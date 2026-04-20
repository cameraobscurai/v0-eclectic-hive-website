'use client'

import { useState, useEffect, useMemo } from 'react'
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
  'Seating': 'Lounge Seating',
  'Tables': 'Tables',
  'Bars': 'Cocktail & Bar',
  'Large Decor & Dividers': 'Large Decor',
  'Lighting': 'Lighting',
  'Chandeliers': 'Chandeliers',
  'Styling': 'Styling',
  'Serveware': 'Serveware',
  'Storage': 'Storage',
}

// Sub-categories by main category (detected from product names)
const SUB_CATEGORIES: Record<string, string[]> = {
  'Seating': ['All', 'Sofas', 'Chairs', 'Benches', 'Ottomans', 'Stools'],
  'Tables': ['All', 'Coffee Tables', 'Side Tables', 'Dining Tables', 'Consoles'],
  'Bars': ['All', 'Bars', 'Back Bars', 'Carts'],
  'Large Decor & Dividers': ['All', 'Screens', 'Mirrors', 'Planters', 'Arches'],
  'Lighting': ['All', 'Floor Lamps', 'Table Lamps', 'Sconces'],
  'Styling': ['All'],
  'Serveware': ['All'],
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
  
  const [activeCategory, setActiveCategory] = useState<string>('Seating')
  const [activeSubCategory, setActiveSubCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
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
    // Only show products with images
    let results = products.filter(p => p.primary_image_url)
    
    // Category filter
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
    }
    
    return results
  }, [products, activeCategory, activeSubCategory, debouncedSearch])
  
  // Get available sub-categories for current category (only show if items exist)
  const availableSubCategories = useMemo(() => {
    const categoryProducts = products.filter(p => p.primary_image_url && p.category === activeCategory)
    const subs = SUB_CATEGORIES[activeCategory] || ['All']
    
    return subs.filter(sub => {
      if (sub === 'All') return true
      return categoryProducts.some(p => detectSubCategory(p.name) === sub)
    })
  }, [products, activeCategory])
  
  // Reset sub-category when main category changes
  useEffect(() => {
    setActiveSubCategory('All')
  }, [activeCategory])
  


  return (
    <main className="min-h-screen bg-white pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* ─────────────────────────────────────────────────────────────
          Filter Header - Horizontal Two-Tier Navigation
      ───────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-40 bg-white">
        {/* Row 1: Main Categories */}
        <div className="border-b border-charcoal/10">
          <div className="flex items-center justify-center gap-1 py-4 px-4 overflow-x-auto scrollbar-hide">
            {['Seating', 'Tables', 'Bars', 'Large Decor & Dividers', 'Lighting', 'Chandeliers', 'Styling', 'Serveware', 'Storage'].filter(c => categoryCounts[c] > 0).map((cat) => (
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
                {CATEGORY_DISPLAY[cat] || cat}
                {/* Active underline */}
                {activeCategory === cat && (
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-charcoal" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Row 2: Sub-Categories + Search */}
        {availableSubCategories.length > 1 && (
          <div className="border-b border-charcoal/5 bg-white">
            <div className="flex items-center justify-between px-6 py-3">
              {/* Sub-categories */}
              <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide" aria-label="Sub-categories">
                {availableSubCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={cn(
                      "px-3 py-1 text-[10px] tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-200 rounded-full",
                      activeSubCategory === sub 
                        ? "bg-charcoal text-cream" 
                        : "text-charcoal/50 hover:text-charcoal/80 hover:bg-charcoal/5"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </nav>
              
              {/* Search */}
              <div className="relative flex-shrink-0 ml-4">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-[10px] tracking-wide bg-white/60 border border-charcoal/10 rounded-full focus:border-charcoal/30 focus:outline-none transition-all w-[100px] focus:w-[140px] placeholder:text-charcoal/30"
                />
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          Product Grid - Dense catalog layout
      ───────────────────────────────────────────────────────────── */}
      <section className="flex-1 bg-white">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/40">Loading...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id || `${product.name}-${i}`}
                className="group relative cursor-pointer border-r border-b border-charcoal/5"
              >
                {/* Image container - clean white background */}
                <div className="aspect-square bg-white p-4 lg:p-6">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 bg-white"
                    style={{ backgroundColor: '#fff' }}
                    loading="lazy"
                  />
                </div>
                
                {/* Hover overlay with name */}
                <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-sm w-full py-3 px-2 text-center">
                    <p className="text-[10px] tracking-[0.08em] text-charcoal uppercase truncate">
                      {product.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-charcoal/40 mb-4">No pieces found.</p>
            <button
              onClick={() => { setActiveSubCategory('All'); setSearchQuery('') }}
              className="text-xs uppercase tracking-[0.12em] text-charcoal/60 hover:text-charcoal underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      
      <Footer />
    </main>
  )
}
