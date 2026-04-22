'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

export default function Hierarchy() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'grid'>('dark')
  
  // Grid view - show all levels in 2x2
  if (theme === 'grid') {
    return (
      <main id="specimen-content" className="min-h-screen grid grid-cols-2 grid-rows-2">
        <DownloadButton targetId="specimen-content" filename="eclectic-hive-hierarchy-grid" />
        
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          {(['dark', 'light', 'grid'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
                theme === t 
                  ? 'bg-charcoal text-cream' 
                  : 'bg-white/80 text-charcoal border border-charcoal/20'
              }`}
            >
              {t === 'grid' ? '2x2' : t}
            </button>
          ))}
        </div>

        {/* H1 Dark */}
        <div className="bg-charcoal flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-cream/40 text-[10px] font-mono uppercase tracking-wider mb-4">H1 Display / Dark</p>
            <p className="font-serif text-cream text-4xl lg:text-6xl tracking-[0.2em] uppercase">ECLECTIC</p>
          </div>
        </div>

        {/* H1 Light */}
        <div className="bg-cream flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider mb-4">H1 Display / Light</p>
            <p className="font-serif text-charcoal text-4xl lg:text-6xl tracking-[0.2em] uppercase">ECLECTIC</p>
          </div>
        </div>

        {/* Body Dark */}
        <div className="bg-charcoal flex items-center justify-center p-8">
          <div className="max-w-sm">
            <p className="text-cream/40 text-[10px] font-mono uppercase tracking-wider mb-4">Body / Dark</p>
            <p className="text-cream/80 text-base leading-relaxed">
              Our process transforms initial vision into authored environment through structured collaboration.
            </p>
          </div>
        </div>

        {/* Body Light */}
        <div className="bg-cream flex items-center justify-center p-8">
          <div className="max-w-sm">
            <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider mb-4">Body / Light</p>
            <p className="text-charcoal/80 text-base leading-relaxed">
              Our process transforms initial vision into authored environment through structured collaboration.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  const accent = theme === 'dark' ? 'text-red-400' : 'text-red-600'
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-hierarchy-${theme}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {(['dark', 'light', 'grid'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              theme === t 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20'
            }`}
          >
            {t === 'grid' ? '2x2' : t}
          </button>
        ))}
      </div>

      {/* Hero section with massive H1 */}
      <section className="min-h-[70vh] flex items-end px-8 lg:px-16 pb-16 relative overflow-hidden">
        {/* Large background letter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span 
            className={`font-serif ${theme === 'dark' ? 'text-cream/[0.03]' : 'text-charcoal/[0.03]'} select-none`}
            style={{ fontSize: 'clamp(400px, 60vw, 800px)', lineHeight: 0.8 }}
          >
            H1
          </span>
        </div>
        
        <div className="relative z-10 max-w-6xl w-full">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
            H1 — Display Headline
          </p>
          <h1 className={`font-serif ${text} text-6xl md:text-7xl lg:text-[120px] tracking-[0.15em] uppercase leading-[0.9]`}>
            ECLECTIC<br/>HIVE
          </h1>
          <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-8`}>
            Saol Display Light / 80-120px / Tracking: 0.15em / Uppercase
          </p>
        </div>
      </section>

      {/* H2 Section */}
      <section className={`px-8 lg:px-16 py-24 border-t ${border}`}>
        <div className="max-w-6xl mx-auto">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
            H2 — Section Title
          </p>
          <h2 className={`font-serif ${text} text-4xl md:text-5xl lg:text-6xl tracking-[0.2em] uppercase`}>
            FROM VISION TO REALIZATION
          </h2>
          <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-6`}>
            Saol Display Light / 48-64px / Tracking: 0.2em / Uppercase
          </p>
        </div>
      </section>

      {/* H3 Section */}
      <section className={`px-8 lg:px-16 py-24 border-t ${border}`}>
        <div className="max-w-6xl mx-auto">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
            H3 — Subsection
          </p>
          <h3 className={`font-serif ${text} text-3xl md:text-4xl tracking-[0.1em]`}>
            Atelier by The Hive
          </h3>
          <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-6`}>
            Saol Display Light / 32-40px / Tracking: 0.1em / Title Case
          </p>
        </div>
      </section>

      {/* H4 + Body Section */}
      <section className={`px-8 lg:px-16 py-24 border-t ${border}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* H4 */}
          <div>
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
              H4 — Component Label
            </p>
            <h4 className={`font-sans font-medium ${text} text-sm tracking-[0.3em] uppercase`}>
              HIVE SIGNATURE COLLECTION
            </h4>
            <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-6`}>
              Inter Medium / 14px / Tracking: 0.3em / Uppercase
            </p>
          </div>

          {/* Body */}
          <div>
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
              Body — Primary Text
            </p>
            <p className={`${text} opacity-80 text-base lg:text-lg leading-relaxed`}>
              Our process is designed to honor both creative ambition and practical reality. 
              We guide clients through a structured journey that transforms initial vision 
              into authored environment.
            </p>
            <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-6`}>
              Inter Regular / 16-18px / Line Height: 1.6
            </p>
          </div>
        </div>
      </section>

      {/* Caption + Labels */}
      <section className={`px-8 lg:px-16 py-24 border-t ${border}`}>
        <div className="max-w-6xl mx-auto">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
            Caption — Labels & Metadata
          </p>
          <p className={`font-sans font-light ${text} text-xs tracking-[0.2em] uppercase opacity-50`}>
            SEATING • TABLES • BARS • LOUNGE • LIGHTING • DÉCOR
          </p>
          <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-6`}>
            Inter Light / 10-12px / Tracking: 0.2em / Uppercase / 50% opacity
          </p>
        </div>
      </section>

      {/* Spacing Scale */}
      <section className={`px-8 lg:px-16 py-24 border-t ${border}`}>
        <div className="max-w-6xl mx-auto">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-8`}>
            Vertical Rhythm — 8px Baseline
          </p>
          
          <div className="flex items-end gap-4">
            {[8, 16, 24, 32, 48, 64, 96].map((size) => (
              <div key={size} className="flex flex-col items-center">
                <div 
                  className={`w-10 ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'} rounded-sm`}
                  style={{ height: size }}
                />
                <span className={`${textMuted} text-xs font-mono mt-3`}>{size}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
