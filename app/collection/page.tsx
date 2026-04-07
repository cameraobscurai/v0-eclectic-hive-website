'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Real inventory from eclectichive.com/lounge
const categories = ['All', 'Sofas & Loveseats', 'Chairs', 'Ottomans', 'Benches'] as const

type Category = typeof categories[number]

interface InventoryItem {
  name: string
  category: Category
  image: string
}

const inventory: InventoryItem[] = [
  // Sofas & Loveseats
  {
    name: 'BROOKLYN Plush Charcoal Sofa',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393192804-GCYSRGVJ8BJOCF3G6AKM/BROOKLYN_Sofa_0.png',
  },
  {
    name: 'INDIWIN Black Leather Sofa',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393201962-4E4HKZNINTLTPTQE7Z8O/INDIWIN_Sofa_0.png',
  },
  {
    name: 'COMMODORE Loveseat',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393196196-R3Y8R06K2J5WA1U60A7L/COMMODORE_Loveseat_0.png',
  },
  {
    name: 'LINDT Sofa',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393204231-W79P4V24URXTZREUL8H6/LINDT_Sofa_0.png',
  },
  {
    name: 'ROWNTREE Loveseat',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393208199-T1PV7YUR0DLMIF03FSXK/ROWNTREE_Loveseat_0.png',
  },
  {
    name: 'TALON Sofa',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393210705-JO0E30UY5SYVT0UISJBN/TALON_Sofa_0.png',
  },
  {
    name: 'FULTON Sofa',
    category: 'Sofas & Loveseats',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/11b30ad1-48f5-4a7d-8883-40f69109bc7b/FULTON+0.png',
  },
  // Chairs
  {
    name: 'AMUN Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392532843-ZQLQ3KY0IOG0JUSD8KER/AMUN_Chair_0.png',
  },
  {
    name: 'CORWIN Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392539804-4LSL3IC56ZB7YVFL6776/CORWIN_Chair_0.png',
  },
  {
    name: 'FAWN Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392541345-5CG504FJQ6OW32LXPNWB/FAWN_Chair_0.png',
  },
  {
    name: 'NOMAD Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392559367-97Z0Y25TANXEVYRKKMO0/NOMAD_Chair_0.png',
  },
  {
    name: 'PHILLIPE Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392561544-NQBPAEREQYDBVA1BQUC5/PHILLIPE_Chair_0.png',
  },
  {
    name: 'POE Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603392562230-MGXXYP0I9K9CXM2HEXR5/POE_Chair_0.png',
  },
  {
    name: 'JESAMAY Chair',
    category: 'Chairs',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/0bf81375-08dc-4f07-b967-998d4eb24c6a/JESAMAY+Chair+1.png',
  },
  // Ottomans
  {
    name: 'BLANC Ottoman',
    category: 'Ottomans',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393243597-KA9UEJWDU2W1FGZ4YPFI/BLANC_Ottoman_0.png',
  },
  {
    name: 'JESSE Ottoman',
    category: 'Ottomans',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393254929-OOYG9DIM926MKOS7LL98/JESSE_Ottoman_0.png',
  },
  {
    name: 'JOSEPH Ottoman',
    category: 'Ottomans',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393255561-IWR49LKBAJ9HS38VXNMR/JOSEPH_Ottoman_0.png',
  },
  {
    name: 'MORRISON Ottoman',
    category: 'Ottomans',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393257537-H14GYO650OVBK1HJN1NZ/MORRISON_Ottoman_0.png',
  },
  {
    name: 'LEANNA Ivory Ottoman',
    category: 'Ottomans',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/05dc4531-0bc5-48b6-b990-4a3182d27c85/LEANNA+Ivory+Ottoman.png',
  },
  // Benches
  {
    name: 'GERALDINE Bench',
    category: 'Benches',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1603393252388-UW0QERFB3LZ3448C3T2U/GERALDINE_Bench_0.png',
  },
]

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <main id="main-content" className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p 
            className={cn(
              'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4 transition-all duration-700',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            The Hive
          </p>
          <h1 
            className={cn(
              'font-display text-5xl md:text-6xl lg:text-7xl tracking-tight font-light italic text-charcoal transition-all duration-700',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
            style={{ transitionDelay: '100ms' }}
          >
            Signature Collection
          </h1>
          <p 
            className={cn(
              'text-charcoal/60 mt-6 max-w-xl transition-all duration-700',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Modern but timeless. A curated collection where everything is complimentary but can stand alone.
          </p>
        </div>
      </section>
      
      {/* Filter */}
      <section className="px-6 lg:px-12 pb-12 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto">
          <div 
            className={cn(
              'flex flex-wrap gap-4 lg:gap-8 transition-all duration-700',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'text-sm uppercase tracking-[0.15em] transition-colors relative pb-1',
                  activeCategory === category 
                    ? 'text-charcoal' 
                    : 'text-charcoal/40 hover:text-charcoal/70'
                )}
              >
                {category}
                <span 
                  className={cn(
                    'absolute bottom-0 left-0 w-full h-px bg-charcoal transition-transform origin-left',
                    activeCategory === category ? 'scale-x-100' : 'scale-x-0'
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Grid - stable keys, CSS-based show/hide for smooth transitions */}
      <section className="px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {inventory.map((item, i) => {
              const isVisible = activeCategory === 'All' || item.category === activeCategory
              return (
              <div
                key={item.name}
                className={cn(
                  'group transition-all duration-500',
                  loaded && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
                  !isVisible && 'hidden'
                )}
                style={{ transitionDelay: loaded ? `${i * 30}ms` : `${300 + i * 50}ms` }}
              >
                <div className="relative aspect-square bg-white mb-4 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <h3 className="text-sm text-charcoal font-medium">{item.name}</h3>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider mt-1">{item.category}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="px-6 lg:px-12 py-24 bg-charcoal text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-tight font-light italic mb-6">
            Looking for something specific?
          </h2>
          <p className="text-cream/60 mb-8 max-w-xl mx-auto">
            Our full inventory includes tables, lighting, decor, and custom fabrication. 
            Get in touch to discuss your event needs.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 border border-cream/30 text-sm uppercase tracking-[0.2em] hover:bg-cream hover:text-charcoal transition-all"
          >
            Request Full Catalog
          </a>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
