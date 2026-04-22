'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

const BRAND_NAME_PARTS = ['ECLECTIC', 'HIVE']
const CATEGORIES = ['SEATING', 'TABLES', 'BARS', 'LOUNGE', 'LIGHTING', 'DÉCOR', 'TEXTILES']
const PROCESS_WORDS = ['DISCOVERY', 'DESIGN', 'PRODUCTION', 'FABRICATION', 'INSTALLATION']
const VALUE_WORDS = ['AUTHORED', 'CURATED', 'REFINED', 'CRAFTED', 'ELEVATED']
const ACTION_WORDS = ['IMAGINED', 'REFINED', 'CRAFTED']

export default function Words() {
  const [view, setView] = useState<'brand' | 'categories' | 'process' | 'values' | 'grid'>('brand')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const accent = theme === 'dark' ? 'text-red-400' : 'text-red-600'
  
  // Grid view - 2x2 showing brand name and categories in both themes
  if (view === 'grid') {
    return (
      <main id="specimen-content" className="min-h-screen grid grid-cols-2 grid-rows-2">
        <DownloadButton targetId="specimen-content" filename="eclectic-hive-words-grid" />
        
        <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap">
          {(['brand', 'categories', 'process', 'values', 'grid'] as const).map((v) => (
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
        
        {/* Dark - Brand name */}
        <div className="bg-charcoal flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-cream/40 text-[10px] font-mono uppercase tracking-wider mb-3">Brand / Dark</p>
            <p className="text-cream font-serif tracking-[0.2em] text-4xl lg:text-6xl">ECLECTIC</p>
            <p className="text-cream font-serif tracking-[0.2em] text-4xl lg:text-6xl">HIVE</p>
          </div>
        </div>
        
        {/* Light - Brand name */}
        <div className="bg-cream flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider mb-3">Brand / Light</p>
            <p className="text-charcoal font-serif tracking-[0.2em] text-4xl lg:text-6xl">ECLECTIC</p>
            <p className="text-charcoal font-serif tracking-[0.2em] text-4xl lg:text-6xl">HIVE</p>
          </div>
        </div>
        
        {/* Dark - Categories */}
        <div className="bg-charcoal flex items-center justify-center p-8">
          <div>
            <p className="text-cream/40 text-[10px] font-mono uppercase tracking-wider mb-4">Categories / Dark</p>
            <div className="space-y-1">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <p key={cat} className="text-cream font-serif tracking-[0.15em] text-xl lg:text-2xl">{cat}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Light - Categories */}
        <div className="bg-cream flex items-center justify-center p-8">
          <div>
            <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider mb-4">Categories / Light</p>
            <div className="space-y-1">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <p key={cat} className="text-charcoal font-serif tracking-[0.15em] text-xl lg:text-2xl">{cat}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-words-${view}-${theme}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap">
        {(['brand', 'categories', 'process', 'values', 'grid'] as const).map((v) => (
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
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 text-xs uppercase tracking-widest rounded bg-white/80 text-charcoal border border-charcoal/20"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* Brand name hero - dramatic full screen */}
      {view === 'brand' && (
        <div className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
          {/* Ghost letters background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span 
              className={`font-serif ${theme === 'dark' ? 'text-cream/[0.02]' : 'text-charcoal/[0.02]'} select-none`}
              style={{ fontSize: 'clamp(300px, 45vw, 500px)', lineHeight: 0.8 }}
            >
              EH
            </span>
          </div>
          
          <div className="text-center relative z-10">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-8`}>
              Brand Wordmark
            </p>
            
            {/* Stacked wordmark */}
            <div className="mb-16">
              {BRAND_NAME_PARTS.map((word) => (
                <p 
                  key={word}
                  className={`${text} font-serif tracking-[0.2em]`}
                  style={{ fontSize: 'clamp(56px, 14vw, 160px)', lineHeight: 1.0 }}
                >
                  {word}
                </p>
              ))}
            </div>

            {/* Inline wordmark */}
            <div className="mb-8">
              <p 
                className={`${text} font-serif tracking-[0.25em]`}
                style={{ fontSize: 'clamp(28px, 6vw, 72px)' }}
              >
                ECLECTIC HIVE
              </p>
            </div>
            
            <p className={`${accent} text-xs font-mono uppercase tracking-wider`}>
              Saol Display Light / Tracking: 0.2-0.25em / Uppercase
            </p>
          </div>
        </div>
      )}

      {/* Categories - elegant numbered list */}
      {view === 'categories' && (
        <div className="min-h-screen px-8 lg:px-16 py-24">
          <div className="max-w-5xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-16`}>
              Product Categories
            </p>
            
            <div className="space-y-4">
              {CATEGORIES.map((cat, i) => (
                <div key={cat} className="flex items-baseline gap-8 group">
                  <span className={`${textMuted} font-mono text-sm w-8 group-hover:text-red-400 transition-colors`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span 
                    className={`${text} font-serif tracking-[0.15em]`}
                    style={{ fontSize: 'clamp(36px, 7vw, 80px)' }}
                  >
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Process - numbered phases */}
      {view === 'process' && (
        <div className="min-h-screen px-8 lg:px-16 py-24">
          <div className="max-w-5xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-16`}>
              Five Phases. One Authored Outcome.
            </p>
            
            <div className="space-y-12">
              {PROCESS_WORDS.map((word, i) => (
                <div key={word} className="flex items-center gap-12">
                  <span 
                    className={`${textMuted} font-serif`}
                    style={{ fontSize: 'clamp(48px, 8vw, 96px)', width: '1.2em', textAlign: 'right' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span 
                      className={`${text} font-serif tracking-[0.1em]`}
                      style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}
                    >
                      {word}
                    </span>
                    <p className={`${textMuted} text-sm mt-2`}>
                      Phase {i + 1} of 5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Values - tagline and core words */}
      {view === 'values' && (
        <div className="min-h-screen px-8 lg:px-16 py-24">
          <div className="max-w-6xl mx-auto">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-16`}>
              Brand Values
            </p>
            
            {/* Tagline - hero treatment */}
            <div className="mb-32 text-center">
              <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
                {ACTION_WORDS.map((word) => (
                  <span 
                    key={word}
                    className={`${text} font-serif tracking-[0.15em]`}
                    style={{ fontSize: 'clamp(32px, 6vw, 72px)' }}
                  >
                    {word}.
                  </span>
                ))}
              </div>
              <p className={`${accent} text-xs font-mono uppercase tracking-wider mt-8`}>
                Primary Tagline
              </p>
            </div>
            
            {/* Value words - horizontal scroll */}
            <div>
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-8`}>
                Core Vocabulary
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                {VALUE_WORDS.map((word) => (
                  <span 
                    key={word}
                    className={`${text} font-serif tracking-[0.2em]`}
                    style={{ fontSize: 'clamp(20px, 3vw, 32px)' }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
