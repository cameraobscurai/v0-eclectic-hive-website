'use client'

import { useState, useRef, useEffect } from 'react'
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

export function ScopeSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-charcoal text-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Header */}
          <div className="lg:col-span-4">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Scope of Work
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '100ms' }}
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
                    'border-t border-cream/20 pt-6 transition-all duration-700',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
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
