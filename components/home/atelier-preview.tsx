import Link from 'next/link'
import Image from 'next/image'

export function AtelierPreview() {
  return (
    <section className="bg-secondary py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Atelier by The Hive
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              The creative engine
              <br />
              <span className="italic">of our studio</span>
            </h2>
          </div>
        </div>
        
        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          {/* Large Image */}
          <div className="md:col-span-7 aspect-[4/5] relative overflow-hidden editorial-image">
            <Image
              src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1200&auto=format&fit=crop"
              alt="Hands working on material fabrication"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Stacked Images */}
          <div className="md:col-span-5 flex flex-col gap-4 lg:gap-6">
            <div className="aspect-[4/3] relative overflow-hidden editorial-image">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop"
                alt="Material samples and textures"
                fill
                className="object-cover"
              />
            </div>
            <div className="aspect-[4/3] relative overflow-hidden editorial-image">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                alt="Fabrication workshop detail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 lg:col-start-4">
            <p className="text-muted-foreground leading-relaxed">
              Our atelier is where materiality meets intention. From custom fabrication 
              to proprietary colorways, every piece carries the mark of hands that 
              understand both craft and concept.
            </p>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <Link 
              href="/atelier"
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
            >
              <span className="editorial-link">Enter Atelier</span>
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
      </div>
    </section>
  )
}
