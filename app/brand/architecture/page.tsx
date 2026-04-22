'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

export default function BrandArchitecture() {
  const [view, setView] = useState<'hierarchy' | 'voice' | 'tone' | 'donts'>('hierarchy')
  
  return (
    <main id="specimen-content" className="min-h-screen bg-cream">
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-architecture-${view}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap max-w-[400px]">
        {(['hierarchy', 'voice', 'tone', 'donts'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              view === v 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20 hover:bg-charcoal/10'
            }`}
          >
            {v === 'donts' ? "Don'ts" : v}
          </button>
        ))}
      </div>
      
      {/* Back link */}
      <Link 
        href="/brand" 
        className="fixed top-4 right-20 z-50 px-3 py-1.5 text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition-colors"
      >
        Back
      </Link>

      {/* Brand Hierarchy */}
      {view === 'hierarchy' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-16">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Brand Architecture</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Sub-Brand Hierarchy</h1>
              <p className="text-charcoal/60 max-w-xl">
                Three distinct expressions under one umbrella. Each serves a specific function while maintaining brand cohesion.
              </p>
            </div>
            
            {/* Hierarchy Diagram */}
            <div className="relative">
              {/* Parent Brand */}
              <div className="bg-charcoal rounded-lg p-8 lg:p-12 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Parent Umbrella</p>
                    <h2 className="font-serif text-3xl lg:text-4xl text-cream tracking-[0.15em] mb-3">ECLECTIC HIVE</h2>
                    <p className="text-cream/50 text-sm max-w-md">
                      The master brand. Appears on all corporate communications, contracts, and as the primary web identity.
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-20 h-20 rounded-full border border-cream/20 flex items-center justify-center">
                      <span className="font-serif text-cream text-3xl">H</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Connecting lines */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-32">
                  <div className="w-px h-12 bg-charcoal/20" />
                  <div className="w-px h-12 bg-charcoal/20" />
                </div>
              </div>
              
              {/* Sub-brands */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Atelier */}
                <div className="bg-white rounded-lg border border-charcoal/10 p-8">
                  <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Design + Fabrication</p>
                  <h3 className="font-serif text-2xl text-charcoal tracking-[0.1em] mb-3">ATELIER</h3>
                  <p className="text-[10px] font-mono text-charcoal/30 uppercase tracking-wider mb-4">by The Hive</p>
                  <p className="text-charcoal/60 text-sm mb-6">
                    The creative studio and workshop. Custom design, fabrication, and production services.
                  </p>
                  <div className="space-y-2 text-xs text-charcoal/50">
                    <p>• Bespoke furniture design</p>
                    <p>• Event environment fabrication</p>
                    <p>• Production management</p>
                  </div>
                </div>
                
                {/* Signature Collection */}
                <div className="bg-white rounded-lg border border-charcoal/10 p-8">
                  <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Inventory Wing</p>
                  <h3 className="font-serif text-2xl text-charcoal tracking-[0.1em] mb-3">SIGNATURE COLLECTION</h3>
                  <p className="text-[10px] font-mono text-charcoal/30 uppercase tracking-wider mb-4">The Hive Edition</p>
                  <p className="text-charcoal/60 text-sm mb-6">
                    Curated rental inventory. Modern but timeless pieces available for event styling.
                  </p>
                  <div className="space-y-2 text-xs text-charcoal/50">
                    <p>• Furniture rentals</p>
                    <p>• Decor and styling pieces</p>
                    <p>• Tabletop and accessories</p>
                  </div>
                </div>
              </div>
              
              {/* Usage rules */}
              <div className="mt-12 pt-8 border-t border-charcoal/10">
                <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Usage Guidelines</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-charcoal/60">
                  <div>
                    <p className="font-medium text-charcoal mb-2">Website Header</p>
                    <p>Always "Eclectic Hive" as wordmark. Sub-brands appear in navigation.</p>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal mb-2">Print Collateral</p>
                    <p>Sub-brand lockups include "by The Hive" or "The Hive" suffix.</p>
                  </div>
                  <div>
                    <p className="font-medium text-charcoal mb-2">Social Media</p>
                    <p>Parent brand for main accounts; sub-brands for specific content.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Voice */}
      {view === 'voice' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Brand Architecture</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Brand Voice</h1>
            </div>
            
            {/* The Formula */}
            <div className="bg-charcoal rounded-lg p-8 lg:p-12 mb-12">
              <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">The Formula</p>
              <div className="flex flex-wrap items-center gap-4 text-cream">
                <span className="font-serif text-2xl lg:text-3xl tracking-wide">Two parts luxe</span>
                <span className="text-cream/30">+</span>
                <span className="font-serif text-2xl lg:text-3xl tracking-wide">one part regal</span>
                <span className="text-cream/30">+</span>
                <span className="font-serif text-2xl lg:text-3xl tracking-wide italic">a dash of edge</span>
              </div>
            </div>
            
            {/* Voice Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="w-12 h-12 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                  <span className="font-serif text-xl text-charcoal">L</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-2">Luxe</h3>
                <p className="text-sm text-charcoal/60 mb-4">
                  Elevated but not pretentious. Quality speaks through restraint.
                </p>
                <div className="space-y-1 text-xs text-charcoal/40">
                  <p>"Refined materials"</p>
                  <p>"Considered details"</p>
                  <p>"Timeless quality"</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="w-12 h-12 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                  <span className="font-serif text-xl text-charcoal">R</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-2">Regal</h3>
                <p className="text-sm text-charcoal/60 mb-4">
                  Confident authority. We know what we're doing.
                </p>
                <div className="space-y-1 text-xs text-charcoal/40">
                  <p>"Expert craftsmanship"</p>
                  <p>"Authoritative taste"</p>
                  <p>"Assured execution"</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="w-12 h-12 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                  <span className="font-serif text-xl text-charcoal italic">E</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-2 italic">Edge</h3>
                <p className="text-sm text-charcoal/60 mb-4">
                  A spark of unexpected. Not safe or predictable.
                </p>
                <div className="space-y-1 text-xs text-charcoal/40">
                  <p>"A little sexy"</p>
                  <p>"Intriguing"</p>
                  <p>"Personality"</p>
                </div>
              </div>
            </div>
            
            {/* Writing Examples */}
            <div className="bg-white rounded-lg border border-charcoal/10 p-8">
              <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">Writing Style</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-mono text-green-600 uppercase tracking-wider mb-2">Do</p>
                    <p className="text-charcoal font-serif text-lg italic">
                      "We design environments you can't hire elsewhere."
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-red-500 uppercase tracking-wider mb-2">Don't</p>
                    <p className="text-charcoal/40 text-lg line-through">
                      "We provide premium event rental solutions."
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-charcoal/10">
                  <div>
                    <p className="text-[10px] font-mono text-green-600 uppercase tracking-wider mb-2">Do</p>
                    <p className="text-charcoal font-serif text-lg italic">
                      "Imagined. Refined. Crafted."
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-red-500 uppercase tracking-wider mb-2">Don't</p>
                    <p className="text-charcoal/40 text-lg line-through">
                      "Design. Build. Deliver."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tone by Context */}
      {view === 'tone' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Brand Architecture</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Tone by Context</h1>
              <p className="text-charcoal/60 max-w-xl">
                The same voice, calibrated for different audiences and touchpoints.
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Home Page */}
              <div className="bg-charcoal rounded-lg p-8 text-cream">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Home Page</p>
                    <h3 className="font-serif text-2xl tracking-wide">A little sexy and a lot of intrigue</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-cream/40 uppercase">Edge Level</p>
                    <div className="flex gap-1 mt-1">
                      <div className="w-3 h-3 rounded-full bg-cream" />
                      <div className="w-3 h-3 rounded-full bg-cream" />
                      <div className="w-3 h-3 rounded-full bg-cream" />
                      <div className="w-3 h-3 rounded-full bg-cream/30" />
                    </div>
                  </div>
                </div>
                <p className="text-cream/60 text-sm">
                  Video movement to hold interest. Mystery and allure. Less information, more atmosphere.
                </p>
              </div>
              
              {/* Team / Atelier */}
              <div className="bg-white rounded-lg border border-charcoal/10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Team / Atelier</p>
                    <h3 className="font-serif text-2xl text-charcoal tracking-wide">Professional but approachable</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-charcoal/40 uppercase">Edge Level</p>
                    <div className="flex gap-1 mt-1">
                      <div className="w-3 h-3 rounded-full bg-charcoal" />
                      <div className="w-3 h-3 rounded-full bg-charcoal" />
                      <div className="w-3 h-3 rounded-full bg-charcoal/30" />
                      <div className="w-3 h-3 rounded-full bg-charcoal/30" />
                    </div>
                  </div>
                </div>
                <p className="text-charcoal/60 text-sm">
                  Show personality. Real people, real workspace. Creative but competent.
                </p>
              </div>
              
              {/* Collection / Inventory */}
              <div className="bg-white rounded-lg border border-charcoal/10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Collection / Inventory</p>
                    <h3 className="font-serif text-2xl text-charcoal tracking-wide">Modern but timeless</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-charcoal/40 uppercase">Edge Level</p>
                    <div className="flex gap-1 mt-1">
                      <div className="w-3 h-3 rounded-full bg-charcoal" />
                      <div className="w-3 h-3 rounded-full bg-charcoal/30" />
                      <div className="w-3 h-3 rounded-full bg-charcoal/30" />
                      <div className="w-3 h-3 rounded-full bg-charcoal/30" />
                    </div>
                  </div>
                </div>
                <p className="text-charcoal/60 text-sm">
                  Clean and composed. No overlapping images. Let the pieces speak.
                </p>
              </div>
              
              {/* Gallery */}
              <div className="bg-white rounded-lg border border-charcoal/10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Gallery / Projects</p>
                    <h3 className="font-serif text-2xl text-charcoal tracking-wide">Cinematic and immersive</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-charcoal/40 uppercase">Edge Level</p>
                    <div className="flex gap-1 mt-1">
                      <div className="w-3 h-3 rounded-full bg-charcoal" />
                      <div className="w-3 h-3 rounded-full bg-charcoal" />
                      <div className="w-3 h-3 rounded-full bg-charcoal" />
                      <div className="w-3 h-3 rounded-full bg-charcoal/30" />
                    </div>
                  </div>
                </div>
                <p className="text-charcoal/60 text-sm">
                  Full-bleed photography. Dramatic reveals. Let the work create desire.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Don'ts */}
      {view === 'donts' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Brand Architecture</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">What We Don't Do</h1>
              <p className="text-charcoal/60 max-w-xl">
                Clarity on what we avoid is as important as what we embrace.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Overlapping Images',
                  description: 'No Pinterest-style collages. One image at a time, full respect.',
                },
                {
                  title: 'Corporate Speak',
                  description: 'No "solutions", "leverage", "synergy". We speak like humans.',
                },
                {
                  title: 'Busy Layouts',
                  description: 'Generous whitespace. Let elements breathe.',
                },
                {
                  title: 'Trendy Effects',
                  description: 'No parallax overload, no scroll hijacking, no gimmicks.',
                },
                {
                  title: 'Stock Photography',
                  description: 'Real projects, real work, real people only.',
                },
                {
                  title: 'Safe Choices',
                  description: 'We take considered risks. Boring is worse than bold.',
                },
                {
                  title: 'Excessive Branding',
                  description: 'The work speaks. Logo doesn't need to be everywhere.',
                },
                {
                  title: 'Rushed Work',
                  description: 'Quality over speed. Refined over rough.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg border border-red-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-400" />
                  <h3 className="font-serif text-lg text-charcoal mb-2">{item.title}</h3>
                  <p className="text-sm text-charcoal/60">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
