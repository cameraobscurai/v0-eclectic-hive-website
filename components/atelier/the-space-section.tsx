'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

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
      <div className="section-padding pt-24 lg:pt-32 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-mono text-xs text-charcoal/40">01</span>
            <div className="w-12 h-px bg-charcoal/20" />
          </div>
          <h2 
            className={cn(
              'font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light uppercase text-charcoal transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            The Space
          </h2>
          <p 
            className={cn(
              'mt-6 text-charcoal/60 text-lg max-w-2xl transition-all duration-700 delay-100',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Denver-based, but we go wherever the vision takes us. Our studio and warehouse 
            are where ideas become tangible and inventory becomes experience.
          </p>
        </div>
      </div>

      {/* Studio + Warehouse Grid */}
      <div className="px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Design Studio */}
            <div 
              className={cn(
                'group transition-all duration-700 delay-200',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_33_39%20AM-i3tVPuiTbhTLfdzp2THZmBRDfyaKBD.png"
                  alt="Curated tablescape in design studio"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <h3 className="font-display text-xl tracking-[0.15em] uppercase text-charcoal mb-3">
                Design Studio
              </h3>
              <p className="text-charcoal/60 leading-relaxed">
                Where concepts are developed, materials sourced and tested, and every detail 
                considered before anything reaches fabrication. The residential approach that 
                defines our work takes shape here.
              </p>
            </div>

            {/* Warehouse */}
            <div 
              className={cn(
                'group transition-all duration-700 delay-300',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-sand">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png"
                  alt="Atmospheric warehouse space"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <h3 className="font-display text-xl tracking-[0.15em] uppercase text-charcoal mb-3">
                Inventory Warehouse
              </h3>
              <p className="text-charcoal/60 leading-relaxed">
                45,000+ square feet housing our curated collection. Each piece sourced from 
                fashion, travel, interior design, and architecture—a storytelling collection 
                ready to transform any space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
