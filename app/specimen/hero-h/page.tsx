'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

export default function HeroH() {
  const [variant, setVariant] = useState<'light' | 'dark' | 'outline' | 'textured'>('dark')
  
  return (
    <main id="specimen-content" className="min-h-screen">
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-hero-h-${variant}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {(['dark', 'light', 'outline', 'textured'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              variant === v 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20 hover:bg-charcoal/10'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Dark variant - Cream H on Charcoal */}
      {variant === 'dark' && (
        <div className="min-h-screen bg-charcoal flex items-center justify-center relative overflow-hidden">
          <span 
            className="font-serif text-cream select-none"
            style={{ 
              fontSize: 'min(80vw, 80vh)',
              lineHeight: 0.85,
              letterSpacing: '-0.02em'
            }}
          >
            H
          </span>
          {/* Measurement annotations */}
          <div className="absolute bottom-8 left-8 text-cream/40 text-xs font-mono uppercase tracking-wider">
            <p>Saol Display Light</p>
            <p>Cap Height: 700 UPM</p>
            <p>Stem Weight: 84pt</p>
          </div>
        </div>
      )}

      {/* Light variant - Charcoal H on Cream */}
      {variant === 'light' && (
        <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
          <span 
            className="font-serif text-charcoal select-none"
            style={{ 
              fontSize: 'min(80vw, 80vh)',
              lineHeight: 0.85,
              letterSpacing: '-0.02em'
            }}
          >
            H
          </span>
          <div className="absolute bottom-8 left-8 text-charcoal/40 text-xs font-mono uppercase tracking-wider">
            <p>Saol Display Light</p>
            <p>Tracking: -0.02em</p>
            <p>Application: Display only</p>
          </div>
        </div>
      )}

      {/* Outline variant - Construction view */}
      {variant === 'outline' && (
        <div className="min-h-screen bg-cream flex items-center justify-center relative overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-l border-charcoal/5 first:border-l-0" />
            ))}
          </div>
          {/* Baseline grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(26,26,26,0.03) 7px, rgba(26,26,26,0.03) 8px)'
          }} />
          
          <span 
            className="font-serif select-none"
            style={{ 
              fontSize: 'min(70vw, 70vh)',
              lineHeight: 0.85,
              letterSpacing: '-0.02em',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(26,26,26,0.3)',
            }}
          >
            H
          </span>
          
          {/* Dimension lines */}
          <div className="absolute left-1/2 top-[10%] bottom-[10%] w-px bg-red-500/60" />
          <div className="absolute top-1/2 left-[15%] right-[15%] h-px bg-red-500/60" />
          
          <div className="absolute bottom-8 left-8 text-charcoal/60 text-xs font-mono uppercase tracking-wider">
            <p className="text-red-500/80">Construction View</p>
            <p>Crossbar: 48% of cap height</p>
            <p>Stem contrast: 1:3.2</p>
          </div>
        </div>
      )}

      {/* Textured variant - with material overlay suggestion */}
      {variant === 'textured' && (
        <div className="min-h-screen bg-charcoal flex items-center justify-center relative overflow-hidden">
          {/* Subtle noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          <span 
            className="font-serif text-cream select-none relative"
            style={{ 
              fontSize: 'min(80vw, 80vh)',
              lineHeight: 0.85,
              letterSpacing: '-0.02em',
            }}
          >
            H
            {/* Inner shadow for depth */}
            <span 
              className="absolute inset-0 font-serif"
              style={{ 
                fontSize: 'min(80vw, 80vh)',
                lineHeight: 0.85,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mixBlendMode: 'overlay',
              }}
            >
              H
            </span>
          </span>
          
          <div className="absolute bottom-8 left-8 text-cream/40 text-xs font-mono uppercase tracking-wider">
            <p>Material: Oak grain overlay</p>
            <p>Texture opacity: 8-15%</p>
            <p>Emboss depth: 0.5mm</p>
          </div>
          
          {/* Material swatch */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <div className="w-12 h-12 rounded bg-[#8B7355] border border-cream/20" title="Oak" />
            <div className="w-12 h-12 rounded bg-[#b8a88a] border border-cream/20" title="Brass" />
            <div className="w-12 h-12 rounded bg-[#d4cdc4] border border-cream/20" title="Linen" />
          </div>
        </div>
      )}
    </main>
  )
}
