import Image from 'next/image'

const processSteps = [
  {
    number: '01',
    title: 'Concept Sketching',
    description: 'Initial form exploration, proportion studies, and spatial relationships translated into visual language.',
  },
  {
    number: '02',
    title: 'Material Sampling',
    description: 'Physical samples, finish tests, and material combinations evaluated for texture, durability, and atmosphere.',
  },
  {
    number: '03',
    title: 'Prototype Development',
    description: 'Full-scale or scaled mockups that allow for physical assessment and iterative refinement.',
  },
  {
    number: '04',
    title: 'Final Fabrication',
    description: 'Production-quality construction with attention to joinery, finish, and installation requirements.',
  },
]

export function FabricationProcess() {
  return (
    <section className="bg-charcoal text-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <div className="lg:col-span-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-8">
              The Making
            </p>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              From rendering
              <br />
              <span className="italic">to reality</span>
            </h2>
            
            <p className="mt-8 text-cream/70 leading-relaxed max-w-lg">
              Fabrication at Eclectic Hive is not outsourced production—it is 
              authored construction. Our in-house capabilities allow us to control 
              quality, iterate rapidly, and create pieces that carry the signature 
              of our process.
            </p>
            
            {/* Process Steps */}
            <div className="mt-12 lg:mt-16 border-t border-cream/10">
              {processSteps.map((step) => (
                <div 
                  key={step.number}
                  className="py-8 border-b border-cream/10 grid grid-cols-12 gap-4"
                >
                  <span className="col-span-2 text-xs text-cream/40">{step.number}</span>
                  <div className="col-span-10">
                    <h3 className="font-serif text-xl tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-sm text-cream/60 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Image */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[3/4] relative overflow-hidden editorial-image lg:sticky lg:top-24">
              <Image
                src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1000&auto=format&fit=crop"
                alt="Fabrication in progress"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
