'use client'

import { useState, useEffect, useRef, lazy, Suspense, useMemo } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
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

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json())

// Category display names mapping
const CATEGORY_DISPLAY: Record<string, string> = {
  'All': 'All Pieces',
  'Seating': 'Lounge Seating',
  'Tables': 'Tables',
  'Bars': 'Cocktail & Bar',
  'Large Decor & Dividers': 'Large Decor',
  'Lighting': 'Lighting',
  'Chandeliers': 'Chandeliers',
  'Styling': 'Styling',
  'Serveware': 'Serveware',
  'Storage': 'Storage',
  'Candlelight': 'Candlelight',
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
  // SWR for products - cached, instant on revisit
  const { data: productsData } = useSWR('/api/products', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache for 1 minute
  })
  
  // SWR for categories - cached
  const { data: categoriesData } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  })
  
  const products: Product[] = productsData?.products || []
  const categories: string[] = categoriesData?.categories || ['All']
  const isLoading = !productsData
  
  // Compute category counts (only for products with images)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All': 0 }
    products.filter(p => p.primary_image_url).forEach(p => {
      counts['All']++
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [products])
  
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [viewer3DReady, setViewer3DReady] = useState(false)
  
  // Carousel refs
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Initialize on mount
  useEffect(() => {
    setLoaded(true)
    const timer = setTimeout(() => setViewer3DReady(true), 600)
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
    // Only show products with images
    let results = products.filter(p => p.primary_image_url)
    
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
  


  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      
      {/* ─────────────────────────────────────────────────────────────
          Category Navigation - Horizontal Pills
      ───────────────────────────────────────────────────────────── */}
      <section className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-charcoal/10">
        <div className="px-6 lg:px-12">
          {/* Category pills - scrollable on mobile */}
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <nav className="flex items-center gap-1 lg:gap-2" role="tablist" aria-label="Product categories">
              {['All', ...categories.filter(c => c !== 'All' && categoryCounts[c] > 0)].map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 text-xs tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200",
                    activeCategory === cat 
                      ? "text-charcoal font-medium" 
                      : "text-charcoal/50 hover:text-charcoal/80"
                  )}
                >
                  <span>{CATEGORY_DISPLAY[cat] || cat}</span>
                  <span className={cn(
                    "text-[10px] tabular-nums",
                    activeCategory === cat ? "text-charcoal/60" : "text-charcoal/30"
                  )}>
                    {categoryCounts[cat] || 0}
                  </span>
                  {/* Active indicator */}
                  {activeCategory === cat && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-charcoal" />
                  )}
                </button>
              ))}
            </nav>
            
            {/* Spacer */}
            <div className="flex-1 min-w-4" />
            
            {/* Search */}
            <div className="relative flex-shrink-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-8 py-2 text-xs tracking-wide bg-white/50 border border-charcoal/10 focus:border-charcoal/30 focus:bg-white focus:outline-none transition-all w-[140px] lg:w-[200px] placeholder:text-charcoal/30"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Search results indicator */}
        {searchQuery && (
          <div className="px-6 lg:px-12 py-2 bg-sand/30 border-b border-charcoal/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal/60">
                {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-charcoal/50 hover:text-charcoal underline underline-offset-2"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
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
