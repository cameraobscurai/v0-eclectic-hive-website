'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import dynamic from 'next/dynamic'
import { useQueryState, parseAsString } from 'nuqs'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// B4: Lazy-load QuickViewModal - defers large JS until actually needed
const QuickViewModal = dynamic(
  () => import('@/components/quick-view-modal').then(m => ({ default: m.QuickViewModal })),
  { ssr: false }
)

// Track broken images globally to avoid re-checking
const brokenImages = new Set<string>()

// Optimized ProductCard with loading states and click handler
function ProductCard({ 
  product, 
  imageUrl, 
  onImageError,
  onClick
}: { 
  product: Product
  imageUrl: string
  onImageError: (id: string, url: string) => void
  onClick: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  
  // Don't render if already known to be broken
  if (brokenImages.has(imageUrl)) return null
  
  const handleError = () => {
    setError(true)
    onImageError(product.id, imageUrl)
  }
  
  if (error) return null
  
  return (
    <button 
      onClick={onClick}
      className="group relative cursor-pointer border-r border-b border-charcoal/5 text-left w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-charcoal/20"
    >
      {/* Image container */}
      <div className="aspect-square bg-white p-4 lg:p-6 relative">
        {/* Skeleton placeholder */}
        {!loaded && (
          <div className="absolute inset-4 lg:inset-6 bg-neutral-100 animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className={cn(
            "w-full h-full object-contain transition-all duration-300",
            loaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
          )}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      </div>
      
      {/* Hover overlay with name + quick view hint */}
      <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm w-full py-3 px-2 text-center">
          <p className="text-[10px] tracking-[0.08em] text-charcoal uppercase truncate">
            {product.name}
          </p>
          <p className="text-[8px] tracking-[0.1em] text-charcoal/40 uppercase mt-0.5">
            Quick View
          </p>
        </div>
      </div>
    </button>
  )
}

// Product type from Supabase (with flattened variant data)
type Product = {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  display_type: string
  is_featured?: boolean
  updated_at?: string
  description?: string
  // Flattened variant data from API
  stock_count?: number
  dims_display?: string
  width_inches?: number
  depth_inches?: number
  height_inches?: number
}

// SWR fetcher with caching headers
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    next: { revalidate: 300 }, // 5 min cache
  })
  return res.json()
}

// Category display names mapping (friendly names for nav)
const CATEGORY_DISPLAY: Record<string, string> = {
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
  'Pillows': 'Pillows',
  'Rugs': 'Rugs',
  'Tableware': 'Tableware',
  'Furs & Pelts': 'Furs & Pelts',
  'Subrentals': 'Subrentals',
}

// Get display name for a category (falls back to raw name if not mapped)
const getCategoryDisplay = (cat: string): string => CATEGORY_DISPLAY[cat] || cat

// Category priority order (most important first, matching reference site hierarchy)
const CATEGORY_PRIORITY = [
  'Seating',           // Lounge Seating - primary focus
  'Tables',            // Lounge Tables
  'Bars',              // Cocktail & Bar
  'Tableware',         // Tableware (Dining)
  'Serveware',         // Serveware
  'Lighting',          // Lighting
  'Chandeliers',       // Chandeliers (part of lighting)
  'Pillows',           // Textiles
  'Rugs',              // Rugs
  'Styling',           // Styling
  'Storage',           // Storage
  'Candlelight',       // Candlelight
  'Large Decor & Dividers', // Large Decor - lowest priority
  'Furs & Pelts',
  'Subrentals',
]

// Sub-categories by main category (detected from product names)
const SUB_CATEGORIES: Record<string, string[]> = {
  'Seating': ['All', 'Sofas', 'Chairs', 'Benches', 'Ottomans', 'Stools'],
  'Tables': ['All', 'Coffee Tables', 'Side Tables', 'Dining Tables', 'Consoles'],
  'Bars': ['All', 'Bars', 'Back Bars', 'Carts'],
  'Large Decor & Dividers': ['All', 'Screens', 'Mirrors', 'Planters', 'Arches'],
  'Lighting': ['All', 'Floor Lamps', 'Table Lamps', 'Sconces'],
  'Chandeliers': ['All'],
  'Styling': ['All'],
  'Serveware': ['All'],
  'Storage': ['All'],
  'Candlelight': ['All'],
  'Pillows': ['All'],
  'Rugs': ['All'],
  'Tableware': ['All'],
  'Furs & Pelts': ['All'],
  'Subrentals': ['All'],
}

