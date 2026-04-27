'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import dynamic from 'next/dynamic'
import { useQueryState, parseAsString } from 'nuqs'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

const QuickViewModal = dynamic(
  () => import('@/components/quick-view-modal').then(m => ({ default: m.QuickViewModal })),
  { ssr: false }
)

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  display_type?: 'single' | 'variants' | 'custom_inquiry'
  is_featured?: boolean
  updated_at?: string
  description?: string
  stock_count?: number
  dims_display?: string
  width_inches?: number
  depth_inches?: number
  height_inches?: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const getCategoryDisplay = (cat: string): string => CATEGORY_DISPLAY[cat] || cat

const CATEGORY_PRIORITY = [
  'Seating', 'Tables', 'Bars', 'Tableware', 'Serveware',
  'Lighting', 'Chandeliers', 'Pillows', 'Rugs', 'Styling',
  'Storage', 'Candlelight', 'Large Decor & Dividers', 'Furs & Pelts', 'Subrentals',
]

const SUB_CATEGORIES: Record<string, string[]> = {
  'Seating': ['All', 'Sofas', 'Chairs', 'Benches', 'Ottomans', 'Stools'],
  'Tables': ['All', 'Coffee Tables', 'Side Tables', 'Dining Tables', 'Consoles'],
  'Bars': ['All', 'Bars', 'Back Bars', 'Carts'],
  'Large Decor & Dividers': ['All', 'Screens', 'Mirrors', 'Planters', 'Arches'],
  'Lighting': ['All', 'Floor Lamps', 'Table Lamps', 'Sconces'],
  'Chandeliers': ['All'], 'Styling': ['All'], 'Serveware': ['All'],
  'Storage': ['All'], 'Candlelight': ['All'], 'Pillows': ['All'],
  'Rugs': ['All'], 'Tableware': ['All'], 'Furs & Pelts': ['All'], 'Subrentals': ['All'],
}

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

const SUB_CATEGORY_SORT_ORDER: Record<string, string[]> = {
  'Seating': ['Sofas', 'Benches', 'Chairs', 'Ottomans', 'Stools'],
  'Tables': ['Dining Tables', 'Coffee Tables', 'Consoles', 'Side Tables'],
  'Bars': ['Bars', 'Back Bars', 'Carts'],
  'Large Decor & Dividers': ['Screens', 'Arches', 'Mirrors', 'Planters'],
  'Lighting': ['Floor Lamps', 'Table Lamps', 'Sconces'],
}

