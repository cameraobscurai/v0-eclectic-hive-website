'use client'

import { useState } from 'react'

const HIERARCHY = [
  {
    level: 'H1 — Display',
    text: 'ECLECTIC HIVE',
    specs: 'Saol Display Light / 64-96px / Tracking: 0.25em / Uppercase',
    className: 'font-serif text-6xl lg:text-8xl tracking-[0.25em] uppercase',
  },
  {
    level: 'H2 — Section',
    text: 'FROM VISION TO REALIZATION',
    specs: 'Saol Display Light / 40-56px / Tracking: 0.2em / Uppercase',
    className: 'font-serif text-4xl lg:text-5xl tracking-[0.2em] uppercase',
  },
  {
    level: 'H3 — Subsection',
    text: 'Atelier by The Hive',
    specs: 'Saol Display Light / 24-32px / Tracking: 0.15em / Title Case',
    className: 'font-serif text-2xl lg:text-3xl tracking-[0.15em]',
  },
  {
    level: 'H4 — Component',
    text: 'HIVE SIGNATURE COLLECTION',
    specs: 'Inter Medium / 14-16px / Tracking: 0.3em / Uppercase',
    className: 'font-sans font-medium text-sm lg:text-base tracking-[0.3em] uppercase',
  },
  {
    level: 'Body — Primary',
    text: 'Our process is designed to honor both creative ambition and practical reality. We guide clients through a structured journey that transforms initial vision into authored environment.',
    specs: 'Inter Regular / 16-18px / Tracking: 0.02em / Line Height: 1.6',
    className: 'font-sans text-base lg:text-lg tracking-[0.02em] leading-relaxed max-w-2xl',
  },
  {
    level: 'Body — Secondary',
    text: 'Full-service design and production studio offering curated collections for luxury events.',
    specs: 'Inter Regular / 14-16px / Tracking: 0.02em / Opacity: 70%',
    className: 'font-sans text-sm lg:text-base tracking-[0.02em] leading-relaxed opacity-70 max-w-xl',
  },
  {
    level: 'Caption / Label',
    text: 'SEATING • TABLES • BARS • LOUNGE',
    specs: 'Inter Light / 10-12px / Tracking: 0.2em / Uppercase',
    className: 'font-sans font-light text-xs tracking-[0.2em] uppercase opacity-50',
  },
]

export default function Hierarchy() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  const accent = theme === 'dark' ? 'text-red-400/60' : 'text-red-600/60'
  
  return (
    <main className={`min-h-screen ${bg} p-8 lg:p-16`}>
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 text-xs uppercase tracking-widest rounded bg-white/80 text-charcoal border border-charcoal/20"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto pt-16">
        {/* Header */}
        <div className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-16`}>
          <p>Typography Hierarchy System</p>
          <p>Eclectic Hive Brand Guidelines</p>
        </div>

        {/* Hierarchy Stack */}
        <div className="space-y-12">
          {HIERARCHY.map((item, i) => (
            <div key={i} className={`border-b ${border} pb-12`}>
              {/* Level label with red accent */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className={`${accent} text-xs font-mono uppercase tracking-wider`}>
                  {item.level}
                </span>
              </div>
              
              {/* The actual typography */}
              <p className={`${text} ${item.className} mb-4`}>
                {item.text}
              </p>
              
              {/* Specs */}
              <p className={`${textMuted} text-xs font-mono tracking-wider`}>
                {item.specs}
              </p>
            </div>
          ))}
        </div>

        {/* Grid measurements */}
        <div className="mt-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-8`}>
            Spacing System — 8px Baseline Grid
          </p>
          
          <div className="flex gap-4 items-end">
            {[8, 16, 24, 32, 48, 64, 96].map((size) => (
              <div key={size} className="flex flex-col items-center">
                <div 
                  className={`w-8 ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'}`}
                  style={{ height: size }}
                />
                <span className={`${textMuted} text-xs font-mono mt-2`}>{size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
