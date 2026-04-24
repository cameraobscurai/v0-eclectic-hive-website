'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { TransitionLink } from '@/components/page-transition'
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
  const ctaSectionRef = useRef<HTMLDivElement>(null)
  const [ctaVisible, setCtaVisible] = useState(false)
  const cardsSectionRef = useRef<HTMLDivElement>(null)
  const [cardsVisible, setCardsVisible] = useState(false)

  useEffect(() => {
    // Stagger the initial load animation
    const timer = setTimeout(() => setLoaded(true), 100)
    
    // Intersection observers for scroll animations
    const observerOptions = { threshold: 0.2, rootMargin: '-50px 0px' }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === ctaSectionRef.current && entry.isIntersecting) {
          setCtaVisible(true)
        }
        if (entry.target === cardsSectionRef.current && entry.isIntersecting) {
          setCardsVisible(true)
        }
      })
    }, observerOptions)
    
    if (ctaSectionRef.current) observer.observe(ctaSectionRef.current)
    if (cardsSectionRef.current) observer.observe(cardsSectionRef.current)
    
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="bg-charcoal min-h-screen">
      <Navigation />
      
      {/* ========== HERO - First Fold ========== */}
      <section className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
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
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-charcoal/10" />
        
        {/* Vignette for depth and focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,20,20,0.6)_100%)]" />
        
        {/* Bottom gradient - seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-70% to-charcoal" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-5">
          {/* Wordmark */}
          <h1 className="font-display text-[clamp(2.75rem,8vw,7rem)] tracking-display font-light text-cream mb-4 md:mb-6 overflow-hidden uppercase">
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
          
          {/* Tagline */}
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
      </section>

      {/* ========== VALUE PROPOSITION ========== */}
      <section className="bg-charcoal py-12 md:py-16">
        <div className="container-padding mx-auto text-center">
          <p className="font-display text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] text-cream/80 italic tracking-wide text-balance md:whitespace-nowrap">
            We design, build, and produce the environments you can&apos;t hire elsewhere.
          </p>
        </div>
      </section>

      {/* ========== NAVIGATION CARDS ========== */}
      <section className="bg-charcoal">
        <div 
          ref={cardsSectionRef}
          className="container-padding max-w-4xl mx-auto pb-16 md:pb-20"
        >
          {/* Cards Grid - scroll-triggered stagger animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {DESTINATIONS.map((dest, i) => (
              <TransitionLink
                key={dest.href}
                href={dest.href}
                className={cn(
                  'group relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                )}
                style={{ transitionDelay: cardsVisible ? `${i * 120}ms` : '0ms' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glassmorphic card - tighter proportions */}
                <div className={cn(
                  'relative h-full glass-interactive',
                  'py-8 px-6 md:py-10 md:px-8',
                  'touch-target',
                  hoveredIndex === i && 'bg-white/[0.08] border-cream/20'
                )}>
                  {/* Mobile: horizontal | Desktop: vertical centered */}
                  <div className="flex items-center justify-between md:flex-col md:items-center md:justify-center md:text-center md:gap-4">
                    {/* Text content */}
                    <div className="md:flex md:flex-col md:items-center">
                      <h2 className={cn(
                        'font-display text-xl sm:text-2xl md:text-[1.5rem] lg:text-[1.65rem] tracking-[0.12em] md:tracking-[0.14em] font-light uppercase transition-colors duration-300',
                        hoveredIndex === i ? 'text-cream' : 'text-cream/80'
                      )}>
                        {dest.title}
                      </h2>
                      <p className={cn(
                        'text-[9px] sm:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.18em] transition-colors duration-300 mt-1.5 md:mt-2.5',
                        hoveredIndex === i ? 'text-cream/60' : 'text-cream/40'
                      )}>
                        {dest.label}
                      </p>
                    </div>
                    
                    {/* Arrow indicator - more prominent */}
                    <div className={cn(
                      'flex items-center gap-2.5 transition-all duration-300 md:mt-5',
                      hoveredIndex === i ? 'opacity-100' : 'opacity-60'
                    )}>
                      <span className={cn(
                        'h-px bg-cream/60 transition-all duration-300',
                        hoveredIndex === i ? 'w-8 md:w-10' : 'w-4 md:w-5'
                      )} />
                      <svg className="w-4 h-4 text-cream/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </TransitionLink>
            ))}
          </div>
        </div>

        {/* CTA Section with scroll-triggered animation */}
        <div 
          ref={ctaSectionRef}
          className="glass-subtle mx-5 md:mx-8 lg:mx-auto lg:max-w-4xl rounded-sm"
        >
          <div 
            className={cn(
              'py-12 md:py-16 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <p 
              className={cn(
                'text-cream/50 text-xs sm:text-sm mb-8 tracking-wide transition-all duration-700',
                ctaVisible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: ctaVisible ? '150ms' : '0ms' }}
            >
              Two parts luxe, one part regal, and a dash of edge.
            </p>
            
            <TransitionLink
              href="/contact#inquiry"
              className={cn(
                'inline-flex items-center gap-4 group transition-all duration-700',
                ctaVisible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: ctaVisible ? '250ms' : '0ms' }}
            >
              <span className="font-display text-xl sm:text-2xl md:text-[1.65rem] tracking-[0.1em] font-light uppercase text-cream group-hover:text-cream/80 transition-colors duration-300">
                Start a Conversation
              </span>
              <span className="w-8 h-px bg-cream/50 group-hover:w-12 transition-all duration-300" />
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </main>
  )
}
