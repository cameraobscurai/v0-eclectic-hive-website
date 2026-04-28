'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { TransitionLink } from '@/components/page-transition'
import { LiquidGlass } from '@/components/liquid-glass'
import { cn } from '@/lib/utils'

const DESTINATIONS = [
  { href: '/atelier', label: 'Design + Fabrication', title: 'Atelier' },
  { href: '/collection', label: 'Signature Inventory', title: 'Collection' },
  { href: '/gallery', label: 'Selected Work', title: 'Gallery' },
]

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [parallaxY, setParallaxY] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Parallax scroll effect
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        // Parallax factor: image moves slower than scroll (0.3 = 30% of scroll speed)
        const scrollY = window.scrollY
        const maxScroll = window.innerHeight
        const clampedScroll = Math.min(scrollY, maxScroll)
        setParallaxY(clampedScroll * 0.3)
        rafRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <main id="main-content" className="bg-charcoal">
      <Navigation />

      {/* Single viewport hero */}
      <section className="relative h-[100svh] flex flex-col overflow-hidden">

        {/* Background image with parallax - scaled up to allow movement */}
        <div 
          className="absolute inset-0 will-change-transform"
          style={{ 
            transform: `translateY(${parallaxY}px) scale(1.15)`,
            transformOrigin: 'center top'
          }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D9D9D665-C36F-4654-9687-7303B1A05765-9rOvJvBIwpsvY9Af2AsIgMz4b3gf75.jpeg"
            alt="Desert tablescape with woven chairs against sandstone cliffs"
            fill
            priority
            quality={90}
            className="object-cover object-[center_38%]"
            sizes="100vw"
          />
        </div>

        {/* Very subtle warm tint */}
        <div className="absolute inset-0 bg-charcoal/[0.02]" />

        {/* Soft vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_center,transparent_40%,rgba(20,20,20,0.3)_100%)]" />

        {/* Light gradient at bottom - just enough for text legibility, not dark */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 75%, rgba(28,26,24,0.35) 88%, rgba(28,26,24,0.6) 100%)'
          }}
        />

        {/* Wordmark - centered with offset for visual balance */}
        <div className="relative z-10 flex-1 flex items-center justify-center pb-[22vh] md:pb-[20vh]">
          <h1 
            className="font-brand text-[clamp(2.4rem,8.5vw,7rem)] tracking-[0.12em] text-cream uppercase drop-shadow-[0_4px_40px_rgba(0,0,0,0.25)]"
            style={{ fontWeight: 400 }}
          >
            {'ECLECTIC HIVE'.split('').map((char, i) => (
              <span
                key={i}
                className={cn(
                  'inline-block transition-all duration-700',
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                )}
                style={{ transitionDelay: `${250 + i * 30}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>

        {/* Navigation cards - anchored to bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-5 md:px-8 md:pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              {DESTINATIONS.map((dest, i) => (
                <TransitionLink
                  key={dest.href}
                  href={dest.href}
                  aria-label={`${dest.title} - ${dest.label}`}
                  className={cn(
                    'group transition-all duration-700',
                    loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  )}
                  style={{ transitionDelay: loaded ? `${700 + i * 100}ms` : '0ms' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <LiquidGlass
                    hovered={hoveredIndex === i}
                    rounded="rounded-xl"
                    className={cn(
                      "py-3 px-5 md:py-3.5 md:px-7 transition-transform duration-300",
                      hoveredIndex === i && "scale-[1.015]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Text */}
                      <div className="min-w-0">
                        <h2
                          className={cn(
                            'font-brand text-[15px] md:text-base tracking-[0.1em] uppercase transition-colors duration-300',
                            hoveredIndex === i ? 'text-cream' : 'text-cream/90'
                          )}
                          style={{ fontWeight: 400 }}
                        >
                          {dest.title}
                        </h2>
                        <p
                          className={cn(
                            'text-[9px] md:text-[10px] uppercase tracking-[0.08em] transition-colors duration-300 mt-0.5',
                            hoveredIndex === i ? 'text-cream/50' : 'text-cream/30'
                          )}
                        >
                          {dest.label}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div
                        className={cn(
                          'flex items-center gap-1.5 shrink-0 transition-all duration-300',
                          hoveredIndex === i ? 'opacity-100' : 'opacity-30'
                        )}
                      >
                        <span
                          className={cn(
                            'h-px bg-cream/60 transition-all duration-300',
                            hoveredIndex === i ? 'w-5' : 'w-2'
                          )}
                        />
                        <svg
                          className="w-2.5 h-2.5 text-cream/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
