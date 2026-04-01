'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    // Trigger entrance animations after mount
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        // Only update parallax when hero is visible
        if (rect.bottom > 0) {
          setScrollY(window.scrollY)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate fade and parallax based on scroll
  const opacity = Math.max(0, 1 - scrollY / 600)
  const parallaxOffset = scrollY * 0.4

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-charcoal overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{ 
          transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0002})`,
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/20" />
      </div>
      
      {/* Content */}
      <div 
        className="relative z-10 flex flex-col justify-end min-h-screen px-6 lg:px-12 pb-20 lg:pb-28"
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Main Headline */}
            <div className="lg:col-span-7">
              {/* Label */}
              <div className="overflow-hidden mb-8">
                <p 
                  className="text-cream/40 text-xs uppercase tracking-[0.4em] transition-all duration-1000 ease-out"
                  style={{
                    transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                    opacity: loaded ? 1 : 0,
                  }}
                >
                  Design & Fabrication Studio
                </p>
              </div>
              
              {/* Headline - Word by word reveal */}
              <h1 className="font-serif text-cream text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight">
                <span className="block overflow-hidden">
                  <span 
                    className="block transition-all duration-1000 ease-out"
                    style={{
                      transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                      transitionDelay: '150ms',
                    }}
                  >
                    We author
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span 
                    className="block italic transition-all duration-1000 ease-out"
                    style={{
                      transform: loaded ? 'translateY(0)' : 'translateY(100%)',
                      transitionDelay: '250ms',
                    }}
                  >
                    environments
                  </span>
                </span>
              </h1>
            </div>
            
            {/* Subtext */}
            <div className="lg:col-span-4 lg:col-start-9">
              <p 
                className="text-cream/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-1000 ease-out"
                style={{
                  transform: loaded ? 'translateY(0)' : 'translateY(30px)',
                  opacity: loaded ? 1 : 0,
                  transitionDelay: '400ms',
                }}
              >
                A Denver-based studio shaping extraordinary spaces through design intelligence, 
                proprietary fabrication, and material authorship.
              </p>
              
              <div
                className="transition-all duration-1000 ease-out"
                style={{
                  transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                  opacity: loaded ? 1 : 0,
                  transitionDelay: '550ms',
                }}
              >
                <Link 
                  href="/atelier"
                  className="inline-flex items-center gap-4 mt-10 text-cream text-sm uppercase tracking-[0.2em] group"
                >
                  <span className="relative">
                    Enter the Atelier
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </span>
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000"
        style={{
          opacity: loaded ? (1 - scrollY / 200) : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transitionDelay: '700ms',
        }}
      >
        <span className="text-cream/30 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cream/40 to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-cream/60 animate-scroll-down" />
        </div>
      </div>
      
      {/* Symmetrical decorative lines */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 lg:px-12 pointer-events-none">
        <div 
          className="w-px h-32 bg-gradient-to-t from-cream/10 to-transparent transition-all duration-1000"
          style={{
            transform: loaded ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'bottom',
            transitionDelay: '800ms',
          }}
        />
        <div 
          className="w-px h-32 bg-gradient-to-t from-cream/10 to-transparent transition-all duration-1000"
          style={{
            transform: loaded ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'bottom',
            transitionDelay: '900ms',
          }}
        />
      </div>
    </section>
  )
}
