'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Product placeholder data
const products = [
  { name: 'Sylvanus Green & Ash Sofa', description: 'Channel tufting with walnut frame' },
  { name: 'Lindt Toffee Velvet Sofa', description: 'Channel tufted velvet' },
  { name: 'Sidony Wood + White Loveseat', description: 'Teak frame with linen cushions' },
  { name: 'Reshma Botanical Sofa', description: 'Sculptural botanical print' },
  { name: 'Ava Sage Velvet Chair', description: 'Mid-century sculptural arms' },
]

// Dark-themed placeholder frame for charcoal sections
function DarkImageFrame({ 
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
        'relative bg-cream/[0.03] border border-cream/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-cream/15" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-cream/15" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-cream/15" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-cream/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-cream/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-cream/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-cream/30 font-mono">{label}</span>
        </div>
      )}
    </div>
  )
}

// Light-themed placeholder frame
function LightImageFrame({ 
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
        'relative bg-charcoal/[0.02] border border-charcoal/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-charcoal/15" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-charcoal/15" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-charcoal/15" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-charcoal/15" />
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

export function TheFabricationSection() {
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
      { threshold: 0.02 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <section ref={ref} id="the-fabrication">
      {/* Section Header - Light background */}
      <div className="bg-cream section-padding py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 lg:col-span-5">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-xs text-charcoal/40">03</span>
                <div className="w-12 h-px bg-charcoal/20" />
              </div>
              <h2 
                className={cn(
                  'font-brand text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] uppercase text-charcoal transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ fontWeight: 400 }}
              >
                The Fabrication
              </h2>
              <p 
                className={cn(
                  'mt-6 text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-700 delay-100',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                Each piece can be tailored. This isn&apos;t rental inventory—it&apos;s a starting point.
              </p>
            </div>
            
            {/* Process visualization */}
            <div className="col-span-12 lg:col-span-7">
              <div 
                className={cn(
                  'grid grid-cols-3 gap-4 transition-all duration-700 delay-200',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
              >
                <div className="text-center">
                  <LightImageFrame aspectRatio="1/1" label="Design" />
                  <p className="text-xs uppercase tracking-[0.12em] text-charcoal/40 mt-3">01 Design</p>
                </div>
                <div className="text-center">
                  <LightImageFrame aspectRatio="1/1" label="Customize" />
                  <p className="text-xs uppercase tracking-[0.12em] text-charcoal/40 mt-3">02 Customize</p>
                </div>
                <div className="text-center">
                  <LightImageFrame aspectRatio="1/1" label="Fabricate" />
                  <p className="text-xs uppercase tracking-[0.12em] text-charcoal/40 mt-3">03 Fabricate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Seating - Dark section */}
      <div className="bg-charcoal text-cream py-24 lg:py-32">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Signature Seating</p>
          </div>
          
          {/* Horizontal scroll filmstrip */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
            {products.map((product, i) => (
              <div key={i} className="flex-shrink-0 w-[75vw] md:w-[50vw] lg:w-[35vw]">
                <DarkImageFrame aspectRatio="4/3" label={`Product ${i + 1}`} />
                <div className="mt-4">
                  <p className="text-cream text-base lg:text-lg">{product.name}</p>
                  <p className="text-cream/50 text-sm mt-1">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableware - Light section */}
      <div className="bg-cream section-padding py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Tableware Collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LightImageFrame aspectRatio="16/10" label="Collection 01" />
            <LightImageFrame aspectRatio="16/10" label="Collection 02" />
            <LightImageFrame aspectRatio="16/10" label="Collection 03" />
          </div>
        </div>
      </div>

      
    </section>
  )
}
