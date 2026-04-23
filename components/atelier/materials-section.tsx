'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const materials = [
  {
    name: 'Textiles',
    description: 'Velvet, linen, raw silk, boucle, performance fabrics',
    color: '#e8e0d4',
  },
  {
    name: 'Woods',
    description: 'White oak, walnut, ash, reclaimed timber, engineered panels',
    color: '#8B7355',
  },
  {
    name: 'Metals',
    description: 'Brass, blackened steel, copper, aluminum, bronze patina',
    color: '#b8a88a',
  },
  {
    name: 'Ceramics',
    description: 'Handthrown vessels, architectural tiles, glazed surfaces',
    color: '#d4c5b5',
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

export function MaterialsSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
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
    <section ref={sectionRef} className="bg-sand/30 py-24 lg:py-32">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section label */}
        <p 
          className={cn(
            "text-[10px] font-mono uppercase tracking-[0.3em] text-charcoal/40 mb-10 transition-all duration-500 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
        >
          Material Intelligence
        </p>
        
        {/* 12-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left - Header */}
          <div 
            className={cn(
              "lg:col-span-5 transition-all duration-500 ease-out",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            )}
            style={{ transitionDelay: '80ms' }}
          >
            <h2 className="font-display text-charcoal text-2xl md:text-3xl lg:text-4xl tracking-[0.1em] font-light uppercase">
              Touch. Weight.
              <br />
              <span className="italic text-charcoal/60">Surface. Response.</span>
            </h2>
            <p className="mt-8 text-charcoal/60 text-sm leading-relaxed max-w-md">
              Materials are not decorative choices. They are the vocabulary through which 
              we communicate atmosphere, quality, and intention.
            </p>
          </div>
          
          {/* Right - Material Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              {materials.map((material, i) => (
                <div 
                  key={material.name} 
                  className={cn(
                    "group border border-charcoal/10 rounded-lg overflow-hidden transition-all duration-500 ease-out hover:border-charcoal/20",
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${160 + i * 60}ms` }}
                >
                  {/* Swatch */}
                  <div 
                    className="aspect-[3/2]"
                    style={{
                      backgroundColor: material.color,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
                    }}
                  />
                  
                  {/* Info */}
                  <div className="p-4 bg-cream">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display text-charcoal text-base tracking-wide">{material.name}</h3>
                        <p className="mt-1 text-xs text-charcoal/50 leading-relaxed">{material.description}</p>
                      </div>
                      <span className="text-[10px] font-mono text-charcoal/30">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
