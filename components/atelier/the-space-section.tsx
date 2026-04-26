'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Placeholder frame component
function ImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-charcoal/[0.03] border border-charcoal/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-charcoal/20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-charcoal/20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-charcoal/20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-charcoal/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-charcoal/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-charcoal/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/30 font-mono">{label}</span>
        </div>
      )}
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

export function TheSpaceSection() {
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
    <section ref={ref} id="the-space" className="bg-cream">
      {/* Section Header */}
      <div className="section-padding py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Section number + title */}
            <div className="col-span-12 lg:col-span-5">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-xs text-charcoal/40">01</span>
                <div className="w-12 h-px bg-charcoal/20" />
              </div>
              <h2 
                className={cn(
                  'font-brand text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] uppercase text-charcoal transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ fontWeight: 400 }}
              >
                The Space
              </h2>
              <p 
                className={cn(
                  'mt-6 text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-700 delay-100',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                Creative work hub. Where ideas become tangible and inventory becomes experience.
              </p>
            </div>
            
            {/* Right: Horizontal image strip */}
            <div className="col-span-12 lg:col-span-7">
              <div 
                className={cn(
                  'grid grid-cols-2 gap-4 transition-all duration-700 delay-200',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
              >
                <ImageFrame aspectRatio="4/5" label="Design Studio" />
                <ImageFrame aspectRatio="4/5" label="Warehouse" />
              </div>
            </div>
          </div>
          
          {/* Full-width cinematic frame */}
          <div 
            className={cn(
              'mt-16 lg:mt-24 transition-all duration-700 delay-300',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <ImageFrame 
              aspectRatio="21/9" 
              label="Panoramic Studio View"
              className="w-full"
            />
          </div>
          
          
        </div>
      </div>
    </section>
  )
}
