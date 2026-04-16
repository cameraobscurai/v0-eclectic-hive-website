'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { cn } from '@/lib/utils'

// Navigation destinations - edge to edge triptych
const DESTINATIONS = [
  {
    href: '/atelier',
    label: 'Design + Fabrication',
    title: 'Atelier',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710309793584-V7I937AO0B569QLUFQPA/Welcome+Party+Fireside.jpg',
  },
  {
    href: '/collection',
    label: 'Signature Inventory',
    title: 'Collection',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710384808225-7LX3MKZOXMSOCNP9DIG8/Main+Banner8.jpg',
  },
  {
    href: '/gallery',
    label: 'Selected Work',
    title: 'Gallery',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2db573b8-41e3-4083-9bbb-8c1f0238705e/Reception+4.jpg',
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

      {/* Triptych Navigation - Edge to edge, minimal gaps */}
      <section className="bg-charcoal">
        {/* Mobile: Stacked | Desktop: Three columns with 2px gaps */}
        <div className="flex flex-col md:flex-row md:gap-[2px]">
          {DESTINATIONS.map((dest, i) => (
            <Link
              key={dest.href}
              href={dest.href}
              className={cn(
                'group relative flex-1 transition-all duration-700',
                loaded ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${600 + i * 150}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image Container */}
              <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.title}
                  fill
                  className={cn(
                    'object-cover transition-all duration-700 ease-out',
                    hoveredIndex === i ? 'scale-105' : 'scale-100'
                  )}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i < 3}
                />
                
                {/* Overlay - darker on non-hovered, lighter on hover */}
                <div className={cn(
                  'absolute inset-0 transition-all duration-500',
                  hoveredIndex === null 
                    ? 'bg-charcoal/40' 
                    : hoveredIndex === i 
                      ? 'bg-charcoal/20' 
                      : 'bg-charcoal/60'
                )} />

                {/* Content - always visible, emphasized on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  {/* Label */}
                  <p className={cn(
                    'text-[10px] uppercase tracking-[0.3em] mb-3 transition-all duration-300',
                    hoveredIndex === i ? 'text-cream/70' : 'text-cream/40'
                  )}>
                    {dest.label}
                  </p>
                  
                  {/* Title */}
                  <h2 className={cn(
                    'font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.15em] font-light uppercase transition-all duration-300',
                    hoveredIndex === i ? 'text-cream' : 'text-cream/80'
                  )}>
                    {dest.title}
                  </h2>
                  
                  {/* Arrow indicator */}
                  <div className={cn(
                    'mt-6 flex items-center gap-2 transition-all duration-300',
                    hoveredIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  )}>
                    <span className="w-8 h-px bg-cream/60" />
                    <svg className="w-4 h-4 text-cream/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
