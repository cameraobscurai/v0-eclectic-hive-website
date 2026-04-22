'use client'

import { useState } from 'react'

const NUMERALS = '0123456789'.split('')
const PUNCTUATION = ['.', ',', ':', ';', '!', '?', '"', '"', "'", "'", '—', '–', '-']
const SYMBOLS = ['&', '@', '#', '*', '/', '\\', '|', '+', '=', '%', '$']

export default function Numerals() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  
  return (
    <main className={`min-h-screen ${bg} p-8 lg:p-16`}>
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50">
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
