'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Lazy load the 3D components for performance
const InlineProductViewer = lazy(() => import('@/components/product-viewer-3d').then(mod => ({ default: mod.InlineProductViewer })))
const Home3DShowcase = lazy(() => import('@/components/home-3d-showcase').then(mod => ({ default: mod.Home3DShowcase })))

// New Collections product images
const NEW_COLLECTION_PRODUCTS = [
  { name: 'GEORGIA Sconce', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GEORGIA%2BSconce%2B1-rnc4CfwUpYrddyEN1oZ9B2AK5yhfyz.webp' },
  { name: 'CRESSIDA Table Lamp', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CRESSIDA%2BTable%2BLamp-7vpkT2QzVYlThgDRVshSk3XOLY5ja7.webp' },
  { name: 'JINA Duo', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JINA%2BDuo-j7eLEUai1yqDNA6NSfIq4Nj5UJZoX4.webp' },
  { name: 'AGATHA Duo', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AGATHA%2BDuo-KYMnfwMmh4lt6l8yfhY7AuLhem533g.webp' },
  { name: 'CONCRETA Wall Sconce', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CONCRETA%2BWall%2BSconce%2B0-49NNZi7tHXTuGuSL9ieNtbgm24eKPZ.webp' },
  { name: 'CULETTA Marble Lamp', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CULETTA%2BMarble%2BCab%2BLamp-wy4XnS6P7WgnkozWwyGLs9QO2FmtNx.webp' },
  { name: 'ARIA Table Lamp', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%27-z4pajVWeYKYf27FFw5FgQdOlsgJXHN.webp' },
  { name: 'MELA Marble Tray', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MELA%2BMarble%2BTray-QoJv0kKnBPqyBPPcBUG4rfKdBygHGI.webp' },
  { name: 'RODRICK Cab Lamp', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RODRICK%2BCab%2BLamp-xwOJ67xlzwd3KMRN3gaZI4kpY58w8f.webp' },
  { name: 'DIVYA Paper Mache Vase', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DIVYA%2BPaper%2BMache%2BVase-FZmZcEEla0Nxg0lEbpyyB6zomAHgDE.webp' },
]

// Real inventory categories
const categories = ['All', 'Sofas & Loveseats', 'Chairs', 'Ottomans', 'Benches'] as const
type Category = typeof categories[number]

// 3D model mapping
const MODEL_3D_MAP: Record<string, string> = {
  'LINDT Sofa': 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb',
}

interface InventoryItem {
  name: string
  category: Category
  image: string
}

const inventory: InventoryItem[] = [
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
    const firstWith3D = Object.keys(MODEL_3D_MAP)[0]
    if (firstWith3D) {
      const timer = setTimeout(() => setActive3DProduct(firstWith3D), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const toggle3DView = (productName: string) => {
    setActive3DProduct(active3DProduct === productName ? null : productName)
  }

  const has3DModel = (productName: string) => productName in MODEL_3D_MAP
  const is3DActive = (productName: string) => active3DProduct === productName

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className={cn('text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4 transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
            The Hive
          </p>
          <h1 className={cn('font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light uppercase text-charcoal transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '100ms' }}>
            Signature Collection
          </h1>
          <p className={cn('text-charcoal/60 mt-6 max-w-xl transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '200ms' }}>
            Modern but timeless. A curated collection where everything is complementary but can stand alone.
          </p>
        </div>
      </section>
      
      {/* 3D Product Showcase */}
      <Suspense fallback={
        <section className="bg-cream pb-16 lg:pb-24">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
            <div className="rounded-2xl bg-sand animate-pulse" style={{ aspectRatio: '21 / 9', maxHeight: '65vh' }} />
          </div>
        </section>
      }>
        <Home3DShowcase />
      </Suspense>
      
      {/* New Collections Carousel */}
      <NewCollectionsSection />
      
      {/* Filter */}
      <section className="px-6 lg:px-12 py-8 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-px bg-charcoal/20" />
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50">Browse Inventory</p>
          </div>
          <div className={cn('flex flex-wrap gap-4 lg:gap-8 transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')} style={{ transitionDelay: '200ms' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn('text-sm uppercase tracking-[0.15em] transition-colors relative pb-1', activeCategory === category ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal/70')}
              >
                {category}
                <span className={cn('absolute bottom-0 left-0 w-full h-px bg-charcoal transition-transform origin-left', activeCategory === category ? 'scale-x-100' : 'scale-x-0')} />
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Product Grid */}
      <section className="px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {inventory.map((item, i) => {
              const isVisible = activeCategory === 'All' || item.category === activeCategory
              return (
                <div
                  key={item.name}
                  className={cn('group transition-all duration-500', loaded && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none', !isVisible && 'hidden')}
                  style={{ transitionDelay: loaded ? `${i * 30}ms` : `${300 + i * 50}ms` }}
                >
                  <div className="relative aspect-square bg-white mb-4 overflow-hidden">
                    {is3DActive(item.name) && has3DModel(item.name) ? (
                      <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-white"><div className="w-6 h-6 border-2 border-charcoal/10 border-t-charcoal/60 rounded-full animate-spin" /></div>}>
                        <InlineProductViewer modelUrl={MODEL_3D_MAP[item.name]} />
                      </Suspense>
                    ) : (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" loading={i < 4 ? "eager" : "lazy"} priority={i === 0} />
                    )}
                    
                    {has3DModel(item.name) && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle3DView(item.name) }}
                        className={cn("absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300", is3DActive(item.name) ? "bg-charcoal text-cream shadow-lg" : "bg-white/90 text-charcoal/60 hover:bg-white hover:text-charcoal shadow-sm border border-charcoal/5")}
                        aria-label={is3DActive(item.name) ? `Show photo of ${item.name}` : `View ${item.name} in 3D`}
                      >
                        {is3DActive(item.name) ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm text-charcoal font-medium">{item.name}</h3>
                      <p className="text-xs text-charcoal/50 uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                    {has3DModel(item.name) && (
                      <span className={cn("text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors", is3DActive(item.name) ? "bg-charcoal text-cream" : "bg-charcoal/5 text-charcoal/50")}>3D</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="px-6 lg:px-12 py-24 bg-charcoal text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.15em] font-light uppercase mb-6">Looking For Something Specific?</h2>
          <p className="text-cream/60 mb-8 max-w-xl mx-auto">Our full inventory includes tables, lighting, decor, and custom fabrication. Get in touch to discuss your event needs.</p>
          <Link href="/contact" className="inline-block px-8 py-3 border border-cream/30 text-sm uppercase tracking-[0.2em] hover:bg-cream hover:text-charcoal transition-all">Request Full Catalog</Link>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

// New Collections Carousel Component
function NewCollectionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } }, { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollRef.current.clientWidth * 0.6 : scrollRef.current.clientWidth * 0.6, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 mb-10">
        <div className="flex items-end justify-between">
          <h2 className={cn("text-2xl md:text-3xl tracking-[0.15em] uppercase font-light text-charcoal transition-all duration-700", isInView ? "translate-y-0 opacity-100" : "translate-y-full opacity-0")}>New Arrivals</h2>
          <div className={cn("flex items-center gap-3 transition-all duration-700 delay-300", isInView ? "opacity-100" : "opacity-0")}>
            <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={cn("w-10 h-10 rounded-full border flex items-center justify-center transition-all", canScrollLeft ? "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream" : "border-charcoal/10 text-charcoal/20 cursor-not-allowed")} aria-label="Scroll left">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={() => scroll('right')} disabled={!canScrollRight} className={cn("w-10 h-10 rounded-full border flex items-center justify-center transition-all", canScrollRight ? "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream" : "border-charcoal/10 text-charcoal/20 cursor-not-allowed")} aria-label="Scroll right">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide px-6 lg:px-16 pb-4" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {NEW_COLLECTION_PRODUCTS.map((product, i) => (
          <div key={product.name} className={cn("group flex-shrink-0 w-[260px] lg:w-[300px] transition-all duration-700", isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} style={{ scrollSnapAlign: 'start', transitionDelay: `${200 + i * 80}ms` }}>
            <div className="relative aspect-[3/4] bg-[#F8F6F3] mb-4 overflow-hidden">
              <Image src={product.src} alt={product.name} fill className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" sizes="300px" />
            </div>
            <p className="text-sm tracking-[0.1em] text-charcoal/70 group-hover:text-charcoal transition-colors">{product.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
