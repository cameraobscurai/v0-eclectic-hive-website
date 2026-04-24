'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Product cards with styling variations
const stylingVariations = [
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%281%29-nSfwPSIy0JjTuxEeXqqKmBeVK5W0e2.png", 
    name: "Sylvanus Green & Ash Sofa",
    description: "Channel tufting with walnut frame"
  },
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%282%29-1p8c5ii3LgfQWQxmATwpzo3ElFTAap.png", 
    name: "Lindt Toffee Velvet Sofa",
    description: "Channel tufted velvet"
  },
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_25%20AM%20%283%29-xSRvEAB09wEKncke2QV6KBxrin22oF.png", 
    name: "Sidony Wood + White Loveseat",
    description: "Teak frame with linen cushions"
  },
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_26%20AM%20%284%29-K8Hfw7Dh32EW9v4TuBPC6dq9jQmBUQ.png", 
    name: "Reshma Botanical Sofa",
    description: "Sculptural botanical print"
  },
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_26%20AM%20%285%29-d7Z9qslCN4o22G8oq8xcBpSwIYr5lh.png", 
    name: "Ava Sage Velvet Chair",
    description: "Mid-century sculptural arms"
  },
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_27%20AM%20%286%29-rBSgl4ESRhpXEk7GlhbWLDBDp2EnYf.png", 
    name: "Benecio Leather Knit Chair",
    description: "Woven leather with iron frame"
  },
  { 
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2007_33_27%20AM%20%287%29-JlktV9arzGZUW84YXqm0s5MrccZaip.png", 
    name: "Alora Botanical Chair",
    description: "Sculptural botanical upholstery"
  },
]

// Dinnerware collections
const dinnerware = [
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%283%29-ISawYAP157izouDbFgfnV2fKubjwQQ.png", alt: "Grey botanical speckle" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%281%29-VwfITiRdTSCrFbSP4c2A7fZG6DVZxD.png", alt: "Sage marble fluted" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%284%29-1T6kh8prKXIs1wYtSGCMq96AUqaK0Q.png", alt: "Navy botanical mixed" },
]

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

// Filmstrip carousel for product cards
function ProductFilmstrip({ items }: { items: typeof stylingVariations }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
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
    <div className="relative">
      {/* Navigation */}
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

      {/* Filmstrip */}
      <div 
        ref={scrollRef}
        className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 lg:px-12"
      >
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              'relative flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[55vw] snap-center transition-all duration-500 text-left',
              i === activeIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-40 scale-[0.97] hover:opacity-60'
            )}
          >
            <div className="relative aspect-[4/3] bg-[#f8f7f5] overflow-hidden shadow-2xl shadow-black/30">
              <Image
                src={item.src}
                alt={`${item.name} - Styling Variations`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 85vw, 55vw"
              />
            </div>
            <div className={cn(
              'mt-4 transition-opacity duration-300',
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            )}>
              <p className="text-cream text-lg font-light">{item.name}</p>
              <p className="text-cream/50 text-sm mt-1">{item.description}</p>
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
  )
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
    <section ref={ref} id="the-fabrication" className="bg-charcoal text-cream">
      {/* Section Header - Light background intro */}
      <div className="bg-cream text-charcoal px-6 lg:px-12 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-mono text-xs text-charcoal/40">03</span>
            <div className="w-12 h-px bg-charcoal/20" />
          </div>
          <h2 
            className={cn(
              'font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light uppercase transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            The Fabrication
          </h2>
          <p 
            className={cn(
              'mt-6 text-charcoal/60 text-lg max-w-2xl transition-all duration-700 delay-100',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Design. Customize. Fabricate. Each piece can be tailored—different rugs, 
            pillows, fabrics. This isn&apos;t rental inventory. It&apos;s a starting point for your vision.
          </p>
        </div>
      </div>

      {/* Signature Seating - Dark filmstrip */}
      <div className="py-16 lg:py-24">
        <div className="px-6 lg:px-12 mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/40">Signature Seating</p>
          <p className="text-cream/60 mt-2 max-w-lg">
            Each piece shown with rug and pillow variations. Fabrics can change. Dimensions can adapt.
          </p>
        </div>
        <ProductFilmstrip items={stylingVariations} />
      </div>

      {/* Dinnerware - Light section */}
      <div className="bg-cream text-charcoal py-16 lg:py-24">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal/40 mb-2">Tableware Collections</p>
          <p className="text-charcoal/60 mb-8 max-w-lg">
            Curated dinnerware sets designed to complement any tablescape aesthetic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dinnerware.map((item, i) => (
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
      </div>

      {/* Process Statement */}
      <div className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-cream/40 text-xs uppercase tracking-[0.3em] mb-6">Our Process</p>
          <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl tracking-wide font-light leading-relaxed">
            &ldquo;This isn&apos;t mass production—it&apos;s craft at scale. Every piece carries the 
            signature of our process and the mark of deliberate making.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  )
}
