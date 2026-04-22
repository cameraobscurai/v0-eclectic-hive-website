'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

const COLORS = [
  { name: 'CHARCOAL', hex: '#1a1a1a', rgb: '26, 26, 26', usage: 'Primary text, backgrounds' },
  { name: 'CREAM', hex: '#f5f2ed', rgb: '245, 242, 237', usage: 'Primary backgrounds, reversed text' },
  { name: 'SAND', hex: '#d4cdc4', rgb: '212, 205, 196', usage: 'Warm neutral, transitions' },
  { name: 'BLACK', hex: '#000000', rgb: '0, 0, 0', usage: 'Maximum contrast moments' },
  { name: 'WARM GRAY', hex: '#8a8a8a', rgb: '138, 138, 138', usage: 'Secondary text, borders' },
]

const MATERIALS = [
  { name: 'WHITE OAK', hex: '#8B7355', descriptor: 'WARM', texture: 'Wood grain, natural warmth' },
  { name: 'BRUSHED BRASS', hex: '#b8a88a', descriptor: 'PATINATED', texture: 'Metallic, aged elegance' },
  { name: 'BELGIAN LINEN', hex: '#c9c4bc', descriptor: 'NATURAL', texture: 'Woven, tactile softness' },
  { name: 'TRAVERTINE', hex: '#d9d2c7', descriptor: 'HONED', texture: 'Stone, organic variation' },
  { name: 'RATTAN', hex: '#a89880', descriptor: 'WOVEN', texture: 'Natural fiber, geometric' },
  { name: 'VELVET', hex: '#2d2d2d', descriptor: 'PLUSH', texture: 'Deep, light-absorbing' },
]

