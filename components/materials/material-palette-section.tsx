'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// Material library - matches brand page aesthetic
const MATERIALS = [
  { 
    name: 'White Oak', 
    tone: 'Warm',
    desc: 'Honey undertones, visible grain',
    color: '#deb887',
    pieceCount: 56,
  },
  { 
    name: 'Brushed Brass', 
    tone: 'Metallic',
    desc: 'Patinated gold, lived-in luxury',
    color: '#b8a88a',
    pieceCount: 31,
  },
  { 
    name: 'Belgian Linen', 
    tone: 'Natural',
    desc: 'Unbleached, textured weave',
    color: '#e8e0d4',
    pieceCount: 35,
  },
  { 
    name: 'Travertine', 
    tone: 'Stone',
    desc: 'Soft cream, subtle pitting',
    color: '#d4c5b5',
    pieceCount: 18,
  },
  { 
    name: 'Velvet', 
    tone: 'Plush',
    desc: 'Deep charcoal, light-catching',
    color: '#2a2a2a',
    pieceCount: 42,
  },
  { 
    name: 'Raw Plaster', 
    tone: 'Tactile',
    desc: 'Imperfect, handmade quality',
    color: '#c4b8a8',
    pieceCount: 28,
  },
]

// Check for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

export function MaterialPaletteSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return
    
    if (reducedMotion) { setIsInView(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <section 
      ref={sectionRef}
      className="bg-charcoal py-24 lg:py-32"
    >
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section label - brand page style */}
        <p 
          className={cn(
            "text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10 transition-all duration-500 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
        >
          Material Library
        </p>
        
        {/* 12-column grid layout matching brand system */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left column - Header */}
          <div 
            className={cn(
              "lg:col-span-4 transition-all duration-500 ease-out",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transitionDelay: '80ms' }}
          >
            <h2 className="font-display text-cream text-2xl md:text-3xl tracking-[0.15em] font-light uppercase">
              Touch. Weight.
              <br />
              <span className="italic text-cream/60">Surface. Response.</span>
            </h2>
            <p className="mt-6 text-cream/50 text-sm leading-relaxed max-w-sm">
              Materials are not decorative choices. They are the vocabulary through which 
              we communicate atmosphere, quality, and intention.
            </p>
            <button
              onClick={() => router.push('/collection')}
              className="mt-8 inline-flex items-center gap-2 text-cream/40 text-xs uppercase tracking-[0.2em] hover:text-cream transition-colors group"
            >
              <span>Explore collection</span>
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
          
          {/* Right column - Material Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MATERIALS.map((mat, i) => (
                <button
                  key={mat.name}
                  onClick={() => router.push(`/collection?search=${encodeURIComponent(mat.name.toLowerCase())}`)}
                  className={cn(
                    "group text-left border border-cream/10 rounded-lg overflow-hidden transition-all duration-500 ease-out hover:border-cream/30",
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${160 + i * 60}ms` }}
                >
                  {/* Material swatch */}
                  <div 
                    className="aspect-[4/3] relative"
                    style={{
                      backgroundColor: mat.color,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
                    }}
                  >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        <span className="block text-2xl font-display">{mat.pieceCount}</span>
                        <span className="block text-[9px] uppercase tracking-[0.2em]">pieces</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Material info */}
                  <div className="p-4 bg-charcoal">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-cream text-sm tracking-wide">{mat.name}</p>
                      <span className="text-cream/20 text-[10px] font-mono">{mat.tone}</span>
                    </div>
                    <p className="text-cream/40 text-xs mt-1">{mat.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