// Keywords for sub-category detection
const SUB_CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Sofas': ['sofa', 'loveseat', 'settee', 'couch'],
  'Chairs': ['chair', 'armchair', 'accent chair', 'lounge chair'],
  'Benches': ['bench', 'daybed'],
  'Ottomans': ['ottoman', 'pouf', 'footstool'],
  'Stools': ['stool', 'barstool'],
  'Coffee Tables': ['coffee table', 'cocktail table'],
  'Side Tables': ['side table', 'end table', 'accent table', 'drink table'],
  'Dining Tables': ['dining table', 'farm table'],
  'Consoles': ['console', 'entry table', 'sofa table'],
  'Bars': ['bar ', ' bar'],
  'Back Bars': ['back bar', 'backbar'],
  'Carts': ['cart', 'trolley'],
  'Screens': ['screen', 'divider', 'partition'],
  'Mirrors': ['mirror'],
  'Planters': ['planter', 'pot', 'urn'],
  'Arches': ['arch', 'arbor'],
  'Floor Lamps': ['floor lamp', 'standing lamp'],
  'Table Lamps': ['table lamp', 'desk lamp'],
  'Sconces': ['sconce', 'wall lamp'],
}

// Sub-category sort order for better visual flow (larger items first, then smaller)
const SUB_CATEGORY_SORT_ORDER: Record<string, string[]> = {
  'Seating': ['Sofas', 'Benches', 'Chairs', 'Ottomans', 'Stools'],
  'Tables': ['Dining Tables', 'Coffee Tables', 'Consoles', 'Side Tables'],
  'Bars': ['Bars', 'Back Bars', 'Carts'],
  'Large Decor & Dividers': ['Screens', 'Arches', 'Mirrors', 'Planters'],
  'Lighting': ['Floor Lamps', 'Table Lamps', 'Sconces'],
}

