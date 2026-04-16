'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Lazy load 3D viewer for performance
const InlineProductViewer = lazy(() => import('@/components/product-viewer-3d').then(mod => ({ default: mod.InlineProductViewer })))

// ═══════════════════════════════════════════════════════════════════════════════
// NEW ARRIVALS - Featured pieces for the scrolling strip
// ═══════════════════════════════════════════════════════════════════════════════
const NEW_ARRIVALS = [
  { name: 'Georgia Sconce', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GEORGIA%2BSconce%2B1-rnc4CfwUpYrddyEN1oZ9B2AK5yhfyz.webp' },
  { name: 'Cressida Table Lamp', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CRESSIDA%2BTable%2BLamp-7vpkT2QzVYlThgDRVshSk3XOLY5ja7.webp' },
  { name: 'Jina Duo', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JINA%2BDuo-j7eLEUai1yqDNA6NSfIq4Nj5UJZoX4.webp' },
  { name: 'Agatha Duo', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AGATHA%2BDuo-KYMnfwMmh4lt6l8yfhY7AuLhem533g.webp' },
  { name: 'Concreta Wall Sconce', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CONCRETA%2BWall%2BSconce%2B0-49NNZi7tHXTuGuSL9ieNtbgm24eKPZ.webp' },
  { name: 'Culetta Marble Lamp', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CULETTA%2BMarble%2BCab%2BLamp-wy4XnS6P7WgnkozWwyGLs9QO2FmtNx.webp' },
  { name: 'Leanna Ivory Ottoman', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
  { name: 'Jesamay Armchair', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/0bf81375-08dc-4f07-b967-998d4eb24c6a/JESAMAY+Chair+1.png' },
  { name: 'Fulton Sofa', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// FULL INVENTORY - Each item has its own unique image
// ═══════════════════════════════════════════════════════════════════════════════
const CATEGORIES = ['All', 'Sofas', 'Loveseats', 'Chairs', 'Benches', 'Ottomans'] as const
type Category = typeof CATEGORIES[number]

interface InventoryItem {
  name: string
  category: 'Sofas' | 'Loveseats' | 'Chairs' | 'Benches' | 'Ottomans'
  image: string
}

// Each item has a UNIQUE image - using real Squarespace CDN images from their site
const INVENTORY: InventoryItem[] = [
  // SOFAS
  { name: 'Indiwin Black Leather Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png' },
  { name: 'Brooklyn Plush Charcoal Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png' },
  { name: 'Talon Black Metal Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  { name: 'Fulton Green & Ash Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
  { name: 'Rowntree Leather Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'Lindt Toffee Velvet Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png' },
  { name: 'Commodore Canvas Sofa', category: 'Sofas', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  
  // LOVESEATS  
  { name: 'Commodore Canvas Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'Rowntree Leather Loveseat', category: 'Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  
  // CHAIRS
  { name: 'Amun Leather Butterfly Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'Fawn Natural Cane Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'Nomad Wood Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'Phillipe Grey Silk Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'Poe Deconstructed Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'Corwin Canvas Lounge Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'Jesamay Armchair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/0bf81375-08dc-4f07-b967-998d4eb24c6a/JESAMAY+Chair+1.png' },
  
  // BENCHES
  { name: 'Geraldine Goat Fur Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
  
  // OTTOMANS
  { name: 'Blanc Cow Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'Morrison Charcoal Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'Jesse Cow Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'Joseph Goat Hide Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
  { name: 'Leanna Ivory Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
]

// 3D model mapping
const MODEL_3D_MAP: Record<string, string> = {
  'Lindt Toffee Velvet Sofa': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb',
}

// Featured 3D product for hero
const FEATURED_3D = {
  name: 'Lindt Toffee Velvet Sofa',
  modelUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb',
  description: 'Channel tufted velvet sofa with brass frame detailing',
  category: 'Sofas'
}


export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loaded, setLoaded] = useState(false)
  const [active3DProduct, setActive3DProduct] = useState<string | null>(null)
  const [hero3DReady, setHero3DReady] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Carousel refs for manual scrolling
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoaded(true)
    const timer = setTimeout(() => setHero3DReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const toggle3DView = (productName: string) => {
    setActive3DProduct(active3DProduct === productName ? null : productName)
  }

  const has3DModel = (name: string) => name in MODEL_3D_MAP
  const is3DActive = (name: string) => active3DProduct === name

  const filteredInventory = activeCategory === 'All' 
    ? INVENTORY 
    : INVENTORY.filter(item => item.category === activeCategory)

  // Manual carousel scroll
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return
    const scrollAmount = 400
    carouselRef.current.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    })
  }

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* ═══════════════════════════════════════════════════════════════════
          HERO: Compact 3D Showcase
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="pt-24 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* 3D Viewer */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[45vh] bg-[#d5cdc5]">
            {hero3DReady && (
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-charcoal/10 border-t-charcoal/40 rounded-full animate-spin" />
                </div>
              }>
                <InlineProductViewer modelUrl={FEATURED_3D.modelUrl} />
              </Suspense>
            )}
          </div>
          
          {/* Product Info Panel */}
          <div className="bg-charcoal text-cream flex flex-col justify-center p-8 lg:p-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cream/40 mb-4">{FEATURED_3D.category}</p>
            <h1 className="font-display text-2xl lg:text-3xl tracking-[0.15em] font-light uppercase mb-4">
              {FEATURED_3D.name}
            </h1>
            <p className="text-sm text-cream/60 leading-relaxed mb-6 max-w-md">
              {FEATURED_3D.description}
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-cream/30">
              Drag to rotate · Scroll to zoom
            </p>
          </div>
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          NEW ARRIVALS STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white border-y border-charcoal/5">
        <div className="flex items-center justify-between px-6 lg:px-12 mb-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-charcoal/60">New Arrivals</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-8 h-8 rounded-full border border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream transition-all flex items-center justify-center"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-8 h-8 rounded-full border border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream transition-all flex items-center justify-center"
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
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {NEW_ARRIVALS.map((product, i) => (
            <div
              key={i}
              className="group flex-shrink-0 w-[140px] lg:w-[160px]"
            >
              <div className="relative aspect-[3/4] bg-[#F8F6F3] mb-2 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  sizes="160px"
                />
              </div>
              <p className="text-[9px] tracking-[0.1em] text-charcoal/50 group-hover:text-charcoal transition-colors truncate">
                {product.name}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          FILTER BAR - Solid background, not sticky
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-cream border-b border-charcoal/10">
        <div className="px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-charcoal hover:text-charcoal/70 transition-colors"
            >
              {activeCategory === 'All' ? 'All Categories' : activeCategory}
              <svg 
                className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute top-full left-0 mt-2 bg-white border border-charcoal/10 shadow-lg z-50 min-w-[180px]">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat)
                        setDropdownOpen(false)
                      }}
                      className={cn(
                        "block w-full text-left px-4 py-3 text-xs uppercase tracking-[0.1em] transition-colors",
                        activeCategory === cat 
                          ? "bg-charcoal text-cream" 
                          : "text-charcoal hover:bg-sand/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Item count */}
          <p className="text-[10px] tracking-[0.1em] text-charcoal/40">
            {filteredInventory.length} pieces
          </p>
        </div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════════
          INVENTORY GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-4 lg:px-6 py-6">
        <div 
          className={cn(
            "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px] transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
        >
          {filteredInventory.map((item, index) => (
            <div 
              key={`${item.name}-${index}`}
              className="group relative"
            >
              {/* Product Card */}
              <div className="relative aspect-square bg-[#d5cdc5] overflow-hidden">
                {/* 3D View Toggle (if available) */}
                {has3DModel(item.name) && (
                  <button
                    onClick={() => toggle3DView(item.name)}
                    className={cn(
                      "absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      is3DActive(item.name)
                        ? "bg-charcoal text-cream"
                        : "bg-white/80 text-charcoal hover:bg-charcoal hover:text-cream"
                    )}
                    aria-label={is3DActive(item.name) ? "Show image" : "Show 3D view"}
                  >
                    {is3DActive(item.name) ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                      </svg>
                    )}
                  </button>
                )}
                
                {/* 3D Viewer or Image */}
                {is3DActive(item.name) && has3DModel(item.name) ? (
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-charcoal/10 border-t-charcoal/40 rounded-full animate-spin" />
                    </div>
                  }>
                    <InlineProductViewer modelUrl={MODEL_3D_MAP[item.name]} />
                  </Suspense>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
              </div>
              
              {/* Product Info */}
              <div className="py-3 px-1">
                <h3 className="font-display text-[11px] tracking-[0.08em] font-light uppercase text-charcoal leading-tight">
                  {item.name}
                </h3>
                <p className="text-[9px] tracking-[0.1em] text-charcoal/40 mt-1">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 lg:px-12 text-center border-t border-charcoal/5">
        <p className="text-sm text-charcoal/60 mb-4">Looking for something specific?</p>
        <a 
          href="/contact"
          className="inline-block px-8 py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.2em] hover:bg-charcoal/90 transition-colors"
        >
          Inquire About Custom Pieces
        </a>
      </section>
      
      <Footer />
    </main>
  )
}
