'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { TextReveal, FadeUp } from '@/components/animations/text-reveal'
import { ImageReveal } from '@/components/animations/scroll-section'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { cn } from '@/lib/utils'

const processSteps = [
  { number: '01', title: 'Discovery', description: 'Understanding vision, context, and constraints' },
  { number: '02', title: 'Concept', description: 'Design direction and material exploration' },
  { number: '03', title: 'Development', description: 'Fabrication, sampling, and refinement' },
  { number: '04', title: 'Realization', description: 'Production, installation, and execution' },
]

function ProcessStep({ 
  step, 
  index,
  isInView 
}: { 
  step: typeof processSteps[0]
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={cn(
        'py-7 border-b border-border flex gap-6 lg:gap-8 cursor-pointer transition-all duration-500 ease-out',
        isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      )}
      style={{ transitionDelay: `${200 + index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={cn(
        'text-xs w-8 tabular-nums transition-colors duration-300',
        isHovered ? 'text-terracotta' : 'text-muted-foreground'
      )}>
        {step.number}
      </span>
      <div>
        <h3 className={cn(
          'font-serif text-xl tracking-tight transition-colors duration-300',
          isHovered ? 'text-terracotta' : 'text-foreground'
        )}>
          {step.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
      </div>
    </div>
  )
}

// Check for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return prefersReducedMotion
}

export function ProcessPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (prefersReducedMotion) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      // Smoother trigger
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section className="bg-secondary py-28 lg:py-44">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Image */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <ImageReveal direction="left">
                <ImagePlaceholder 
                  aspectRatio="portrait"
                  label="Process"
                />
              </ImageReveal>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div ref={ref} className="lg:col-span-6 lg:col-start-7">
            <FadeUp>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
                Working With The Hive
              </p>
            </FadeUp>
            
            <TextReveal
              as="h2"
              className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight"
              splitBy="word"
              stagger={0.04}
            >
              From vision to realization
            </TextReveal>
            
            <FadeUp delay={0.2}>
              <p className="mt-10 text-muted-foreground leading-relaxed max-w-lg text-base lg:text-lg">
                Our process is designed to honor both creative ambition and practical 
                reality. We guide clients through a structured journey that transforms 
                initial vision into authored environment.
              </p>
            </FadeUp>
            
            {/* Process Steps */}
            <div className="mt-14 lg:mt-18 border-t border-border">
              {processSteps.map((step, index) => (
                <ProcessStep 
                  key={step.number} 
                  step={step} 
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
            
            <FadeUp delay={0.6}>
              <div className="mt-14">
                <Link 
                  href="/process"
                  className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group"
                >
                  <span className="relative">
                    Learn About Our Process
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
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
