'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { useInquiryStore } from '@/lib/inquiry-store'
import { Plus, Check, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  primary_image_url: string | null
  category: string
  sub_category?: string
  dims_display?: string
  stock_count?: number
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

// Lifestyle vignettes for visual storytelling
const VIGNETTES = [
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_33_39%20AM-i3tVPuiTbhTLfdzp2THZmBRDfyaKBD.png', 
    title: 'The Gathered Table',
    caption: 'Linen, ceramic, and candlelight'
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png', 
    title: 'Quiet Corners',
    caption: 'Boucle, brass, and books'
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%283%29-AJLa39oz4oGazs06HWIawRq61cYiuT.png', 
    title: 'Collected Objects',
    caption: 'Patina, pottery, and provenance'
  },
]

export default function StudioPage() {
  const [loaded, setLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  
  const { items, add, remove, hasItem } = useInquiryStore()

  useEffect(() => { setLoaded(true) }, [])

  // Fetch categories
  const { data: categoriesData } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
  })
  const categories: string[] = categoriesData?.categories || []

  // Set initial category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0])
    }
  }, [categories, activeCategory])

  // Fetch products
  const { data: productsData, isValidating } = useSWR(
    activeCategory 
      ? `/api/products?imagesOnly=true&category=${encodeURIComponent(activeCategory)}&limit=50`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )
  const products: Product[] = productsData?.products || []

  // Group products by subcategory
  const productsBySubcategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const sub = product.sub_category || 'Other'
      if (!acc[sub]) acc[sub] = []
      acc[sub].push(product)
      return acc
    }, {} as Record<string, Product[]>)
  }, [products])

  const toggleProduct = (product: Product) => {
    if (hasItem(product.id)) {
      remove(product.id)
    } else {
      add({
        id: product.id,
        name: product.name,
        category: product.category,
        imageUrl: product.primary_image_url || undefined,
      })
    }
  }

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Hero - Simple, no form */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Title */}
            <div>
              <p className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/40 mb-6 transition-all duration-700',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                The Collection
              </p>
              <h1 className={cn(
                'font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-light text-charcoal transition-all duration-700',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )} style={{ transitionDelay: '100ms' }}>
                Design Studio
              </h1>
              <p className={cn(
                'text-charcoal/50 mt-6 max-w-md leading-relaxed transition-all duration-700',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )} style={{ transitionDelay: '200ms' }}>
                Browse our inventory of furniture, tableware, lighting, and decor. 
                Select pieces to save them for your project.
              </p>
            </div>
            
            {/* Right: Vignette Carousel */}
            <div className={cn(
              'relative transition-all duration-1000',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )} style={{ transitionDelay: '300ms' }}>
              <div className="grid grid-cols-3 gap-2">
                {VIGNETTES.map((v, i) => (
                  <div key={i} className="relative aspect-[3/4] group overflow-hidden">
                    <Image
                      src={v.src}
                      alt={v.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-cream text-xs font-medium">{v.title}</p>
                      <p className="text-cream/60 text-[10px]">{v.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-y border-charcoal/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'text-xs uppercase tracking-[0.15em] whitespace-nowrap transition-colors',
                  activeCategory === cat 
                    ? 'text-charcoal' 
                    : 'text-charcoal/40 hover:text-charcoal/70'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          {Object.entries(productsBySubcategory).map(([subcategory, subProducts]) => (
            <div key={subcategory} className="mb-16 last:mb-0">
              {/* Subcategory Header */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display text-xl tracking-wide text-charcoal">{subcategory}</h2>
                <div className="flex-1 h-px bg-charcoal/10" />
                <span className="text-xs text-charcoal/40">{subProducts.length} pieces</span>
              </div>

              {/* Products */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {subProducts.map((product) => {
                  const isSelected = hasItem(product.id)
                  
                  return (
                    <div 
                      key={product.id}
                      className="group cursor-pointer"
                      onClick={() => setActiveProduct(product)}
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-white mb-3 overflow-hidden">
                        {product.primary_image_url ? (
                          <Image
                            src={product.primary_image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-charcoal/20 text-xs">
                            No Image
                          </div>
                        )}
                        
                        {/* Selection Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleProduct(product)
                          }}
                          className={cn(
                            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                            isSelected 
                              ? 'bg-charcoal text-cream' 
                              : 'bg-white/80 text-charcoal/50 opacity-0 group-hover:opacity-100 hover:bg-charcoal hover:text-cream'
                          )}
                        >
                          {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Info */}
                      <p className="text-sm text-charcoal truncate">{product.name}</p>
                      {product.dims_display && (
                        <p className="text-xs text-charcoal/40 mt-0.5">{product.dims_display}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Loading State */}
          {isValidating && products.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-6 h-6 border border-charcoal/20 border-t-charcoal/60 rounded-full animate-spin mx-auto" />
              <p className="text-charcoal/40 text-sm mt-4">Loading inventory...</p>
            </div>
          )}

          {/* Empty State */}
          {!isValidating && products.length === 0 && activeCategory && (
            <div className="py-32 text-center">
              <p className="text-charcoal/40 text-sm">No products in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      {activeProduct && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setActiveProduct(null)}
        >
          <div 
            className="bg-cream max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square bg-white">
                {activeProduct.primary_image_url ? (
                  <Image
                    src={activeProduct.primary_image_url}
                    alt={activeProduct.name}
                    fill
                    className="object-contain p-8"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-charcoal/20">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-8 lg:p-12 flex flex-col">
                <button 
                  onClick={() => setActiveProduct(null)}
                  className="self-end -mt-4 -mr-4 w-10 h-10 flex items-center justify-center text-charcoal/40 hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40 mb-2">
                    {activeProduct.category}
                    {activeProduct.sub_category && ` / ${activeProduct.sub_category}`}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl tracking-wide text-charcoal">
                    {activeProduct.name}
                  </h2>
                  {activeProduct.dims_display && (
                    <p className="text-charcoal/50 mt-3">{activeProduct.dims_display}</p>
                  )}
                  {activeProduct.stock_count !== undefined && (
                    <p className="text-xs text-charcoal/40 mt-4">
                      {activeProduct.stock_count} available
                    </p>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() => toggleProduct(activeProduct)}
                  className={cn(
                    'mt-8 py-4 text-xs uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-3',
                    hasItem(activeProduct.id)
                      ? 'bg-white border border-charcoal/20 text-charcoal hover:bg-cream'
                      : 'bg-charcoal text-cream hover:bg-charcoal/90'
                  )}
                >
                  {hasItem(activeProduct.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Selections</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Selections</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
