'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { TextReveal, FadeUp, LineReveal } from '@/components/animations/text-reveal'
import { cn } from '@/lib/utils'

const services = [
  {
    number: '01',
    title: 'Design',
    description: 'Concept development, spatial planning, material direction, and visual architecture that shapes how environments feel and function.',
  },
  {
    number: '02',
    title: 'Fabrication',
    description: 'Custom construction, proprietary pieces, material manipulation, and finish work that brings design intelligence into physical form.',
  },
  {
    number: '03',
    title: 'Production',
    description: 'Technical coordination, installation management, timeline orchestration, and on-site execution that delivers authored environments.',
  },
]

function ServiceRow({ 
  service, 
  index,
  isInView 
}: { 
  service: typeof services[0]
  index: number
  isInView: boolean
}) {
  return (
    <div 
      className={cn(
        'py-14 lg:py-18 border-b border-cream/10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 group cursor-pointer transition-all duration-500 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="lg:col-span-1">
        <span className="text-xs text-cream/30 tabular-nums">{service.number}</span>
      </div>
      <div className="lg:col-span-3">
        <h3 className="font-serif text-2xl lg:text-3xl tracking-tight text-cream group-hover:text-terracotta transition-colors duration-500">
          {service.title}
        </h3>
      </div>
      <div className="lg:col-span-6">
        <p className="text-cream/50 leading-relaxed group-hover:text-cream/70 transition-colors duration-500">
          {service.description}
        </p>
      </div>
      <div className="lg:col-span-2 flex items-center justify-end">
        <Link 
          href="/services"
          className="text-xs uppercase tracking-[0.15em] text-cream/30 group-hover:text-cream transition-colors duration-500 relative"
        >
          <span>Learn More</span>
          <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </Link>
      </div>
    </div>
  )
}

// Check for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return prefersReducedMotion
}

export function ServicesPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (prefersReducedMotion) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      // Smoother trigger - earlier reveal
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section className="bg-charcoal text-cream py-28 lg:py-44">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <div className="lg:col-span-3">
            <FadeUp>
              <p className="text-xs uppercase tracking-[0.3em] text-cream/40">
                Capabilities
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              <TextReveal splitBy="word" stagger={0.04} className="block">
                Design intelligence.
              </TextReveal>
              <TextReveal splitBy="word" stagger={0.04} delay={0.2} className="block">
                Fabrication authority.
              </TextReveal>
              <TextReveal splitBy="word" stagger={0.04} delay={0.4} className="block italic">
                Production expertise.
              </TextReveal>
            </h2>
          </div>
        </div>
        
        {/* Services List */}
        <div ref={ref} className="border-t border-cream/10">
          {services.map((service, index) => (
            <ServiceRow 
              key={service.number} 
              service={service} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
        
        {/* CTA */}
        <FadeUp delay={0.4}>
          <div className="mt-20 lg:mt-28 flex justify-center">
            <Link 
              href="/services"
              className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group"
            >
              <span className="relative">
                Full Service Overview
                <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
