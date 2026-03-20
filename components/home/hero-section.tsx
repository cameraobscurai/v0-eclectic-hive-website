'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen bg-charcoal overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/70" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen px-6 lg:px-12 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Main Headline */}
            <div className="lg:col-span-8">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6 animate-reveal">
                Design & Fabrication Studio
              </p>
              <h1 className="font-serif text-cream text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tight text-balance animate-reveal delay-100">
                We author
                <br />
                <span className="italic">environments</span>
              </h1>
            </div>
            
            {/* Subtext */}
            <div className="lg:col-span-4 animate-reveal delay-200">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed max-w-md">
                A Denver-based studio shaping extraordinary spaces through design intelligence, 
                proprietary fabrication, and material authorship.
              </p>
              <Link 
                href="/atelier"
                className="inline-flex items-center gap-3 mt-8 text-cream text-sm uppercase tracking-widest group"
              >
                <span className="editorial-link">Enter the Atelier</span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-reveal delay-500">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-cream/30 to-cream/60" />
      </div>
    </section>
  )
}
