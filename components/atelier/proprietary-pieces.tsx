import Link from 'next/link'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'

const pieces = [
  {
    name: 'The Meridian Table',
    category: 'Furniture',
    material: 'White oak, blackened steel',
  },
  {
    name: 'Vesper Lounge',
    category: 'Seating',
    material: 'Walnut frame, boucle upholstery',
  },
  {
    name: 'Terra Vessel Collection',
    category: 'Objects',
    material: 'Hand-thrown stoneware, matte glaze',
  },
  {
    name: 'Atrium Screen',
    category: 'Architectural',
    material: 'Brass rod, perforated steel',
  },
]

export function ProprietaryPieces() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Proprietary Pieces
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Authored objects
              <br />
              <span className="italic">born in our studio</span>
            </h2>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <Link 
              href="/gallery"
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
            >
              <span className="editorial-link">View All Pieces</span>
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
        
        {/* Pieces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {pieces.map((piece, index) => (
            <div key={piece.name} className="group">
              <div className="mb-6 overflow-hidden">
                <div className="transition-transform duration-700 group-hover:scale-105">
                  <ImagePlaceholder 
                    aspectRatio="landscape"
                    label={piece.name}
                  />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">{piece.category}</p>
                  <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{piece.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{piece.material}</p>
                </div>
                <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