// B2: Move detectSubCategory outside component (called ~700× per sort otherwise)
function detectSubCategory(name: string): string {
  const lower = name.toLowerCase()
  for (const [subCat, keywords] of Object.entries(SUB_CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return subCat
  }
  return 'Other'
}

export default function CollectionPage() {
  const { cache } = useSWRConfig()
  // URL state - shareable links for planners
  const [activeCategory, setActiveCategory] = useQueryState('category', parseAsString.withDefault(''))
  
  // B1: Fetch categories first (long cache - rarely changes)
  const { data: categoriesData } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5 * 60 * 1000, // 5 minute cache
  })
  
  const categories: string[] = categoriesData?.categories || []
  
  // B1: Fetch by category, not all 500 products - biggest perf win
  const { data: productsData, mutate: mutateProducts } = useSWR(
    activeCategory
      ? `/api/products?imagesOnly=true&category=${encodeURIComponent(activeCategory)}&limit=100`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000, // 60 second cache
      keepPreviousData: true,  // shows old category while new one loads
    }
  )
  
  // B1: Prefetch category on hover for instant tab switching
  const prefetchCategory = useCallback((cat: string) => {
    const url = `/api/products?imagesOnly=true&category=${encodeURIComponent(cat)}&limit=100`
    if (!cache.get(url)) {
      fetcher(url) // warm the cache
    }
  }, [cache])
  
  const products: Product[] = productsData?.products || []
  const isLoading = !productsData && activeCategory !== ''
  
  // B2: Pre-compute subcategories once per product load (not on every render)
  const productsWithSubCategory = useMemo(() =>
    products.map(p => ({ ...p, _subCategory: detectSubCategory(p.name) })),
    [products]
  )
  
  // Fetch category counts separately (light endpoint)
  const { data: countsData } = useSWR('/api/categories?withCounts=true', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
  const categoryCounts: Record<string, number> = countsData?.counts || {}
  
  // URL state for sub-category and sort
  const [activeSubCategory, setActiveSubCategory] = useQueryState('sub', parseAsString.withDefault('All'))
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''))
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('type'))
  
  // Local state (not worth persisting to URL)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [hiddenProducts, setHiddenProducts] = useState<Set<string>>(new Set())
  
  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  // Set initial category to highest priority category
  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      // Find first category in priority order
      const firstPriorityCategory = CATEGORY_PRIORITY.find(cat => 
        categories.includes(cat)
      )
      
      if (firstPriorityCategory) {
        setActiveCategory(firstPriorityCategory)
      } else if (categories.length > 0) {
        // Fallback to first available if none in priority list
        setActiveCategory(categories[0])
      }
    }
  }, [categories, activeCategory])
  
  // Check if any filters are active
  const hasActiveFilters = activeSubCategory !== 'All' || searchQuery.trim() !== ''
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setActiveSubCategory('All')
    setSearchQuery('')
    setSortBy('type')
  }, [])
  
  // Quick View handlers
  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }, [])
  
  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false)
    // Delay clearing product to allow exit animation
    setTimeout(() => setQuickViewProduct(null), 400)
  }, [])
  
  // Handle broken images - hide them from the grid
  const handleImageError = useCallback((productId: string, imageUrl: string) => {
    brokenImages.add(imageUrl)
    setHiddenProducts(prev => new Set(prev).add(productId))
  }, [])
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Get image URL - use Blob URL if available
  const getImageUrl = useCallback((product: Product): string => {
    if (product.primary_image_url) {
      // If it's a Blob pathname, use the API route with cache buster
      if (product.primary_image_url.startsWith('inventory/')) {
        // Use updated_at as cache buster if available
        const cacheBuster = product.updated_at ? `&v=${new Date(product.updated_at).getTime()}` : ''
        return `/api/inventory-image?pathname=${encodeURIComponent(product.primary_image_url)}${cacheBuster}`
      }
      return product.primary_image_url
    }
    // Placeholder for items without images
    return '/placeholder-product.jpg'
  }, [])
  
  // Filter and search products (uses pre-computed _subCategory from B2)
  const filteredProducts = useMemo(() => {
    // Only show products with images, exclude hidden/broken ones
    if (!activeCategory) return []
    
    let results = productsWithSubCategory.filter(p => 
      p.primary_image_url && 
      !hiddenProducts.has(p.id) &&
      !brokenImages.has(getImageUrl(p))
    )
    
    // Sub-category filter (uses pre-computed _subCategory)
    if (activeSubCategory !== 'All') {
      results = results.filter(p => p._subCategory === activeSubCategory)
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
          return { ...p, _score: score }
        })
        .filter(p => p._score > 0)
        .sort((a, b) => b._score - a._score)
    } else {
      // Apply sort when not searching
      switch (sortBy) {
        case 'type':
          // Sort by sub-category (uses pre-computed _subCategory)
          const sortOrder = SUB_CATEGORY_SORT_ORDER[activeCategory] || []
          results.sort((a, b) => {
            const aIndex = sortOrder.indexOf(a._subCategory)
            const bIndex = sortOrder.indexOf(b._subCategory)
            const aOrder = aIndex === -1 ? 999 : aIndex
            const bOrder = bIndex === -1 ? 999 : bIndex
            if (aOrder !== bOrder) return aOrder - bOrder
            return a.name.localeCompare(b.name)
          })
          break
        case 'name':
          results.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'newest':
          results.sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
          break
        case 'oldest':
          results.sort((a, b) => new Date(a.updated_at || 0).getTime() - new Date(b.updated_at || 0).getTime())
          break
      }
    }
    
    return results
  }, [productsWithSubCategory, activeCategory, activeSubCategory, debouncedSearch, hiddenProducts, getImageUrl, sortBy])
  
  // Get available sub-categories for current category (uses pre-computed _subCategory)
  const availableSubCategories = useMemo(() => {
    const subs = SUB_CATEGORIES[activeCategory] || ['All']
    
    return subs.filter(sub => {
      if (sub === 'All') return true
      return productsWithSubCategory.some(p => p._subCategory === sub)
    })
  }, [productsWithSubCategory, activeCategory])
  
  // Quick View navigation (must be after filteredProducts is defined)
  const goToNextProduct = useCallback(() => {
    if (!quickViewProduct) return
    const currentIndex = filteredProducts.findIndex(p => p.id === quickViewProduct.id)
    if (currentIndex < filteredProducts.length - 1) {
      setQuickViewProduct(filteredProducts[currentIndex + 1])
    }
  }, [quickViewProduct, filteredProducts])
  
  const goToPreviousProduct = useCallback(() => {
    if (!quickViewProduct) return
    const currentIndex = filteredProducts.findIndex(p => p.id === quickViewProduct.id)
    if (currentIndex > 0) {
      setQuickViewProduct(filteredProducts[currentIndex - 1])
    }
  }, [quickViewProduct, filteredProducts])
  
  // Reset sub-category when main category changes
  useEffect(() => {
    setActiveSubCategory('All')
  }, [activeCategory])
  


  return (
    <main className="min-h-screen bg-white pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* ─────��───────────────────────────────────────────────────────
          Filter Header - Horizontal Two-Tier Navigation
      ───────────────────���──────────��────────────────────────────── */}
      <section className="sticky top-0 z-40 bg-white">
        {/* Row 1: Main Categories - dynamically shows categories with images */}
        <div className="border-b border-charcoal/10">
          <div className="flex items-center lg:justify-center gap-1 py-3 px-4 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {Object.entries(categoryCounts)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => {
                // Sort by priority order (Seating first, Large Decor last)
                const aIndex = CATEGORY_PRIORITY.indexOf(a[0])
                const bIndex = CATEGORY_PRIORITY.indexOf(b[0])
                const aPriority = aIndex === -1 ? 999 : aIndex
                const bPriority = bIndex === -1 ? 999 : bIndex
                return aPriority - bPriority
              })
              .map(([cat]) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                onMouseEnter={() => prefetchCategory(cat)}
                className={cn(
                  "relative flex-shrink-0 px-3 py-2 min-h-[44px] text-[11px] tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 snap-start touch-manipulation",
                  activeCategory === cat 
                    ? "text-charcoal font-medium" 
                    : "text-charcoal/40 hover:text-charcoal/60"
                )}
              >
                {getCategoryDisplay(cat)}
                {/* Active underline */}
                {activeCategory === cat && (
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-charcoal" />
                )}
              </button>
            ))}
            {/* End spacer for scroll */}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>
        
        {/* Row 2: Sub-Categories + Controls */}
        <div className="border-b border-charcoal/5 bg-white">
          {/* Mobile: Stack vertically. Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
            {/* Sub-categories - scrollable row */}
            <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 py-1 sm:flex-1" aria-label="Sub-categories">
              {availableSubCategories.map((sub) => {
                // Count items in this sub-category (uses pre-computed _subCategory)
                const count = sub === 'All' 
                  ? productsWithSubCategory.length
                  : productsWithSubCategory.filter(p => p._subCategory === sub).length
                
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={cn(
                      "flex-shrink-0 px-3 py-1.5 min-h-[36px] text-[10px] tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-200 rounded-full flex items-center gap-1.5 touch-manipulation",
                      activeSubCategory === sub 
                        ? "bg-charcoal text-cream" 
                        : "text-charcoal/50 hover:text-charcoal/80 hover:bg-charcoal/5"
                    )}
                  >
                    {sub}
                    <span className={cn(
                      "text-[9px] tabular-nums",
                      activeSubCategory === sub ? "text-cream/70" : "text-charcoal/30"
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
              {/* End spacer */}
              <div className="flex-shrink-0 w-4 sm:hidden" aria-hidden="true" />
            </nav>
            
            {/* Sort + Search + Reset */}
            <div className="flex items-center gap-2 flex-shrink-0 py-1">
              {/* Sort dropdown - 44px touch target */}
              <select
                value={sortBy ?? 'type'}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[10px] tracking-wide bg-transparent border border-charcoal/10 rounded-full px-3 py-2 min-h-[36px] focus:outline-none focus:border-charcoal/30 text-charcoal/60 cursor-pointer touch-manipulation"
              >
                <option value="type">By Type</option>
                <option value="name">A-Z</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              
              {/* Search */}
              <div className="relative hidden sm:block">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-8 pr-3 py-1.5 text-[10px] tracking-wide border rounded-full focus:outline-none transition-all placeholder:text-charcoal/30",
                    searchQuery 
                      ? "w-[140px] border-charcoal/30 bg-charcoal/5" 
                      : "w-[100px] focus:w-[140px] border-charcoal/10 bg-white/60"
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Reset button - only show when filters active */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] tracking-wide text-charcoal/50 hover:text-charcoal underline underline-offset-2 whitespace-nowrap min-h-[36px] px-2 touch-manipulation"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile search - full width on small screens */}
          <div className="sm:hidden px-4 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                inputMode="search"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 min-h-[44px] text-base border border-charcoal/10 rounded-full focus:outline-none focus:border-charcoal/30 placeholder:text-charcoal/30 touch-manipulation"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-charcoal touch-manipulation"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Active filters summary + result count */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-neutral-50/50 text-[10px] tracking-wide text-charcoal/50">
          <span>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
            {debouncedSearch && ` matching "${debouncedSearch}"`}
          </span>
          {hasActiveFilters && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal/30" />
              Filters applied
            </span>
          )}
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Product Grid - Dense catalog layout with skeleton loading
      ───────────────────────────────────────────────────────────── */}
      <section className="flex-1 bg-white">
        {isLoading ? (
          // Skeleton grid - instant visual feedback
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-r border-b border-charcoal/5">
                <div className="aspect-square bg-neutral-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                imageUrl={getImageUrl(product)}
                onImageError={handleImageError}
                onClick={() => openQuickView(product)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/40 mb-2">No pieces found.</p>
            <p className="text-xs text-charcoal/30 mb-4">
              {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Try adjusting your filters'}
            </p>
            <button
              onClick={resetFilters}
              className="text-xs uppercase tracking-[0.12em] text-charcoal/60 hover:text-charcoal underline underline-offset-4"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>
      
      <Footer />
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        onNext={quickViewProduct && filteredProducts.findIndex(p => p.id === quickViewProduct.id) < filteredProducts.length - 1 ? goToNextProduct : undefined}
        onPrevious={quickViewProduct && filteredProducts.findIndex(p => p.id === quickViewProduct.id) > 0 ? goToPreviousProduct : undefined}
        imageUrl={quickViewProduct ? getImageUrl(quickViewProduct) : undefined}
      />
    </main>
  )
}
