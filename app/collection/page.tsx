'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { INVENTORY, NEW_ARRIVALS, CATEGORIES, type Category } from '@/lib/inventory-data'

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loaded, setLoaded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Carousel
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    setLoaded(true)
  }, [])
  
  // Track carousel scroll position
  const checkScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }
  
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])
  
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const amount = carouselRef.current.clientWidth * 0.6
    carouselRef.current.scrollBy({ 
      left: direction === 'left' ? -amount : amount, 
      behavior: 'smooth' 
    })
  }

  // Filter products
  const filteredProducts = activeCategory === 'All' 
    ? INVENTORY 
    : INVENTORY.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      {/* ─────────────────────────────────────────────────────────────
          Page Header
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-6 px-6 lg:px-12">
        <h1 
          className={cn(
            'font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light uppercase text-charcoal transition-all duration-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          Hive Signature Collection
        </h1>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          New Arrivals Carousel
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6 border-y border-charcoal/10 bg-white">
        <div className="flex items-center justify-between px-6 lg:px-12 mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50">New Arrivals</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              disabled={!canScrollLeft}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                canScrollLeft 
                  ? "border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-cream" 
                  : "border-charcoal/10 text-charcoal/20 cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              disabled={!canScrollRight}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                canScrollRight 
                  ? "border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-cream" 
                  : "border-charcoal/10 text-charcoal/20 cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          ref={carouselRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {NEW_ARRIVALS.map((product, i) => (
            <div
              key={`arrival-${i}`}
              className="group flex-shrink-0 w-[140px] lg:w-[160px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-square bg-[#E8E4DF] mb-2 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
              <p className="text-[9px] tracking-[0.1em] text-charcoal/60 group-hover:text-charcoal transition-colors truncate">
                {product.name}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Filter Bar - Solid background
      ───────────────────────────────────────────────────────────── */}
      <section className="py-4 px-6 lg:px-12 bg-cream border-b border-charcoal/10">
        <div className="flex items-center justify-between">
          {/* Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-charcoal hover:text-charcoal/70 transition-colors"
            >
              {activeCategory === 'All' ? 'All Categories' : activeCategory}
              <svg 
                className={cn("w-4 h-4 transition-transform", dropdownOpen && "rotate-180")} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)} 
                />
                <div className="absolute top-full left-0 mt-2 bg-white border border-charcoal/10 shadow-lg z-50 min-w-[180px]">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat)
                        setDropdownOpen(false)
                      }}
                      className={cn(
                        "block w-full text-left px-4 py-2.5 text-xs uppercase tracking-[0.1em] transition-colors",
                        activeCategory === cat 
                          ? "bg-charcoal text-cream" 
                          : "text-charcoal hover:bg-sand/50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Count */}
          <span className="text-[10px] tracking-[0.1em] text-charcoal/40">
            {filteredProducts.length} pieces
          </span>
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Product Grid
      ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px]">
          {filteredProducts.map((product, i) => (
            <div
              key={`${product.name}-${i}`}
              className={cn(
                "group cursor-pointer transition-all duration-500",
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${Math.min(i * 30, 300)}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#E8E4DF] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              
              {/* Info */}
              <div className="py-3">
                <h3 className="text-[11px] tracking-[0.1em] text-charcoal font-medium uppercase">
                  {product.name}
                </h3>
                <p className="text-[10px] tracking-[0.05em] text-charcoal/40 uppercase mt-0.5">
                  {product.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 border-t border-charcoal/10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-charcoal/60 mb-6">
            Looking for something specific? Our team can help you find the perfect pieces for your event.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
