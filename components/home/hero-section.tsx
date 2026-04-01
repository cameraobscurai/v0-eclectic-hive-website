'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AdaptiveHeadline } from '@/components/typography/adaptive-headline'

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(window.scrollY)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const opacity = Math.max(0, 1 - scrollY / 600)
  const parallaxOffset = scrollY * 0.4

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-charcoal overflow-hidden"
    >
      {/* Background with Parallax */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{ 
          transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0002})`,
        }}
      >
        <Image
          src="https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173556231-U5Z6HJ7N0B9I9FJ5F8GN/Eclectic+Hive+Event+Design.jpg"
          alt="Eclectic Hive Event Design"
          fill
          priority
          className={`object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
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
              
              {/* Adaptive Headline */}
              <div className="text-cream">
                <AdaptiveHeadline
                  as="h1"
                  minSize={40}
                  maxSize={120}
                  lineHeightRatio={0.95}
                  animateIn
                  animationDelay={150}
                  className="text-cream"
                >
                  We author environments
                </AdaptiveHeadline>
              </div>
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
