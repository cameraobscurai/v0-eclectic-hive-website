'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TextReveal, FadeUp } from '@/components/animations/text-reveal'
import { cn } from '@/lib/utils'

const collections = [
  {
    title: 'Lounge Seating',
    description: 'Sofas, loveseats, and settees for intimate conversation',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1594831234569-DQHY14SQPKC1YFTQMBQO/Indiwin+Black+Leather+Sofa.jpg',
  },
  {
    title: 'Accent Chairs',
    description: 'Statement seating that anchors any environment',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1594831392162-9C1WQFB7F5QQ6V0YGYQG/Brooklyn+Plush+Charcoal+Sofa.jpg',
  },
  {
    title: 'Tables & Surfaces',
    description: 'Coffee tables, consoles, and display surfaces',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173430989-DJBQ2XQRLRX3NXMQQL9M/Banks+%2B+Leaf+Denver.jpg',
  },
]

function CollectionCard({ 
  collection, 
  index 
}: { 
  collection: typeof collections[0]
  index: number 
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Link 
      ref={ref}
      href="/atelier"
      className={cn(
        'group block transition-all duration-1000',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden mb-6">
        {/* Image reveal overlay */}
        <div 
          className="absolute inset-0 bg-background z-10 origin-bottom transition-transform duration-1000"
          style={{
            transform: isInView ? 'scaleY(0)' : 'scaleY(1)',
            transitionDelay: `${200 + index * 150}ms`,
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        <div className={cn(
          'relative aspect-[3/4] transition-transform duration-700',
          isHovered ? 'scale-105' : 'scale-100'
        )}>
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className={cn(
              'object-cover transition-opacity duration-700',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-colors duration-500 z-20" />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 
            className={cn(
              'font-serif text-2xl tracking-tight transition-colors duration-300',
              isHovered ? 'text-terracotta' : 'text-foreground'
            )}
          >
            {collection.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </Link>
  )
}

export function CollectionsSection() {
  return (
    <section className="bg-background py-28 lg:py-44">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <div className="lg:col-span-3">
            <FadeUp>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Inventory Collections
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-6">
            <TextReveal
              as="h2"
              className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight"
              splitBy="word"
              stagger={0.04}
            >
              Proprietary pieces authored by The Hive
            </TextReveal>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <FadeUp delay={0.3}>
              <Link 
                href="/atelier"
                className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group"
              >
                <span className="relative">
                  View Inventory
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-foreground/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
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
            </FadeUp>
          </div>
        </div>
        
        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">
          {collections.map((collection, index) => (
            <CollectionCard 
              key={collection.title} 
              collection={collection} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
