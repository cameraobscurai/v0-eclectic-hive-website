'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
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

export function FabricationSection() {
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
    <section ref={ref} className="relative bg-charcoal text-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="lg:order-2">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '100ms' }}
            >
              Fabrication Capacity
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '160ms' }}
            >
              Where design becomes reality
            </h2>
            <p 
              className={cn(
                'mt-6 text-cream/70 leading-relaxed transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '220ms' }}
            >
              Our in-house fabrication capabilities allow us to build what we design. 
              Custom furniture, architectural elements, installations, and proprietary 
              pieces—all created with precision and intention.
            </p>
            <p 
              className={cn(
                'mt-4 text-cream/70 leading-relaxed transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '280ms' }}
            >
              This isn&apos;t mass production—it&apos;s craft at scale. Every piece carries 
              the signature of our process and the mark of deliberate making.
            </p>
          </div>

          {/* Image */}
          <div 
            className={cn(
              'relative aspect-[4/3] overflow-hidden lg:order-1 transition-all duration-600 ease-out',
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
            )}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%281%29-ysnOsz5FYFEPQzufogthldORvQWG5F.png"
              alt="Material study with ceramics and natural elements"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
