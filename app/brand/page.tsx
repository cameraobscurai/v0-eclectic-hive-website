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
      <section className="relative h-[45vh] min-h-[350px] flex items-end pb-12 px-8 lg:px-16 border-b border-cream/10">
        {/* Large background letter */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <span 
            className="font-serif text-cream/[0.02] select-none"
            style={{ fontSize: 'clamp(300px, 50vw, 600px)', lineHeight: 0.8 }}
          >
            H
          </span>
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <p className="text-cream/40 text-xs font-mono uppercase tracking-[0.3em] mb-4">
            Brand System
          </p>
          <h1 className="font-serif text-cream text-4xl lg:text-6xl tracking-tight mb-3">
            Eclectic Hive
          </h1>
          <p className="text-cream/30 text-sm italic mb-4">
            "Two parts luxe, one part regal, and a dash of edge."
          </p>
          <p className="text-cream/50 text-sm max-w-lg">
            Complete brand reference with typography, voice, visual foundations, and usage guidelines.
          </p>
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
