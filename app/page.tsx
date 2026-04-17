'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { cn } from '@/lib/utils'

// Navigation destinations
const DESTINATIONS = [
  {
    href: '/atelier',
    label: 'Design + Fabrication',
    title: 'Atelier',
  },
  {
    href: '/collection',
    label: 'Signature Inventory',
    title: 'Collection',
  },
  {
    href: '/gallery',
    label: 'Selected Work',
    title: 'Gallery',
  },
]

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <main className="bg-charcoal min-h-screen">
      <Navigation />
      
      {/* Hero - Full viewport with centered logo */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col items-center justify-center">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-[#1a1a1a] to-charcoal" />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Wordmark */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight font-light italic text-cream mb-4 overflow-hidden normal-case">
            {'Eclectic Hive'.split('').map((char, i) => (
              <span
                key={i}
                className={cn(
                  'inline-block transition-all duration-700',
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                )}
                style={{ transitionDelay: `${300 + i * 35}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          
          {/* Tagline */}
          <p 
            className={cn(
              'text-xs md:text-sm uppercase tracking-[0.4em] text-cream/40 transition-all duration-700',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '900ms' }}
          >
            Design + Production
          </p>
        </div>
      </section>

      {/* Navigation Cards - Glassmorphic buttons */}
      <section className="bg-charcoal pb-24 lg:pb-32">
        <div className="max-w-4xl mx-auto px-6">
          {/* Mobile: stacked | Desktop: side by side - tightened spacing */}
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-3">
            {DESTINATIONS.map((dest, i) => (
              <Link
                key={dest.href}
                href={dest.href}
                className={cn(
                  'group relative flex-1 transition-all duration-700',
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${600 + i * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glassmorphic container */}
                <div className={cn(
                  'relative h-full py-8 px-6 lg:py-12 lg:px-8 border transition-all duration-300',
                  'bg-white/[0.03] backdrop-blur-sm',
                  hoveredIndex === i 
                    ? 'border-cream/20 bg-white/[0.06]' 
                    : 'border-cream/[0.08]'
                )}>
                  {/* Mobile: row layout | Desktop: centered column */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-center lg:justify-center lg:text-center lg:min-h-[140px]">
                    {/* Title + Label */}
                    <div className="lg:flex lg:flex-col lg:items-center">
                      <h2 className={cn(
                        'font-display text-2xl lg:text-3xl tracking-[0.15em] font-light uppercase transition-colors duration-300',
                        hoveredIndex === i ? 'text-cream' : 'text-cream/70'
                      )}>
                        {dest.title}
                      </h2>
                      <p className={cn(
                        'text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 mt-1 lg:mt-3',
                        hoveredIndex === i ? 'text-cream/50' : 'text-cream/30'
                      )}>
                        {dest.label}
                      </p>
                    </div>
                    
                    {/* Arrow - shows on mobile right side, desktop below text */}
                    <div className={cn(
                      'flex items-center gap-2 transition-all duration-300 lg:mt-6',
                      hoveredIndex === i ? 'opacity-100' : 'opacity-40'
                    )}>
                      <span className={cn(
                        'h-px bg-cream/40 transition-all duration-300',
                        hoveredIndex === i ? 'w-8' : 'w-4'
                      )} />
                      <svg className="w-4 h-4 text-cream/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA - Minimal */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-charcoal/40 text-sm mb-4 tracking-wide">
            Two parts luxe, one part regal, and a dash of edge.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-4 group"
          >
            <span className="font-display text-2xl md:text-3xl tracking-[0.1em] font-light uppercase text-charcoal group-hover:text-charcoal/70 transition-colors">
              Start a Conversation
            </span>
            <span className="w-8 h-px bg-charcoal/30 group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-charcoal py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-cream/25 tracking-wide">Denver, Colorado</p>
          <Link href="/" className="font-display text-xl tracking-tight font-light italic text-cream/40 hover:text-cream/70 transition-colors normal-case">
            Eclectic Hive
          </Link>
          <p className="text-xs text-cream/25">&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
