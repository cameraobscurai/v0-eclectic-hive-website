'use client'

import Image from 'next/image'
import { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

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

// Cinematic filmstrip for styling variations - mirrors gallery experience
function StylingFilmstrip({ 
  items 
}: { 
  items: { src: string; name: string }[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    // Each item is roughly 70vw on desktop
    const itemWidth = clientWidth * 0.75
    const newIndex = Math.round(scrollLeft / itemWidth)
    setActiveIndex(Math.min(newIndex, items.length - 1))
  }, [items.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateActiveIndex, { passive: true })
    updateActiveIndex()
    return () => el.removeEventListener('scroll', updateActiveIndex)
  }, [updateActiveIndex])

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return
    const itemWidth = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollTo({ left: itemWidth * index, behavior: 'smooth' })
  }

  return (
    <div className="relative -mx-6 lg:-mx-12">
      {/* Film strip container - dark background like gallery */}
      <div className="bg-charcoal py-12 lg:py-16">
        {/* Navigation + Counter */}
        <div className="flex items-center justify-between px-6 lg:px-12 mb-6">
          <div className="flex items-center gap-4 text-cream/40 text-xs tracking-wider font-mono">
            <span>{(activeIndex + 1).toString().padStart(2, '0')}</span>
            <span className="w-8 h-px bg-cream/20" />
            <span>{items.length.toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="w-10 h-10 flex items-center justify-center border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => scrollTo(Math.min(items.length - 1, activeIndex + 1))}
              disabled={activeIndex === items.length - 1}
              className="w-10 h-10 flex items-center justify-center border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable filmstrip */}
        <div 
          ref={scrollRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 lg:px-12"
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                'relative flex-shrink-0 w-[80vw] md:w-[65vw] lg:w-[55vw] snap-center transition-all duration-500',
                i === activeIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-40 scale-[0.97] hover:opacity-60'
              )}
            >
              <div className="relative aspect-[4/3] bg-[#f8f7f5] overflow-hidden shadow-2xl shadow-black/40">
                <Image
                  src={item.src}
                  alt={`${item.name} - Styling Variations`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 80vw, 55vw"
                />
              </div>
              {/* Product name - only show for active */}
              <div className={cn(
                'mt-4 text-left transition-opacity duration-300',
                i === activeIndex ? 'opacity-100' : 'opacity-0'
              )}>
                <p className="text-cream/80 text-sm font-light">{item.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-6 lg:px-12 mt-8">
          <div className="h-px bg-cream/10 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-sand transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
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

          {/* Row 4: Dinnerware Variations - Just show all 3, no carousel */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="04" label="Dinnerware Variations" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%283%29-ISawYAP157izouDbFgfnV2fKubjwQQ.png", alt: "Dinnerware set - grey, botanical, speckle" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%281%29-VwfITiRdTSCrFbSP4c2A7fZG6DVZxD.png", alt: "Dinnerware set - sage, marble, fluted" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%284%29-1T6kh8prKXIs1wYtSGCMq96AUqaK0Q.png", alt: "Dinnerware set - navy, botanical, mixed" },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="relative aspect-[16/10] bg-white border border-charcoal/5 overflow-hidden"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Styling Variations - Cinematic filmstrip */}
          <div className="col-span-12 pt-12 mt-8">
            <div className="mb-8">
              <SectionLabel number="05" label="Styling Variations" />
              <p className="text-charcoal/50 text-sm mt-2 max-w-lg">
                Every piece can be customized. Different rugs, pillows, and accessories to match your vision.
              </p>
            </div>
            <StylingFilmstrip 
              items={[
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%281%29-nSfwPSIy0JjTuxEeXqqKmBeVK5W0e2.png", name: "Sylvanus Green & Ash Sofa" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%282%29-1p8c5ii3LgfQWQxmATwpzo3ElFTAap.png", name: "Lindt Toffee Velvet Channel Tufted Sofa" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%283%29-xSRvEAB09wEKncke2QV6KBxrin22oF.png", name: "Sidony Wood + White Loveseat" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_26%20AM%20%284%29-K8Hfw7Dh32EW9v4TuBPC6dq9jQmBUQ.png", name: "Reshma Botanical Sculptural Sofa" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_26%20AM%20%285%29-d7Z9qslCN4o22G8oq8xcBpSwIYr5lh.png", name: "Ava Sage Velvet Chair" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_27%20AM%20%286%29-rBSgl4ESRhpXEk7GlhbWLDBDp2EnYf.png", name: "Benecio Leather Knit Chair" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_27%20AM%20%287%29-JlktV9arzGZUW84YXqm0s5MrccZaip.png", name: "Alora Botanical Sculptural Chair" },
              ]}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
