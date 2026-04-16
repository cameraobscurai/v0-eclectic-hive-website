'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
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

          {/* Image */}
          <div 
            className={cn(
              'relative aspect-[4/3] overflow-hidden lg:order-1 transition-all duration-1000',
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          >
            <Image
              src="https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/cfa4c553-1dd4-42dd-8576-0bc47ec25447/Eclectic+Hive-Carrie+King+Photographer-199.jpg"
              alt="Eclectic Hive Fabrication"
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
