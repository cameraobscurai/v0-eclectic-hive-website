'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default function Alphabet() {
  const [mode, setMode] = useState<'upper' | 'lower' | 'both'>('upper')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg} p-8 lg:p-16`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-alphabet-${mode}-${theme}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        {(['upper', 'lower', 'both'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              mode === m 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20'
            }`}
          >
            {m}
          </button>
        ))}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 text-xs uppercase tracking-widest rounded bg-white/80 text-charcoal border border-charcoal/20"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto pt-16">
        {/* Header */}
        <div className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-12`}>
          <p>Saol Display Light — Full Character Set</p>
          <p>Tracking: 0.25em / Weight: 300</p>
        </div>

        {/* Uppercase */}
        {(mode === 'upper' || mode === 'both') && (
          <div className="mb-16">
            {mode === 'both' && (
              <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>Uppercase</p>
            )}
            <div className="grid grid-cols-13 gap-0">
              {UPPERCASE.map((letter, i) => (
                <div 
                  key={letter} 
                  className={`aspect-square flex items-center justify-center ${text} font-serif border-b border-r ${
                    theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
                  } ${i % 13 === 0 ? 'border-l' : ''} ${i < 13 ? 'border-t' : ''}`}
                  style={{ fontSize: 'clamp(24px, 5vw, 64px)' }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lowercase */}
        {(mode === 'lower' || mode === 'both') && (
          <div className="mb-16">
            {mode === 'both' && (
              <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>Lowercase</p>
            )}
            <div className="grid grid-cols-13 gap-0">
              {LOWERCASE.map((letter, i) => (
                <div 
                  key={letter} 
                  className={`aspect-square flex items-center justify-center ${text} font-serif border-b border-r ${
                    theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
                  } ${i % 13 === 0 ? 'border-l' : ''} ${i < 13 ? 'border-t' : ''}`}
                  style={{ fontSize: 'clamp(24px, 5vw, 64px)' }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured letters - HIVE */}
        <div className="mt-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>Featured Glyphs — Brand Wordmark</p>
          <div className="flex justify-center gap-8 lg:gap-16">
            {['H', 'I', 'V', 'E'].map((letter) => (
              <span 
                key={letter}
                className={`${text} font-serif`}
                style={{ fontSize: 'clamp(80px, 15vw, 200px)', lineHeight: 1 }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Specimen text */}
        <div className="mt-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>Specimen Setting</p>
          <p className={`${text} font-serif text-4xl lg:text-6xl tracking-[0.15em] uppercase leading-tight`}>
            ECLECTIC HIVE
          </p>
          <p className={`${text} font-serif text-2xl lg:text-4xl tracking-[0.2em] uppercase mt-4 opacity-60`}>
            IMAGINED. REFINED. CRAFTED.
          </p>
        </div>
      </div>
    </main>
  )
}
