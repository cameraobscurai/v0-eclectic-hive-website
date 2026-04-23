'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

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

export function StudioSection() {
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
    <section ref={ref} className="bg-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div 
            className={cn(
              'relative aspect-[4/3] bg-sand transition-all duration-600 ease-out',
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-charcoal/20 rounded-sm flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Design Studio</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6 transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '100ms' }}
            >
              Design Studio
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase text-charcoal transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '160ms' }}
            >
              The creative work hub
            </h2>
            <p 
              className={cn(
                'mt-6 text-charcoal/70 leading-relaxed transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '220ms' }}
            >
              Our Denver studio is where ideas become tangible. Here, design concepts 
              are developed, materials are sourced and tested, and every detail is 
              considered before anything reaches fabrication.
            </p>
            <p 
              className={cn(
                'mt-4 text-charcoal/70 leading-relaxed transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '280ms' }}
            >
              This is where the cinematic, art-forward approach that defines our work 
              takes shape—where mood boards become environments and sketches become 
              proprietary pieces.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
