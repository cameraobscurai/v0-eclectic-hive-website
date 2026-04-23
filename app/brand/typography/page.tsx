'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

// Complete alphabet
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('')
const NUMERALS = '0123456789'.split('')
const PUNCTUATION = ['&', '.', ',', ':', ';', '!', '?', '"', "'", '—', '–', '/', '(', ')']

export default function Typography() {
  const [view, setView] = useState<'letterform' | 'alphabet' | 'hierarchy' | 'numerals'>('letterform')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [letterformMode, setLetterformMode] = useState<'display' | 'construction' | 'anatomy' | 'process'>('display')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'

  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-typography-${view}-${theme}`} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-cream/10">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/brand" className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors">
            ← Brand
          </Link>
          <div className="flex gap-1">
            {(['letterform', 'alphabet', 'hierarchy', 'numerals'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded transition-colors ${
                  view === v 
                    ? 'bg-cream text-charcoal' 
                    : 'text-cream/60 hover:text-cream'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors"
          >
            {theme === 'dark' ? '◐ Light' : '◑ Dark'}
          </button>
        </div>
        
        {/* Sub-navigation for letterform */}
        {view === 'letterform' && (
          <div className="flex justify-center gap-1 px-6 pb-3">
            {(['display', 'construction', 'anatomy', 'process'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setLetterformMode(m)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded transition-colors ${
                  letterformMode === m 
                    ? 'bg-cream/20 text-cream' 
                    : 'text-cream/40 hover:text-cream/60'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* LETTERFORM VIEW */}
      {view === 'letterform' && (
        <div className="pt-24">
          {/* Display mode */}
          {letterformMode === 'display' && (
            <div className={`min-h-[calc(100vh-6rem)] flex items-center justify-center ${bg}`}>
              <span 
                className={`font-serif ${text} select-none`}
                style={{ fontSize: 'min(70vw, 70vh)', lineHeight: 0.85 }}
              >
                H
              </span>
              <div className={`absolute bottom-8 left-8 ${textMuted} text-xs font-mono uppercase tracking-wider`}>
                <p>Saol Display Light</p>
                <p>Cap Height: 700</p>
              </div>
            </div>
          )}
          
          {/* Construction mode */}
          {letterformMode === 'construction' && (
            <div className="min-h-[calc(100vh-6rem)] bg-cream p-8 lg:p-16">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <p className="text-red-500 text-xs font-mono uppercase tracking-[0.2em] mb-2">Construction Analysis</p>
                  <h2 className="font-serif text-charcoal text-2xl tracking-wide">Letterform Engineering</h2>
                </div>
                
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
                        fontSize: 'min(35vw, 30vh)', 
                        lineHeight: 0.85,
                        color: 'transparent',
                        WebkitTextStroke: '2px #1a1a1a',
                      }}
                    >
                      H
                    </span>
                  </div>
                  
                  {/* Measurement lines */}
                  <div className="absolute left-[15%] top-[20%] bottom-[25%] flex flex-col items-center">
                    <div className="w-px h-full bg-red-500" />
                    <div className="absolute top-0 w-3 h-px bg-red-500" />
                    <div className="absolute bottom-0 w-3 h-px bg-red-500" />
                    <span className="absolute top-1/2 -translate-y-1/2 -left-20 text-red-500 text-[10px] font-mono whitespace-nowrap">
                      CAP: 700
                    </span>
                  </div>
                  
                  <div className="absolute top-[47%] left-[32%] right-[32%]">
                    <div className="h-px w-full bg-red-500/80" />
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-red-500 text-[10px] font-mono whitespace-nowrap bg-white px-1">
                      CROSSBAR @ 48%
                    </span>
                  </div>
                  
                  {/* Specs panel */}
                  <div className="absolute top-4 right-4 bg-white/95 p-4 rounded border border-charcoal/10">
                    <p className="text-[10px] font-mono text-charcoal/60 uppercase tracking-wider mb-2">Specs</p>
                    <div className="space-y-1 text-[11px] font-mono text-charcoal/80">
                      <p>UPM: 1000</p>
                      <p>Stem: 84pt</p>
                      <p>Contrast: 1:3.2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Anatomy mode */}
          {letterformMode === 'anatomy' && (
            <div className="min-h-[calc(100vh-6rem)] bg-cream p-8 lg:p-16 flex items-center justify-center">
              <div className="relative">
                <span 
                  className="font-serif text-charcoal select-none"
                  style={{ fontSize: 'min(50vw, 45vh)', lineHeight: 0.85 }}
                >
                  H
                </span>
                
                {/* Labels */}
                <div className="absolute top-[10%] left-[25%]">
                  <div className="w-16 h-px bg-charcoal/40 -rotate-45 origin-left" />
                  <span className="absolute -top-4 left-12 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                    Serif
                  </span>
                </div>
                
                <div className="absolute top-[45%] left-[5%] -translate-y-1/2">
                  <div className="w-12 h-px bg-charcoal/40" />
                  <span className="absolute -top-4 left-0 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                    Stem
                  </span>
                </div>
                
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2">
                  <div className="w-px h-10 bg-charcoal/40 mx-auto" />
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap bg-cream px-1">
                    Crossbar
                  </span>
                </div>
                
                <div className="absolute top-[30%] right-[5%]">
                  <div className="w-12 h-px bg-charcoal/40" />
                  <span className="absolute -top-4 right-0 text-[10px] font-mono text-charcoal/60 uppercase tracking-wider whitespace-nowrap text-right bg-cream px-1">
                    Counter
                  </span>
                </div>
                
                <div className="absolute top-[8%] left-0 right-0 border-t border-dashed border-charcoal/20">
                  <span className="absolute -top-4 right-0 text-[9px] font-mono text-charcoal/30 uppercase bg-cream px-1">Cap Line</span>
                </div>
                <div className="absolute bottom-[8%] left-0 right-0 border-t border-dashed border-charcoal/20">
                  <span className="absolute top-1 right-0 text-[9px] font-mono text-charcoal/30 uppercase bg-cream px-1">Baseline</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Process mode */}
          {letterformMode === 'process' && (
            <div className="min-h-[calc(100vh-6rem)] bg-cream p-8 lg:p-16">
              <div className="max-w-6xl mx-auto pt-8">
                <div className="mb-12">
                  <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.2em] mb-2">Design Process</p>
                  <h2 className="font-serif text-charcoal text-2xl tracking-wide">Sketch → Production</h2>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { stage: '01', label: 'Sketch', desc: 'Initial exploration', style: { opacity: 0.3, filter: 'blur(0.5px)', transform: 'rotate(-1deg)' }, color: 'charcoal' },
                    { stage: '02', label: 'Structure', desc: 'Vector skeleton', style: { color: 'transparent', WebkitTextStroke: '1px rgba(26,26,26,0.4)' }, color: 'charcoal' },
                    { stage: '03', label: 'Review', desc: 'Junction flagged', style: { color: 'transparent', WebkitTextStroke: '1.5px rgba(26,26,26,0.6)' }, color: 'red-500', hasCircle: true },
                    { stage: '04', label: 'Refined', desc: '12° fillet added', style: { color: 'transparent', WebkitTextStroke: '2px rgba(26,26,26,0.8)' }, color: 'charcoal' },
                    { stage: '05', label: 'Final', desc: 'Production ready', style: {}, color: 'green-600', inverted: true },
                  ].map((item, i) => (
                    <div key={i} className="relative">
                      <div className={`aspect-square ${item.inverted ? 'bg-charcoal' : 'bg-white'} rounded-lg border border-charcoal/10 flex items-center justify-center mb-3 relative`}>
                        <span 
                          className={`font-serif text-4xl lg:text-5xl ${item.inverted ? 'text-cream' : ''}`}
                          style={item.style as React.CSSProperties}
                        >
                          H
                        </span>
                        {item.hasCircle && (
                          <div className="absolute top-[35%] left-[38%] w-5 h-5 border-2 border-red-500 rounded-full" />
                        )}
                      </div>
                      <div className={`absolute -top-2 -left-2 w-5 h-5 bg-${item.color} text-${item.inverted || item.color !== 'charcoal' ? 'white' : 'cream'} text-[9px] font-mono flex items-center justify-center rounded-full ${item.color === 'red-500' ? 'bg-red-500' : item.color === 'green-600' ? 'bg-green-600' : 'bg-charcoal'}`}>
                        {item.stage}
                      </div>
                      <p className={`text-xs font-mono uppercase tracking-wider mb-0.5 ${item.color === 'red-500' ? 'text-red-500' : item.color === 'green-600' ? 'text-green-600' : 'text-charcoal'}`}>{item.label}</p>
                      <p className="text-[10px] text-charcoal/50">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ALPHABET VIEW */}
      {view === 'alphabet' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Character Set</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>Complete Alphabet</h2>
            </div>
            
            {/* Uppercase */}
            <div className="mb-12">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-4`}>Uppercase</p>
              <div className="grid grid-cols-9 lg:grid-cols-13 gap-0">
                {UPPERCASE.map((letter) => (
                  <div key={letter} className={`aspect-square flex items-center justify-center ${text} font-serif text-2xl lg:text-4xl border-b border-r ${border}`}>
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lowercase */}
            <div className="mb-12">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-4`}>Lowercase</p>
              <div className="grid grid-cols-9 lg:grid-cols-13 gap-0">
                {LOWERCASE.map((letter) => (
                  <div key={letter} className={`aspect-square flex items-center justify-center ${text} font-serif text-2xl lg:text-4xl border-b border-r ${border}`}>
                    {letter}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Display pangram */}
            <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'}`}>
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-4`}>Pangram</p>
              <p className={`font-serif ${text} text-2xl lg:text-4xl tracking-wide leading-relaxed`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HIERARCHY VIEW */}
      {view === 'hierarchy' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Type Scale</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>Hierarchy System</h2>
            </div>
            
            <div className="space-y-12">
              {[
                { level: 'H1', sample: 'ECLECTIC HIVE', font: 'Saol Display Light', size: '72px', tracking: '0.2em', specs: 'Hero headlines, section titles' },
                { level: 'H2', sample: 'Design + Production', font: 'Saol Display Light', size: '48px', tracking: '0.15em', specs: 'Section headers, page titles' },
                { level: 'H3', sample: 'Featured Collections', font: 'Saol Display Light', size: '32px', tracking: '0.1em', specs: 'Card titles, subsections' },
                { level: 'Body', sample: 'We design, build, and produce the environments you can\'t hire elsewhere. From grand-scale activations to intimate dinners.', font: 'Inter Regular', size: '16px', tracking: '0.02em', specs: 'Paragraphs, descriptions' },
                { level: 'Caption', sample: 'CANYON POINT, UTAH — 2024', font: 'Inter Light', size: '12px', tracking: '0.15em', specs: 'Labels, metadata, dates' },
                { level: 'Mono', sample: '96W × 24D × 41H', font: 'Geist Mono', size: '11px', tracking: '0.1em', specs: 'Dimensions, specs, technical' },
              ].map((item, i) => (
                <div key={i} className={`grid grid-cols-12 gap-8 pb-8 border-b ${border}`}>
                  <div className="col-span-2">
                    <span className={`text-xs font-mono ${textMuted} uppercase tracking-wider`}>{item.level}</span>
                  </div>
                  <div className="col-span-6">
                    <p className={`${text} ${item.level === 'Body' ? '' : item.level === 'Mono' ? 'font-mono' : 'font-serif'}`} style={{ 
                      fontSize: item.size, 
                      letterSpacing: item.tracking,
                      lineHeight: item.level === 'Body' ? 1.6 : 1.2
                    }}>
                      {item.sample}
                    </p>
                  </div>
                  <div className="col-span-4 space-y-1">
                    <p className={`text-[10px] font-mono ${textMuted}`}>{item.font}</p>
                    <p className={`text-[10px] font-mono ${textMuted}`}>{item.size} / {item.tracking}</p>
                    <p className={`text-[10px] ${textMuted}`}>{item.specs}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NUMERALS VIEW */}
      {view === 'numerals' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Figures + Glyphs</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>Numerals + Symbols</h2>
            </div>
            
            {/* Large numerals */}
            <div className="mb-16">
              <div className="flex justify-between items-end mb-8">
                {NUMERALS.map((num) => (
                  <span key={num} className={`font-serif ${text} text-5xl lg:text-7xl`}>{num}</span>
                ))}
              </div>
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider`}>Proportional Lining Figures</p>
            </div>
            
            {/* Punctuation */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Punctuation + Glyphs</p>
              <div className="flex flex-wrap gap-6">
                {PUNCTUATION.map((char, i) => (
                  <span key={i} className={`font-serif ${text} text-4xl`}>{char}</span>
                ))}
              </div>
            </div>
            
            {/* Dimension example */}
            <div className={`p-8 rounded-lg ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'}`}>
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-4`}>Dimension Format</p>
              <p className={`font-serif ${text} text-3xl lg:text-5xl tracking-wide`}>96W × 24D × 41H</p>
              <p className={`${textMuted} text-xs mt-4`}>Use multiplication sign (×) not letter x</p>
            </div>
            
            {/* Large ampersand */}
            <div className="mt-16 flex items-center justify-center">
              <span className={`font-serif ${text}`} style={{ fontSize: 'min(40vw, 35vh)' }}>&</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
