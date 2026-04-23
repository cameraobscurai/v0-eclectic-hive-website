'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const capabilities = [
  {
    title: 'Environment Design',
    description: 'Complete spatial design for events, from concept through execution.',
  },
  {
    title: 'Custom Fabrication',
    description: 'Bespoke furniture, installations, and architectural elements built in-house.',
  },
  {
    title: 'Material Curation',
    description: 'Sourcing and specifying materials that elevate the design narrative.',
  },
  {
    title: 'Production Management',
    description: 'End-to-end coordination ensuring flawless delivery on site.',
  },
  {
    title: 'Inventory Rental',
    description: 'Access to our Signature Collection of proprietary lounge and decor pieces.',
  },
  {
    title: 'Destination Events',
    description: 'We travel wherever our clients and their visions take us.',
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

export function ScopeSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
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
    <section ref={ref} className="bg-charcoal text-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Header — sticky on desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
            >
              Scope of Work
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '80ms' }}
            >
              Full-service design + production
            </h2>
          </div>

          {/* Capabilities Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {capabilities.map((item, i) => (
                <div 
                  key={item.title}
                  className={cn(
                    'border-t border-cream/20 pt-6 transition-all duration-500 ease-out',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                  style={{ transitionDelay: `${160 + i * 60}ms` }}
                >
                  <h3 className="font-display text-xl tracking-tight font-normal mb-3">{item.title}</h3>
                  <p className="text-cream/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
