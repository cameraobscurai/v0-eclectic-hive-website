import Link from 'next/link'

const services = [
  {
    number: '01',
    title: 'Design',
    description: 'Concept development, spatial planning, material direction, and visual architecture that shapes how environments feel and function.',
  },
  {
    number: '02',
    title: 'Fabrication',
    description: 'Custom construction, proprietary pieces, material manipulation, and finish work that brings design intelligence into physical form.',
  },
  {
    number: '03',
    title: 'Production',
    description: 'Technical coordination, installation management, timeline orchestration, and on-site execution that delivers authored environments.',
  },
]

export function ServicesPreview() {
  return (
    <section className="bg-charcoal text-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
              Capabilities
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Design intelligence.
              <br />
              Fabrication authority.
              <br />
              <span className="italic">Production expertise.</span>
            </h2>
          </div>
        </div>
        
        {/* Services List */}
        <div className="border-t border-cream/10">
          {services.map((service) => (
            <div 
              key={service.number}
              className="py-12 lg:py-16 border-b border-cream/10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 group"
            >
              <div className="lg:col-span-1">
                <span className="text-xs text-cream/40">{service.number}</span>
              </div>
              <div className="lg:col-span-3">
                <h3 className="font-serif text-2xl lg:text-3xl tracking-tight">{service.title}</h3>
              </div>
              <div className="lg:col-span-6">
                <p className="text-cream/60 leading-relaxed">{service.description}</p>
              </div>
              <div className="lg:col-span-2 flex items-center justify-end">
                <Link 
                  href="/services"
                  className="text-xs uppercase tracking-widest text-cream/40 group-hover:text-cream transition-colors editorial-link"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-16 lg:mt-24 flex justify-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
          >
            <span className="editorial-link">Full Service Overview</span>
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
    </section>
  )
}
