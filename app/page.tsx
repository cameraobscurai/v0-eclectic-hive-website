'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { TransitionLink } from '@/components/page-transition'
import { cn } from '@/lib/utils'

// Navigation destinations for bottom strip
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
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="bg-charcoal h-[100svh] flex flex-col overflow-hidden">
      <Navigation />
      
      {/* ========== HERO - 85vh on desktop, flexible on mobile ========== */}
      <section className="relative flex-1 min-h-0 flex flex-col items-center justify-center">
        {/* Background image - desert tablescape */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D9D9D665-C36F-4654-9687-7303B1A05765-9rOvJvBIwpsvY9Af2AsIgMz4b3gf75.jpeg"
            alt="Desert tablescape with woven chairs against sandstone cliffs"
            fill
            priority
            quality={90}
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
        </div>
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-charcoal/15" />
        
        {/* Vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(20,20,20,0.5)_100%)]" />

        {/* Wordmark - centered */}
        <div className="relative z-10 text-center px-5">
          <h1 className="font-display text-[clamp(2.5rem,9vw,8rem)] tracking-[0.2em] font-light text-cream uppercase overflow-hidden">
            {'ECLECTIC HIVE'.split('').map((char, i) => (
              <span
                key={i}
                className={cn(
                  'inline-block transition-all duration-700',
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                )}
                style={{ transitionDelay: `${200 + i * 30}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* ========== NAVIGATION STRIP - Bottom 15vh ========== */}
      <nav 
        className={cn(
          'relative z-20 border-t border-cream/10 transition-all duration-700',
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
        style={{ transitionDelay: '600ms' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream/10">
          {DESTINATIONS.map((dest, i) => (
            <TransitionLink
              key={dest.href}
              href={dest.href}
              className="group relative flex items-center justify-between md:justify-center py-5 md:py-6 px-6 md:px-4 transition-colors duration-300 hover:bg-cream/5"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Text content */}
              <div className="flex flex-col md:items-center md:text-center gap-1">
                <span className={cn(
                  'font-display text-sm md:text-base tracking-[0.14em] font-light uppercase transition-colors duration-300',
                  hoveredIndex === i ? 'text-cream' : 'text-cream/70'
                )}>
                  {dest.title}
                </span>
                <span className={cn(
                  'text-[9px] uppercase tracking-[0.12em] transition-colors duration-300',
                  hoveredIndex === i ? 'text-cream/50' : 'text-cream/30'
                )}>
                  {dest.label}
                </span>
              </div>
              
              {/* Arrow - visible on mobile, hover on desktop */}
              <div className={cn(
                'flex items-center gap-2 transition-all duration-300 md:absolute md:right-4',
                hoveredIndex === i ? 'opacity-100' : 'opacity-50 md:opacity-0'
              )}>
                <span className={cn(
                  'h-px bg-cream/40 transition-all duration-300',
                  hoveredIndex === i ? 'w-6' : 'w-3'
                )} />
                <svg className="w-3 h-3 text-cream/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </TransitionLink>
          ))}
        </div>
      </nav>
    </main>
  )
}
