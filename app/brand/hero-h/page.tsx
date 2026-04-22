'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

export default function HeroH() {
  const [variant, setVariant] = useState<'dark' | 'light' | 'construction' | 'anatomy' | 'process' | 'grid'>('dark')
  
  return (
    <main id="specimen-content" className="min-h-screen">
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-hero-h-${variant}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap max-w-[450px]">
        {(['dark', 'light', 'construction', 'anatomy', 'process', 'grid'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              variant === v 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20 hover:bg-charcoal/10'
            }`}
          >
            {v === 'grid' ? '2x2' : v}
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

      {/* Construction - Full engineering breakdown */}
      {variant === 'construction' && (
        <div className="min-h-screen bg-cream p-8 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-red-500 text-xs font-mono uppercase tracking-[0.3em] mb-2">Construction Analysis</p>
              <h2 className="font-serif text-charcoal text-2xl tracking-wide">Letterform Engineering</h2>
            </div>
            
            {/* Main construction view */}
            <div className="relative aspect-[16/10] bg-white rounded-lg border border-charcoal/10 overflow-hidden mb-8">
              {/* Grid */}
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-l border-charcoal/5 first:border-l-0" />
                ))}
              </div>
              <div className="absolute inset-0 grid grid-rows-8 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border-t border-charcoal/5 first:border-t-0" />
                ))}
              </div>
              
              {/* The H */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="font-serif"
                  style={{ 
                    fontSize: 'min(40vw, 35vh)', 
                    lineHeight: 0.85,
                    color: 'transparent',
                    WebkitTextStroke: '2px #1a1a1a',
                  }}
                >
                  H
                </span>
              </div>
              
              {/* Measurement lines - Cap height */}
              <div className="absolute left-[12%] top-[18%] bottom-[25%] flex flex-col items-center">
                <div className="w-px h-full bg-red-500" />
                <div className="absolute top-0 w-4 h-px bg-red-500" />
                <div className="absolute bottom-0 w-4 h-px bg-red-500" />
                <span className="absolute top-1/2 -translate-y-1/2 -left-16 text-red-500 text-[10px] font-mono whitespace-nowrap">
                  CAP HEIGHT: 700
                </span>
              </div>
              
              {/* Measurement lines - Crossbar position */}
              <div className="absolute top-[47%] left-[30%] right-[30%] flex flex-col items-center">
                <div className="h-px w-full bg-red-500/80" />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 text-[10px] font-mono whitespace-nowrap bg-white px-2">
                  CROSSBAR @ 48%
                </span>
              </div>
              
              {/* Stem width indicator */}
              <div className="absolute bottom-[28%] left-[38%]">
                <div className="w-10 h-px bg-red-500/80" />
                <div className="absolute left-0 -top-1 w-px h-2 bg-red-500/80" />
                <div className="absolute right-0 -top-1 w-px h-2 bg-red-500/80" />
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-red-500 text-[10px] font-mono whitespace-nowrap">
                  84pt
                </span>
              </div>
              
              {/* Annotations panel */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded border border-charcoal/10">
                <p className="text-[10px] font-mono text-charcoal/60 uppercase tracking-wider mb-3">Specifications</p>
                <div className="space-y-1.5 text-[11px] font-mono text-charcoal/80">
                  <p>Units per Em: 1000</p>
                  <p>Cap Height: 700</p>
                  <p>Stem Weight: 84pt</p>
                  <p>Contrast Ratio: 1:3.2</p>
                  <p>Crossbar: 48% of cap</p>
                </div>
              </div>
            </div>
            
            {/* Detail callouts */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="aspect-square bg-cream/50 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                  <span className="font-serif text-5xl" style={{ color: 'transparent', WebkitTextStroke: '1px #1a1a1a' }}>H</span>
                  <div className="absolute top-[20%] left-[28%] w-6 h-6 border-2 border-red-500 rounded-full" />
                </div>
                <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-1">Detail A</p>
                <p className="text-xs text-charcoal/60">Serif terminal angle: 92°</p>
              </div>
              
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="aspect-square bg-cream/50 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                  <span className="font-serif text-5xl" style={{ color: 'transparent', WebkitTextStroke: '1px #1a1a1a' }}>H</span>
                  <div className="absolute top-[42%] left-[36%] w-10 h-5 border-2 border-red-500 rounded" />
                </div>
                <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-1">Detail B</p>
                <p className="text-xs text-charcoal/60">Crossbar junction: 12° fillet</p>
              </div>
              
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="aspect-square bg-cream/50 rounded mb-4 flex items-center justify-center relative overflow-hidden">
                  <span className="font-serif text-5xl" style={{ color: 'transparent', WebkitTextStroke: '1px #1a1a1a' }}>H</span>
                  <div className="absolute bottom-[18%] right-[28%] w-6 h-6 border-2 border-red-500 rounded-full" />
                </div>
                <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-1">Detail C</p>
                <p className="text-xs text-charcoal/60">Base serif: bracketed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Anatomy - Type anatomy labels */}
      {variant === 'anatomy' && (
        <div className="min-h-screen bg-cream p-8 lg:p-16 flex items-center justify-center">
          <div className="relative">
            <span 
              className="font-serif text-charcoal select-none"
              style={{ fontSize: 'min(55vw, 50vh)', lineHeight: 0.85 }}
            >
              H
            </span>
            
            {/* Anatomy labels with leader lines */}
            <div className="absolute top-[8%] left-[22%]">
              <div className="w-20 h-px bg-charcoal/40 -rotate-45 origin-left" />
              <span className="absolute -top-5 left-16 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                Serif / Terminal
              </span>
            </div>
            
            <div className="absolute top-[45%] left-[2%] -translate-y-1/2">
              <div className="w-16 h-px bg-charcoal/40" />
              <span className="absolute -top-5 left-0 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                Stem
              </span>
            </div>
            
            <div className="absolute top-[47%] left-[50%] -translate-x-1/2">
              <div className="w-px h-12 bg-charcoal/40 mx-auto" />
              <span className="absolute top-14 left-1/2 -translate-x-1/2 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                Crossbar / Bar
              </span>
            </div>
            
            <div className="absolute bottom-[5%] right-[20%]">
              <div className="w-20 h-px bg-charcoal/40 rotate-45 origin-right" />
              <span className="absolute top-2 right-16 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                Baseline Serif
              </span>
            </div>
            
            <div className="absolute top-[30%] right-[2%]">
              <div className="w-16 h-px bg-charcoal/40" />
              <span className="absolute -top-5 right-0 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap text-right bg-cream px-1">
                Counter
              </span>
            </div>
            
            {/* Cap line and baseline indicators */}
            <div className="absolute top-[6%] left-0 right-0 border-t border-dashed border-charcoal/20">
              <span className="absolute -top-5 right-0 text-[9px] font-mono text-charcoal/30 uppercase">Cap Line</span>
            </div>
            <div className="absolute bottom-[8%] left-0 right-0 border-t border-dashed border-charcoal/20">
              <span className="absolute top-1 right-0 text-[9px] font-mono text-charcoal/30 uppercase">Baseline</span>
            </div>
          </div>
        </div>
      )}

      {/* Process - Design iteration steps */}
      {variant === 'process' && (
        <div className="min-h-screen bg-cream p-8 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-2">Design Process</p>
              <h2 className="font-serif text-charcoal text-3xl tracking-wide">From Sketch to Production</h2>
            </div>
            
            {/* Process timeline */}
            <div className="grid grid-cols-5 gap-4 lg:gap-6">
              {/* Stage 1: Sketch */}
              <div className="relative">
                <div className="aspect-square bg-white rounded-lg border border-charcoal/10 p-4 flex items-center justify-center mb-4 relative overflow-hidden">
                  <span className="font-serif text-5xl lg:text-6xl opacity-30" style={{ filter: 'blur(0.5px)', transform: 'rotate(-2deg)' }}>H</span>
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                  }} />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-charcoal text-cream text-[10px] font-mono flex items-center justify-center rounded-full">01</div>
                <p className="text-xs font-mono text-charcoal uppercase tracking-wider mb-1">Sketch</p>
                <p className="text-[10px] text-charcoal/50 leading-tight">Initial form exploration</p>
              </div>
              
              {/* Stage 2: Structure */}
              <div className="relative">
                <div className="aspect-square bg-white rounded-lg border border-charcoal/10 p-4 flex items-center justify-center mb-4">
                  <span className="font-serif text-5xl lg:text-6xl" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(26,26,26,0.4)' }}>H</span>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-charcoal text-cream text-[10px] font-mono flex items-center justify-center rounded-full">02</div>
                <p className="text-xs font-mono text-charcoal uppercase tracking-wider mb-1">Structure</p>
                <p className="text-[10px] text-charcoal/50 leading-tight">Vector skeleton</p>
              </div>
              
              {/* Stage 3: Review */}
              <div className="relative">
                <div className="aspect-square bg-white rounded-lg border border-charcoal/10 p-4 flex items-center justify-center mb-4 relative">
                  <span className="font-serif text-5xl lg:text-6xl" style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(26,26,26,0.6)' }}>H</span>
                  <div className="absolute top-[35%] left-[35%] w-6 h-6 border-2 border-red-500 rounded-full" />
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-[10px] font-mono flex items-center justify-center rounded-full">03</div>
                <p className="text-xs font-mono text-red-500 uppercase tracking-wider mb-1">Review</p>
                <p className="text-[10px] text-charcoal/50 leading-tight">Junction needs work</p>
              </div>
              
              {/* Stage 4: Refined */}
              <div className="relative">
                <div className="aspect-square bg-white rounded-lg border border-charcoal/10 p-4 flex items-center justify-center mb-4">
                  <span className="font-serif text-5xl lg:text-6xl" style={{ color: 'transparent', WebkitTextStroke: '2px rgba(26,26,26,0.8)' }}>H</span>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-charcoal text-cream text-[10px] font-mono flex items-center justify-center rounded-full">04</div>
                <p className="text-xs font-mono text-charcoal uppercase tracking-wider mb-1">Refined</p>
                <p className="text-[10px] text-charcoal/50 leading-tight">12° fillet added</p>
              </div>
              
              {/* Stage 5: Final */}
              <div className="relative">
                <div className="aspect-square bg-charcoal rounded-lg p-4 flex items-center justify-center mb-4">
                  <span className="font-serif text-5xl lg:text-6xl text-cream">H</span>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-600 text-white text-[10px] font-mono flex items-center justify-center rounded-full">05</div>
                <p className="text-xs font-mono text-green-600 uppercase tracking-wider mb-1">Final</p>
                <p className="text-[10px] text-charcoal/50 leading-tight">Production ready</p>
              </div>
            </div>
            
            {/* Timeline bar */}
            <div className="mt-12 pt-8 border-t border-charcoal/10">
              <div className="relative h-1 bg-charcoal/10 rounded-full">
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-charcoal/40 via-red-500/40 to-green-600/40 rounded-full" />
                {[0, 25, 50, 75, 100].map((pos, i) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-charcoal/30 rounded-full" style={{ left: `${pos}%`, transform: `translateX(-50%) translateY(-50%)` }} />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[9px] font-mono text-charcoal/40 uppercase tracking-wider">
                <span>Initial</span>
                <span>Structure</span>
                <span>Feedback</span>
                <span>Revision</span>
                <span>Approved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid view - All 4 variants in 2x2 */}
      {variant === 'grid' && (
        <div className="h-screen w-screen grid grid-cols-2 grid-rows-2">
          {/* Dark */}
          <div className="bg-charcoal flex items-center justify-center relative p-8">
            <span className="font-serif text-cream text-[15vw] leading-none">H</span>
            <div className="absolute bottom-4 left-4">
              <span className="text-cream/40 text-[10px] font-mono uppercase tracking-wider block">Dark</span>
              <span className="text-cream/25 text-[8px] font-mono">Cream on Charcoal</span>
            </div>
          </div>
          
          {/* Light */}
          <div className="bg-cream flex items-center justify-center relative p-8">
            <span className="font-serif text-charcoal text-[15vw] leading-none">H</span>
            <div className="absolute bottom-4 left-4">
              <span className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider block">Light</span>
              <span className="text-charcoal/25 text-[8px] font-mono">Charcoal on Cream</span>
            </div>
          </div>
          
          {/* Outline/Construction */}
          <div className="bg-cream flex items-center justify-center relative p-8">
            <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-l border-charcoal/10 first:border-l-0" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-6 pointer-events-none opacity-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-t border-charcoal/10 first:border-t-0" />
              ))}
            </div>
            <span 
              className="font-serif text-[15vw] leading-none" 
              style={{ 
                color: 'transparent',
                WebkitTextStroke: '2px rgba(26,26,26,0.4)',
              }}
            >
              H
            </span>
            <div className="absolute bottom-4 left-4">
              <span className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider block">Construction</span>
              <span className="text-charcoal/25 text-[8px] font-mono">Vector Outline</span>
            </div>
          </div>
          
          {/* Textured */}
          <div className="bg-charcoal flex items-center justify-center relative p-8 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
            <span className="font-serif text-cream relative text-[15vw] leading-none">H</span>
            <div className="absolute bottom-4 left-4">
              <span className="text-cream/40 text-[10px] font-mono uppercase tracking-wider block">Textured</span>
              <span className="text-cream/25 text-[8px] font-mono">Noise Overlay</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
