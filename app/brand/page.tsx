'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const PAGES = [
  {
    href: '/brand/hero-h',
    title: 'Hero Letterform',
    subtitle: 'H',
    description: 'Massive display treatment with construction, anatomy, and process views',
    preview: 'serif',
  },
  {
    href: '/brand/alphabet',
    title: 'Complete Alphabet',
    subtitle: 'A—Z',
    description: 'Full character set in display and text weights',
    preview: 'serif',
  },
  {
    href: '/brand/hierarchy',
    title: 'Type Hierarchy',
    subtitle: 'H1—Body',
    description: 'Complete typographic scale with specifications',
    preview: 'system',
  },
  {
    href: '/brand/phrases',
    title: 'Brand Language',
    subtitle: 'Copy',
    description: 'Taglines, mission statements, and brand voice',
    preview: 'serif',
  },
  {
    href: '/brand/words',
    title: 'Vocabulary',
    subtitle: 'Words',
    description: 'Categories, values, and key terminology',
    preview: 'serif',
  },
  {
    href: '/brand/numerals',
    title: 'Numerals',
    subtitle: '0—9',
    description: 'Figures, dimensions, and special characters',
    preview: 'serif',
  },
  {
    href: '/brand/colors',
    title: 'Color + Material',
    subtitle: 'Palette',
    description: 'Brand colors and material reference swatches',
    preview: 'swatch',
  },
  {
    href: '/brand/grid',
    title: 'Grid System',
    subtitle: '12-Col',
    description: 'Construction grid and spacing measurements',
    preview: 'grid',
  },
  {
    href: '/brand/spacing',
    title: 'Spacing System',
    subtitle: '8px',
    description: 'Base unit, scale, section padding, container margins',
    preview: 'spacing',
  },
  {
    href: '/brand/effects',
    title: 'Effects + Motion',
    subtitle: 'FX',
    description: 'Glassmorphism, easing curves, animation presets',
    preview: 'effects',
  },
  {
    href: '/brand/components',
    title: 'UI Components',
    subtitle: 'UI',
    description: 'Buttons, forms, cards with specs and states',
    preview: 'components',
  },
]

export default function SpecimenIndex() {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end pb-16 px-8 lg:px-16 border-b border-cream/10">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal" />
        
        {/* Large background letter */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <span 
            className="font-serif text-cream/[0.02] select-none"
            style={{ fontSize: 'clamp(300px, 50vw, 600px)', lineHeight: 0.8 }}
          >
            Aa
          </span>
        </div>
        
        <div className="relative z-10 max-w-6xl">
          <p className="text-cream/40 text-xs font-mono uppercase tracking-[0.3em] mb-6">
            Typography Specimen
          </p>
          <h1 className="font-serif text-cream text-5xl lg:text-7xl tracking-tight mb-4">
            Eclectic Hive
          </h1>
          <p className="text-cream/50 text-lg max-w-xl">
            Brand typography system. Isolated reference pages for design and image generation.
          </p>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="px-8 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10">
            {PAGES.map((page, i) => (
              <Link
                key={page.href}
                href={page.href}
                className="group relative bg-charcoal p-6 lg:p-8 hover:bg-charcoal/80 transition-colors"
              >
                {/* Preview area */}
                <div className="aspect-[4/3] mb-6 flex items-center justify-center relative overflow-hidden rounded-sm bg-cream/5">
                  {page.preview === 'serif' && (
                    <span className="font-serif text-cream/80 text-4xl lg:text-5xl tracking-tight group-hover:scale-105 transition-transform duration-500">
                      {page.subtitle}
                    </span>
                  )}
                  {page.preview === 'system' && (
                    <div className="text-left px-4">
                      <p className="font-serif text-cream/80 text-xl">H1</p>
                      <p className="font-serif text-cream/50 text-base">H2</p>
                      <p className="text-cream/30 text-sm">Body</p>
                    </div>
                  )}
                  {page.preview === 'swatch' && (
                    <div className="flex gap-1">
                      <div className="w-8 h-16 rounded-sm bg-[#1a1a1a] border border-cream/10" />
                      <div className="w-8 h-16 rounded-sm bg-[#d4cdc4]" />
                      <div className="w-8 h-16 rounded-sm bg-[#f5f2ed]" />
                      <div className="w-8 h-16 rounded-sm bg-[#b8a88a]" />
                    </div>
                  )}
                  {page.preview === 'grid' && (
                    <div className="absolute inset-4 grid grid-cols-6 gap-px opacity-30">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <div key={j} className="bg-cream/20 rounded-sm" />
                      ))}
                    </div>
                  )}
                  {page.preview === 'spacing' && (
                    <div className="flex flex-col gap-1 px-4">
                      <div className="w-4 h-2 bg-cream/40 rounded-sm" />
                      <div className="w-8 h-2 bg-cream/40 rounded-sm" />
                      <div className="w-16 h-2 bg-cream/40 rounded-sm" />
                      <div className="w-24 h-2 bg-cream/40 rounded-sm" />
                    </div>
                  )}
                  {page.preview === 'effects' && (
                    <div className="glass p-4 rounded">
                      <div className="w-12 h-8 bg-cream/20 rounded animate-pulse" />
                    </div>
                  )}
                  {page.preview === 'components' && (
                    <div className="flex flex-col gap-2 px-4">
                      <div className="w-20 h-6 bg-cream rounded-sm" />
                      <div className="w-20 h-6 border border-cream/30 rounded-sm" />
                    </div>
                  )}
                  
                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-cream/60" />
                  </div>
                </div>
                
                {/* Title and description */}
                <h2 className="font-serif text-cream text-lg tracking-tight mb-1 group-hover:text-cream/80 transition-colors">
                  {page.title}
                </h2>
                <p className="text-cream/40 text-xs leading-relaxed">
                  {page.description}
                </p>
                
                {/* Index number */}
                <span className="absolute top-6 left-6 lg:top-8 lg:left-8 text-cream/20 text-xs font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="px-8 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto border-t border-cream/10 pt-8">
          <p className="text-cream/30 text-xs font-mono uppercase tracking-wider">
            Each page includes theme toggles (dark/light) and 2x2 grid view options. Download as PNG available on all pages.
          </p>
        </div>
      </section>
    </main>
  )
}
