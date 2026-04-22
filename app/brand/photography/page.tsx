'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

export default function PhotographyGuidelines() {
  const [view, setView] = useState<'inventory' | 'team' | 'events' | 'layout'>('inventory')
  
  return (
    <main id="specimen-content" className="min-h-screen bg-cream">
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-photography-${view}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap max-w-[400px]">
        {(['inventory', 'team', 'events', 'layout'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
              view === v 
                ? 'bg-charcoal text-cream' 
                : 'bg-white/80 text-charcoal border border-charcoal/20 hover:bg-charcoal/10'
            }`}
          >
            {v}
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

      {/* Inventory Photography */}
      {view === 'inventory' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Photography Guidelines</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Inventory Photography</h1>
              <p className="text-charcoal/60 max-w-xl">
                Clean, composed, and consistent. The product is the hero.
              </p>
            </div>
            
            {/* Key Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="w-full aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 rounded mb-4 flex items-center justify-center">
                  <div className="w-1/2 h-1/3 bg-charcoal/20 rounded" />
                </div>
                <h3 className="font-serif text-lg text-charcoal mb-2">Centered Subject</h3>
                <p className="text-sm text-charcoal/60">
                  Product centered in frame. Clean, neutral background.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="w-full aspect-square bg-gradient-to-br from-neutral-50 to-neutral-100 rounded mb-4 flex items-center justify-center">
                  <div className="w-1/2 h-1/3 bg-charcoal/10 rounded border border-charcoal/20" />
                </div>
                <h3 className="font-serif text-lg text-charcoal mb-2">Soft Lighting</h3>
                <p className="text-sm text-charcoal/60">
                  Even, diffused light. Minimal harsh shadows.
                </p>
              </div>
              
              <div className="bg-white rounded-lg border border-charcoal/10 p-6">
                <div className="w-full aspect-square rounded mb-4 flex items-center justify-center border border-charcoal/10 relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-charcoal/5" />
                    ))}
                  </div>
                  <div className="w-1/2 h-1/3 bg-charcoal/20 rounded relative z-10" />
                </div>
                <h3 className="font-serif text-lg text-charcoal mb-2">Consistent Framing</h3>
                <p className="text-sm text-charcoal/60">
                  Same padding ratio across all product shots.
                </p>
              </div>
            </div>
            
            {/* Specs */}
            <div className="bg-charcoal rounded-lg p-8">
              <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">Technical Specifications</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-cream/40 text-[10px] font-mono uppercase mb-1">Aspect Ratio</p>
                  <p className="text-cream font-serif text-xl">1:1</p>
                  <p className="text-cream/40 text-xs">Square format</p>
                </div>
                <div>
                  <p className="text-cream/40 text-[10px] font-mono uppercase mb-1">Background</p>
                  <p className="text-cream font-serif text-xl">#FFFFFF</p>
                  <p className="text-cream/40 text-xs">Pure white</p>
                </div>
                <div>
                  <p className="text-cream/40 text-[10px] font-mono uppercase mb-1">Padding</p>
                  <p className="text-cream font-serif text-xl">8-12%</p>
                  <p className="text-cream/40 text-xs">Of frame width</p>
                </div>
                <div>
                  <p className="text-cream/40 text-[10px] font-mono uppercase mb-1">Resolution</p>
                  <p className="text-cream font-serif text-xl">2400px</p>
                  <p className="text-cream/40 text-xs">Minimum dimension</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Photography */}
      {view === 'team' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Photography Guidelines</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Team Photography</h1>
              <p className="text-charcoal/60 max-w-xl">
                Professional but approachable. Show personality.
              </p>
            </div>
            
            {/* Mood */}
            <div className="bg-charcoal rounded-lg p-8 lg:p-12 mb-12">
              <div className="max-w-2xl">
                <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">The Mood</p>
                <h2 className="font-serif text-3xl text-cream tracking-wide mb-4 italic">
                  Real people doing real work
                </h2>
                <p className="text-cream/60">
                  Not stiff corporate headshots. Capture people in their element—designing, building, creating. Natural light, natural moments.
                </p>
              </div>
            </div>
            
            {/* Do / Don't */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-[10px] font-mono text-green-600 uppercase tracking-wider mb-4">Do</p>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-charcoal/10 p-4">
                    <p className="text-sm text-charcoal">Natural light from windows</p>
                  </div>
                  <div className="bg-white rounded-lg border border-charcoal/10 p-4">
                    <p className="text-sm text-charcoal">Candid moments in the workspace</p>
                  </div>
                  <div className="bg-white rounded-lg border border-charcoal/10 p-4">
                    <p className="text-sm text-charcoal">Genuine smiles and expressions</p>
                  </div>
                  <div className="bg-white rounded-lg border border-charcoal/10 p-4">
                    <p className="text-sm text-charcoal">Warm, approachable color grading</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-mono text-red-500 uppercase tracking-wider mb-4">Don't</p>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-red-100 p-4">
                    <p className="text-sm text-charcoal/60 line-through">Harsh flash lighting</p>
                  </div>
                  <div className="bg-white rounded-lg border border-red-100 p-4">
                    <p className="text-sm text-charcoal/60 line-through">Stiff posed headshots</p>
                  </div>
                  <div className="bg-white rounded-lg border border-red-100 p-4">
                    <p className="text-sm text-charcoal/60 line-through">Forced or awkward expressions</p>
                  </div>
                  <div className="bg-white rounded-lg border border-red-100 p-4">
                    <p className="text-sm text-charcoal/60 line-through">Over-saturated or cold tones</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Settings */}
            <div className="bg-white rounded-lg border border-charcoal/10 p-8">
              <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Ideal Settings</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Design Studio', 'Workshop', 'Material Library', 'On Site'].map((setting) => (
                  <div key={setting} className="bg-cream/50 rounded p-4 text-center">
                    <p className="text-sm text-charcoal">{setting}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Photography */}
      {view === 'events' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Photography Guidelines</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Event Photography</h1>
              <p className="text-charcoal/60 max-w-xl">
                Cinematic and immersive. Create desire through atmosphere.
              </p>
            </div>
            
            {/* The Gallery Aesthetic */}
            <div className="bg-charcoal rounded-lg p-8 lg:p-12 mb-12">
              <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">The Gallery Aesthetic</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-serif text-xl text-cream mb-2">Candlelit Warmth</h3>
                  <p className="text-cream/60 text-sm">Golden hour and candlelight. Warm, intimate atmosphere.</p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-cream mb-2">Shallow Depth</h3>
                  <p className="text-cream/60 text-sm">Bokeh backgrounds. Focus draws the eye to key details.</p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-cream mb-2">Dramatic Moments</h3>
                  <p className="text-cream/60 text-sm">Capture the magic. The details that make it special.</p>
                </div>
              </div>
            </div>
            
            {/* Shot List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                'Wide establishing shots',
                'Tablescape details',
                'Floral arrangements',
                'Candlelight moments',
                'Material textures',
                'Furniture vignettes',
                'Guest interactions',
                'Architectural context',
              ].map((shot, i) => (
                <div key={i} className="bg-white rounded-lg border border-charcoal/10 p-4">
                  <span className="text-[10px] font-mono text-charcoal/40">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm text-charcoal mt-1">{shot}</p>
                </div>
              ))}
            </div>
            
            {/* Color Grading */}
            <div className="bg-white rounded-lg border border-charcoal/10 p-8">
              <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Color Grading</p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="h-16 rounded bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 mb-2" />
                  <p className="text-xs text-charcoal/60">Warm highlights</p>
                </div>
                <div className="flex-1">
                  <div className="h-16 rounded bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-600 mb-2" />
                  <p className="text-xs text-charcoal/60">Rich shadows</p>
                </div>
                <div className="flex-1">
                  <div className="h-16 rounded bg-gradient-to-r from-amber-200 via-yellow-100 to-cream mb-2" />
                  <p className="text-xs text-charcoal/60">Creamy midtones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout Rules */}
      {view === 'layout' && (
        <div className="min-h-screen p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">Photography Guidelines</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-charcoal tracking-wide mb-4">Layout Rules</h1>
              <p className="text-charcoal/60 max-w-xl">
                Clean and composed. No overlapping images.
              </p>
            </div>
            
            {/* The Rule */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-12">
              <p className="text-red-600 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">Critical Rule</p>
              <h2 className="font-serif text-2xl text-red-800 mb-3">No overlapping images</h2>
              <p className="text-red-700/70">
                Each image gets its own space. No Pinterest-style collages, no layered compositions. 
                One image at a time, full respect.
              </p>
            </div>
            
            {/* Do / Don't */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Do */}
              <div>
                <p className="text-[10px] font-mono text-green-600 uppercase tracking-wider mb-4">Do — Clean Grid</p>
                <div className="bg-white rounded-lg border border-green-200 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-neutral-100 rounded" />
                    <div className="aspect-square bg-neutral-100 rounded" />
                    <div className="aspect-square bg-neutral-100 rounded" />
                    <div className="aspect-square bg-neutral-100 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Don't */}
              <div>
                <p className="text-[10px] font-mono text-red-500 uppercase tracking-wider mb-4">Don't — Overlapping</p>
                <div className="bg-white rounded-lg border border-red-200 p-6 relative">
                  <div className="relative h-48">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-neutral-200 rounded transform rotate-3" />
                    <div className="absolute top-8 left-16 w-32 h-32 bg-neutral-300 rounded transform -rotate-2" />
                    <div className="absolute top-4 right-4 w-24 h-24 bg-neutral-400 rounded transform rotate-6" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-500 text-3xl">×</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gallery Layout */}
            <div className="mt-12 bg-white rounded-lg border border-charcoal/10 p-8">
              <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">Approved Gallery Layouts</p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="aspect-video bg-neutral-100 rounded mb-2" />
                  <p className="text-xs text-charcoal/60">Single hero</p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="aspect-square bg-neutral-100 rounded" />
                    <div className="aspect-square bg-neutral-100 rounded" />
                  </div>
                  <p className="text-xs text-charcoal/60">Side by side</p>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="aspect-square bg-neutral-100 rounded" />
                    <div className="aspect-square bg-neutral-100 rounded" />
                    <div className="aspect-square bg-neutral-100 rounded" />
                  </div>
                  <p className="text-xs text-charcoal/60">Triple row</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
