'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

const NUMERALS = '0123456789'.split('')
const PUNCTUATION = ['.', ',', ':', ';', '!', '?', '"', '"', "'", "'", '—', '–', '-']
const SYMBOLS = ['&', '@', '#', '*', '/', '\\', '|', '+', '=', '%', '$']

export default function Numerals() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'grid'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : theme === 'light' ? 'bg-cream' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  
  // Grid view - show numerals in both themes
  if (theme === 'grid') {
    return (
      <main id="specimen-content" className="min-h-screen grid grid-cols-2">
        <DownloadButton targetId="specimen-content" filename="eclectic-hive-numerals-grid" />
        
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
        
        {/* Dark numerals */}
        <div className="bg-charcoal p-8 min-h-[50vh] flex flex-col justify-center">
          <p className="text-cream/40 text-[10px] font-mono uppercase tracking-wider mb-4">Dark / Numerals</p>
          <div className="flex justify-between">
            {NUMERALS.map((num) => (
              <span key={num} className="text-cream font-serif text-3xl lg:text-5xl">{num}</span>
            ))}
          </div>
          <p className="text-cream font-serif text-xl lg:text-3xl tracking-[0.1em] mt-8">96W × 24D × 41H</p>
        </div>
        
        {/* Light numerals */}
        <div className="bg-cream p-8 min-h-[50vh] flex flex-col justify-center">
          <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider mb-4">Light / Numerals</p>
          <div className="flex justify-between">
            {NUMERALS.map((num) => (
              <span key={num} className="text-charcoal font-serif text-3xl lg:text-5xl">{num}</span>
            ))}
          </div>
          <p className="text-charcoal font-serif text-xl lg:text-3xl tracking-[0.1em] mt-8">96W × 24D × 41H</p>
        </div>
        
        {/* Dark ampersand */}
        <div className="bg-charcoal flex items-center justify-center min-h-[50vh]">
          <span className="text-cream font-serif" style={{ fontSize: 'clamp(100px, 20vw, 200px)' }}>&</span>
        </div>
        
        {/* Light ampersand */}
        <div className="bg-cream flex items-center justify-center min-h-[50vh]">
          <span className="text-charcoal font-serif" style={{ fontSize: 'clamp(100px, 20vw, 200px)' }}>&</span>
        </div>
      </main>
    )
  }
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg} p-8 lg:p-16`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-numerals-${theme}`} />
      
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

      <div className="max-w-5xl mx-auto pt-16">
        {/* Header */}
        <div className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-16`}>
          <p>Numerals + Symbols + Punctuation</p>
          <p>Saol Display Light — Tabular Figures</p>
        </div>

        {/* Large numerals */}
        <section className="mb-24">
          <div className="flex justify-between">
            {NUMERALS.map((num) => (
              <span 
                key={num}
                className={`${text} font-serif`}
                style={{ fontSize: 'clamp(48px, 10vw, 120px)' }}
              >
                {num}
              </span>
            ))}
          </div>
          <p className={`${textMuted} text-xs font-mono mt-6`}>
            Tabular figures — Fixed width for data alignment
          </p>
        </section>

        {/* Real inventory numbers */}
        <section className="mb-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>
            Application — Inventory Catalog Numbers
          </p>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {['001', '024', '108', '256', '512', '999'].map((num) => (
              <div key={num} className={`border ${border} rounded p-4 text-center`}>
                <span className={`${text} font-serif text-2xl lg:text-3xl tracking-[0.1em]`}>
                  {num}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Dimensions format */}
        <section className="mb-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>
            Application — Product Dimensions
          </p>
          
          <div className={`${text} font-serif text-3xl lg:text-5xl tracking-[0.1em] space-y-4`}>
            <p>96W × 24D × 41H</p>
            <p>48" × 30" × 29"</p>
            <p>120cm × 80cm × 75cm</p>
          </div>
        </section>

        {/* Punctuation */}
        <section className="mb-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>
            Punctuation
          </p>
          
          <div className="flex flex-wrap gap-6">
            {PUNCTUATION.map((char, i) => (
              <span 
                key={i}
                className={`${text} font-serif text-4xl lg:text-5xl`}
              >
                {char}
              </span>
            ))}
          </div>
        </section>

        {/* Symbols */}
        <section className="mb-24">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>
            Symbols
          </p>
          
          <div className="flex flex-wrap gap-8">
            {SYMBOLS.map((char, i) => (
              <span 
                key={i}
                className={`${text} font-serif text-4xl lg:text-5xl`}
              >
                {char}
              </span>
            ))}
          </div>
        </section>

        {/* Ampersand hero */}
        <section>
          <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>
            Featured Glyph — Ampersand
          </p>
          
          <div className="flex items-center justify-center py-12">
            <span 
              className={`${text} font-serif`}
              style={{ fontSize: 'clamp(120px, 25vw, 300px)', lineHeight: 1 }}
            >
              &
            </span>
          </div>
          <p className={`${textMuted} text-xs font-mono text-center`}>
            DESIGN + PRODUCTION — Usage in brand lockups
          </p>
        </section>
      </div>
    </main>
  )
}
