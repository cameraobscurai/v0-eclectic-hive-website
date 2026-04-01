import { ImagePlaceholder } from '@/components/ui/image-placeholder'

const materials = [
  {
    name: 'Textiles',
    description: 'Velvet, linen, raw silk, boucle, performance fabrics',
  },
  {
    name: 'Woods',
    description: 'White oak, walnut, ash, reclaimed timber, engineered panels',
  },
  {
    name: 'Metals',
    description: 'Brass, blackened steel, copper, aluminum, bronze patina',
  },
  {
    name: 'Ceramics',
    description: 'Handthrown vessels, architectural tiles, glazed surfaces',
  },
]

export function MaterialsSection() {
  return (
    <section className="bg-secondary py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Material Intelligence
            </p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Touch. Weight.
              <br />
              <span className="italic">Surface. Response.</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl">
              Materials are not decorative choices. They are the vocabulary through which 
              we communicate atmosphere, quality, and intention. We source, sample, and 
              specify with obsessive attention to how things feel in space.
            </p>
          </div>
        </div>
        
        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {materials.map((material, index) => (
            <div key={material.name} className="group">
              <div className="mb-4 overflow-hidden">
                <div className="transition-transform duration-700 group-hover:scale-105">
                  <ImagePlaceholder 
                    aspectRatio="portrait"
                    label={material.name}
                  />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-lg tracking-tight">{material.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{material.description}</p>
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
