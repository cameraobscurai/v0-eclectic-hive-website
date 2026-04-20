'use client'

import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Product type from Supabase
type Product = {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  display_type: string
  is_featured?: boolean
}

// Lazy load 3D viewer
const InlineProductViewer = lazy(() => 
  import('@/components/product-viewer-3d').then(mod => ({ default: mod.InlineProductViewer }))
)

// Type for Blob files
type BlobFile = { pathname: string; url: string }

// 3D Model - using the working model from the project
const HERO_MODEL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb'

export default function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'category' | null>(null)
  const [viewer3DReady, setViewer3DReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Carousel refs
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Fetch products and categories from Supabase
  useEffect(() => {
    setLoaded(true)
    const timer = setTimeout(() => setViewer3DReady(true), 600)
    
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories)
      })
      .catch(console.error)
    
    // Fetch all products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.products) setProducts(data.products)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
    
    return () => clearTimeout(timer)
  }, [])
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Get image URL - use Blob URL if available
  const getImageUrl = (product: Product): string => {
    if (product.primary_image_url) {
      // If it's a Blob pathname, use the API route
      if (product.primary_image_url.startsWith('inventory/')) {
        return `/api/inventory-image?pathname=${encodeURIComponent(product.primary_image_url)}`
      }
      return product.primary_image_url
    }
    // Placeholder for items without images
    return '/placeholder-product.jpg'
  }
  
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
    let results = products
    
    // Category filter
    if (activeCategory !== 'All') {
      results = results.filter(p => p.category === activeCategory)
    }
    
    // Search filter with scoring
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim()
      results = results
        .map(p => {
          let score = 0
          const name = p.name.toLowerCase()
          if (name === q) score = 100
          else if (name.startsWith(q)) score = 80
          else if (name.includes(q)) score = 60
          else if (p.category.toLowerCase().includes(q)) score = 40
          return { ...p, _score: score }
        })
        .filter(p => p._score > 0)
        .sort((a, b) => b._score - a._score)
    }
    
    return results
  }, [products, activeCategory, debouncedSearch])
  
  // Check if any filters active
  const hasActiveFilters = activeCategory !== 'All' || searchQuery.trim()
  
  // Clear all filters
  const clearAllFilters = () => {
    setActiveCategory('All')
    setSearchQuery('')
  }

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
      
      {/* ────────────────────────────────────────────────────�������────────
          Filter & Search Bar
      ───────────────────────────────────────────────────────────── */}
      <section className="py-4 px-6 lg:px-12 bg-cream border-y border-charcoal/10">
        {/* Click outside to close dropdowns */}
        {openDropdown && (
          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
        )}
        
        <div className="flex flex-col gap-4">
          {/* Top row: Filters + Search + Count */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                className={cn(
                  "flex items-center gap-2 text-xs uppercase tracking-[0.15em] py-2 px-3 border transition-colors min-w-[140px] justify-between",
                  activeCategory !== 'All' 
                    ? "border-charcoal bg-charcoal text-cream" 
                    : "border-charcoal/20 text-charcoal hover:border-charcoal/40"
                )}
              >
                <span>{activeCategory === 'All' ? 'Category' : activeCategory}</span>
                <svg className={cn("w-3 h-3 transition-transform", openDropdown === 'category' && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {openDropdown === 'category' && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-charcoal/10 shadow-lg z-50 min-w-[160px] max-h-[400px] overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setOpenDropdown(null) }}
                      className={cn(
                        "block w-full text-left px-4 py-2.5 text-xs uppercase tracking-[0.1em] transition-colors",
                        activeCategory === cat ? "bg-charcoal text-cream" : "text-charcoal hover:bg-sand/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Search Input */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-8 py-2 text-xs tracking-wide bg-transparent border border-charcoal/20 focus:border-charcoal/40 focus:outline-none transition-colors w-[160px] lg:w-[200px] placeholder:text-charcoal/30"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Count */}
            <span className="text-[10px] tracking-[0.1em] text-charcoal/40 whitespace-nowrap">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            </span>
          </div>
          
          {/* Active filters row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {activeCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-charcoal/5 text-[10px] uppercase tracking-[0.1em] text-charcoal">
                  {activeCategory}
                  <button onClick={() => setActiveCategory('All')} className="hover:text-charcoal/60">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-charcoal/5 text-[10px] tracking-[0.1em] text-charcoal">
                  &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="hover:text-charcoal/60">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button 
                onClick={clearAllFilters}
                className="text-[10px] uppercase tracking-[0.1em] text-charcoal/50 hover:text-charcoal underline underline-offset-2 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Product Grid
      ───────────────────────────────────────────────────────────── */}
      <section className="px-4 lg:px-8 py-8 bg-cream">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/50">Loading collection...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => {
              const row = Math.floor(i / 4)
              const delay = Math.min(row * 80, 400)
              
              return (
              <div
                key={product.id || `${product.name}-${i}`}
                className={cn(
                  "group cursor-pointer transition-all duration-500 ease-out",
                  loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Image container */}
                <div className="aspect-square bg-[#D4D0CB] overflow-hidden">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                
                {/* Info */}
                <div className="pt-4">
                  <h3 className="text-[11px] tracking-[0.1em] text-charcoal font-medium uppercase">
                    {product.name}
                  </h3>
                  <p className="text-[10px] tracking-[0.05em] text-charcoal/40 uppercase mt-0.5">
                    {product.category}
                  </p>
                </div>
              </div>
              )
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/50 mb-4">No pieces found matching your search.</p>
            <button
              onClick={clearAllFilters}
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
          {products.filter(p => p.primary_image_url).slice(0, 12).map((product, i) => (
            <div
              key={`featured-${product.id || i}`}
              className="group flex-shrink-0 w-[160px] lg:w-[180px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="relative aspect-[3/4] bg-[#E8E4DF] mb-2 overflow-hidden">
                <Image
                  src={getImageUrl(product)}
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
      ─────────────────────────────────���─────────────────────────── */}
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
