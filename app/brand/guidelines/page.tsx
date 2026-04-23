'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

export default function Guidelines() {
  const [view, setView] = useState<'architecture' | 'photography' | 'components' | 'donts'>('architecture')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'

  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-guidelines-${view}-${theme}`} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-cream/10">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/brand" className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors">
            ← Brand
          </Link>
          <div className="flex gap-1">
            {(['architecture', 'photography', 'components', 'donts'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded transition-colors ${
                  view === v 
                    ? 'bg-cream text-charcoal' 
                    : 'text-cream/60 hover:text-cream'
                }`}
              >
                {v === 'donts' ? "Don'ts" : v}
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

      {/* ARCHITECTURE VIEW */}
      {view === 'architecture' && (
        <div className="pt-24 bg-cream min-h-screen">
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            <div className="mb-16 text-center">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.2em] mb-4">Brand Architecture</p>
              <h2 className="font-serif text-charcoal text-4xl tracking-wide">Sub-brand Hierarchy</h2>
            </div>
            
            {/* Hierarchy visualization */}
            <div className="flex flex-col items-center mb-16">
              {/* Parent */}
              <div className="bg-charcoal text-cream px-12 py-6 rounded-lg text-center mb-4">
                <p className="font-serif text-2xl tracking-[0.2em]">ECLECTIC HIVE</p>
                <p className="text-cream/50 text-xs font-mono mt-2">Parent Brand</p>
              </div>
              
              {/* Connector */}
              <div className="w-px h-8 bg-charcoal/20" />
              <div className="w-64 h-px bg-charcoal/20" />
              <div className="flex gap-32">
                <div className="w-px h-8 bg-charcoal/20" />
                <div className="w-px h-8 bg-charcoal/20" />
              </div>
              
              {/* Children */}
              <div className="flex gap-8">
                <div className="border-2 border-charcoal px-8 py-4 rounded-lg text-center">
                  <p className="font-serif text-charcoal text-xl tracking-[0.15em]">ATELIER</p>
                  <p className="text-charcoal/50 text-[10px] font-mono mt-2">Custom Design Studio</p>
                </div>
                <div className="border-2 border-charcoal px-8 py-4 rounded-lg text-center">
                  <p className="font-serif text-charcoal text-xl tracking-[0.15em]">SIGNATURE</p>
                  <p className="text-charcoal/50 text-[10px] font-mono mt-2">Collection Line</p>
                </div>
              </div>
            </div>
            
            {/* Usage guidelines */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { brand: 'ECLECTIC HIVE', use: 'Primary communications, website, contracts', lockup: 'Wordmark only' },
                { brand: 'ATELIER', use: 'Custom project proposals, bespoke work', lockup: 'EH Atelier' },
                { brand: 'SIGNATURE', use: 'Collection catalog, product tags', lockup: 'EH Signature' },
              ].map((item) => (
                <div key={item.brand} className="border border-charcoal/10 rounded-lg p-6">
                  <p className="font-serif text-charcoal text-lg mb-3">{item.brand}</p>
                  <p className="text-charcoal/60 text-sm mb-4">{item.use}</p>
                  <p className="text-charcoal/40 text-xs font-mono">Lockup: {item.lockup}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHOTOGRAPHY VIEW */}
      {view === 'photography' && (
        <div className="pt-24 bg-cream min-h-screen">
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.2em] mb-2">Photography Style</p>
              <h2 className="font-serif text-charcoal text-3xl tracking-wide">Visual Standards</h2>
            </div>
            
            {/* Photo categories */}
            <div className="space-y-12">
              {[
                { 
                  category: 'Inventory',
                  specs: ['1:1 aspect ratio', 'White/cream background', 'Centered, breathing room', '2400px minimum'],
                  desc: 'Clean and composed. No overlapping. Let items speak for themselves.',
                  style: 'bg-cream border-2 border-charcoal/10'
                },
                { 
                  category: 'Team',
                  specs: ['3:4 portrait or 16:9 landscape', 'Natural light preferred', 'Workspace context', 'Candid moments'],
                  desc: 'Professional but approachable. Show personality. Not corporate headshots.',
                  style: 'bg-[#e8e4de]'
                },
                { 
                  category: 'Events',
                  specs: ['16:9 or 3:2 landscape', 'Warm candlelit tones', 'Shallow depth of field', 'Dramatic moments'],
                  desc: 'Cinematic. Atmospheric. Gallery-worthy. The "Amangiri aesthetic."',
                  style: 'bg-charcoal'
                },
              ].map((photo) => (
                <div key={photo.category} className="grid md:grid-cols-2 gap-6">
                  <div 
                    className={`aspect-video rounded-lg ${photo.style} flex items-center justify-center`}
                  >
                    <span className={`font-serif text-2xl tracking-wide ${photo.category === 'Events' ? 'text-cream/30' : 'text-charcoal/20'}`}>
                      {photo.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-charcoal text-xl mb-3">{photo.category}</h3>
                    <p className="text-charcoal/60 text-sm mb-4">{photo.desc}</p>
                    <ul className="space-y-1">
                      {photo.specs.map((spec) => (
                        <li key={spec} className="text-charcoal/50 text-xs font-mono flex items-center gap-2">
                          <span className="w-1 h-1 bg-charcoal/30 rounded-full" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Critical rule */}
            <div className="mt-16 p-8 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-xs font-mono uppercase tracking-wider mb-3">Critical Rule</p>
              <p className="text-red-800 text-lg font-serif">No overlapping images. Ever.</p>
              <p className="text-red-600 text-sm mt-2">Each image gets its own space. Clean grid. Let work breathe.</p>
            </div>
          </div>
        </div>
      )}

      {/* COMPONENTS VIEW */}
      {view === 'components' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>UI Components</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>Interface Patterns</h2>
            </div>
            
            {/* Buttons */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Buttons</p>
              <div className="flex flex-wrap gap-4 mb-4">
                <button className="bg-charcoal text-cream px-6 py-3 text-sm uppercase tracking-wider rounded hover:bg-charcoal/90 transition-colors">
                  Primary
                </button>
                <button className={`border ${theme === 'dark' ? 'border-cream text-cream' : 'border-charcoal text-charcoal'} px-6 py-3 text-sm uppercase tracking-wider rounded hover:bg-charcoal/5 transition-colors`}>
                  Secondary
                </button>
                <button className={`${textMuted} px-6 py-3 text-sm uppercase tracking-wider rounded hover:${text} transition-colors`}>
                  Ghost
                </button>
              </div>
              <p className={`${textMuted} text-xs font-mono`}>Height: 48px / Padding: 24px horizontal / Font: 14px uppercase</p>
            </div>
            
            {/* Glass panels */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Glass Effect</p>
              <div className="relative h-48 rounded-lg overflow-hidden" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#e8e4de' }}>
                <div className="absolute inset-4 backdrop-blur-[12px] bg-white/[0.04] border border-white/[0.08] rounded-lg flex items-center justify-center">
                  <span className={`${text} text-sm uppercase tracking-wider`}>Glass Panel</span>
                </div>
              </div>
              <p className={`${textMuted} text-xs font-mono mt-4`}>backdrop-blur-[12px] / bg-white/[0.04] / border-white/[0.08]</p>
            </div>
            
            {/* Cards */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Cards</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`border ${border} rounded-lg overflow-hidden`}>
                  <div className="aspect-[4/3] bg-charcoal/10" />
                  <div className="p-6">
                    <p className={`font-serif ${text} text-lg mb-2`}>Card Title</p>
                    <p className={`${textMuted} text-sm`}>Description text goes here with supporting details.</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono text-charcoal/50">
                  <p>Border radius: 8px</p>
                  <p>Image aspect: 4:3</p>
                  <p>Content padding: 24px</p>
                  <p>Title: Saol Display, 18px</p>
                  <p>Body: Inter, 14px</p>
                </div>
              </div>
            </div>
            
            {/* Form inputs */}
            <div>
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Form Inputs</p>
              <div className="max-w-md space-y-4">
                <input 
                  type="text" 
                  placeholder="Text input"
                  className={`w-full px-4 py-3 rounded border ${border} ${bg} ${text} text-sm focus:outline-none focus:border-charcoal/30 transition-colors`}
                />
                <textarea 
                  placeholder="Textarea"
                  rows={3}
                  className={`w-full px-4 py-3 rounded border ${border} ${bg} ${text} text-sm focus:outline-none focus:border-charcoal/30 transition-colors resize-none`}
                />
              </div>
              <p className={`${textMuted} text-xs font-mono mt-4`}>Height: 48px / Padding: 16px / Border: 1px</p>
            </div>
          </div>
        </div>
      )}

      {/* DON'TS VIEW */}
      {view === 'donts' && (
        <div className="pt-24 bg-cream min-h-screen">
          <div className="max-w-4xl mx-auto p-8 lg:p-16">
            <div className="mb-12">
              <p className="text-red-500 text-xs font-mono uppercase tracking-[0.2em] mb-2">Critical Rules</p>
              <h2 className="font-serif text-charcoal text-3xl tracking-wide">Never Do This</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { rule: 'Overlapping images', desc: 'Each image gets its own space. Always.' },
                { rule: 'Corporate speak', desc: 'No "synergy," "leverage," "best-in-class."' },
                { rule: 'Busy layouts', desc: 'White space is intentional. Let work breathe.' },
                { rule: 'Stock photography', desc: 'All imagery must be original or commissioned.' },
                { rule: 'Gradient backgrounds', desc: 'Solid colors only. Charcoal, cream, black.' },
                { rule: 'Decorative fonts', desc: 'Saol Display, Inter, Geist Mono. Nothing else.' },
                { rule: 'Rounded corners > 12px', desc: 'Subtle rounding only. No pill shapes.' },
                { rule: 'Centered body text', desc: 'Left-align paragraphs. Always.' },
              ].map((item, i) => (
                <div key={i} className="border border-red-200 bg-red-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-lg">✕</span>
                    <div>
                      <p className="text-red-800 font-medium mb-1">{item.rule}</p>
                      <p className="text-red-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Final stamp */}
            <div className="mt-16 text-center py-12 border-t border-charcoal/10">
              <p className="text-charcoal/30 text-xs font-mono uppercase tracking-widest mb-4">Brand Guidelines v1.0</p>
              <p className="font-serif text-charcoal text-xl italic">"Two parts luxe, one part regal, and a dash of edge."</p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
