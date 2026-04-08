'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Navigation } from '@/components/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorData {
  r: number
  g: number
  b: number
  hex: string
  count: number
}

interface ImageData {
  url: string
  name: string
  id: string
}

interface PerImageData {
  id: string
  colors: ColorData[]
}

interface Tones {
  warm: number
  cool: number
  neutral: number
  light: number
  dark: number
  saturated: number
  muted: number
}

interface Insight {
  icon: string
  text: string
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

function colorDist(a: number[], b: number[]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

function samplePixels(img: HTMLImageElement, canvas: HTMLCanvasElement, n = 2000): number[][] {
  const ctx = canvas.getContext('2d')!
  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height
  ctx.drawImage(img, 0, 0)
  
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const pixels: number[][] = []
  const step = Math.max(4, Math.floor(data.length / (4 * n)))
  
  for (let i = 0; i < data.length; i += 4 * step) {
    const a = data[i + 3]
    if (a < 128) continue
    pixels.push([data[i], data[i + 1], data[i + 2]])
  }
  return pixels
}

function kMeans(pixels: number[][], k = 8, iters = 12): ColorData[] {
  if (pixels.length < k) {
    return pixels.map(p => ({ r: p[0], g: p[1], b: p[2], hex: rgbToHex(p[0], p[1], p[2]), count: 1 }))
  }
  
  const centers: number[][] = []
  centers.push(pixels[Math.floor(Math.random() * pixels.length)])
  
  while (centers.length < k) {
    let best: number[] | null = null, bestD = 0
    for (let t = 0; t < 40; t++) {
      const c = pixels[Math.floor(Math.random() * pixels.length)]
      const d = Math.min(...centers.map(x => colorDist(c, x)))
      if (d > bestD) { bestD = d; best = c }
    }
    centers.push(best || pixels[Math.floor(Math.random() * pixels.length)])
  }
  
  const assigns = new Array(pixels.length).fill(0)
  
  for (let iter = 0; iter < iters; iter++) {
    const clusters: number[][][] = Array.from({ length: k }, () => [])
    
    pixels.forEach((p, i) => {
      let best = 0, bd = Infinity
      centers.forEach((c, j) => {
        const d = colorDist(p, c)
        if (d < bd) { bd = d; best = j }
      })
      assigns[i] = best
      clusters[best].push(p)
    })
    
    clusters.forEach((cl, i) => {
      if (!cl.length) return
      centers[i] = [
        Math.round(cl.reduce((s, p) => s + p[0], 0) / cl.length),
        Math.round(cl.reduce((s, p) => s + p[1], 0) / cl.length),
        Math.round(cl.reduce((s, p) => s + p[2], 0) / cl.length)
      ]
    })
  }
  
  const counts = new Array(k).fill(0)
  assigns.forEach(a => counts[a]++)
  
  return centers
    .map((c, i) => ({ r: c[0], g: c[1], b: c[2], hex: rgbToHex(c[0], c[1], c[2]), count: counts[i] }))
    .sort((a, b) => b.count - a.count)
}

function mergeColors(colors: ColorData[], threshold = 35): ColorData[] {
  const merged: ColorData[] = []
  colors.forEach(c => {
    const found = merged.find(m => colorDist([c.r, c.g, c.b], [m.r, m.g, m.b]) < threshold)
    if (found) { found.count += c.count } else merged.push({ ...c })
  })
  return merged.sort((a, b) => b.count - a.count)
}

function computeTones(colors: ColorData[]): Tones {
  const tones = { warm: 0, cool: 0, neutral: 0, light: 0, dark: 0, saturated: 0, muted: 0 }
  let total = 0
  
  colors.forEach(c => {
    const { h, s, l } = rgbToHsl(c.r, c.g, c.b)
    const w = c.count
    total += w
    
    if (s < 15) tones.neutral += w
    else if (h < 30 || h > 330) tones.warm += w
    else if (h >= 170 && h <= 260) tones.cool += w
    else if ((h >= 30 && h < 60) || (h >= 300 && h < 330)) { tones.warm += w * 0.5; tones.neutral += w * 0.5 }
    else { tones.cool += w * 0.3; tones.warm += w * 0.7 }
    
    if (l > 62) tones.light += w
    else if (l < 35) tones.dark += w
    
    if (s > 45) tones.saturated += w
    else tones.muted += w
  })
  
  const norm = (k: keyof typeof tones) => Math.round(tones[k] / total * 100)
  return {
    warm: norm('warm'), cool: norm('cool'), neutral: norm('neutral'),
    light: norm('light'), dark: norm('dark'), saturated: norm('saturated'), muted: norm('muted')
  }
}

function styleHint(t: Tones): string {
  if (t.warm > 50 && t.muted > 50) return 'Japandi, wabi-sabi, or organic modern'
  if (t.cool > 50 && t.light > 50) return 'Scandinavian, minimalist, or coastal'
  if (t.dark > 45) return 'moody maximalist, Art Deco, or industrial'
  if (t.warm > 50 && t.saturated > 50) return 'Mediterranean, Moroccan, or eclectic'
  if (t.neutral > 40) return 'transitional, contemporary, or classic neutral'
  return 'contemporary mixed'
}

function generateInsights(palette: ColorData[], tones: Tones): Insight[] {
  const ins: Insight[] = []
  const top = palette.slice(0, 5)
  const hues = top.map(c => rgbToHsl(c.r, c.g, c.b).h)
  const hueSpread = Math.max(...hues) - Math.min(...hues)
  
  if (hueSpread < 30) ins.push({ icon: '🎨', text: '<strong>Monochromatic</strong> — the palette stays in a tight hue range, creating a cohesive, harmonious feel.' })
  else if (hueSpread < 80) ins.push({ icon: '🎨', text: '<strong>Analogous harmony</strong> — hues are closely related, suggesting a calm and unified aesthetic.' })
  else ins.push({ icon: '🎨', text: '<strong>Contrast palette</strong> — a wide hue range creates visual tension and energy.' })
  
  if (tones.warm > 55) ins.push({ icon: '🌅', text: `<strong>Warm-dominant (${tones.warm}%)</strong> — oranges, reds and yellows suggest comfort, earthiness, or energy.` })
  else if (tones.cool > 55) ins.push({ icon: '🧊', text: `<strong>Cool-dominant (${tones.cool}%)</strong> — blues and greens evoke calm, freshness, or sophistication.` })
  else ins.push({ icon: '⚖️', text: '<strong>Balanced temperature</strong> — warm and cool tones balance well, giving versatility.' })
  
  if (tones.light > 65) ins.push({ icon: '☀️', text: '<strong>Light & airy</strong> — high luminosity suggests a bright, open, Scandinavian or minimalist direction.' })
  else if (tones.dark > 55) ins.push({ icon: '🌑', text: '<strong>Moody & dramatic</strong> — deep tones suggest a luxurious, editorial, or industrial aesthetic.' })
  else ins.push({ icon: '🌗', text: '<strong>Balanced luminosity</strong> — a mix of lights and darks creates depth and layering.' })
  
  if (tones.saturated > 60) ins.push({ icon: '💎', text: '<strong>High saturation</strong> — vivid hues create boldness. Use accent walls, art, or upholstery sparingly.' })
  else if (tones.muted > 70) ins.push({ icon: '🪵', text: '<strong>Muted & desaturated</strong> — dusty, earthy tones align with organic, artisan, or biophilic interiors.' })
  
  const hex0 = top[0]?.hex || '#888'
  const hex1 = top[1]?.hex || '#888'
  ins.push({ icon: '🛋', text: `<strong>Suggested pairing:</strong> Use ${hex0} as the base wall or floor, and ${hex1} as the dominant furniture or trim tone.` })
  
  const names = top.map(c => {
    const { h, s, l } = rgbToHsl(c.r, c.g, c.b)
    if (s < 12) return l > 70 ? 'white/light gray' : 'dark gray/charcoal'
    if (h < 15 || h > 340) return 'red/burgundy'
    if (h < 40) return 'orange/terracotta'
    if (h < 65) return 'yellow/ochre'
    if (h < 140) return 'green/sage'
    if (h < 185) return 'teal/aqua'
    if (h < 260) return 'blue/navy'
    if (h < 290) return 'purple/violet'
    return 'pink/mauve'
  })
  const unique = [...new Set(names)]
  ins.push({ icon: '🏠', text: `<strong>Style direction:</strong> ${unique.join(', ')} tones commonly appear in ${styleHint(tones)} interiors.` })
  
  return ins
}

// ─── Components ───────────────────────────────────────────────────────────────

function PaletteRow({ colors, onCopy }: { colors: ColorData[], onCopy: (hex: string) => void }) {
  return (
    <div className="flex gap-0 rounded-lg overflow-hidden h-14 mb-4">
      {colors.map((c, i) => (
        <div
          key={i}
          className="flex-1 cursor-pointer relative group transition-all duration-200 hover:flex-[2]"
          style={{ backgroundColor: c.hex }}
          onClick={() => onCopy(c.hex)}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-charcoal text-cream px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {c.hex}
            <br />
            <span className="text-cream/60">RGB({c.r},{c.g},{c.b})</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ToneBar({ label, value, fill }: { label: string, value: number, fill: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-charcoal/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-charcoal/10 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ width: `${value}%`, backgroundColor: fill }} 
        />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DesignPage() {
  const [images, setImages] = useState<ImageData[]>([])
  const [analyzed, setAnalyzed] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [palette, setPalette] = useState<ColorData[]>([])
  const [tones, setTones] = useState<Tones | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [perImage, setPerImage] = useState<PerImageData[]>([])
  const [activeTab, setActiveTab] = useState<'palette' | 'tones' | 'insights'>('palette')
  const [toast, setToast] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const copyColor = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {})
    setToast(`Copied ${hex}`)
    setTimeout(() => setToast(null), 1600)
  }, [])
  
  const addFiles = useCallback((files: FileList | File[]) => {
    const newImages: ImageData[] = []
    Array.from(files).forEach(f => {
      if (!f.type.startsWith('image/')) return
      if (images.length + newImages.length >= 20) return
      const url = URL.createObjectURL(f)
      newImages.push({ url, name: f.name, id: Date.now() + Math.random().toString() })
    })
    setImages(prev => [...prev, ...newImages])
    setAnalyzed(false)
  }, [images.length])
  
  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const img = prev.find(x => x.id === id)
      if (img) URL.revokeObjectURL(img.url)
      return prev.filter(x => x.id !== id)
    })
    setAnalyzed(false)
  }, [])
  