function detectSubCategory(name: string): string {
  const lower = name.toLowerCase()
  for (const [subCat, keywords] of Object.entries(SUB_CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return subCat
  }
  return 'Other'
}

// ─── Animation Philosophy ─────────────────────────────────────────────────────
//
// CALM over CLEVER: Instead of animating 50+ cards individually (chaos),
// we crossfade the entire grid as a single unit.
//
// - Grid fades out (150ms) → new content fades in (200ms)
// - No stagger, no FLIP, no individual card animations
// - Result: peaceful, editorial feel regardless of item count

// ─── ProductCard ──────────────────────────────────────────────────────────────

const ProductCard = ({
  product,
  imageUrl,
  onImageError,
  onClick,
  index = 0,
  brokenImagesRef,
}: {
  product: Product
  imageUrl: string
  onImageError: (id: string, url: string) => void
  onClick: () => void
  index?: number
  brokenImagesRef: React.RefObject<Set<string>>
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (brokenImagesRef.current?.has(imageUrl)) return null

  const handleError = () => {
    setError(true)
    onImageError(product.id, imageUrl)
  }

  if (error) return null

  const isAboveFold = index < 6

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer border-r border-b border-charcoal/5 text-left w-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-charcoal/20"
    >
      <div className="aspect-square bg-white p-4 lg:p-6 relative overflow-hidden">
        {!loaded && (
          <div className="absolute inset-4 lg:inset-6 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className={cn(
            'w-full h-full object-contain transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={isAboveFold ? 'eager' : 'lazy'}
          decoding={isAboveFold ? 'sync' : 'async'}
          fetchPriority={index < 3 ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      </div>

      {/* Clip-path reveal on hover */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden"
        style={{
          clipPath: isHovered ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
          transition: 'clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="bg-white/96 backdrop-blur-sm px-4 py-4 border-t border-charcoal/6">
          <p className="text-xs sm:text-[11px] tracking-[0.08em] text-charcoal uppercase font-medium truncate">
            {product.name}
          </p>
          <p className="text-[10px] sm:text-[9px] tracking-[0.1em] text-charcoal/40 uppercase mt-1">
            Quick View
          </p>
        </div>
      </div>
    </button>
  )
}

// Memoize to prevent unnecessary re-renders
const MemoProductCard = React.memo(ProductCard)

// ─── Page ─────────────────────────────────────────────────────────────────────

// Need React import for React.memo above
import React from 'react'

const fetcher = async (url: string) => {
  const res = await fetch(url, { next: { revalidate: 300 } })
  return res.json()
}

export default function CollectionPage() {
  const { cache } = useSWRConfig()
  const brokenImagesRef = useRef<Set<string>>(new Set())

  const [activeCategory, setActiveCategory] = useQueryState('category', parseAsString.withDefault('Seating'))

  const { data: categoriesData } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 5 * 60 * 1000,
  })

  const categories: string[] = categoriesData?.categories || []

  const { data: productsData, isValidating } = useSWR(
    activeCategory
      ? `/api/products?imagesOnly=true&category=${encodeURIComponent(activeCategory)}&limit=100`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000,
      // The most important line — keeps previous category's products visible
      // while the new category loads. Zero blank state, zero flash.
      keepPreviousData: true,
    }
  )

  const prefetchCategory = useCallback((cat: string) => {
    const url = `/api/products?imagesOnly=true&category=${encodeURIComponent(cat)}&limit=100`
    if (!cache.get(url)) fetcher(url)
  }, [cache])

  const products: Product[] = productsData?.products || []
  const isInitializing = !categoriesData
  const isLoading = isInitializing || (!productsData && isValidating)

  const productsWithSubCategory = useMemo(() =>
    products.map(p => ({ ...p, _subCategory: detectSubCategory(p.name) })),
    [products]
  )

  const { data: countsData } = useSWR('/api/categories?withCounts=true', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })
  const categoryCounts: Record<string, number> = countsData?.counts || {}

  const [activeSubCategory, setActiveSubCategory] = useQueryState('sub', parseAsString.withDefault('All'))
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''))
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('type'))
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [hiddenProducts, setHiddenProducts] = useState<Set<string>>(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

  const hasActiveFilters = activeSubCategory !== 'All' || searchQuery.trim() !== ''

  const resetFilters = useCallback(() => {
    setActiveSubCategory('All')
    setSearchQuery('')
    setSortBy('type')
  }, [])

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }, [])

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false)
    setTimeout(() => setQuickViewProduct(null), 400)
  }, [])

  const handleImageError = useCallback((productId: string, imageUrl: string) => {
    brokenImagesRef.current?.add(imageUrl)
    setHiddenProducts(prev => new Set(prev).add(productId))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const getImageUrl = useCallback((product: Product): string => {
    if (product.primary_image_url) {
      if (product.primary_image_url.startsWith('inventory/')) {
        const cacheBuster = product.updated_at ? `&v=${new Date(product.updated_at).getTime()}` : ''
        return `/api/inventory-image?pathname=${encodeURIComponent(product.primary_image_url)}${cacheBuster}`
      }
      return product.primary_image_url
    }
    return '/placeholder-product.jpg'
  }, [])

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return []

    let results = productsWithSubCategory.filter(p =>
      p.primary_image_url &&
      !hiddenProducts.has(p.id) &&
      !brokenImagesRef.current?.has(getImageUrl(p))
    )

    if (activeSubCategory !== 'All') {
      results = results.filter(p => p._subCategory === activeSubCategory)
    }

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
      switch (sortBy) {
        case 'type': {
          const sortOrder = SUB_CATEGORY_SORT_ORDER[activeCategory] || []
          results.sort((a, b) => {
            const aOrder = sortOrder.indexOf(a._subCategory)
            const bOrder = sortOrder.indexOf(b._subCategory)
            const aIdx = aOrder === -1 ? 999 : aOrder
            const bIdx = bOrder === -1 ? 999 : bOrder
            if (aIdx !== bIdx) return aIdx - bIdx
            return a.name.localeCompare(b.name)
          })
          break
        }
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

  const availableSubCategories = useMemo(() => {
    const subs = SUB_CATEGORIES[activeCategory] || ['All']
    return subs.filter(sub => {
      if (sub === 'All') return true
      return productsWithSubCategory.some(p => p._subCategory === sub)
    })
  }, [productsWithSubCategory, activeCategory])

  const goToNextProduct = useCallback(() => {
    if (!quickViewProduct) return
    const idx = filteredProducts.findIndex(p => p.id === quickViewProduct.id)
    if (idx < filteredProducts.length - 1) setQuickViewProduct(filteredProducts[idx + 1])
  }, [quickViewProduct, filteredProducts])

  const goToPreviousProduct = useCallback(() => {
    if (!quickViewProduct) return
    const idx = filteredProducts.findIndex(p => p.id === quickViewProduct.id)
    if (idx > 0) setQuickViewProduct(filteredProducts[idx - 1])
  }, [quickViewProduct, filteredProducts])

  useEffect(() => {
    setActiveSubCategory('All')
  }, [activeCategory])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-white pt-[72px] lg:pt-[88px]">
      <Navigation />

      {/* ── Filter Header ─────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-40 bg-white">

        {/* Row 1 — Main categories */}
        <div className="border-b border-charcoal/10">
          <div className="flex items-center lg:justify-center gap-1 py-3 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {Object.entries(categoryCounts)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => {
                const aIdx = CATEGORY_PRIORITY.indexOf(a[0])
                const bIdx = CATEGORY_PRIORITY.indexOf(b[0])
                return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
              })
              .map(([cat]) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={() => prefetchCategory(cat)}
                  className={cn(
                    'relative flex-shrink-0 px-3 py-2 min-h-[44px] text-[11px] tracking-[0.12em] uppercase whitespace-nowrap transition-colors duration-200 snap-start touch-manipulation',
                    activeCategory === cat
                      ? 'text-charcoal font-medium'
                      : 'text-charcoal/40 hover:text-charcoal/60'
                  )}
                >
                  {getCategoryDisplay(cat)}
                  <span
                    className={cn(
                      'absolute bottom-1 left-3 right-3 h-px bg-charcoal transition-all duration-200',
                      activeCategory === cat 
                        ? 'opacity-100 scale-x-100' 
                        : 'opacity-0 scale-x-0'
                    )}
                  />
                </button>
              ))}
            <div className="flex-shrink-0 w-4" aria-hidden="true" />
          </div>
        </div>

        {/* Row 2 — Sub-categories + controls */}
        <div className="border-b border-charcoal/5 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 md:px-6 py-2 sm:py-3 gap-2 sm:gap-3">
            <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 py-1 sm:flex-1" aria-label="Sub-categories">
              {availableSubCategories.map((sub) => {
                const count = sub === 'All'
                  ? productsWithSubCategory.length
                  : productsWithSubCategory.filter(p => p._subCategory === sub).length

                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={cn(
                      'relative flex-shrink-0 px-3 py-2.5 min-h-[44px] text-[10px] tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-200 rounded-full flex items-center gap-1.5 touch-manipulation',
                      activeSubCategory === sub
                        ? 'bg-charcoal text-cream'
                        : 'text-charcoal/50 hover:text-charcoal/80 hover:bg-charcoal/5'
                    )}
                  >
                    {sub}
                    <span className={cn(
                      'text-[9px] tabular-nums',
                      activeSubCategory === sub ? 'text-cream/70' : 'text-charcoal/30'
                    )}>
                      {count}
                    </span>
                  </button>
                )
              })}
              <div className="flex-shrink-0 w-4 sm:hidden" aria-hidden="true" />
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0 py-1">
              <select
                value={sortBy ?? 'type'}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[10px] tracking-wide bg-transparent border border-charcoal/10 rounded-full px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-charcoal/30 text-charcoal/60 cursor-pointer touch-manipulation"
              >
                <option value="type">By Type</option>
                <option value="name">A-Z</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

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
                    'pl-8 pr-3 py-1.5 text-[10px] tracking-wide border rounded-full focus:outline-none transition-all placeholder:text-charcoal/30',
                    searchQuery
                      ? 'w-[140px] border-charcoal/30 bg-charcoal/5'
                      : 'w-[100px] focus:w-[140px] border-charcoal/10 bg-white/60'
                  )}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-[10px] tracking-wide text-charcoal/50 hover:text-charcoal underline underline-offset-2 whitespace-nowrap min-h-[44px] px-2 touch-manipulation">
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Mobile search */}
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
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-charcoal touch-manipulation" aria-label="Clear search">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-neutral-50/50 text-[10px] tracking-wide text-charcoal/50">
          <span>
            {isLoading ? (
              <span className="inline-block h-3 w-20 bg-neutral-200/50 rounded animate-pulse" />
            ) : (
              <>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                {debouncedSearch && ` matching "${debouncedSearch}"`}
              </>
            )}
          </span>
          {hasActiveFilters && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal/30" />
              Filters applied
            </span>
          )}
        </div>
      </section>

      {/* ── Product Grid ──────────────────────────────────────────────────── */}
      <section className="flex-1 bg-white">
        {isLoading ? (
          // Skeleton — only shown on true first load
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-r border-b border-charcoal/5 relative overflow-hidden">
                <div className="aspect-square bg-neutral-50">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          /*
           * CALM CROSSFADE: The entire grid fades as one unit.
           * - key={category+subcategory} triggers a fresh mount on filter change
           * - AnimatePresence crossfades old grid out, new grid in
           * - No per-card animations = peaceful, editorial feel
           */
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${activeSubCategory}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {filteredProducts.map((product, index) => (
                <MemoProductCard
                  key={product.id}
                  product={product}
                  imageUrl={getImageUrl(product)}
                  onImageError={handleImageError}
                  onClick={() => openQuickView(product)}
                  index={index}
                  brokenImagesRef={brokenImagesRef}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/40 mb-2">No pieces found.</p>
            <p className="text-xs text-charcoal/30 mb-4">
              {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Try adjusting your filters'}
            </p>
            <button onClick={resetFilters} className="text-xs uppercase tracking-[0.12em] text-charcoal/60 hover:text-charcoal underline underline-offset-4">
              Reset all filters
            </button>
          </div>
        )}
      </section>

      <Footer />

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
