'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { TransitionLink } from '@/components/page-transition'
import { TextReveal, KenBurns, FadeInView, StaggerContainer, StaggerItem } from '@/components/scroll-animations'
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
    // Stagger the initial load animation for hero text
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="bg-charcoal min-h-screen">
      <Navigation />
      
      {/* ========== HERO - First Fold ========== */}
      <section className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image with Ken Burns zoom-out effect */}
        <KenBurns className="absolute inset-0" initialScale={1.12} finalScale={1}>
          <Image
            src="/images/hero-desert-venue.jpg"
            alt="Luxury desert event venue at twilight"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        </KenBurns>
        
        {/* Frosted glass overlay - elegant mystery */}
        <div className="absolute inset-0 backdrop-blur-[6px] bg-charcoal/25" />
        
        {/* Vignette for depth and focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,20,20,0.6)_100%)]" />
        
        {/* Bottom gradient - seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-charcoal" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-5">
          {/* Wordmark */}
          <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[7rem] tracking-tight font-light italic text-cream mb-4 md:mb-6 overflow-hidden normal-case">
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
              'text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-cream/50 transition-all duration-700',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            Design + Production
          </p>
        </div>
      </section>

      {/* ========== NAVIGATION CARDS ========== */}
      <section className="bg-charcoal">
        <div className="container-padding max-w-5xl mx-auto pt-0 pb-16 md:pb-24">
          {/* Cards Grid - scroll-triggered stagger animation */}
          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
            staggerDelay={0.12}
          >
            {DESTINATIONS.map((dest, i) => (
              <StaggerItem key={dest.href}>
                <TransitionLink
                  href={dest.href}
                  className="group relative block"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                {/* Glassmorphic card */}
                <div className={cn(
                  'relative h-full glass-interactive',
                  'py-6 px-5 md:py-10 md:px-6 lg:py-12 lg:px-8',
                  'touch-target',
                  hoveredIndex === i && 'bg-white/[0.08] border-cream/20'
                )}>
                  {/* Mobile: horizontal | Desktop: vertical centered */}
                  <div className="flex items-center justify-between md:flex-col md:items-center md:justify-center md:text-center md:min-h-[160px] lg:min-h-[180px]">
                    {/* Text content */}
                    <div className="md:flex md:flex-col md:items-center">
                      <h2 className={cn(
                        'font-display text-xl sm:text-2xl md:text-2xl lg:text-3xl tracking-[0.12em] md:tracking-[0.15em] font-light uppercase transition-colors duration-300',
                        hoveredIndex === i ? 'text-cream' : 'text-cream/80'
                      )}>
                        {dest.title}
                      </h2>
                      <p className={cn(
                        'text-[9px] sm:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] transition-colors duration-300 mt-1 md:mt-3',
                        hoveredIndex === i ? 'text-cream/60' : 'text-cream/35'
                      )}>
                        {dest.label}
                      </p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className={cn(
                      'flex items-center gap-2 transition-all duration-300 md:mt-6',
                      hoveredIndex === i ? 'opacity-100' : 'opacity-50'
                    )}>
                      <span className={cn(
                        'h-px bg-cream/50 transition-all duration-300',
                        hoveredIndex === i ? 'w-6 md:w-8' : 'w-3 md:w-4'
                      )} />
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-cream/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </TransitionLink>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* CTA Section with scroll-triggered animation */}
        <FadeInView className="glass-subtle mx-5 md:mx-8 rounded-sm" direction="up" distance={30}>
          <div className="py-14 md:py-20 text-center">
            <FadeInView delay={0.15} distance={20}>
              <p className="text-cream/40 text-xs sm:text-sm mb-6 tracking-wide max-w-md mx-auto px-5">
                Two parts luxe, one part regal, and a dash of edge.
              </p>
            </FadeInView>
            
            <FadeInView delay={0.25} distance={20}>
              <TransitionLink
                href="/contact"
                className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 group"
              >
                <span className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.08em] sm:tracking-[0.1em] font-light uppercase text-cream group-hover:text-cream/80 transition-colors duration-300">
                  Start a Conversation
                </span>
                <span className="hidden sm:block w-6 h-px bg-cream/40 group-hover:w-10 transition-all duration-300" />
              </TransitionLink>
            </FadeInView>
          </div>
        </FadeInView>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-charcoal border-t border-cream/[0.06] py-8 md:py-10 mt-16 md:mt-24">
        <div className="container-padding max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <p className="text-[10px] md:text-xs text-cream/25 tracking-wide order-2 md:order-1">Denver, Colorado</p>
          <TransitionLink href="/" className="font-display text-lg md:text-xl tracking-tight font-light italic text-cream/40 hover:text-cream/70 transition-colors normal-case order-1 md:order-2">
            Eclectic Hive
          </TransitionLink>
          <p className="text-[10px] md:text-xs text-cream/25 order-3">&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
