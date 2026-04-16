'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function FabricationSection() {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="lg:order-2">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '200ms' }}
            >
              Fabrication Capacity
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.12em] font-semibold uppercase transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '300ms' }}
            >
              Where design becomes reality
            </h2>
            <p 
              className={cn(
                'mt-6 text-cream/70 leading-relaxed transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '400ms' }}
            >
              Our in-house fabrication capabilities allow us to build what we design. 
              Custom furniture, architectural elements, installations, and proprietary 
              pieces—all created with precision and intention.
            </p>
            <p 
              className={cn(
                'mt-4 text-cream/70 leading-relaxed transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '500ms' }}
            >
              This isn&apos;t mass production—it&apos;s craft at scale. Every piece carries 
              the signature of our process and the mark of deliberate making.
            </p>
          </div>

          {/* Image Placeholder */}
          <div 
            className={cn(
              'relative aspect-[4/3] overflow-hidden lg:order-1 transition-all duration-1000 bg-cream/10',
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-cream/20 rounded-sm flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-cream/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Fabrication</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
