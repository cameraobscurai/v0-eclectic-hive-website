'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { useInquiryStore } from '@/lib/inquiry-store'
import { 
  Upload, 
  Palette, 
  Grid3X3, 
  Eye, 
  ChevronRight,
  Plus,
  X,
  Check,
  ImageIcon
} from 'lucide-react'

// UX System images showing the design process
const PROCESS_IMAGES = {
  system: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2004_02_30%20AM-PC1QPFzv8coKtHdTmyohE6e5v8RGrq.png',
  systemDark: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2003_58_02%20AM-g0JxI4uxmPS4cxhgVGuZ5MPA1jcg8J.png',
  productView: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_28%20AM%20%287%29-ogThIzfVzpR22E72NOewa8VIWPPe9I.png',
}

// Lifestyle vignettes for inspiration
const VIGNETTES = [
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_33_39%20AM-i3tVPuiTbhTLfdzp2THZmBRDfyaKBD.png', 
    title: 'The Gathered Table',
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png', 
    title: 'Quiet Corners',
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_41%20AM%20%284%29-d9QCIVvJ0A0HwHkvgomCLIsSZpTltS.png', 
    title: 'Layered Textiles',
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%281%29-ysnOsz5FYFEPQzufogthldORvQWG5F.png', 
    title: 'Material Study',
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%283%29-AJLa39oz4oGazs06HWIawRq61cYiuT.png', 
    title: 'Collected Objects',
  },
]

// Default palette colors
const DEFAULT_PALETTE = [
  { hex: '#f5f2ed', name: 'Cream' },
  { hex: '#d4cdc4', name: 'Sand' },
  { hex: '#c9b99a', name: 'Oak' },
  { hex: '#5a6b4a', name: 'Sage' },
  { hex: '#4a3728', name: 'Espresso' },
  { hex: '#1a1a1a', name: 'Charcoal' },
]

type Step = 'intro' | 'inspiration' | 'palette' | 'preview'

