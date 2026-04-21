'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import useSWR from 'swr'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { QuickViewModal } from '@/components/quick-view-modal'
import { TextReveal, FadeInView } from '@/components/scroll-animations'
import { cn } from '@/lib/utils'

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



export default function CollectionPage() {
  // SWR for products - short cache for fresh data after uploads
  const { data: productsData, mutate: mutateProducts } = useSWR('/api/products?imagesOnly=true&limit=500', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 second cache
  })
  
  // SWR for categories - short cache
  const { data: categoriesData } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
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
  
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [hiddenProducts, setHiddenProducts] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'type' | 'name' | 'newest' | 'oldest'>('type')
  
  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  // Set initial category to highest priority category with images
  useEffect(() => {
    if (!activeCategory && products.length > 0) {
      // Find first category in priority order that has images
      const categoriesWithImages = Object.entries(categoryCounts)
        .filter(([cat, count]) => cat !== 'All' && count > 0)
        .map(([cat]) => cat)
      
      const firstPriorityCategory = CATEGORY_PRIORITY.find(cat => 
        categoriesWithImages.includes(cat)
      )
      
      if (firstPriorityCategory) {
        setActiveCategory(firstPriorityCategory)
      } else if (categoriesWithImages.length > 0) {
        // Fallback to first available if none in priority list
        setActiveCategory(categoriesWithImages[0])
      }
    }
  }, [products, categoryCounts, activeCategory])
  
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
  
  // Detect sub-category from product name
  const detectSubCategory = (name: string): string => {
    const lowerName = name.toLowerCase()
    for (const [subCat, keywords] of Object.entries(SUB_CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => lowerName.includes(kw))) {
        return subCat
      }
    }
    return 'Other'
  }

  // Filter and search products
  const filteredProducts = useMemo(() => {
    // Only show products with images, exclude hidden/broken ones
    let results = products.filter(p => 
      p.primary_image_url && 
      !hiddenProducts.has(p.id) &&
      !brokenImages.has(getImageUrl(p))
    )
    
    // Category filter (if no category selected yet, show nothing until loaded)
    if (!activeCategory) return []
    results = results.filter(p => p.category === activeCategory)
    
    // Sub-category filter
    if (activeSubCategory !== 'All') {
      results = results.filter(p => detectSubCategory(p.name) === activeSubCategory)
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
          // Sort by sub-category for better visual flow (sofas, then benches, then chairs, etc.)
          const sortOrder = SUB_CATEGORY_SORT_ORDER[activeCategory] || []
          results.sort((a, b) => {
            const aSubCat = detectSubCategory(a.name)
            const bSubCat = detectSubCategory(b.name)
            const aIndex = sortOrder.indexOf(aSubCat)
            const bIndex = sortOrder.indexOf(bSubCat)
            // Items not in sort order go to end
            const aOrder = aIndex === -1 ? 999 : aIndex
            const bOrder = bIndex === -1 ? 999 : bIndex
            // Primary sort by sub-category, secondary by name
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
  }, [products, activeCategory, activeSubCategory, debouncedSearch, hiddenProducts, getImageUrl, sortBy])
  
  // Get available sub-categories for current category (only show if items exist)
  const availableSubCategories = useMemo(() => {
    const categoryProducts = products.filter(p => p.primary_image_url && p.category === activeCategory)
    const subs = SUB_CATEGORIES[activeCategory] || ['All']
    
    return subs.filter(sub => {
      if (sub === 'All') return true
      return categoryProducts.some(p => detectSubCategory(p.name) === sub)
    })
  }, [products, activeCategory])
  
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
      
      {/* ─────────────────────────────────────────────────────────────
          Filter Header - Horizontal Two-Tier Navigation
      ──────────────────────────────��────────────────────────────── */}
      <section className="sticky top-0 z-40 bg-white">
        {/* Row 1: Main Categories - dynamically shows categories with images */}
        <div className="border-b border-charcoal/10">
          <div className="flex items-center justify-center gap-1 py-4 px-4 overflow-x-auto scrollbar-hide">
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
                className={cn(
                  "relative px-4 py-2 text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-200",
                  activeCategory === cat 
                    ? "text-charcoal" 
                    : "text-charcoal/40 hover:text-charcoal/60"
                )}
              >
                {getCategoryDisplay(cat)}
                {/* Active underline */}
                {activeCategory === cat && (
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-charcoal" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Row 2: Sub-Categories + Controls */}
        <div className="border-b border-charcoal/5 bg-white">
          <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">
            {/* Left: Sub-categories */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1" aria-label="Sub-categories">
              {availableSubCategories.map((sub) => {
                // Count items in this sub-category
                const count = sub === 'All' 
                  ? products.filter(p => p.primary_image_url && p.category === activeCategory).length
                  : products.filter(p => p.primary_image_url && p.category === activeCategory && detectSubCategory(p.name) === sub).length
                
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={cn(
                      "px-3 py-1 text-[10px] tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-200 rounded-full flex items-center gap-1.5",
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
            </nav>
            
            {/* Right: Sort + Search + Reset */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Sort dropdown */}
              <select
                value={sortBy}
  onChange={(e) => setSortBy(e.target.value as 'type' | 'name' | 'newest' | 'oldest')}
  className="text-[10px] tracking-wide bg-transparent border border-charcoal/10 rounded-full px-2.5 py-1.5 focus:outline-none focus:border-charcoal/30 text-charcoal/60 cursor-pointer"
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
                  className="text-[10px] tracking-wide text-charcoal/50 hover:text-charcoal underline underline-offset-2 whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile search - full width on small screens */}
          <div className="sm:hidden px-4 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm border border-charcoal/10 rounded-full focus:outline-none focus:border-charcoal/30 placeholder:text-charcoal/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
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
