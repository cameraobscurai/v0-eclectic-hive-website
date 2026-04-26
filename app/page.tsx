'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { TransitionLink } from '@/components/page-transition'
import { LiquidGlass } from '@/components/liquid-glass'
import { cn } from '@/lib/utils'

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
    <main className="bg-charcoal min-h-screen">
      <Navigation />

      {/* ========== HERO — cards live inside this section ========== */}
      <section className="relative h-[100svh] min-h-[640px] flex flex-col overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D9D9D665-C36F-4654-9687-7303B1A05765-9rOvJvBIwpsvY9Af2AsIgMz4b3gf75.jpeg"
            alt="Desert tablescape with woven chairs against sandstone cliffs"
            fill
            priority
            quality={90}
            // Shift the image up slightly so the table/chair zone
            // lands right behind the cards at the bottom
            className="object-cover object-[center_35%]"
            sizes="100vw"
          />
        </div>

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-charcoal/10" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,20,20,0.55)_100%)]" />

        {/*
          Bottom gradient — critical for card legibility.
          Fades to charcoal from ~65% down so the card text
          always sits on a dark base, but the gradient starts
          light enough that the glass still refracts the photo.
          
          The key: don't go fully opaque until BELOW the cards.
          Cards sit at ~72%–95% of viewport height.
          Gradient goes transparent → semi → near-opaque in that zone.
        */}
        <div className="absolute inset-0 bg-gradient-to-b
          from-transparent
          via-transparent
          via-[55%]
          to-charcoal/95
          to-[100%]"
        />

        {/* Additional dark band just under the cards — keeps the section
            below the hero seamless */}
        <div className="absolute bottom-0 left-0 right-0 h-24
          bg-gradient-to-b from-transparent to-charcoal" />

        {/* ── Wordmark — centered in upper 60% of the hero ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 pb-[28vh]">
          <h1 className="font-brand text-[clamp(2.75rem,8vw,7rem)] tracking-[0.2em] text-cream mb-4 md:mb-6 overflow-hidden uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]" style={{ fontWeight: 400 }}>
            {'ECLECTIC HIVE'.split('').map((char, i) => (
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

          <p
            className={cn(
              'text-[10px] sm:text-xs md:text-sm uppercase tracking-wide text-cream/50 transition-all duration-700',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            Design + Production
          </p>
        </div>

        {/* ── Cards — absolute, anchored to the bottom of the hero ──
            
            Positioning logic:
            - `bottom-6 md:bottom-8` keeps them above the fold on most viewports
            - The image is shifted to object-[center_35%] so the table surface
              and woven chair backs land right behind this zone
            - LiquidGlass refracts the chair texture + candlelight edges
        */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 px-5 md:px-8 lg:px-0">
          <div className="max-w-4xl mx-auto">
            <div
              className={cn(
                'grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3',
              )}
            >
              {DESTINATIONS.map((dest, i) => (
                <TransitionLink
                  key={dest.href}
                  href={dest.href}
                  className={cn(
                    'group relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  )}
                  // Cards stagger in after the wordmark finishes
                  style={{ transitionDelay: loaded ? `${900 + i * 120}ms` : '0ms' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <LiquidGlass
                    hovered={hoveredIndex === i}
                    rounded="rounded-xl"
                    className="py-4 px-6 md:py-5 md:px-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2
                          className={cn(
                            'font-brand text-base md:text-lg tracking-[0.12em] uppercase transition-colors duration-300',
                            hoveredIndex === i ? 'text-cream' : 'text-cream/85'
                          )}
                          style={{ fontWeight: 400 }}
                        >
                          {dest.title}
                        </h2>
                        <p
                          className={cn(
                            'text-[9px] uppercase tracking-[0.12em] transition-colors duration-300 mt-0.5',
                            hoveredIndex === i ? 'text-cream/55' : 'text-cream/35'
                          )}
                        >
                          {dest.label}
                        </p>
                      </div>

                      <div
                        className={cn(
                          'flex items-center gap-2 transition-all duration-300',
                          hoveredIndex === i ? 'opacity-100' : 'opacity-40'
                        )}
                      >
                        <span
                          className={cn(
                            'h-px bg-cream/50 transition-all duration-300',
                            hoveredIndex === i ? 'w-6' : 'w-3'
                          )}
                        />
                        <svg
                          className="w-3 h-3 text-cream/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </LiquidGlass>
                </TransitionLink>
              ))}
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}
