'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const team = [
  { name: 'Jill Livingston', role: 'Founder & Creative Director' },
  { name: 'Annie Ohman', role: 'Director of Company Operations' },
  { name: 'Amanda Ferguson', role: 'Senior Designer' },
  { name: 'Sam Young', role: 'Project Manager' },
  { name: 'Adrienne Moon', role: 'Purchasing & Inventory Specialist' },
  { name: 'Patrick Batten', role: 'Director of Warehouse Operations' },
]

// Placeholder portrait frame
function PortraitFrame({ name, role }: { name: string; role: string }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-sand/50 border border-charcoal/10 overflow-hidden mb-4">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-charcoal/15" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-charcoal/15" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-charcoal/15" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-charcoal/15" />
        
        {/* Center indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-charcoal/10" />
        </div>
      </div>
      <h3 className="font-brand text-sm tracking-[0.08em] text-charcoal" style={{ fontWeight: 400 }}>{name}</h3>
      <p className="text-xs text-charcoal/50 mt-1">{role}</p>
    </div>
  )
}

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

export function TheHumansSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (prefersReducedMotion) { setIsInView(true); return }
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
  }, [prefersReducedMotion])

  return (
    <section ref={ref} id="the-humans" className="bg-sand/30 py-24 lg:py-32">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 lg:col-span-6">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-xs text-charcoal/40">02</span>
              <div className="w-12 h-px bg-charcoal/20" />
            </div>
            <h2 
              className={cn(
                'font-brand text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] uppercase text-charcoal transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ fontWeight: 400 }}
            >
              The Humans
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:flex lg:items-end">
            <p 
              className={cn(
                'text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-700 delay-100',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Professional but approachable. Design intelligence meets fabrication expertise 
              meets production experience. We love what we do—and it shows.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div 
          className={cn(
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 transition-all duration-700 delay-200',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {team.map((member) => (
            <PortraitFrame key={member.name} name={member.name} role={member.role} />
          ))}
        </div>
      </div>
    </section>
  )
}
