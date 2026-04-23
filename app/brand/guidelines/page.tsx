'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

export default function Guidelines() {
  const [view, setView] = useState<'architecture' | 'photography' | 'applications' | 'donts'>('architecture')
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
            {(['architecture', 'photography', 'applications', 'donts'] as const).map((v) => (
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
                <p className="font-display text-2xl tracking-[0.15em] uppercase">ECLECTIC HIVE</p>
                <p className="text-cream/50 text-xs font-mono mt-2">Parent Umbrella</p>
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
                  <p className="font-display text-charcoal text-lg tracking-[0.1em] uppercase">ATELIER by THE HIVE</p>
                  <p className="text-charcoal/50 text-[10px] font-mono mt-2">Design & Fabrication</p>
                </div>
                <div className="border-2 border-charcoal px-8 py-4 rounded-lg text-center">
                  <p className="font-display text-charcoal text-lg tracking-[0.1em] uppercase">HIVE SIGNATURE COLLECTION</p>
                  <p className="text-charcoal/50 text-[10px] font-mono mt-2">Inventory Wing</p>
                </div>
              </div>
            </div>
            
            {/* Usage guidelines */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { brand: 'ECLECTIC HIVE', use: 'Primary communications, website, contracts, brand identity', lockup: 'Wordmark only' },
                { brand: 'ATELIER by THE HIVE', use: 'Design & fabrication services, custom project proposals, bespoke work', lockup: 'ATELIER by THE HIVE' },
                { brand: 'HIVE SIGNATURE COLLECTION', use: 'Inventory catalog, product tags, rental inquiries', lockup: 'The Hive Signature Collection' },
              ].map((item) => (
                <div key={item.brand} className="border border-charcoal/10 rounded-lg p-6">
                  <p className="font-display text-charcoal text-base tracking-wide uppercase mb-3">{item.brand}</p>
                  <p className="text-charcoal/60 text-sm mb-4 leading-relaxed">{item.use}</p>
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
                  specs: ['1:1 aspect ratio', 'Neutral, grounded background', 'Clean and composed', '360° option ready'],
                  desc: 'Approach like a collection where everything is complimentary but can stand alone. No overlapping images.',
                  style: 'bg-cream border-2 border-charcoal/10'
                },
                { 
                  category: 'Team',
                  specs: ['Professional portraits', 'Personality showing', 'Approachable not corporate', 'Creative workspace context'],
                  desc: 'Professional but approachable. Love to see personality.',
                  style: 'bg-[#e8e4de]'
                },
                { 
                  category: 'Events',
                  specs: ['Cinematic quality', 'Atmospheric lighting', 'Gallery-worthy composition', 'Movement and intrigue'],
                  desc: 'A little sexy and a lot of intrigue. Video movement to hold interest.',
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

      {/* APPLICATIONS VIEW */}
      {view === 'applications' && (
        <div className={`pt-24 min-h-screen ${bg}`}>
          <div className="max-w-5xl mx-auto p-8 lg:p-16">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Brand In Use</p>
              <h2 className={`font-display ${text} text-3xl tracking-wide`}>Applications</h2>
            </div>
            
            {/* Email Signature */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Email Signature</p>
              <div className={`border ${border} rounded-lg p-8 max-w-md`}>
                <div className="border-l-2 border-charcoal pl-4">
                  <p className={`font-display ${text} text-base tracking-wide`}>Jill Livingston</p>
                  <p className={`${textMuted} text-sm mt-1`}>Founder & Creative Director</p>
                  <div className={`${textMuted} text-xs mt-4 space-y-1`}>
                    <p>jill@eclectichive.com</p>
                    <p>303.555.0100</p>
                    <p className="mt-2 uppercase tracking-wider text-[10px]">ECLECTIC HIVE</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Business Card */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Business Card</p>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Front */}
                <div className="aspect-[3.5/2] bg-charcoal rounded-lg flex items-center justify-center p-8">
                  <p className="font-display text-cream text-xl tracking-[0.15em] uppercase">ECLECTIC HIVE</p>
                </div>
                {/* Back */}
                <div className="aspect-[3.5/2] bg-cream border border-charcoal/10 rounded-lg flex flex-col justify-between p-6">
                  <div>
                    <p className="font-display text-charcoal text-sm tracking-wide">Jill Livingston</p>
                    <p className="text-charcoal/50 text-xs mt-1">Founder & Creative Director</p>
                  </div>
                  <div className="text-charcoal/60 text-[10px] space-y-0.5">
                    <p>jill@eclectichive.com</p>
                    <p>303.555.0100</p>
                    <p>Denver, Colorado</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Event Signage */}
            <div className="mb-16">
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Event Signage</p>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Welcome sign */}
                <div className="aspect-[3/4] bg-charcoal rounded-lg flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-cream/40 text-[8px] uppercase tracking-[0.3em] mb-4">Welcome to</p>
                  <p className="font-display text-cream text-lg tracking-[0.1em] uppercase">THE MORRISON</p>
                  <p className="font-display text-cream/60 text-sm italic mt-2">Wedding</p>
                  <p className="text-cream/30 text-[8px] uppercase tracking-[0.2em] mt-8">Designed by ECLECTIC HIVE</p>
                </div>
                {/* Table number */}
                <div className="aspect-[3/4] bg-cream border border-charcoal/10 rounded-lg flex flex-col items-center justify-center">
                  <p className="font-display text-charcoal text-5xl">7</p>
                  <p className="text-charcoal/30 text-[8px] uppercase tracking-[0.2em] mt-4">Table</p>
                </div>
                {/* Menu card */}
                <div className="aspect-[3/4] bg-cream border border-charcoal/10 rounded-lg p-6 flex flex-col">
                  <p className="text-charcoal/40 text-[8px] uppercase tracking-[0.2em] mb-2">Dinner</p>
                  <p className="font-display text-charcoal text-sm tracking-wide mb-4">Evening Menu</p>
                  <div className="flex-1 space-y-3 text-[10px] text-charcoal/60">
                    <p>First Course</p>
                    <p>Second Course</p>
                    <p>Main</p>
                    <p>Dessert</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Inventory Tags */}
            <div>
              <p className={`${textMuted} text-[10px] font-mono uppercase tracking-wider mb-6`}>Collection Tags</p>
              <div className="flex gap-4">
                <div className="w-32 bg-cream border border-charcoal/10 rounded p-4">
                  <p className="text-charcoal/30 text-[8px] uppercase tracking-wider mb-2">HSC</p>
                  <p className="text-charcoal text-xs font-medium">Brass Arc Lamp</p>
                  <p className="text-charcoal/50 text-[10px] mt-1">HSC-001</p>
                </div>
                <div className="w-32 bg-charcoal rounded p-4">
                  <p className="text-cream/30 text-[8px] uppercase tracking-wider mb-2">Atelier</p>
                  <p className="text-cream text-xs font-medium">Custom Build</p>
                  <p className="text-cream/50 text-[10px] mt-1">ATL-2024-001</p>
                </div>
              </div>
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
