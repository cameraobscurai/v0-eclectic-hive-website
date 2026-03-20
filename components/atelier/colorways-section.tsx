const colorways = [
  { name: 'Bone', hex: '#E8E4DC', description: 'Warm white with undertones of clay' },
  { name: 'Charred', hex: '#2D2A26', description: 'Deep black with brown warmth' },
  { name: 'Sienna', hex: '#8B5A3C', description: 'Earthy terracotta, sun-baked' },
  { name: 'Sage', hex: '#A8B5A0', description: 'Muted green, restful and grounded' },
  { name: 'Dusk', hex: '#6B5D52', description: 'Warm taupe, evening atmosphere' },
  { name: 'Flax', hex: '#D4C9B0', description: 'Natural linen, unbleached warmth' },
]

export function ColorwaysSection() {
  return (
    <section className="bg-secondary py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Signature Colorways
            </p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Our proprietary
              <br />
              <span className="italic">palette</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl">
              Color is atmosphere. Our signature colorways are developed through 
              material testing and spatial consideration—each one designed to 
              work in harmony with natural light and architectural context.
            </p>
          </div>
        </div>
        
        {/* Colorways Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {colorways.map((color) => (
            <div key={color.name} className="group">
              <div 
                className="aspect-square mb-4 transition-transform duration-300 group-hover:scale-95"
                style={{ backgroundColor: color.hex }}
              />
              <h3 className="font-serif text-lg tracking-tight">{color.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{color.description}</p>
            </div>
          ))}
        </div>
        
        {/* Custom Colorway Note */}
        <div className="mt-16 lg:mt-24 pt-12 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Custom Development
              </p>
            </div>
            <div className="lg:col-span-6">
              <p className="text-muted-foreground leading-relaxed">
                Beyond our signature palette, we develop custom colorways for specific 
                projects—matching existing materials, responding to architectural context, 
                or creating entirely new palettes that serve the vision of each environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
