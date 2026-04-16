'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { cn } from '@/lib/utils'

// Press logos
const PRESS_LOGOS = [
  { name: 'Elle', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Elle%2BLogo%2Bw%2B2-OVQNlm5PY1I9dKvM2JblVMgBvFfYj7.webp' },
  { name: "Harper's Bazaar", src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bazaar%2BLogo%2BW-Y41iLCo3Nck09LLPlG974WK0B927jI.webp' },
  { name: 'The Knot', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h11ekHP7Chbg2IvGhPvl5IEqwDAW78.png' },
  { name: 'Vogue', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vogue%2Blogo%2Bw-NfImu5uR2feTV0gVZLpDgb3izl9xAO.webp' },
  { name: 'Martha Stewart', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MS%2Blogo%2Bw-qJWRNbqp0fnELXYBwPDut01f5GbAXE.webp' },
  { name: 'Brides', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Brides%2Blogo%2BW-mt7R82vdgFSNJzMdkravKAHEO77igK.webp' },
]

// Navigation destinations
const DESTINATIONS = [
  {
    href: '/atelier',
    title: 'Atelier',
    subtitle: 'Design + Fabrication',
    description: 'Full-service event design from concept to installation',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710309793584-V7I937AO0B569QLUFQPA/Welcome+Party+Fireside.jpg',
  },
  {
    href: '/collection',
    title: 'Collection',
    subtitle: 'Signature Inventory',
    description: 'Curated furniture and decor for exceptional events',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png',
  },
  {
    href: '/gallery',
    title: 'Gallery',
    subtitle: 'Selected Work',
    description: 'A portfolio of our most memorable collaborations',
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
      <section className="relative h-screen flex flex-col items-center justify-center px-6">
        {/* Animated background panels */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5">
          {['bg-[#0d0d0d]', 'bg-[#1a1a1a]', 'bg-[#262626]', 'bg-[#1a1a1a]', 'bg-[#0d0d0d]'].map((color, i) => (
            <div
              key={i}
              className={cn(color, i >= 3 ? 'hidden md:block' : '')}
            />
          ))}
        </div>

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
                style={{ transitionDelay: `${400 + i * 40}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          
          {/* Tagline */}
          <p 
            className={cn(
              'text-xs md:text-sm uppercase tracking-[0.4em] text-cream/50 transition-all duration-700',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '1000ms' }}
          >
            Design + Production
          </p>
        </div>

        {/* Scroll indicator */}
        <div 
          className={cn(
            'absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '1200ms' }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40">Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-cream/40 to-transparent" />
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-16">
            <span className="w-12 h-px bg-charcoal/20" />
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50">Choose Your Experience</p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {DESTINATIONS.map((dest, i) => (
              <Link
                key={dest.href}
                href={dest.href}
                className={cn(
                  'group relative block transition-all duration-700',
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-sand mb-6">
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className={cn(
                      'object-cover transition-all duration-700',
                      hoveredIndex === i ? 'scale-105' : 'scale-100',
                      dest.href === '/collection' ? 'object-contain p-8 bg-white' : ''
                    )}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className={cn(
                    'absolute inset-0 bg-charcoal/0 transition-colors duration-500',
                    hoveredIndex === i ? 'bg-charcoal/20' : ''
                  )} />
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50">{dest.subtitle}</p>
                  <h2 className="font-display text-2xl lg:text-3xl tracking-[0.15em] font-light uppercase text-charcoal">
                    {dest.title}
                  </h2>
                  <p className="text-sm text-charcoal/60 leading-relaxed">{dest.description}</p>
                </div>

                {/* Arrow */}
                <div className={cn(
                  'mt-6 flex items-center gap-3 text-charcoal/50 transition-all duration-300',
                  hoveredIndex === i ? 'text-charcoal' : ''
                )}>
                  <span className="text-xs uppercase tracking-[0.2em]">Explore</span>
                  <span className={cn(
                    'w-6 h-px bg-current transition-all duration-300',
                    hoveredIndex === i ? 'w-10' : ''
                  )} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Press Strip */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#D5CDC3' }}>
        <div className="flex items-center gap-3 mb-10 px-6 lg:px-16">
          <span className="w-6 h-px bg-charcoal/15" />
          <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/35">As featured in</p>
        </div>
        
        <div className="px-6 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-0">
            {PRESS_LOGOS.map((logo, i) => (
              <div
                key={i}
                className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-charcoal py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.15em] font-light uppercase text-cream mb-6">
            Let&apos;s Create Together
          </h2>
          <p className="text-cream/50 mb-10 max-w-xl mx-auto">
            Two parts luxe, one part regal, and a dash of edge. Tell us about your vision.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 border border-cream/30 text-sm uppercase tracking-[0.25em] text-cream hover:bg-cream hover:text-charcoal transition-all duration-300"
          >
            Start a Conversation
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-charcoal border-t border-cream/10 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">Denver, Colorado</p>
          <Link href="/" className="font-display text-lg tracking-tight font-light italic text-cream/50 hover:text-cream transition-colors">
            Eclectic Hive
          </Link>
          <p className="text-xs text-cream/30">&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
