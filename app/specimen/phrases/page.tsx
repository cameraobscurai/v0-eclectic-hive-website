'use client'

import { useState } from 'react'

// All real Eclectic Hive phrases - no fake words
const PHRASES = [
  { text: 'ECLECTIC HIVE', category: 'Brand Name' },
  { text: 'IMAGINED. REFINED. CRAFTED.', category: 'Tagline' },
  { text: 'FROM VISION TO REALIZATION', category: 'Process' },
  { text: 'ATELIER BY THE HIVE', category: 'Studio' },
  { text: 'HIVE SIGNATURE COLLECTION', category: 'Product' },
  { text: 'FULL-SERVICE DESIGN + PRODUCTION', category: 'Service' },
  { text: 'FIVE PHASES. ONE AUTHORED OUTCOME.', category: 'Process' },
  { text: 'AUTHORED ENVIRONMENTS', category: 'Philosophy' },
  { text: 'CURATED COLLECTIONS', category: 'Product' },
  { text: 'THE GALLERY', category: 'Section' },
]

const SINGLE_WORDS = [
  'AUTHORED', 'CURATED', 'REFINED', 'CRAFTED', 'ELEVATED',
  'SEATING', 'TABLES', 'BARS', 'LOUNGE', 'LIGHTING', 'DÉCOR', 'TEXTILES',
  'VISION', 'DESIGN', 'PRODUCTION', 'FABRICATION', 'INSTALLATION',
]

export default function Phrases() {
  const [view, setView] = useState<'stack' | 'hero' | 'words'>('stack')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  
  return (
    <main className={`min-h-screen ${bg}`}>
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {(['stack', 'hero', 'words'] as const).map((v) => (
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

      {/* Stacked phrases view */}
      {view === 'stack' && (
        <div className="min-h-screen p-8 lg:p-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-12`}>
              Brand Vocabulary — Display Settings
            </p>
            
            <div className="space-y-8">
              {PHRASES.map((phrase, i) => (
                <div key={i} className={`border-b ${border} pb-8`}>
                  <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-2`}>
                    {phrase.category}
                  </p>
                  <p 
                    className={`${text} font-serif tracking-[0.15em]`}
                    style={{ fontSize: 'clamp(24px, 5vw, 56px)' }}
                  >
                    {phrase.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero phrase view - one at a time, massive */}
      {view === 'hero' && (
        <div className="min-h-screen flex flex-col">
          {PHRASES.slice(0, 4).map((phrase, i) => (
            <div 
              key={i}
              className={`flex-1 flex items-center justify-center border-b ${border} px-8`}
            >
              <div className="text-center">
                <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-4`}>
                  {phrase.category}
                </p>
                <p 
                  className={`${text} font-serif tracking-[0.2em]`}
                  style={{ fontSize: 'clamp(32px, 6vw, 80px)' }}
                >
                  {phrase.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single words grid */}
      {view === 'words' && (
        <div className="min-h-screen p-8 lg:p-16 pt-24">
          <div className="max-w-6xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-12`}>
              Brand Vocabulary — Single Word Specimens
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px" style={{ background: theme === 'dark' ? 'rgba(245,242,237,0.1)' : 'rgba(26,26,26,0.1)' }}>
              {SINGLE_WORDS.map((word, i) => (
                <div 
                  key={i}
                  className={`${bg} aspect-[3/2] flex items-center justify-center p-4`}
                >
                  <span 
                    className={`${text} font-serif tracking-[0.2em] text-center`}
                    style={{ fontSize: 'clamp(14px, 2.5vw, 28px)' }}
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