export default function Colors() {
  const [view, setView] = useState<'full' | 'colors' | 'materials' | 'grid'>('full')

  if (view === 'grid') {
    return (
      <main id="specimen-content" className="min-h-screen grid grid-cols-2 grid-rows-2">
        <DownloadButton targetId="specimen-content" filename="eclectic-hive-colors-grid" />
        
        {/* Controls */}
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          {(['full', 'colors', 'materials', 'grid'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
                view === v 
                  ? 'bg-charcoal text-cream' 
                  : 'bg-white/80 text-charcoal border border-charcoal/20'
              }`}
            >
              {v === 'grid' ? '2x2' : v}
            </button>
          ))}
        </div>

        {/* Charcoal panel */}
        <div className="bg-charcoal flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-cream/10 border-4 border-cream/20 mx-auto mb-6" />
            <p className="font-serif text-cream text-3xl tracking-[0.15em] mb-2">CHARCOAL</p>
            <p className="font-mono text-cream/40 text-xs">#1a1a1a</p>
          </div>
        </div>

        {/* Cream panel */}
        <div className="bg-cream flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-charcoal/10 border-4 border-charcoal/20 mx-auto mb-6" />
            <p className="font-serif text-charcoal text-3xl tracking-[0.15em] mb-2">CREAM</p>
            <p className="font-mono text-charcoal/40 text-xs">#f5f2ed</p>
          </div>
        </div>

        {/* Sand panel */}
        <div className="bg-sand flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-charcoal/10 border-4 border-charcoal/20 mx-auto mb-6" />
            <p className="font-serif text-charcoal text-3xl tracking-[0.15em] mb-2">SAND</p>
            <p className="font-mono text-charcoal/40 text-xs">#d4cdc4</p>
          </div>
        </div>

        {/* Brass panel */}
        <div className="bg-[#b8a88a] flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 rounded-full bg-charcoal/10 border-4 border-charcoal/20 mx-auto mb-6" />
            <p className="font-serif text-charcoal text-3xl tracking-[0.15em] mb-2">BRASS</p>
            <p className="font-mono text-charcoal/40 text-xs">#b8a88a</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="specimen-content" className="min-h-screen bg-charcoal">
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-colors-${view}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {(['full', 'colors', 'materials', 'grid'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              view === v 
                ? 'bg-cream text-charcoal' 
                : 'bg-cream/10 text-cream/70 border border-cream/20 hover:bg-cream/20'
            }`}
          >
            {v === 'grid' ? '2x2' : v}
          </button>
        ))}
      </div>

      {/* Hero section */}
      <section className="relative min-h-[60vh] flex items-end pb-16 px-8 lg:px-16 overflow-hidden">
        {/* Large background color blocks */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-charcoal" />
          <div className="w-px bg-cream/10" />
          <div className="flex-1 bg-cream" />
        </div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-cream/40 text-xs font-mono uppercase tracking-[0.3em] mb-4">
                Color System
              </p>
              <h1 className="font-serif text-6xl lg:text-8xl tracking-tight">
                <span className="text-cream">Color</span>
                <span className="text-charcoal ml-4">& Material</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Colors - only show if not in materials-only view */}
      {(view === 'full' || view === 'colors') && (
        <section className="bg-cream px-8 lg:px-16 py-24">
          <div className="max-w-6xl mx-auto">
            <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-12">
              Primary Palette
            </p>
            
            {/* Large color blocks */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              {COLORS.map((color) => (
                <div key={color.name} className="group">
                  <div 
                    className="aspect-[3/4] rounded-lg mb-4 transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="font-serif text-charcoal text-sm tracking-[0.1em]">{color.name}</p>
                  <p className="font-mono text-charcoal/40 text-xs mt-1">{color.hex}</p>
                </div>
              ))}
            </div>

            {/* Type combinations */}
            <div className="mt-24 grid grid-cols-4 gap-4">
              <div className="aspect-square bg-cream border border-charcoal/10 rounded-lg flex items-center justify-center">
                <span className="font-serif text-charcoal text-5xl">Aa</span>
              </div>
              <div className="aspect-square bg-charcoal rounded-lg flex items-center justify-center">
                <span className="font-serif text-cream text-5xl">Aa</span>
              </div>
              <div className="aspect-square bg-sand rounded-lg flex items-center justify-center">
                <span className="font-serif text-charcoal text-5xl">Aa</span>
              </div>
              <div className="aspect-square bg-charcoal rounded-lg flex items-center justify-center">
                <span className="font-serif text-[#b8a88a] text-5xl">Aa</span>
              </div>
            </div>
            <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mt-4">
              Approved type/background combinations
            </p>
          </div>
        </section>
      )}

      {/* Materials - only show if not in colors-only view */}
      {(view === 'full' || view === 'materials') && (
        <section className="bg-charcoal px-8 lg:px-16 py-24">
          <div className="max-w-6xl mx-auto">
            <p className="text-cream/40 text-xs font-mono uppercase tracking-[0.3em] mb-12">
              Material Reference
            </p>
            
            {/* Material swatches - larger, more tactile */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
              {MATERIALS.map((mat) => (
                <div key={mat.name} className="group">
                  <div 
                    className="aspect-square rounded-lg mb-4 relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundColor: mat.hex }}
                  >
                    {/* Texture overlay */}
                    <div 
                      className="absolute inset-0 opacity-20 mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }}
                    />
                    
                    {/* Descriptor label */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 text-charcoal text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded">
                        {mat.descriptor}
                      </span>
                    </div>
                  </div>
                  <p className="font-mono text-cream/80 text-xs tracking-[0.05em]">{mat.name}</p>
                  <p className="font-mono text-cream/30 text-[10px] mt-1">{mat.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tonal scale */}
      <section className="bg-cream px-8 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="h-32 rounded-lg overflow-hidden flex">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-charcoal" />
            <div className="flex-1 bg-[#3d3d3d]" />
            <div className="flex-1 bg-[#5a5a5a]" />
            <div className="flex-1 bg-[#8a8a8a]" />
            <div className="flex-1 bg-sand" />
            <div className="flex-1 bg-cream border-r border-charcoal/5" />
            <div className="flex-1 bg-white" />
          </div>
          <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mt-6 text-center">
            Full tonal range — Black through White
          </p>
        </div>
      </section>
    </main>
  )
}
