'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

const PHRASES = [
  'IMAGINED. REFINED. CRAFTED.',
  'FROM VISION TO REALIZATION',
  'DESIGN + PRODUCTION',
  'WHERE VISION MEETS CRAFT',
]

const CATEGORIES = ['FURNITURE', 'LIGHTING', 'TEXTILES', 'TABLETOP', 'DECOR', 'FLORAL', 'CUSTOM']

const PROCESS_WORDS = ['CONCEPT', 'DESIGN', 'SOURCE', 'BUILD', 'INSTALL', 'EXECUTE']

const VALUES = ['CRAFT', 'COLLABORATION', 'CREATIVITY', 'PRECISION', 'WARMTH', 'EDGE']

export default function Language() {
  const [view, setView] = useState<'phrases' | 'vocabulary' | 'voice' | 'tone'>('phrases')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'

  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-language-${view}-${theme}`} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-cream/10">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/brand" className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors">
            ← Brand
          </Link>
          <div className="flex gap-1">
            {(['phrases', 'vocabulary', 'voice', 'tone'] as const).map((v) => (
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
      </nav>

      {/* PHRASES VIEW */}
      {view === 'phrases' && (
        <div className={`pt-24 ${bg}`}>
          {/* Hero tagline */}
          <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="text-center">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-8`}>Primary Tagline</p>
              <h1 className={`font-serif ${text} text-4xl md:text-6xl lg:text-7xl tracking-[0.2em] leading-relaxed`}>
                IMAGINED.<br />REFINED.<br />CRAFTED.
              </h1>
            </div>
          </div>
          
          {/* All phrases */}
          <div className={`p-8 lg:p-16 ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'}`}>
            <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-8`}>Supporting Phrases</p>
            <div className="space-y-6">
              {PHRASES.slice(1).map((phrase, i) => (
                <p key={i} className={`font-serif ${text} text-2xl lg:text-4xl tracking-[0.15em]`}>
                  {phrase}
                </p>
              ))}
            </div>
          </div>
          
          {/* Mission statement */}
          <div className="p-8 lg:p-16">
            <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-8`}>Mission</p>
            <p className={`${text} text-lg lg:text-xl leading-relaxed max-w-3xl`}>
              We design, build, and produce the environments you can't hire elsewhere. From grand-scale brand activations to intimate private dinners, we deliver fully realized experiences with soul.
            </p>
          </div>
        </div>
      )}

      {/* VOCABULARY VIEW */}
      {view === 'vocabulary' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-5xl mx-auto">
            {/* Brand name display */}
            <div className="min-h-[40vh] flex items-center justify-center mb-16 relative">
              <span className={`absolute font-serif ${theme === 'dark' ? 'text-cream/[0.03]' : 'text-charcoal/[0.03]'}`} style={{ fontSize: 'min(50vw, 40vh)' }}>H</span>
              <div className="text-center relative z-10">
                <h1 className={`font-serif ${text} text-5xl lg:text-7xl tracking-[0.25em] mb-2`}>ECLECTIC</h1>
                <h1 className={`font-serif ${text} text-5xl lg:text-7xl tracking-[0.25em]`}>HIVE</h1>
              </div>
            </div>
            
            {/* Categories */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Categories</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat} className={`p-4 border ${border} rounded`}>
                    <span className={`${textMuted} text-[10px] font-mono`}>{String(i + 1).padStart(2, '0')}</span>
                    <p className={`font-serif ${text} text-xl tracking-[0.1em] mt-1`}>{cat}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Process */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Process</p>
              <div className="flex flex-wrap gap-4 items-center">
                {PROCESS_WORDS.map((word, i) => (
                  <div key={word} className="flex items-center gap-4">
                    <span className={`font-serif ${text} text-xl lg:text-2xl tracking-[0.1em]`}>{word}</span>
                    {i < PROCESS_WORDS.length - 1 && <span className={`${textMuted} text-xl`}>→</span>}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Values */}
            <div>
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Values</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {VALUES.map((val) => (
                  <div key={val} className="text-center">
                    <p className={`font-serif ${text} text-lg tracking-[0.1em]`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VOICE VIEW */}
      {view === 'voice' && (
        <div className="pt-24 bg-cream">
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            {/* Formula */}
            <div className="mb-16 text-center">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.2em] mb-6">Brand Voice Formula</p>
              <p className="font-serif text-charcoal text-2xl lg:text-3xl italic leading-relaxed">
                "Two parts luxe, one part regal,<br />and a dash of edge."
              </p>
            </div>
            
            {/* Three pillars */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { 
                  name: 'LUXE', 
                  ratio: '2 parts',
                  desc: 'Sophisticated, refined, premium quality',
                  examples: ['Curated collection', 'Artisan-crafted', 'Bespoke experience']
                },
                { 
                  name: 'REGAL', 
                  ratio: '1 part',
                  desc: 'Confident, authoritative, elevated',
                  examples: ['Signature aesthetic', 'Timeless design', 'Distinguished quality']
                },
                { 
                  name: 'EDGE', 
                  ratio: 'a dash',
                  desc: 'Unexpected, bold, memorable',
                  examples: ['Break the rules', 'Unforgettable moments', 'Push boundaries']
                },
              ].map((pillar) => (
                <div key={pillar.name} className="border border-charcoal/10 rounded-lg p-6">
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-serif text-charcoal text-2xl tracking-wide">{pillar.name}</h3>
                    <span className="text-charcoal/40 text-xs font-mono">{pillar.ratio}</span>
                  </div>
                  <p className="text-charcoal/60 text-sm mb-4">{pillar.desc}</p>
                  <div className="space-y-2">
                    {pillar.examples.map((ex) => (
                      <p key={ex} className="text-charcoal/80 text-sm italic">"{ex}"</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Do/Don't */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-700 text-xs font-mono uppercase tracking-wider mb-4">Do Write</p>
                <ul className="space-y-3 text-green-800">
                  <li>"Environments that tell your story"</li>
                  <li>"Crafted with intention"</li>
                  <li>"Where vision meets execution"</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-700 text-xs font-mono uppercase tracking-wider mb-4">Don't Write</p>
                <ul className="space-y-3 text-red-800">
                  <li>"Best-in-class solutions"</li>
                  <li>"Synergistic partnerships"</li>
                  <li>"Leverage our expertise"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TONE VIEW */}
      {view === 'tone' && (
        <div className="pt-24 bg-cream">
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.2em] mb-2">Tone Calibration</p>
              <h2 className="font-serif text-charcoal text-3xl tracking-wide">Voice by Context</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { context: 'Homepage', tone: 'Intriguing + Confident', edge: 4, example: 'Scroll-stopping. Let the work do the talking.' },
                { context: 'Collection', tone: 'Clean + Informative', edge: 2, example: 'Clear specs, no poetry. Let items breathe.' },
                { context: 'Gallery', tone: 'Cinematic + Evocative', edge: 3, example: 'Mood over information. Editorial captions.' },
                { context: 'Team', tone: 'Warm + Approachable', edge: 2, example: 'Professional but human. Show personality.' },
                { context: 'Contact', tone: 'Direct + Welcoming', edge: 1, example: 'Clear call to action. Easy to reach.' },
              ].map((item) => (
                <div key={item.context} className="grid grid-cols-12 gap-6 items-center py-6 border-b border-charcoal/10">
                  <div className="col-span-2">
                    <p className="font-serif text-charcoal text-lg">{item.context}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-charcoal/60 text-sm">{item.tone}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={`w-4 h-4 rounded-sm ${i <= item.edge ? 'bg-charcoal' : 'bg-charcoal/10'}`}
                        />
                      ))}
                    </div>
                    <p className="text-charcoal/40 text-[10px] font-mono mt-1">Edge Level</p>
                  </div>
                  <div className="col-span-5">
                    <p className="text-charcoal/50 text-sm italic">"{item.example}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
