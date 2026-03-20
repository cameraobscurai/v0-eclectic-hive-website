import Link from 'next/link'
import Image from 'next/image'

const collections = [
  {
    title: 'Terra',
    description: 'Earthen forms, raw textures, grounded palettes',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Atrium',
    description: 'Architectural volumes, light play, spatial rhythm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Vesper',
    description: 'Evening warmth, intimate scale, golden hour',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop',
  },
]

export function CollectionsSection() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Signature Collections
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Proprietary pieces
              <br />
              <span className="italic">authored by The Hive</span>
            </h2>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <Link 
              href="/gallery"
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
            >
              <span className="editorial-link">View All</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {collections.map((collection, index) => (
            <Link 
              key={collection.title}
              href={`/gallery?collection=${collection.title.toLowerCase()}`}
              className="group"
            >
              <div className="aspect-[3/4] relative overflow-hidden editorial-image mb-6">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-2xl tracking-tight">{collection.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
