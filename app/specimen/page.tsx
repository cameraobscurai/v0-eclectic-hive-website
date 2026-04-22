'use client'

import { useState } from 'react'
import Link from 'next/link'

// All real Eclectic Hive words and phrases
const BRAND_WORDS = {
  tagline: 'Imagined. Refined. Crafted.',
  mission: 'From Vision to Realization',
  descriptor: 'Full-Service Design + Production',
  studio: 'Atelier by The Hive',
  collection: 'Hive Signature Collection',
  process: 'Five Phases. One Authored Outcome.',
  values: ['Authored', 'Curated', 'Refined', 'Crafted', 'Elevated'],
  categories: ['Seating', 'Tables', 'Bars', 'Lounge', 'Lighting', 'Décor', 'Textiles'],
}

export default function SpecimenIndex() {
  return (
    <main className="min-h-screen bg-cream p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl tracking-tight mb-2">Typography Specimen Pages</h1>
        <p className="text-charcoal/60 mb-12">Isolated pages for image generation reference</p>
        
        <div className="grid grid-cols-2 gap-6">
          <Link href="/specimen/hero-h" className="group">
            <div className="aspect-video bg-charcoal rounded-lg flex items-center justify-center mb-3 group-hover:bg-charcoal/90 transition-colors">
              <span className="font-serif text-cream text-8xl">H</span>
            </div>
            <p className="font-medium">Hero H Letterform</p>
            <p className="text-sm text-charcoal/50">Massive display, multiple treatments</p>
          </Link>
          
          <Link href="/specimen/alphabet" className="group">
            <div className="aspect-video bg-charcoal rounded-lg flex items-center justify-center mb-3 group-hover:bg-charcoal/90 transition-colors">
              <span className="font-serif text-cream text-2xl tracking-[0.3em]">ABCDEF</span>
            </div>
            <p className="font-medium">Full Alphabet</p>
            <p className="text-sm text-charcoal/50">Complete A-Z specimen</p>
          </Link>
          
          <Link href="/specimen/hierarchy" className="group">
            <div className="aspect-video bg-cream border border-charcoal/10 rounded-lg flex flex-col items-start justify-center px-6 mb-3 group-hover:bg-sand/30 transition-colors">
              <span className="font-serif text-charcoal text-xl">H1 Display</span>
              <span className="font-serif text-charcoal/70 text-base">H2 Section</span>
              <span className="text-charcoal/50 text-sm">Body text</span>
            </div>
            <p className="font-medium">Type Hierarchy</p>
            <p className="text-sm text-charcoal/50">All text levels with specs</p>
          </Link>
          
          <Link href="/specimen/phrases" className="group">
            <div className="aspect-video bg-charcoal rounded-lg flex items-center justify-center mb-3 group-hover:bg-charcoal/90 transition-colors">
              <span className="font-serif text-cream text-lg tracking-[0.2em] text-center px-4">IMAGINED.<br/>REFINED.<br/>CRAFTED.</span>
            </div>
            <p className="font-medium">Brand Phrases</p>
            <p className="text-sm text-charcoal/50">Real taglines and copy</p>
          </Link>
          
          <Link href="/specimen/words" className="group">
            <div className="aspect-video bg-cream border border-charcoal/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-sand/30 transition-colors">
              <span className="font-serif text-charcoal text-lg tracking-[0.15em]">ECLECTIC HIVE</span>
            </div>
            <p className="font-medium">Brand Words</p>
            <p className="text-sm text-charcoal/50">Key vocabulary display</p>
          </Link>
          
          <Link href="/specimen/numerals" className="group">
            <div className="aspect-video bg-charcoal rounded-lg flex items-center justify-center mb-3 group-hover:bg-charcoal/90 transition-colors">
              <span className="font-serif text-cream text-3xl tracking-[0.2em]">1234567890</span>
            </div>
            <p className="font-medium">Numerals + Symbols</p>
            <p className="text-sm text-charcoal/50">Numbers, punctuation, glyphs</p>
          </Link>
          
          <Link href="/specimen/colors" className="group">
            <div className="aspect-video bg-gradient-to-r from-charcoal via-sand to-cream rounded-lg flex items-center justify-center mb-3">
              <span className="text-white text-sm tracking-widest uppercase mix-blend-difference">Color System</span>
            </div>
            <p className="font-medium">Color Palette</p>
            <p className="text-sm text-charcoal/50">Swatches with hex values</p>
          </Link>
          
          <Link href="/specimen/grid" className="group">
            <div className="aspect-video bg-cream border border-charcoal/10 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden group-hover:bg-sand/30 transition-colors">
              <div className="absolute inset-0 grid grid-cols-12 gap-px">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-charcoal/5" />
                ))}
              </div>
            </div>
            <p className="font-medium">Grid System</p>
            <p className="text-sm text-charcoal/50">Construction lines and measurements</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
