'use client'

import { useEffect, useState } from 'react'

export function AtelierHero() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-[80vh] lg:min-h-screen bg-charcoal overflow-hidden">
      {/* Background with Parallax */}
      <div 
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=2400&auto=format&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-charcoal/75" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-[80vh] lg:min-h-screen px-6 lg:px-12 pb-16 lg:pb-24 pt-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Label */}
            <div className="lg:col-span-12">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6 animate-reveal">
                Atelier by The Hive
              </p>
            </div>
            
            {/* Main Headline */}
            <div className="lg:col-span-7">
              <h1 className="font-serif text-cream text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight animate-reveal delay-100">
                Where materiality
                <br />
                meets <span className="italic">intention</span>
              </h1>
            </div>
            
            {/* Subtext */}
            <div className="lg:col-span-5 animate-reveal delay-200">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed max-w-md">
                The atelier is the creative engine of Eclectic Hive—a space where 
                fabrication, material exploration, and design authorship converge to 
                shape environments that cannot be replicated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
