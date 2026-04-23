'use client'

import Image from 'next/image'
import { useRef, useState, useEffect, useCallback } from 'react'

// Figma-style numbered section header
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="text-[10px] text-charcoal/40 font-mono">{number}</span>
      <span className="text-[10px] uppercase tracking-wide text-charcoal/60">{label}</span>
    </div>
  )
}

// Individual product card with subtle border
function ProductCard({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string
  alt: string
  className?: string 
}) {
  return (
    <div className={`relative bg-[#f8f7f5] border border-charcoal/5 overflow-hidden group ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  )
}

// Process step with arrow
function ProcessStep({ 
  label, 
  isLast = false 
}: { 
  label: string
  isLast?: boolean 
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-24 bg-charcoal/5 border border-charcoal/10 flex items-center justify-center">
        <span className="text-[9px] uppercase tracking-wide text-charcoal/50">{label}</span>
      </div>
      {!isLast && (
        <svg className="w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </div>
  )
}

// Color/material swatch
function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="w-10 h-10 rounded-full border border-charcoal/10"
        style={{ backgroundColor: color }}
      />
      <span className="text-[8px] uppercase tracking-wide text-charcoal/40">{label}</span>
    </div>
  )
}

// Horizontal scroll carousel with navigation
function HorizontalCarousel({ 
  children, 
  itemCount,
  accentColor = '#c4a962'
}: { 
  children: React.ReactNode
  itemCount: number
  accentColor?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const itemWidth = scrollWidth / itemCount
    const newIndex = Math.round(scrollLeft / itemWidth)
    setActiveIndex(newIndex)
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }, [itemCount])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return
    const itemWidth = scrollRef.current.scrollWidth / itemCount
    scrollRef.current.scrollTo({ left: itemWidth * index, behavior: 'smooth' })
  }

  const scrollPrev = () => scrollTo(Math.max(0, activeIndex - 1))
  const scrollNext = () => scrollTo(Math.min(itemCount - 1, activeIndex + 1))

  return (
    <div className="relative">
      {/* Navigation arrows */}
      <div className="absolute -top-12 right-0 flex items-center gap-3 z-10">
        <button 
          onClick={scrollPrev}
          disabled={!canScrollLeft}
          className="w-8 h-8 flex items-center justify-center border border-charcoal/20 hover:border-charcoal/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button 
          onClick={scrollNext}
          disabled={!canScrollRight}
          className="w-8 h-8 flex items-center justify-center border border-charcoal/20 hover:border-charcoal/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Scroll container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory"
      >
        {children}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: itemCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className="group p-1"
            aria-label={`Go to item ${i + 1}`}
          >
            <div 
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: activeIndex === i ? '24px' : '8px',
                backgroundColor: activeIndex === i ? accentColor : 'rgba(26, 26, 26, 0.15)'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function VisualSystemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-cream border-t border-charcoal/10"
    >
      <div className="container-padding max-w-[1600px] mx-auto">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] uppercase tracking-wide text-charcoal/40 mb-4">
            Design + Production
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-display text-charcoal">
            Visual System
          </h2>
        </div>

        {/* Main Grid - Figma-style layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          
          {/* Row 1: Isometric Views + Exploded View */}
          <div className="col-span-12 lg:col-span-8 border-b border-charcoal/10 pb-8 mb-8 lg:border-b-0 lg:pb-0 lg:mb-0 lg:border-r lg:pr-8">
            <SectionLabel number="01" label="Isometric Views" />
            <div className="grid grid-cols-3 gap-3">
              <ProductCard 
                src="/images/atelier/sidony-loveseat.png" 
                alt="Sidony Wood + White Loveseat"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/green-channel-sofa.png" 
                alt="Green Channel Tufted Sofa"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/iron-bench.png" 
                alt="Black Iron Bench"
                className="aspect-square"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <SectionLabel number="04" label="Exploded View" />
            <ProductCard 
              src="/images/atelier/sidony-loveseat.png" 
              alt="Sidony construction detail"
              className="aspect-[4/5]"
            />
          </div>

          {/* Row 2: Top View (Furniture) */}
          <div className="col-span-12 lg:col-span-8 border-t border-charcoal/10 pt-8 mt-4 lg:border-r lg:pr-8">
            <SectionLabel number="02" label="Top View" />
            <div className="grid grid-cols-3 gap-3">
              <ProductCard 
                src="/images/atelier/rosalind-banquette.png" 
                alt="Rosalind Cream Velvet Banquette - top view"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/black-cane-chair.png" 
                alt="Black Cane Chair - top view"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/ava-sage-chair.png" 
                alt="Ava Sage Velvet Chair"
                className="aspect-square"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="05" label="Material Cues" />
            <div className="grid grid-cols-5 gap-6 py-8">
              <div className="aspect-square bg-gradient-to-br from-[#c9b99a] to-[#a89070] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#e8e4df] to-[#d4cdc4] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#f5f3f0] to-[#e8e2da] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#c4a962] to-[#9a7f3c] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#5a6b4a] to-[#3d4a32] rounded" />
            </div>
            <div className="grid grid-cols-5 gap-6 text-center">
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Oak</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Linen</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Plaster</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Brass</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Sage</span>
            </div>
          </div>

          {/* Row 2b: Tableware System - Full Width */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="02b" label="Tableware Collections" />
            <div className="relative aspect-[16/7] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_13_08%20AM-cuAv2o9C6y11pcarZNqzqEKYnyIjcT.png"
                alt="Complete tableware system - place settings, dinnerware, flatware, glassware, serving pieces"
                fill
                className="object-contain p-6"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Row 2c: Dinnerware + Glassware Grid */}
          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:border-r md:pr-4">
            <SectionLabel number="02c" label="Dinnerware" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%282%29-0zX2cuKc6paMuf77FLcquXFUaTAiZ7.png"
                alt="Dinnerware stacks - navy, white, marble, scalloped collections"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:pl-4">
            <SectionLabel number="02d" label="Glassware" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_18_29%20AM-c2Qro4enKvZSCX7hpsrqDk1WuhS1em.png"
                alt="Glassware collections - amber, crystal, blush, sage, clear stemware"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Row 2e: Flatware + Lighting */}
          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:border-r md:pr-4">
            <SectionLabel number="02e" label="Flatware" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_18_34%20AM-RzlhofmL5EQTqjDOAgEo8oBNqr61I2.png"
                alt="Flatware collections - bone, tortoise, copper, gold, steel finishes"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:pl-4">
            <SectionLabel number="02f" label="Lighting" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_22_22%20AM-OmoDdFeniqqk82l8iegQh31luyI75r.png"
                alt="Lighting collection - table lamps, floor lamps, lanterns, votives"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Row 3: Palette + Finishes */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="03" label="Palette + Finishes" />
            <div className="flex flex-wrap gap-6 md:gap-10 py-4">
              <Swatch color="#f5f2ed" label="Cream" />
              <Swatch color="#d4cdc4" label="Sand" />
              <Swatch color="#c9b99a" label="Oak" />
              <Swatch color="#5a6b4a" label="Sage" />
              <Swatch color="#c4a962" label="Mustard" />
              <Swatch color="#4a3728" label="Espresso" />
              <Swatch color="#1a1a1a" label="Black" />
            </div>
          </div>

          {/* Row 4: Dinnerware Variations */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="04" label="Dinnerware Variations" />
            <HorizontalCarousel itemCount={3} accentColor="#5a6b4a">
              {[
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%283%29-ISawYAP157izouDbFgfnV2fKubjwQQ.png", alt: "Dinnerware set - grey, botanical, speckle" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%281%29-VwfITiRdTSCrFbSP4c2A7fZG6DVZxD.png", alt: "Dinnerware set - sage, marble, fluted" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%284%29-1T6kh8prKXIs1wYtSGCMq96AUqaK0Q.png", alt: "Dinnerware set - navy, botanical, mixed" },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="relative flex-shrink-0 w-[400px] md:w-[500px] aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden snap-start"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-contain p-4"
                    sizes="500px"
                  />
                </div>
              ))}
            </HorizontalCarousel>
          </div>

          {/* Row 5: Styling Variations - Shows customization possibilities */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="05" label="Styling Variations" />
            <HorizontalCarousel itemCount={7} accentColor="#c4a962">
              {[
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%281%29-nSfwPSIy0JjTuxEeXqqKmBeVK5W0e2.png", 
                  name: "Sylvanus Green & Ash Sofa"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%282%29-1p8c5ii3LgfQWQxmATwpzo3ElFTAap.png", 
                  name: "Lindt Toffee Velvet Channel Tufted Sofa"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%283%29-xSRvEAB09wEKncke2QV6KBxrin22oF.png", 
                  name: "Sidony Wood + White Loveseat"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_26%20AM%20%284%29-K8Hfw7Dh32EW9v4TuBPC6dq9jQmBUQ.png", 
                  name: "Reshma Botanical Sculptural Sofa"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_26%20AM%20%285%29-d7Z9qslCN4o22G8oq8xcBpSwIYr5lh.png", 
                  name: "Ava Sage Velvet Chair"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_27%20AM%20%286%29-rBSgl4ESRhpXEk7GlhbWLDBDp2EnYf.png", 
                  name: "Benecio Leather Knit Chair"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_27%20AM%20%287%29-JlktV9arzGZUW84YXqm0s5MrccZaip.png", 
                  name: "Alora Botanical Sculptural Chair"
                },
              ].map((piece, i) => (
                <div 
                  key={i}
                  className="relative flex-shrink-0 w-[600px] md:w-[720px] lg:w-[840px] group snap-start"
                >
                  <div className="relative aspect-[4/3] bg-[#f8f7f5] overflow-hidden">
                    <Image
                      src={piece.src}
                      alt={`${piece.name} - Styling Variations`}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                      sizes="840px"
                    />
                  </div>
                </div>
              ))}
            </HorizontalCarousel>
          </div>

        </div>
      </div>
    </section>
  )
}
