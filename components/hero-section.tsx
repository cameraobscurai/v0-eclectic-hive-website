'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Monochromatic charcoal shades — staggered so the wipe feels organic
const BAR_COLORS = [
  'bg-[#0d0d0d]',
  'bg-[#1a1a1a]',
  'bg-[#262626]',
  'bg-[#1a1a1a]',
  'bg-[#0d0d0d]',
]

export function HeroSection() {
  const [barsRevealed, setBarsRevealed] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    // Bars wipe upward first, then text drops in
    const t1 = setTimeout(() => setBarsRevealed(true), 300)
    const t2 = setTimeout(() => setContentVisible(true), 1200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-[#0d0d0d]"
      aria-label="Hero"
    >
      {/* ── Background image with overlay ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-desert-venue.jpg"
          alt="Luxury desert event venue at twilight"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* ── Wipe reveal bars ── */}
      {/* Each bar is a solid charcoal column that translates upward on load,
          revealing the image beneath like a theatrical curtain */}
      <div
        className="absolute inset-0 grid grid-cols-3 md:grid-cols-5 pointer-events-none z-[5]"
        aria-hidden="true"
      >
        {BAR_COLORS.map((color, i) => (
          <div
            key={i}
            className={cn(
              'h-full transition-transform ease-[cubic-bezier(0.76,0,0.24,1)]',
              i >= 3 ? 'hidden md:block' : '',
              color,
              barsRevealed ? '-translate-y-full' : 'translate-y-0'
            )}
            style={{
              transitionDuration: '1.4s',
              transitionDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* ── Foreground content ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-cream px-6">

        {/* Wordmark — each letter drops in independently */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-9xl tracking-tight font-light italic mb-8 overflow-hidden normal-case">
          {'Eclectic Hive'.split('').map((char, i) => (
            <span
              key={i}
              className={cn(
                'inline-block transition-all duration-700 ease-out',
                contentVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-full'
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Tagline with flanking rules */}
        <div
          className={cn(
            'flex items-center gap-4 transition-all duration-700',
            contentVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          )}
          style={{ transitionDelay: '600ms' }}
        >
          <span
            className={cn(
              'w-8 h-px bg-cream/50 transition-transform duration-700 origin-left',
              contentVisible ? 'scale-x-100' : 'scale-x-0'
            )}
            style={{ transitionDelay: '700ms' }}
          />
          <p className="text-xs tracking-[0.25em] uppercase text-cream/70">
            design + production
          </p>
          <span
            className={cn(
              'w-8 h-px bg-cream/50 transition-transform duration-700 origin-right',
              contentVisible ? 'scale-x-100' : 'scale-x-0'
            )}
            style={{ transitionDelay: '700ms' }}
          />
        </div>

        {/* Scroll indicator */}
        <div
          className={cn(
            'absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000',
            contentVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '1000ms' }}
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-cream/40">
            Scroll
          </span>
          <div className="w-px h-12 bg-cream/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-cream animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  )
}
