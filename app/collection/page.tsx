'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Lazy load 3D viewer for performance
const InlineProductViewer = lazy(() => import('@/components/product-viewer-3d').then(mod => ({ default: mod.InlineProductViewer })))

// Categories
const categories = ['All', 'Sofas & Loveseats', 'Chairs', 'Ottomans', 'Benches', 'New Arrivals'] as const
type Category = typeof categories[number]

// 3D model mapping - products with 3D models available
const MODEL_3D_MAP: Record<string, string> = {
  'LINDT Sofa': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb',
}

interface InventoryItem {
  name: string
  category: Category
  image: string
  isNew?: boolean
}

const inventory: InventoryItem[] = [
  // New Arrivals (also tagged with their actual category)
  { name: 'GEORGIA Sconce', category: 'New Arrivals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GEORGIA%2BSconce%2B1-rnc4CfwUpYrddyEN1oZ9B2AK5yhfyz.webp', isNew: true },
  { name: 'CRESSIDA Table Lamp', category: 'New Arrivals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CRESSIDA%2BTable%2BLamp-7vpkT2QzVYlThgDRVshSk3XOLY5ja7.webp', isNew: true },
  { name: 'JINA Duo', category: 'New Arrivals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JINA%2BDuo-j7eLEUai1yqDNA6NSfIq4Nj5UJZoX4.webp', isNew: true },
  { name: 'AGATHA Duo', category: 'New Arrivals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AGATHA%2BDuo-KYMnfwMmh4lt6l8yfhY7AuLhem533g.webp', isNew: true },
  { name: 'CONCRETA Wall Sconce', category: 'New Arrivals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CONCRETA%2BWall%2BSconce%2B0-49NNZi7tHXTuGuSL9ieNtbgm24eKPZ.webp', isNew: true },
  { name: 'CULETTA Marble Lamp', category: 'New Arrivals', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CULETTA%2BMarble%2BCab%2BLamp-wy4XnS6P7WgnkozWwyGLs9QO2FmtNx.webp', isNew: true },
  // Sofas & Loveseats
  { name: 'BROOKLYN Plush Charcoal Sofa', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png' },
  { name: 'INDIWIN Black Leather Sofa', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png' },
  { name: 'COMMODORE Loveseat', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png' },
  { name: 'LINDT Sofa', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png' },
  { name: 'ROWNTREE Loveseat', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png' },
  { name: 'TALON Sofa', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png' },
  { name: 'FULTON Sofa', category: 'Sofas & Loveseats', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png' },
  // Chairs
  { name: 'AMUN Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png' },
  { name: 'CORWIN Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png' },
  { name: 'FAWN Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png' },
  { name: 'NOMAD Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png' },
  { name: 'PHILLIPE Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png' },
  { name: 'POE Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png' },
  { name: 'JESAMAY Chair', category: 'Chairs', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/0bf81375-08dc-4f07-b967-998d4eb24c6a/JESAMAY+Chair+1.png' },
  // Ottomans
  { name: 'BLANC Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png' },
  { name: 'JESSE Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png' },
  { name: 'JOSEPH Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png' },
  { name: 'MORRISON Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png' },
  { name: 'LEANNA Ivory Ottoman', category: 'Ottomans', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png' },
  // Benches
  { name: 'GERALDINE Bench', category: 'Benches', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png' },
]

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loaded, setLoaded] = useState(false)
  const [active3DProduct, setActive3DProduct] = useState<string | null>(null)

  useEffect(() => {
    setLoaded(true)
    // Auto-activate 3D for first product with a model after delay
    const firstWith3D = Object.keys(MODEL_3D_MAP)[0]
    if (firstWith3D) {
      const timer = setTimeout(() => setActive3DProduct(firstWith3D), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const toggle3DView = (productName: string) => {
    setActive3DProduct(active3DProduct === productName ? null : productName)
  }

  const has3DModel = (productName: string) => productName in MODEL_3D_MAP
  const is3DActive = (productName: string) => active3DProduct === productName

  const filteredInventory = activeCategory === 'All' 
    ? inventory 
    : inventory.filter(item => item.category === activeCategory || (activeCategory === 'New Arrivals' && item.isNew))

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Compact Header */}
      <section className="pt-28 pb-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className={cn(
            'font-display text-3xl md:text-4xl tracking-[0.2em] font-light uppercase text-charcoal transition-all duration-700 normal-case',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            Signature Collection
          </h1>
        </div>
      </section>
      
      {/* Sticky Filter Bar */}
      <section className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-all pb-1 relative',
                  activeCategory === category 
                    ? 'text-charcoal' 
                    : 'text-charcoal/40 hover:text-charcoal/70'
                )}
              >
                {category}
                {category === 'New Arrivals' && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-sand inline-block" />
                )}
                <span className={cn(
                  'absolute bottom-0 left-0 w-full h-px bg-charcoal transition-transform origin-left',
                  activeCategory === category ? 'scale-x-100' : 'scale-x-0'
                )} />
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Product Grid - THE PRIMARY CONTENT */}
      <section className="px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Item count */}
          <p className={cn(
            'text-xs text-charcoal/40 mb-6 transition-all duration-500',
            loaded ? 'opacity-100' : 'opacity-0'
          )}>
            {filteredInventory.length} {filteredInventory.length === 1 ? 'piece' : 'pieces'}
          </p>
          
          {/* Tight grid - 4px gaps as requested */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {filteredInventory.map((item, i) => (
              <div
                key={item.name}
                className={cn(
                  'group transition-all duration-500',
                  loaded ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {/* Product Card */}
                <div className="relative aspect-square bg-white overflow-hidden">
                  {/* 3D Viewer or Static Image */}
                  {is3DActive(item.name) && has3DModel(item.name) ? (
                    <Suspense fallback={
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <div className="w-5 h-5 border-2 border-charcoal/10 border-t-charcoal/50 rounded-full animate-spin" />
                      </div>
                    }>
                      <InlineProductViewer modelUrl={MODEL_3D_MAP[item.name]} />
                    </Suspense>
                  ) : (
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105" 
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading={i < 8 ? "eager" : "lazy"}
                    />
                  )}
                  
                  {/* New Badge */}
                  {item.isNew && (
                    <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider px-2 py-0.5 bg-charcoal text-cream">
                      New
                    </span>
                  )}
                  
                  {/* 3D Toggle */}
                  {has3DModel(item.name) && (
                    <button
                      onClick={() => toggle3DView(item.name)}
                      className={cn(
                        "absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300",
                        is3DActive(item.name)
                          ? "bg-charcoal text-cream"
                          : "bg-white/80 text-charcoal/50 hover:bg-white hover:text-charcoal border border-charcoal/10"
                      )}
                      aria-label={is3DActive(item.name) ? 'Show photo' : 'View in 3D'}
                    >
                      {is3DActive(item.name) ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Product Info - Minimal */}
                <div className="py-3 px-1">
                  <h3 className="text-xs text-charcoal tracking-wide">{item.name}</h3>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider mt-0.5">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Minimal CTA */}
      <section className="px-6 lg:px-12 py-16 border-t border-charcoal/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display text-xl tracking-[0.2em] font-light uppercase text-charcoal normal-case">
              Looking for something specific?
            </h2>
            <p className="text-sm text-charcoal/50 mt-2">Full catalog includes tables, lighting, decor, and custom fabrication.</p>
          </div>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-colors group"
          >
            Request Full Catalog
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
