'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

const COLORS = [
  { name: 'Charcoal', hex: '#1a1a1a', rgb: '26, 26, 26', usage: 'Primary dark, backgrounds, text' },
  { name: 'Cream', hex: '#f5f2ed', rgb: '245, 242, 237', usage: 'Primary light, backgrounds, text' },
  { name: 'Sand', hex: '#d4cdc4', rgb: '212, 205, 196', usage: 'Warm neutral, borders, muted' },
  { name: 'Black', hex: '#000000', rgb: '0, 0, 0', usage: 'Pure black, maximum contrast' },
  { name: 'Brass', hex: '#b8a88a', rgb: '184, 168, 138', usage: 'Metallic accent, warmth' },
]

const MATERIALS = [
  { name: 'White Oak', tone: 'Warm', desc: 'Honey undertones, visible grain' },
  { name: 'Brushed Brass', tone: 'Metallic', desc: 'Patinated gold, lived-in luxury' },
  { name: 'Belgian Linen', tone: 'Natural', desc: 'Unbleached, textured weave' },
  { name: 'Travertine', tone: 'Stone', desc: 'Soft cream, subtle pitting' },
  { name: 'Velvet', tone: 'Plush', desc: 'Deep charcoal, light-catching' },
  { name: 'Raw Plaster', tone: 'Tactile', desc: 'Imperfect, handmade quality' },
]

const MOOD_WORDS = [
  { word: 'Cinematic', desc: 'Every frame could be a still from a film. Dramatic lighting, intentional composition.' },
  { word: 'Grounded', desc: 'Natural materials, warm tones, tactile textures. Nothing artificial or cold.' },
  { word: 'Curated', desc: 'Every element chosen with purpose. Less but better. Museum-quality editing.' },
  { word: 'Intimate', desc: 'Approachable luxury. Warmth over opulence. Inviting, never intimidating.' },
  { word: 'Artful', desc: 'Gallery-worthy. Design as installation. Environments that provoke and inspire.' },
]

const MOTION_PRINCIPLES = [
  { principle: 'Slow reveals', desc: 'Content emerges gradually. Never jarring. Time to breathe and appreciate.' },
  { principle: 'Natural easing', desc: 'Organic movement like candlelight. Ease-out, never linear or mechanical.' },
  { principle: 'Purpose-driven', desc: 'Animation serves the story. If it doesn\'t add meaning, it doesn\'t move.' },
  { principle: 'Restraint', desc: 'One animation at a time. Let the eye settle before the next transition.' },
]