export default function StudioPage() {
  const [loaded, setLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [activeStep, setActiveStep] = useState<Step>('intro')
  const [inspirationImages, setInspirationImages] = useState<string[]>([])
  const [selectedPalette, setSelectedPalette] = useState<typeof DEFAULT_PALETTE>(DEFAULT_PALETTE)
  const [projectName, setProjectName] = useState('')
  
  const { items } = useInquiryStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { 
    setLoaded(true) 
    // Check if already authenticated in session
    const authenticated = sessionStorage.getItem('studio_auth') === 'true'
    setIsAuthenticated(authenticated)
  }, [])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        sessionStorage.setItem('studio_auth', 'true')
        setPasswordError(false)
      } else {
        setPasswordError(true)
      }
    } catch {
      setPasswordError(true)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setInspirationImages(prev => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeInspirationImage = (index: number) => {
    setInspirationImages(prev => prev.filter((_, i) => i !== index))
  }

  const steps = [
    { id: 'intro', label: 'Overview', icon: Eye },
    { id: 'inspiration', label: 'Inspiration', icon: ImageIcon },
    { id: 'palette', label: 'Palette', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Grid3X3 },
  ]

  // Password gate
  if (!isAuthenticated) {
    return (
      <main className="bg-cream min-h-screen">
        <Navigation />
        <div className="min-h-[80vh] flex items-center justify-center px-6">
          <div className={cn(
            'max-w-md w-full transition-all duration-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-charcoal/40 mb-4">
                Private Access
              </p>
              <h1 className="font-display text-3xl tracking-display text-charcoal">
                Design Studio
              </h1>
              <p className="text-charcoal/50 mt-4 text-sm">
                This area is currently under development.
              </p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError(false)
                  }}
                  placeholder="Enter password"
                  className={cn(
                    'w-full bg-white border px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none transition-colors text-center tracking-wider',
                    passwordError 
                      ? 'border-red-400 focus:border-red-400' 
                      : 'border-charcoal/10 focus:border-charcoal/30'
                  )}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    Incorrect password
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-charcoal text-cream py-3 text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
        {/* Background UX System Image */}
        <div className="absolute inset-0 opacity-[0.03]">
          <Image
            src={PROCESS_IMAGES.systemDark}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-2xl">
            <p className={cn(
              'text-xs uppercase tracking-[0.3em] text-charcoal/40 mb-6 transition-all duration-700',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              Proposal Builder
            </p>
            <h1 className={cn(
              'font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-light text-charcoal transition-all duration-700 leading-[1.1]',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )} style={{ transitionDelay: '100ms' }}>
              Design Your
              <span className="block italic">Vision</span>
            </h1>
            <p className={cn(
              'text-charcoal/50 mt-8 max-w-md leading-relaxed transition-all duration-700',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )} style={{ transitionDelay: '200ms' }}>
              Build a curated proposal with inspiration imagery, color palettes, 
              and selections from our collection. Share your vision with our team 
              to begin the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Step Navigation */}
      <section className="sticky top-0 z-30 bg-cream border-y border-charcoal/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === step.id
              const isPast = steps.findIndex(s => s.id === activeStep) > index
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as Step)}
                  className={cn(
                    'flex-1 py-5 flex items-center justify-center gap-3 border-b-2 transition-all',
                    isActive 
                      ? 'border-charcoal text-charcoal' 
                      : isPast
                        ? 'border-charcoal/20 text-charcoal/60 hover:text-charcoal'
                        : 'border-transparent text-charcoal/30 hover:text-charcoal/50'
                  )}
                >
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors',
                    isActive ? 'bg-charcoal text-cream' : isPast ? 'bg-charcoal/20 text-charcoal' : 'bg-charcoal/10 text-charcoal/40'
                  )}>
                    {index + 1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.15em] hidden sm:block">{step.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="px-6 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Step 1: Overview / Intro */}
          {activeStep === 'intro' && (
            <div className="space-y-20">
              {/* Process Overview with UX System Image */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl tracking-wide text-charcoal mb-6">
                    How It Works
                  </h2>
                  <div className="space-y-8">
                    {[
                      { num: '01', title: 'Gather Inspiration', desc: 'Upload mood images, reference photos, or screenshots that capture your vision.' },
                      { num: '02', title: 'Define Your Palette', desc: 'Select colors that resonate with your aesthetic. We will match materials accordingly.' },
                      { num: '03', title: 'Browse the Collection', desc: 'Explore our inventory and save pieces that speak to your project.' },
                      { num: '04', title: 'Review and Submit', desc: 'Preview your curated selections and send to our team to begin.' },
                    ].map((item) => (
                      <div key={item.num} className="flex gap-6">
                        <span className="text-xs text-charcoal/30 font-mono">{item.num}</span>
                        <div>
                          <h3 className="text-charcoal font-medium mb-1">{item.title}</h3>
                          <p className="text-charcoal/50 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setActiveStep('inspiration')}
                    className="mt-10 inline-flex items-center gap-3 bg-charcoal text-cream px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
                  >
                    <span>Begin</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* UX System Diagram */}
                <div className="relative aspect-[4/3] bg-charcoal/5 overflow-hidden">
                  <Image
                    src={PROCESS_IMAGES.system}
                    alt="Design system overview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Vignettes for Inspiration */}
              <div>
                <h3 className="font-display text-xl tracking-wide text-charcoal mb-8">
                  Recent Inspirations
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {VIGNETTES.map((v, i) => (
                    <div key={i} className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
                      onClick={() => {
                        setInspirationImages(prev => [...prev, v.src])
                        setActiveStep('inspiration')
                      }}
                    >
                      <Image
                        src={v.src}
                        alt={v.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors flex items-center justify-center">
                        <Plus className="w-8 h-8 text-cream opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Inspiration */}
          {activeStep === 'inspiration' && (
            <div className="space-y-12">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl md:text-3xl tracking-wide text-charcoal mb-4">
                  Inspiration Board
                </h2>
                <p className="text-charcoal/50 leading-relaxed">
                  Upload images that capture the feeling, colors, or style you are envisioning. 
                  These help our team understand your aesthetic direction.
                </p>
              </div>
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-charcoal/20 hover:border-charcoal/40 transition-colors p-12 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-charcoal/30 mx-auto mb-4" />
                <p className="text-charcoal/60 text-sm">
                  Drop images here or click to upload
                </p>
                <p className="text-charcoal/30 text-xs mt-2">
                  PNG, JPG up to 10MB
                </p>
              </div>
              
              {/* Uploaded Images Grid */}
              {inspirationImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {inspirationImages.map((img, i) => (
                    <div key={i} className="relative aspect-square group">
                      <Image
                        src={img}
                        alt={`Inspiration ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeInspirationImage(i)}
                        className="absolute top-2 right-2 w-8 h-8 bg-charcoal/80 text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Quick Add from Vignettes */}
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal/40 mb-4">Or choose from our library</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {VIGNETTES.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setInspirationImages(prev => [...prev, v.src])}
                      className="relative w-24 h-24 flex-shrink-0 overflow-hidden opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Image src={v.src} alt={v.title} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between pt-8 border-t border-charcoal/10">
                <button
                  onClick={() => setActiveStep('intro')}
                  className="text-charcoal/50 hover:text-charcoal text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep('palette')}
                  className="inline-flex items-center gap-3 bg-charcoal text-cream px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
                >
                  <span>Continue to Palette</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Palette */}
          {activeStep === 'palette' && (
            <div className="space-y-12">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl md:text-3xl tracking-wide text-charcoal mb-4">
                  Color Palette
                </h2>
                <p className="text-charcoal/50 leading-relaxed">
                  Select colors that define your vision. These guide our material and finish recommendations.
                </p>
              </div>
              
              {/* Palette Selection */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {selectedPalette.map((color, i) => (
                  <div key={i} className="text-center">
                    <div 
                      className="aspect-square mb-3 cursor-pointer ring-2 ring-transparent hover:ring-charcoal/20 transition-all"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-xs text-charcoal/60">{color.name}</p>
                    <p className="text-[10px] text-charcoal/30 font-mono">{color.hex}</p>
                  </div>
                ))}
              </div>
              
              {/* Preset Palettes */}
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-charcoal/40 mb-6">Preset Palettes</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'Warm Neutrals', colors: ['#f5f2ed', '#d4cdc4', '#c9b99a', '#a08060', '#6b5344', '#3d2e24'] },
                    { name: 'Cool & Calm', colors: ['#f0f4f4', '#d4e0e0', '#9eb3b3', '#5a7070', '#3d4d4d', '#1a2424'] },
                    { name: 'Earth & Sage', colors: ['#f5f2ed', '#d4d4c4', '#b3c9a0', '#5a6b4a', '#4a5040', '#2a302a'] },
                    { name: 'Moody & Rich', colors: ['#e8e4df', '#c9b99a', '#8b6b4a', '#4a3728', '#2a1f18', '#1a1410'] },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedPalette(preset.colors.map((hex, i) => ({ hex, name: `Color ${i + 1}` })))}
                      className="text-left group"
                    >
                      <div className="flex h-12 mb-2">
                        {preset.colors.map((c, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <p className="text-sm text-charcoal/60 group-hover:text-charcoal transition-colors">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between pt-8 border-t border-charcoal/10">
                <button
                  onClick={() => setActiveStep('inspiration')}
                  className="text-charcoal/50 hover:text-charcoal text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveStep('preview')}
                  className="inline-flex items-center gap-3 bg-charcoal text-cream px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
                >
                  <span>Preview Proposal</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {activeStep === 'preview' && (
            <div className="space-y-12">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl md:text-3xl tracking-wide text-charcoal mb-4">
                  Proposal Preview
                </h2>
                <p className="text-charcoal/50 leading-relaxed">
                  Review your curated selections before submitting to our team.
                </p>
              </div>
              
              {/* Project Name */}
              <div className="max-w-md">
                <label className="text-xs uppercase tracking-[0.15em] text-charcoal/40 block mb-3">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Canyon Point Celebration"
                  className="w-full bg-white border border-charcoal/10 px-4 py-3 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal/30"
                />
              </div>
              
              {/* Preview Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Inspiration */}
                <div className="border border-charcoal/10 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal/40 mb-4">Inspiration</h3>
                  {inspirationImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {inspirationImages.slice(0, 4).map((img, i) => (
                        <div key={i} className="relative aspect-square">
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-charcoal/30 text-sm">No images added</p>
                  )}
                  {inspirationImages.length > 4 && (
                    <p className="text-xs text-charcoal/40 mt-2">+{inspirationImages.length - 4} more</p>
                  )}
                </div>
                
                {/* Palette */}
                <div className="border border-charcoal/10 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal/40 mb-4">Palette</h3>
                  <div className="flex gap-2">
                    {selectedPalette.map((color, i) => (
                      <div key={i} className="flex-1 aspect-square" style={{ backgroundColor: color.hex }} />
                    ))}
                  </div>
                </div>
                
                {/* Selections */}
                <div className="border border-charcoal/10 p-6">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal/40 mb-4">Selections</h3>
                  {items.length > 0 ? (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        {items.slice(0, 6).map((item) => (
                          <div key={item.id} className="relative aspect-square bg-white">
                            {item.imageUrl && (
                              <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                            )}
                          </div>
                        ))}
                      </div>
                      {items.length > 6 && (
                        <p className="text-xs text-charcoal/40 mt-2">+{items.length - 6} more pieces</p>
                      )}
                    </>
                  ) : (
                    <p className="text-charcoal/30 text-sm">
                      No pieces selected yet. 
                      <a href="/collection" className="underline hover:text-charcoal ml-1">Browse collection</a>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Submit */}
              <div className="flex justify-between pt-8 border-t border-charcoal/10">
                <button
                  onClick={() => setActiveStep('palette')}
                  className="text-charcoal/50 hover:text-charcoal text-xs uppercase tracking-[0.15em] transition-colors"
                >
                  Back
                </button>
                <a
                  href="/contact#inquiry"
                  className="inline-flex items-center gap-3 bg-charcoal text-cream px-8 py-4 text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
                >
                  <span>Submit Inquiry</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
