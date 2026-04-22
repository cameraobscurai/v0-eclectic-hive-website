import Image from 'next/image'
import Link from 'next/link'

const slides = [
  { id: '01', name: 'Brand Hero', file: '01-brand-hero.jpg' },
  { id: '02', name: 'Typography Hierarchy', file: '02-typography-hierarchy.jpg' },
  { id: '03', name: 'Letterform Showcase', file: '03-letterform-showcase.jpg' },
  { id: '04', name: 'Type + Photography', file: '04-type-photography.jpg' },
  { id: '05', name: 'Color + Materials', file: '05-color-materials.jpg' },
  { id: '06', name: 'Grid System', file: '06-grid-system.jpg' },
  { id: '07', name: 'Process Documentation', file: '07-process-construction.jpg' },
  { id: '08', name: 'Application Suite', file: '08-application-suite.jpg' },
  { id: '09', name: 'Scale Specifications', file: '09-scale-specifications.jpg' },
]

export default function BrandDownloads() {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* Header */}
      <div className="p-8 lg:p-16 border-b border-cream/10">
        <Link 
          href="/brand" 
          className="text-cream/50 text-xs uppercase tracking-[0.3em] hover:text-cream transition-colors"
        >
          Back to Brand
        </Link>
        <h1 className="font-serif text-cream text-4xl lg:text-6xl mt-4 tracking-tight">
          Download Brand Assets
        </h1>
        <p className="text-cream/60 mt-4 max-w-xl">
          Right-click any image and select &quot;Save Image As&quot; to download. All slides are optimized for presentations at 16:9 aspect ratio.
        </p>
      </div>

      {/* Grid of slides */}
      <div className="p-8 lg:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {slides.map((slide) => (
          <div key={slide.id} className="group">
            <div className="relative aspect-video overflow-hidden rounded-lg bg-charcoal/50 border border-cream/10">
              <Image
                src={`/brand-assets/${slide.file}`}
                alt={slide.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <a
                href={`/brand-assets/${slide.file}`}
                download={slide.file}
                className="absolute bottom-4 right-4 px-4 py-2 bg-cream text-charcoal text-xs uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              >
                Download
              </a>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-cream/30 font-mono text-xs">{slide.id}</span>
              <span className="text-cream text-sm">{slide.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Download All Section */}
      <div className="p-8 lg:p-16 border-t border-cream/10">
        <p className="text-cream/40 text-xs uppercase tracking-[0.2em] mb-4">
          All 9 slides generated
        </p>
        <p className="text-cream/60 text-sm">
          These images are available in your project at <code className="text-cream/80 bg-cream/10 px-2 py-0.5 rounded">/public/brand-assets/</code>
        </p>
      </div>
    </main>
  )
}