export default function Visual() {
  const [view, setView] = useState<'colors' | 'materials' | 'mood' | 'motion'>('colors')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'

  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-visual-${view}-${theme}`} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-cream/10">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/brand" className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors">
            ← Brand
          </Link>
          <div className="flex gap-1">
            {(['colors', 'materials', 'mood', 'motion'] as const).map((v) => (
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

      {/* COLORS VIEW */}
      {view === 'colors' && (
        <div className="pt-24">
          {/* Hero split */}
          <div className="h-[50vh] flex">
            <div className="flex-1 bg-charcoal flex items-center justify-center">
              <span className="font-serif text-cream text-6xl lg:text-8xl tracking-wide">COLOR</span>
            </div>
            <div className="flex-1 bg-cream flex items-center justify-center">
              <span className="font-serif text-charcoal text-6xl lg:text-8xl tracking-wide">TONE</span>
            </div>
          </div>
          
          {/* Color swatches */}
          <div className={`p-8 lg:p-16 ${bg}`}>
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-8`}>Primary Palette</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {COLORS.map((color) => (
                <div key={color.name}>
                  <div 
                    className="aspect-[4/3] rounded-lg mb-4 border border-black/5"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className={`font-serif ${text} text-lg mb-1`}>{color.name}</p>
                  <p className={`${textMuted} text-xs font-mono mb-1`}>{color.hex}</p>
                  <p className={`${textMuted} text-xs font-mono mb-2`}>RGB {color.rgb}</p>
                  <p className={`${textMuted} text-[10px]`}>{color.usage}</p>
                </div>
              ))}
            </div>
            
            {/* Tonal range */}
            <div className="mt-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-6`}>Tonal Range</p>
              <div className="h-16 rounded-lg overflow-hidden flex">
                <div className="flex-1 bg-black" />
                <div className="flex-1 bg-[#1a1a1a]" />
                <div className="flex-1 bg-[#333333]" />
                <div className="flex-1 bg-[#666666]" />
                <div className="flex-1 bg-[#999999]" />
                <div className="flex-1 bg-[#b8a88a]" />
                <div className="flex-1 bg-[#d4cdc4]" />
                <div className="flex-1 bg-[#e8e4de]" />
                <div className="flex-1 bg-[#f5f2ed]" />
                <div className="flex-1 bg-white border-l border-black/5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATERIALS VIEW */}
      {view === 'materials' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Material Library</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>Texture + Finish</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {MATERIALS.map((mat, i) => (
                <div key={mat.name} className={`border ${border} rounded-lg overflow-hidden`}>
                  <div 
                    className="aspect-square"
                    style={{
                      backgroundColor: i === 0 ? '#8B7355' : i === 1 ? '#b8a88a' : i === 2 ? '#c4b8a8' : i === 3 ? '#e8e0d4' : i === 4 ? '#2a2a2a' : '#d8d0c8',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <p className={`font-serif ${text} text-lg`}>{mat.name}</p>
                      <span className={`${textMuted} text-[10px] font-mono uppercase`}>{mat.tone}</span>
                    </div>
                    <p className={`${textMuted} text-xs`}>{mat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MOOD VIEW */}
      {view === 'mood' && (
        <div className={`pt-24 min-h-screen ${bg}`}>
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            <div className="mb-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Visual Language</p>
              <h2 className={`font-display ${text} text-3xl lg:text-4xl tracking-wide italic`}>Atmosphere + Feeling</h2>
              <p className={`${textMuted} text-sm mt-4 max-w-xl`}>
                The brand should feel like walking into a beautifully lit room at golden hour. 
                Warm, intentional, memorable.
              </p>
            </div>
            
            {/* Mood words */}
            <div className="space-y-8 mb-20">
              {MOOD_WORDS.map((item, i) => (
                <div 
                  key={item.word} 
                  className={`border-l-2 ${theme === 'dark' ? 'border-cream/20' : 'border-charcoal/20'} pl-8 py-2`}
                >
                  <p className={`font-display ${text} text-2xl lg:text-3xl tracking-wide italic mb-2`}>{item.word}</p>
                  <p className={`${textMuted} text-sm max-w-lg`}>{item.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Visual contrast */}
            <div className="mt-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-6`}>The Formula</p>
              <div className={`border ${border} rounded-lg p-8 lg:p-12`}>
                <p className={`font-display ${text} text-xl lg:text-2xl tracking-wide text-center italic`}>
                  "Two parts luxe, one part regal, and a dash of edge."
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  {['Luxe', 'Luxe', 'Regal', 'Edge'].map((part, i) => (
                    <span 
                      key={i} 
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider ${
                        part === 'Edge' 
                          ? 'bg-charcoal text-cream' 
                          : theme === 'dark' ? 'bg-cream/10 text-cream/60' : 'bg-charcoal/10 text-charcoal/60'
                      }`}
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOTION VIEW */}
      {view === 'motion' && (
        <div className={`pt-24 min-h-screen ${bg}`}>
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            <div className="mb-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Movement + Pacing</p>
              <h2 className={`font-display ${text} text-3xl lg:text-4xl tracking-wide italic`}>Video movement to hold interest</h2>
              <p className={`${textMuted} text-sm mt-4 max-w-xl`}>
                Motion is a storytelling tool. Used sparingly, it creates intrigue. 
                Overused, it distracts from the work.
              </p>
            </div>
            
            {/* Motion principles */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {MOTION_PRINCIPLES.map((item) => (
                <div 
                  key={item.principle} 
                  className={`border ${border} rounded-lg p-6 lg:p-8`}
                >
                  <p className={`font-display ${text} text-xl tracking-wide mb-3`}>{item.principle}</p>
                  <p className={`${textMuted} text-sm`}>{item.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Live examples */}
            <div className="mt-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-8`}>In Practice</p>
              
              {/* Slow fade example */}
              <div className={`border ${border} rounded-lg p-8 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <p className={`${text} text-sm font-mono`}>Fade In</p>
                  <p className={`${textMuted} text-xs`}>Content reveals on scroll</p>
                </div>
                <div className="flex gap-4">
                  {[0, 0.3, 0.6, 1].map((opacity) => (
                    <div 
                      key={opacity}
                      className={`flex-1 h-16 rounded ${theme === 'dark' ? 'bg-cream' : 'bg-charcoal'}`}
                      style={{ opacity }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Hover lift example */}
              <div className={`border ${border} rounded-lg p-8`}>
                <div className="flex items-center justify-between mb-4">
                  <p className={`${text} text-sm font-mono`}>Hover Response</p>
                  <p className={`${textMuted} text-xs`}>Subtle lift on interaction</p>
                </div>
                <div className="flex gap-4">
                  <div 
                    className={`flex-1 h-16 rounded ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'} flex items-center justify-center`}
                  >
                    <span className={`${textMuted} text-xs`}>Default</span>
                  </div>
                  <div 
                    className={`flex-1 h-16 rounded ${theme === 'dark' ? 'bg-cream/40' : 'bg-charcoal/40'} flex items-center justify-center -translate-y-1 shadow-lg`}
                  >
                    <span className={`${textMuted} text-xs`}>Hovered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
