'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { X, ChevronRight } from 'lucide-react'

// Organized media categories
const MEDIA_CATEGORIES = [
  {
    id: 'ui-system',
    title: 'UI/UX System',
    description: 'Design framework, site architecture, and component anatomy',
    images: [
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2004_02_30%20AM-PC1QPFzv8coKtHdTmyohE6e5v8RGrq.png',
        title: 'System Overview Light',
        aspect: '16/9'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2003_58_02%20AM-g0JxI4uxmPS4cxhgVGuZ5MPA1jcg8J.png',
        title: 'System Overview Dark',
        aspect: '16/9'
      },
    ]
  },
  {
    id: 'product-views',
    title: 'Product Photography',
    description: 'Multi-angle product views and exploded diagrams',
    images: [
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_28%20AM%20%287%29-ogThIzfVzpR22E72NOewa8VIWPPe9I.png',
        title: 'Lindt Toffee Sofa - Multi-view',
        aspect: '1/1'
      },
      { src: '/images/atelier/sidony-loveseat.png', title: 'Sidony Loveseat', aspect: '1/1' },
      { src: '/images/atelier/green-channel-sofa.png', title: 'Green Channel Sofa', aspect: '1/1' },
      { src: '/images/atelier/iron-bench.png', title: 'Iron Bench', aspect: '1/1' },
      { src: '/images/atelier/rosalind-banquette.png', title: 'Rosalind Banquette', aspect: '1/1' },
      { src: '/images/atelier/chesterfield.png', title: 'Leather Chesterfield', aspect: '1/1' },
    ]
  },
  {
    id: 'seating',
    title: 'Seating Collection',
    description: 'Chairs, accent pieces, and statement seating',
    images: [
      { src: '/images/atelier/ava-sage-chair.png', title: 'Ava Sage Chair', aspect: '1/1' },
      { src: '/images/atelier/black-cane-chair.png', title: 'Black Cane Chair', aspect: '1/1' },
      { src: '/images/atelier/reshma-botanical.png', title: 'Reshma Botanical Sofa', aspect: '1/1' },
      { src: '/images/atelier/alora-botanical.png', title: 'Alora Botanical Chair', aspect: '1/1' },
    ]
  },
  {
    id: 'tableware',
    title: 'Tableware',
    description: 'Dinnerware, flatware, and glassware collections',
    images: [
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_13_08%20AM-cuAv2o9C6y11pcarZNqzqEKYnyIjcT.png',
        title: 'Complete Tableware System',
        aspect: '16/9'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%282%29-0zX2cuKc6paMuf77FLcquXFUaTAiZ7.png',
        title: 'Dinnerware Stacks I',
        aspect: '16/9'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%283%29-ISawYAP157izouDbFgfnV2fKubjwQQ.png',
        title: 'Dinnerware Stacks II',
        aspect: '16/9'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_18_29%20AM-c2Qro4enKvZSCX7hpsrqDk1WuhS1em.png',
        title: 'Glassware Collection',
        aspect: '16/9'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_18_34%20AM-RzlhofmL5EQTqjDOAgEo8oBNqr61I2.png',
        title: 'Flatware Collection',
        aspect: '16/9'
      },
    ]
  },
  {
    id: 'lighting',
    title: 'Lighting',
    description: 'Table lamps, floor lamps, lanterns, and votives',
    images: [
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_22_22%20AM-OmoDdFeniqqk82l8iegQh31luyI75r.png',
        title: 'Complete Lighting Collection',
        aspect: '16/9'
      },
    ]
  },
  {
    id: 'vignettes',
    title: 'Styled Vignettes',
    description: 'Lifestyle photography and styled environments',
    images: [
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_33_39%20AM-i3tVPuiTbhTLfdzp2THZmBRDfyaKBD.png',
        title: 'The Gathered Table',
        aspect: '1/1'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png',
        title: 'Quiet Corners',
        aspect: '1/1'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%281%29-ysnOsz5FYFEPQzufogthldORvQWG5F.png',
        title: 'Objects of Interest',
        aspect: '1/1'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_41%20AM%20%284%29-d9QCIVvJ0A0HwHkvgomCLIsSZpTltS.png',
        title: 'Layered Comfort',
        aspect: '1/1'
      },
      { 
        src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%283%29-AJLa39oz4oGazs06HWIawRq61cYiuT.png',
        title: 'Still Life',
        aspect: '1/1'
      },
    ]
  },
]

type CategoryImage = {
  src: string
  title: string
  aspect: string
}

export function MediaLibrarySection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [lightboxImage, setLightboxImage] = useState<CategoryImage | null>(null)

  return (
    <section className="py-24 md:py-32 bg-cream border-t border-charcoal/10">
      <div className="container-padding max-w-[1600px] mx-auto">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-wide text-charcoal/40 mb-4">
            Asset Library
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-display text-charcoal">
            Media Collection
          </h2>
          <p className="text-charcoal/50 mt-4 max-w-lg leading-relaxed">
            Organized visual assets across categories. Click to expand a collection 
            or select an image to view in detail.
          </p>
        </div>

        {/* Categories List */}
        <div className="space-y-1">
          {MEDIA_CATEGORIES.map((category) => {
            const isExpanded = expandedCategory === category.id
            
            return (
              <div key={category.id} className="border-b border-charcoal/10">
                {/* Category Header */}
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    {/* Preview thumbnails */}
                    <div className="hidden sm:flex gap-1">
                      {category.images.slice(0, 3).map((img, i) => (
                        <div 
                          key={i}
                          className="w-12 h-12 bg-charcoal/5 overflow-hidden"
                        >
                          <Image
                            src={img.src}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {category.images.length > 3 && (
                        <div className="w-12 h-12 bg-charcoal/10 flex items-center justify-center">
                          <span className="text-[10px] text-charcoal/50">+{category.images.length - 3}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Title and description */}
                    <div>
                      <h3 className="text-lg font-display tracking-wide text-charcoal group-hover:text-charcoal/70 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-charcoal/40 mt-0.5 hidden md:block">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-charcoal/30">{category.images.length} items</span>
                    <ChevronRight 
                      className={cn(
                        "w-5 h-5 text-charcoal/30 transition-transform duration-300",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  </div>
                </button>
                
                {/* Expanded Gallery */}
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-out",
                    isExpanded ? "max-h-[2000px] opacity-100 pb-8" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-4">
                    {category.images.map((image, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImage(image)}
                        className="group relative bg-charcoal/5 overflow-hidden"
                        style={{ aspectRatio: image.aspect === '16/9' ? '16/9' : '1/1' }}
                      >
                        <Image
                          src={image.src}
                          alt={image.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-cream text-xs truncate">{image.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-cream/60 hover:text-cream transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative w-full"
              style={{ aspectRatio: lightboxImage.aspect === '16/9' ? '16/9' : '4/3' }}
            >
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <p className="text-cream text-center mt-4 text-sm tracking-wide">{lightboxImage.title}</p>
          </div>
        </div>
      )}
    </section>
  )
}
