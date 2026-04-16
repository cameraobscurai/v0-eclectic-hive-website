'use client'

import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { INVENTORY, NEW_ARRIVALS, CATEGORIES, type Category } from '@/lib/inventory-data'

// Lazy load 3D viewer
const InlineProductViewer = lazy(() => 
  import('@/components/product-viewer-3d').then(mod => ({ default: mod.InlineProductViewer }))
)

// 3D Models available
const HERO_MODEL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lindt_sofa-UVDdyUrLv6B2aJXqMx4xqVwcvv1TBw.glb'

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [viewer3DReady, setViewer3DReady] = useState(false)
  
  // Carousel refs
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    setLoaded(true)
    // Delay 3D viewer to avoid hydration issues
    const timer = setTimeout(() => setViewer3DReady(true), 600)
    return () => clearTimeout(timer)
  }, [])
  
  // Carousel scroll tracking
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

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let results = INVENTORY
    
    // Category filter
    if (activeCategory !== 'All') {
      results = results.filter(p => p.category === activeCategory)
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    
    return results
  }, [activeCategory, searchQuery])

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      {/* ─────────────────────────────────────────────────────────────
          Hero - Split Layout: Info Left, 3D Viewer Right
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[50vh] lg:min-h-[55vh]">
          {/* Left: Title & Intro */}
          <div className="flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-0 bg-cream">
            <p 
              className={cn(
                "text-[10px] uppercase tracking-[0.3em] text-charcoal/40 mb-4 transition-all duration-700",
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Signature Inventory
            </p>
            <h1 
              className={cn(
                'font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.2em] font-light uppercase text-charcoal mb-6 transition-all duration-700 delay-100',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Hive Signature Collection
            </h1>
            <p 
              className={cn(
                "text-sm text-charcoal/60 leading-relaxed max-w-md transition-all duration-700 delay-200",
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Curated furniture and decor pieces for extraordinary events. 
              Each item selected to elevate your design vision.
            </p>
          </div>
          
          {/* Right: 3D Viewer */}
          <div className="relative h-[40vh] lg:h-auto bg-[#d5cdc5]">
            {viewer3DReady && (
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border border-charcoal/20 border-t-charcoal/60 rounded-full animate-spin" />
                </div>
              }>
                <InlineProductViewer modelUrl={HERO_MODEL} className="w-full h-full" />
              </Suspense>
            )}
          </div>
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Filter & Search Bar
      ───────────────────────────────────────────────────────────── */}
      <section className="py-4 px-6 lg:px-12 bg-cream border-y border-charcoal/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Dropdown + Search */}
          <div className="flex items-center gap-4">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-charcoal hover:text-charcoal/70 transition-colors py-2"
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
            
            {/* Search Input */}
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-xs tracking-wide bg-transparent border border-charcoal/10 focus:border-charcoal/30 focus:outline-none transition-colors w-[180px] lg:w-[240px] placeholder:text-charcoal/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Right: Count */}
          <span className="text-[10px] tracking-[0.1em] text-charcoal/40">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Product Grid
      ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-8">
        {filteredProducts.length > 0 ? (
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
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/50 mb-4">No pieces found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="text-xs uppercase tracking-[0.15em] text-charcoal underline underline-offset-4 hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          New Arrivals Carousel - Below inventory
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-t border-charcoal/10 bg-white">
        <div className="flex items-center justify-between px-6 lg:px-12 mb-6">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50">Featured Pieces</h2>
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
          className="flex gap-3 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {NEW_ARRIVALS.map((product, i) => (
            <div
              key={`featured-${i}`}
              className="group flex-shrink-0 w-[160px] lg:w-[180px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-[3/4] bg-[#E8E4DF] mb-2 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  sizes="180px"
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
          CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 border-t border-charcoal/10 bg-cream">
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
