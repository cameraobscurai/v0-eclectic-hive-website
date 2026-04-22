'use client'

const COLORS = [
  { name: 'CHARCOAL', hex: '#1a1a1a', rgb: '26, 26, 26', usage: 'Primary text, backgrounds' },
  { name: 'CREAM', hex: '#f5f2ed', rgb: '245, 242, 237', usage: 'Primary backgrounds, reversed text' },
  { name: 'SAND', hex: '#d4cdc4', rgb: '212, 205, 196', usage: 'Warm neutral, transitions' },
  { name: 'BLACK', hex: '#000000', rgb: '0, 0, 0', usage: 'Maximum contrast moments' },
  { name: 'WARM GRAY', hex: '#8a8a8a', rgb: '138, 138, 138', usage: 'Secondary text, borders' },
]

const MATERIALS = [
  { name: 'WHITE OAK', hex: '#8B7355', descriptor: 'WARM' },
  { name: 'BRUSHED BRASS', hex: '#b8a88a', descriptor: 'PATINATED' },
  { name: 'BELGIAN LINEN', hex: '#c9c4bc', descriptor: 'NATURAL' },
  { name: 'TRAVERTINE', hex: '#d9d2c7', descriptor: 'HONED' },
  { name: 'RATTAN', hex: '#a89880', descriptor: 'WOVEN' },
  { name: 'VELVET', hex: '#2d2d2d', descriptor: 'PLUSH' },
]

export default function Colors() {
  return (
    <main className="min-h-screen bg-cream p-8 lg:p-16">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-16">
          <p>Color System + Material Palette</p>
          <p>Eclectic Hive Brand Guidelines</p>
        </div>

        {/* Primary Colors */}
        <section className="mb-24">
          <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-8">
            Primary Color Palette
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {COLORS.map((color) => (
              <div key={color.name}>
                <div 
                  className="aspect-[4/3] rounded-lg mb-4 border border-charcoal/10"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="font-serif text-charcoal text-sm tracking-[0.15em]">{color.name}</p>
                <p className="font-mono text-charcoal/50 text-xs mt-1">{color.hex}</p>
                <p className="font-mono text-charcoal/40 text-xs">RGB {color.rgb}</p>
                <p className="font-sans text-charcoal/50 text-xs mt-2">{color.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Color combinations */}
        <section className="mb-24">
          <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-8">
            Approved Type/Background Combinations
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Approved combos */}
            <div className="aspect-square bg-cream border border-charcoal/10 rounded-lg flex items-center justify-center">
              <span className="font-serif text-charcoal text-4xl">Aa</span>
            </div>
            <div className="aspect-square bg-charcoal rounded-lg flex items-center justify-center">
              <span className="font-serif text-cream text-4xl">Aa</span>
            </div>
            <div className="aspect-square bg-sand rounded-lg flex items-center justify-center">
              <span className="font-serif text-charcoal text-4xl">Aa</span>
            </div>
            <div className="aspect-square bg-charcoal rounded-lg flex items-center justify-center">
              <span className="font-serif text-[#b8a88a] text-4xl">Aa</span>
            </div>
          </div>
          
          <p className="font-mono text-charcoal/40 text-xs mt-4">
            Charcoal/Cream • Cream/Charcoal • Charcoal/Sand • Brass/Charcoal
          </p>
        </section>

        {/* Material palette */}
        <section>
          <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-8">
            Material Reference Palette
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {MATERIALS.map((mat) => (
              <div key={mat.name}>
                <div 
                  className="aspect-square rounded-lg mb-3 border border-charcoal/10 relative overflow-hidden"
                  style={{ backgroundColor: mat.hex }}
                >
                  {/* Subtle texture overlay */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>
                <p className="font-mono text-charcoal text-xs tracking-[0.1em]">{mat.name}</p>
                <p className="font-mono text-charcoal/40 text-[10px] mt-0.5">{mat.descriptor}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Full width gradient bar */}
        <section className="mt-24">
          <div className="h-24 rounded-lg overflow-hidden flex">
            <div className="flex-1 bg-charcoal" />
            <div className="flex-1 bg-[#3d3d3d]" />
            <div className="flex-1 bg-[#8a8a8a]" />
            <div className="flex-1 bg-sand" />
            <div className="flex-1 bg-cream" />
          </div>
          <p className="font-mono text-charcoal/40 text-xs mt-4 text-center">
            Full tonal range — Dark to Light
          </p>
        </section>
      </div>
    </main>
  )
}
