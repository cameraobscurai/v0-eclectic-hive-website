'use client'

import { useState } from 'react'

// Real Eclectic Hive vocabulary only
const BRAND_NAME_PARTS = ['ECLECTIC', 'HIVE']

const CATEGORIES = ['SEATING', 'TABLES', 'BARS', 'LOUNGE', 'LIGHTING', 'DÉCOR', 'TEXTILES']

const PROCESS_WORDS = ['DISCOVERY', 'DESIGN', 'PRODUCTION', 'FABRICATION', 'INSTALLATION']

const VALUE_WORDS = ['AUTHORED', 'CURATED', 'REFINED', 'CRAFTED', 'ELEVATED']

const ACTION_WORDS = ['IMAGINED', 'REFINED', 'CRAFTED']

export default function Words() {
  const [view, setView] = useState<'brand' | 'categories' | 'process' | 'values'>('brand')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  
  return (
    <main className={`min-h-screen ${bg}`}>
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap">
        {(['brand', 'categories', 'process', 'values'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              view === v 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20'
            }`}
          >
            {v}
          </button>
        ))}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 text-xs uppercase tracking-widest rounded bg-white/80 text-charcoal border border-charcoal/20"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* Brand name hero */}
      {view === 'brand' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-8`}>
              Brand Wordmark — Display Setting
            </p>
            
            {/* Stacked */}
            <div className="mb-16">
              {BRAND_NAME_PARTS.map((word) => (
                <p 
                  key={word}
                  className={`${text} font-serif tracking-[0.2em]`}
                  style={{ fontSize: 'clamp(48px, 12vw, 140px)', lineHeight: 1.1 }}
                >
                  {word}
                </p>
              ))}
            </div>

            {/* Inline */}
            <p 
              className={`${text} font-serif tracking-[0.25em]`}
              style={{ fontSize: 'clamp(24px, 5vw, 64px)' }}
            >
              ECLECTIC HIVE
            </p>
            
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mt-8`}>
              Tracking: 0.25em / Weight: Light / Case: Uppercase
            </p>
          </div>
        </div>
      )}

      {/* Categories */}
      {view === 'categories' && (
        <div className="min-h-screen p-8 lg:p-16 pt-24">
          <div className="max-w-4xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-12`}>
              Product Categories — Navigation Vocabulary
            </p>
            
            <div className="space-y-6">
              {CATEGORIES.map((cat, i) => (
                <div key={cat} className="flex items-baseline gap-6">
                  <span className={`${textMuted} font-mono text-xs w-8`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span 
                    className={`${text} font-serif tracking-[0.2em]`}
                    style={{ fontSize: 'clamp(32px, 6vw, 72px)' }}
                  >
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Process */}
      {view === 'process' && (
        <div className="min-h-screen p-8 lg:p-16 pt-24">
          <div className="max-w-4xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-12`}>
              Process Phases — Sequential Vocabulary
            </p>
            
            <div className="space-y-8">
              {PROCESS_WORDS.map((word, i) => (
                <div key={word} className="flex items-center gap-8">
                  <span 
                    className={`${textMuted} font-serif text-6xl lg:text-8xl`}
                    style={{ width: '1.5em', textAlign: 'right' }}
                  >
                    {i + 1}
                  </span>
                  <span 
                    className={`${text} font-serif tracking-[0.15em]`}
                    style={{ fontSize: 'clamp(24px, 5vw, 56px)' }}
                  >
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Values */}
      {view === 'values' && (
        <div className="min-h-screen p-8 lg:p-16 pt-24">
          <div className="max-w-5xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-12`}>
              Brand Values — Core Vocabulary
            </p>
            
            {/* Action words - tagline */}
            <div className="mb-24">
              <div className="flex flex-wrap gap-4 lg:gap-8 justify-center">
                {ACTION_WORDS.map((word, i) => (
                  <span key={word} className="flex items-center gap-4 lg:gap-8">
                    <span 
                      className={`${text} font-serif tracking-[0.2em]`}
                      style={{ fontSize: 'clamp(28px, 5vw, 64px)' }}
                    >
                      {word}.
                    </span>
                  </span>
                ))}
              </div>
              <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mt-6 text-center`}>
                Primary Tagline
              </p>
            </div>
            
            {/* Value words grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {VALUE_WORDS.map((word) => (
                <div key={word} className="text-center">
                  <span 
                    className={`${text} font-serif tracking-[0.15em]`}
                    style={{ fontSize: 'clamp(16px, 2vw, 24px)' }}
                  >
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
