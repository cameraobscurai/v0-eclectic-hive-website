import Link from 'next/link'
import Image from 'next/image'

const processSteps = [
  { number: '01', title: 'Discovery', description: 'Understanding vision, context, and constraints' },
  { number: '02', title: 'Concept', description: 'Design direction and material exploration' },
  { number: '03', title: 'Development', description: 'Fabrication, sampling, and refinement' },
  { number: '04', title: 'Realization', description: 'Production, installation, and execution' },
]

export function ProcessPreview() {
  return (
    <section className="bg-secondary py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Image */}
          <div className="lg:col-span-5">
            <div className="aspect-[3/4] relative overflow-hidden editorial-image sticky top-24">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop"
                alt="Design process at work"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Working With The Hive
            </p>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              From vision
              <br />
              <span className="italic">to realization</span>
            </h2>
            
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-lg">
              Our process is designed to honor both creative ambition and practical 
              reality. We guide clients through a structured journey that transforms 
              initial vision into authored environment.
            </p>
            
            {/* Process Steps */}
            <div className="mt-12 lg:mt-16 border-t border-border">
              {processSteps.map((step) => (
                <div 
                  key={step.number}
                  className="py-6 border-b border-border flex gap-6 lg:gap-8"
                >
                  <span className="text-xs text-muted-foreground w-8">{step.number}</span>
                  <div>
                    <h3 className="font-serif text-xl tracking-tight">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <Link 
                href="/process"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
              >
                <span className="editorial-link">Learn About Our Process</span>
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
      </div>
    </section>
  )
}
