'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TextReveal, FadeUp } from '@/components/animations/text-reveal'
import { cn } from '@/lib/utils'

const caseStudies = [
  {
    id: 'aspen-summit',
    title: 'Aspen Summit',
    type: 'Corporate Retreat',
    scope: 'Design, Fabrication, Production',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'gallery-nocturne',
    title: 'Gallery Nocturne',
    type: 'Private Celebration',
    scope: 'Full Environment Design',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
  },
]

function CaseStudyCard({ 
  study, 
  index 
}: { 
  study: typeof caseStudies[0]
  index: number
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <Link 
      ref={ref}
      href={`/gallery/${study.id}`}
      className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div 
        className={cn(
          'aspect-[16/10] relative overflow-hidden transition-all duration-1000',
          isEven ? 'lg:col-span-7' : 'lg:col-span-7 lg:col-start-6 lg:order-2',
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        )}
        style={{ transitionDelay: '100ms' }}
      >
        {/* Image reveal overlay */}
        <div 
          className="absolute inset-0 bg-background z-10 origin-bottom transition-transform duration-1000"
          style={{
            transform: isInView ? 'scaleY(0)' : 'scaleY(1)',
            transitionDelay: '200ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        <Image
          src={study.image}
          alt={study.title}
          fill
          className={cn(
            'object-cover transition-transform duration-700',
            isHovered ? 'scale-105' : 'scale-100'
          )}
        />
        {/* Subtle overlay on hover */}
        <div 
          className={cn(
            'absolute inset-0 bg-charcoal/0 transition-colors duration-500',
            isHovered && 'bg-charcoal/10'
          )}
        />
      </div>
      
      {/* Info */}
      <div 
        className={cn(
          'flex flex-col justify-center transition-all duration-1000',
          isEven ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-4 lg:order-1',
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
        style={{ transitionDelay: '300ms' }}
      >
        <span className="text-xs text-muted-foreground mb-5 tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 
          className={cn(
            'font-serif text-2xl lg:text-3xl tracking-tight transition-colors duration-300',
            isHovered ? 'text-terracotta' : 'text-foreground'
          )}
        >
          {study.title}
        </h3>
        <div className="mt-5 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{study.type}</p>
          <p className="text-sm text-muted-foreground">{study.scope}</p>
        </div>
        <div className="mt-8">
          <span 
            className={cn(
              'text-xs uppercase tracking-[0.15em] transition-colors duration-300 relative inline-block',
              isHovered ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            View Project
            <span 
              className={cn(
                'absolute -bottom-1 left-0 w-full h-px bg-foreground/30 origin-left transition-transform duration-500',
                isHovered ? 'scale-x-100' : 'scale-x-0'
              )}
            />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function CaseStudiesSection() {
  return (
    <section className="bg-background py-28 lg:py-44">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <div className="lg:col-span-3">
            <FadeUp>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Selected Work
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
              Environments we have authored
            </TextReveal>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <FadeUp delay={0.3}>
              <Link 
                href="/gallery"
                className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group"
              >
                <span className="relative">
                  View Gallery
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
        
        {/* Case Studies */}
        <div className="flex flex-col gap-20 lg:gap-32">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
