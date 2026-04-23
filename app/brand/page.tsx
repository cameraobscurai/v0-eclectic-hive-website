'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const PAGES = [
  {
    href: '/brand/typography',
    title: 'Typography',
    subtitle: 'Aa',
    description: 'Letterforms, alphabet, type hierarchy, numerals. Construction and anatomy views.',
    tabs: ['Letterform', 'Alphabet', 'Hierarchy', 'Numerals'],
    color: 'bg-charcoal',
  },
  {
    href: '/brand/language',
    title: 'Language',
    subtitle: '"',
    description: 'Phrases, vocabulary, voice formula, tone calibration by context.',
    tabs: ['Phrases', 'Vocabulary', 'Voice', 'Tone'],
    color: 'bg-charcoal',
  },
  {
    href: '/brand/visual',
    title: 'Visual System',
    subtitle: '◐',
    description: 'Colors, materials, 12-column grid, 8px spacing scale.',
    tabs: ['Colors', 'Materials', 'Grid', 'Spacing'],
    color: 'bg-gradient-to-br from-charcoal to-[#2a2a2a]',
  },
  {
    href: '/brand/guidelines',
    title: 'Guidelines',
    subtitle: '✓',
    description: 'Brand architecture, photography rules, UI components, critical don\'ts.',
    tabs: ['Architecture', 'Photography', 'Components', "Don'ts"],
    color: 'bg-charcoal',
  },
]

export default function BrandIndex() {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end pb-16 px-8 lg:px-16 border-b border-cream/10 overflow-hidden">
        {/* Ghost EH letters - positioned right like in screenshot */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none" aria-hidden="true">
          <span 
            className="font-serif text-cream/[0.03] tracking-tight"
            style={{ fontSize: 'clamp(200px, 35vw, 450px)', lineHeight: 0.85 }}
          >
            E
          </span>
          <span 
            className="font-serif text-cream/[0.03] tracking-tight -ml-[0.05em]"
            style={{ fontSize: 'clamp(200px, 35vw, 450px)', lineHeight: 0.85 }}
          >
            H
          </span>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.3em] mb-6">
            Brand System
          </p>
          <h1 className="font-display text-cream text-4xl sm:text-5xl lg:text-7xl tracking-[0.08em] uppercase mb-4">
            ECLECTIC HIVE
          </h1>
          <p className="text-cream/40 text-base lg:text-lg italic mb-5">
            "Two parts luxe, one part regal, and a dash of edge."
          </p>
          <p className="text-cream/50 text-sm max-w-md leading-relaxed">
            Complete brand reference with typography, voice, visual foundations, and usage guidelines.
          </p>
        </div>
      </section>

      {/* Brand Hierarchy */}
      <section className="px-8 lg:px-16 py-12 border-b border-cream/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">
            Brand Architecture
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="text-center sm:text-left">
              <p className="text-cream text-lg lg:text-xl tracking-[0.1em] uppercase font-light">ECLECTIC HIVE</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-1">Parent umbrella</p>
            </div>
            <span className="hidden sm:block text-cream/20 text-2xl">→</span>
            <div className="text-center sm:text-left">
              <p className="text-cream/70 text-base lg:text-lg tracking-[0.08em] uppercase font-light">ATELIER by THE HIVE</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-1">Design & Fabrication</p>
            </div>
            <span className="hidden sm:block text-cream/20 text-2xl">→</span>
            <div className="text-center sm:text-left">
              <p className="text-cream/70 text-base lg:text-lg tracking-[0.08em] uppercase font-light">HIVE SIGNATURE COLLECTION</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-1">Inventory Wing</p>
            </div>
          </div>
          
          {/* Approach */}
          <div className="mt-12 pt-8 border-t border-cream/5">
            <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">
              Atelier Approach
            </p>
            <p className="text-cream/60 text-xl lg:text-2xl font-display italic tracking-wide">
              Imagined. Refined. Crafted.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Main Pages */}
      <section className="p-8 lg:p-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {PAGES.map((page, i) => (
              <Link
                key={page.href}
                href={page.href}
                className="group relative border border-cream/10 rounded-lg overflow-hidden hover:border-cream/20 transition-colors"
              >
                {/* Preview area */}
                <div className={`aspect-[2/1] ${page.color} flex items-center justify-center relative`}>
                  <span className="font-serif text-cream/20 text-7xl lg:text-8xl group-hover:text-cream/30 transition-colors">
                    {page.subtitle}
                  </span>
                  
                  {/* Index number */}
                  <span className="absolute top-4 left-4 text-cream/20 text-xs font-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-cream/60" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 bg-charcoal">
                  <h2 className="font-serif text-cream text-xl tracking-tight mb-2">
                    {page.title}
                  </h2>
                  <p className="text-cream/40 text-sm mb-4 leading-relaxed">
                    {page.description}
                  </p>
                  
                  {/* Tabs preview */}
                  <div className="flex flex-wrap gap-2">
                    {page.tabs.map((tab) => (
                      <span 
                        key={tab}
                        className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-cream/30 border border-cream/10 rounded"
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-8 lg:px-16 pb-12">
        <div className="max-w-5xl mx-auto border-t border-cream/10 pt-8">
          <p className="text-cream/30 text-xs font-mono uppercase tracking-wider">
            Each page includes dark/light toggle and PNG download. Tab navigation for sub-sections.
          </p>
        </div>
      </section>
    </main>
  )
}