  const clearAll = useCallback(() => {
    images.forEach(x => URL.revokeObjectURL(x.url))
    setImages([])
    setAnalyzed(false)
    setPalette([])
    setTones(null)
    setInsights([])
    setPerImage([])
  }, [images])
  
  const analyze = useCallback(async () => {
    if (!images.length || !canvasRef.current) return
    setAnalyzing(true)
    
    await new Promise(r => setTimeout(r, 50))
    
    const allPixels: number[][] = []
    const perImageData: PerImageData[] = []
    
    for (const imgData of images) {
      await new Promise<void>(res => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const px = samplePixels(img, canvasRef.current!, 1500)
          allPixels.push(...px)
          const colors = mergeColors(kMeans(px, 6, 10), 40)
          perImageData.push({ id: imgData.id, colors: colors.slice(0, 5) })
          res()
        }
        img.onerror = () => res()
        img.src = imgData.url
      })
    }
    
    const combined = mergeColors(kMeans(allPixels, 10, 15), 30)
    const newPalette = combined.slice(0, 8)
    const newTones = computeTones(newPalette)
    const newInsights = generateInsights(newPalette, newTones)
    
    setPalette(newPalette)
    setTones(newTones)
    setInsights(newInsights)
    setPerImage(perImageData)
    setAnalyzed(true)
    setAnalyzing(false)
  }, [images])
  
  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(x => URL.revokeObjectURL(x.url))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <main className="min-h-screen bg-[#F5F5F0]">
      <Navigation />
      
      {/* Hidden canvas for pixel sampling */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
      />
      
      {/* Toast notification */}
      <div className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 bg-charcoal text-cream px-4 py-2 rounded-lg text-sm z-50 transition-opacity duration-200",
        toast ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {toast}
      </div>
      
      <div className="pt-24 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[calc(100vh-6rem)]">
          {/* Main area */}
          <div className="flex flex-col p-4 lg:p-6 gap-4">
            {/* Toolbar */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium text-charcoal">Moodboard</h1>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium px-3 py-1.5 border border-charcoal/20 rounded-md bg-white text-charcoal hover:bg-charcoal/5 transition-colors"
              >
                + Add images
              </button>
              {images.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-xs font-medium px-3 py-1.5 border border-red-300 rounded-md bg-white text-red-600 hover:bg-red-50 transition-colors"
                >
                  Clear all
                </button>
              )}
              <span className="ml-auto text-sm text-charcoal/50">
                {images.length > 0 && `${images.length} image${images.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            
            {/* Board */}
            <div className="flex-1 overflow-y-auto">
              {images.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
                  className={cn(
                    "border-2 border-dashed rounded-xl min-h-[300px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors p-8",
                    isDragging ? "border-charcoal/40 bg-charcoal/5" : "border-charcoal/20 hover:border-charcoal/30"
                  )}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-charcoal/30">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <p className="text-sm text-charcoal/50">Drop images here to build your moodboard</p>
                  <small className="text-xs text-charcoal/30">JPG, PNG, WebP — up to 20 images</small>
                </div>
              ) : (
                <div 
                  className="grid gap-3"
                  style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
                >
                  {images.map(img => (
                    <div key={img.id} className="relative rounded-lg overflow-hidden aspect-[4/3] bg-charcoal/5 border border-charcoal/5 group">
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40 text-[11px] text-white truncate">
                        {img.name}
                      </div>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {images.length < 20 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-lg aspect-[4/3] flex items-center justify-center cursor-pointer text-2xl text-charcoal/30 transition-colors",
                        isDragging ? "border-charcoal/40 bg-charcoal/5" : "border-charcoal/20 hover:border-charcoal/30"
                      )}
                    >
                      +
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="bg-white border-l border-charcoal/5 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-charcoal/5">
              {(['palette', 'tones', 'insights'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 text-xs text-center capitalize transition-colors border-b-2 -mb-px",
                    activeTab === tab 
                      ? "text-charcoal border-charcoal font-medium" 
                      : "text-charcoal/50 border-transparent hover:text-charcoal/70"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {!analyzed ? (
                <div className="p-6 text-center text-charcoal/40 text-sm leading-relaxed">
                  Add images and click <strong className="text-charcoal/60">Analyze moodboard</strong> to extract colors and design insights.
                </div>
              ) : activeTab === 'palette' ? (
                <div className="p-4">
                  <div className="mb-6">
                    <h2 className="text-[11px] font-medium uppercase tracking-wider text-charcoal/40 mb-3">Combined palette</h2>
                    <PaletteRow colors={palette} onCopy={copyColor} />
                    <div className="flex flex-wrap gap-1.5">
                      {palette.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => copyColor(c.hex)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded bg-charcoal/5 border border-charcoal/5 hover:border-charcoal/20 transition-colors"
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                          <span className="font-mono text-[11px] text-charcoal/70">{c.hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {perImage.length > 0 && (
                    <div>
                      <h2 className="text-[11px] font-medium uppercase tracking-wider text-charcoal/40 mb-3">Per image</h2>
                      <div className="flex flex-col gap-3">
                        {perImage.map((pi, i) => {
                          const img = images.find(x => x.id === pi.id)
                          return (
                            <div key={pi.id} className="flex items-center gap-2">
                              <span className="text-[11px] text-charcoal/40 w-20 truncate" title={img?.name}>
                                {img?.name || `Image ${i + 1}`}
                              </span>
                              <div className="flex-1 flex gap-0.5 h-5 rounded overflow-hidden">
                                {pi.colors.map((c, j) => (
                                  <div
                                    key={j}
                                    className="flex-1 cursor-pointer hover:flex-[2] transition-all duration-200"
                                    style={{ backgroundColor: c.hex }}
                                    onClick={() => copyColor(c.hex)}
                                    title={c.hex}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'tones' && tones ? (
                <div className="p-4">
                  <div className="mb-6">
                    <h2 className="text-[11px] font-medium uppercase tracking-wider text-charcoal/40 mb-4">Temperature & value</h2>
                    <div className="flex flex-col gap-3">
                      <ToneBar label="Warm" value={tones.warm} fill="#D85A30" />
                      <ToneBar label="Cool" value={tones.cool} fill="#378ADD" />
                      <ToneBar label="Neutral" value={tones.neutral} fill="#888780" />
                      <ToneBar label="Light" value={tones.light} fill="#C0DD97" />
                      <ToneBar label="Dark" value={tones.dark} fill="#3C3489" />
                      <ToneBar label="Saturated" value={tones.saturated} fill="#D4537E" />
                      <ToneBar label="Muted" value={tones.muted} fill="#B4B2A9" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-[11px] font-medium uppercase tracking-wider text-charcoal/40 mb-3">Character</h2>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-charcoal/5 rounded-md p-3">
                        <div className="text-lg font-medium text-charcoal">
                          {tones.warm > tones.cool ? (tones.warm > tones.neutral ? 'Warm' : 'Warm-neutral') : (tones.cool > tones.neutral ? 'Cool' : 'Cool-neutral')}
                        </div>
                        <div className="text-[11px] text-charcoal/40">Temperature</div>
                      </div>
                      <div className="bg-charcoal/5 rounded-md p-3">
                        <div className="text-lg font-medium text-charcoal">{tones.light > tones.dark ? 'Light' : 'Dark'}</div>
                        <div className="text-[11px] text-charcoal/40">Value</div>
                      </div>
                      <div className="bg-charcoal/5 rounded-md p-3">
                        <div className="text-lg font-medium text-charcoal">{tones.saturated > tones.muted ? 'Vibrant' : 'Subdued'}</div>
                        <div className="text-[11px] text-charcoal/40">Saturation</div>
                      </div>
                      <div className="bg-charcoal/5 rounded-md p-3">
                        <div className="text-lg font-medium text-charcoal">{images.length}</div>
                        <div className="text-[11px] text-charcoal/40">Images</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'insights' ? (
                <div className="p-4">
                  <h2 className="text-[11px] font-medium uppercase tracking-wider text-charcoal/40 mb-4">Design analysis</h2>
                  <div className="flex flex-col gap-3">
                    {insights.map((ins, i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b border-charcoal/5 last:border-0">
                        <div className="w-8 h-8 rounded-md bg-charcoal/5 flex items-center justify-center text-base shrink-0">
                          {ins.icon}
                        </div>
                        <div 
                          className="text-xs leading-relaxed text-charcoal/60 [&_strong]:text-charcoal [&_strong]:font-medium"
                          dangerouslySetInnerHTML={{ __html: ins.text }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            
            {/* Analyze button */}
            <div className="p-4 border-t border-charcoal/5">
              <button
                onClick={analyze}
                disabled={images.length === 0 || analyzing}
                className={cn(
                  "w-full py-2.5 rounded-md text-sm font-medium transition-all",
                  images.length > 0 && !analyzing
                    ? "bg-charcoal text-cream hover:bg-charcoal/90"
                    : "bg-charcoal/20 text-charcoal/40 cursor-not-allowed"
                )}
              >
                {analyzing ? 'Analyzing...' : analyzed ? 'Re-analyze' : 'Analyze moodboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
