'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function WarehouseSection() {
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
    <section ref={ref} className="bg-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div 
            className={cn(
              'relative aspect-[4/3] overflow-hidden transition-all duration-1000',
              isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          >
            <Image
              src="https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/cfa4c553-1dd4-42dd-8576-0bc47ec25447/Eclectic+Hive-Carrie+King+Photographer-199.jpg"
              alt="Eclectic Hive Warehouse"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div>
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '200ms' }}
            >
              Warehouse
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.12em] font-semibold uppercase text-charcoal transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '300ms' }}
            >
              The Hive Signature Collection
            </h2>
            <p 
              className={cn(
                'mt-6 text-charcoal/70 leading-relaxed transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '400ms' }}
            >
              Our warehouse houses the Signature Collection—a curated inventory of 
              proprietary lounge furniture, decor, and accessories designed and 
              fabricated by our studio.
            </p>
            <p 
              className={cn(
                'mt-4 text-charcoal/70 leading-relaxed transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '500ms' }}
            >
              Modern but timeless. Everything in the collection is designed to be 
              complimentary while standing on its own—pieces that work together or 
              apart to create environments with intention.
            </p>
            <div 
              className={cn(
                'mt-8 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '600ms' }}
            >
              <Link 
                href="/collection"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-colors group"
              >
                <span>Browse the Collection</span>
                <span className="w-8 h-px bg-charcoal group-hover:w-12 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
