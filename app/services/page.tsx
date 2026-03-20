import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services | Eclectic Hive',
  description: 'Design intelligence, fabrication authority, and production expertise. We shape environments through a complete service architecture.',
}

const services = [
  {
    id: 'design',
    number: '01',
    title: 'Design',
    subtitle: 'Intelligence & Vision',
    description: 'Design at Eclectic Hive is not decoration—it is the intellectual framework that shapes how environments feel, function, and resonate. We approach every project with spatial awareness, material intelligence, and a commitment to creating atmospheres that cannot be replicated.',
    capabilities: [
      'Concept development & creative direction',
      'Spatial planning & layout design',
      'Material selection & palette development',
      'Custom furniture & fixture design',
      'Lighting design & atmosphere planning',
      'Rendering & visualization',
      'Vendor curation & specification',
    ],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'fabrication',
    number: '02',
    title: 'Fabrication',
    subtitle: 'Authority & Craft',
    description: 'Our atelier is where design intelligence takes physical form. We fabricate proprietary pieces, custom elements, and bespoke constructions that carry the signature of our process. This is not outsourced production—it is authored making.',
    capabilities: [
      'Custom furniture fabrication',
      'Structural installations & backdrops',
      'Sculptural elements & art pieces',
      'Upholstery & soft goods',
      'Metal work & welding',
      'Wood construction & finishing',
      'Material prototyping & sampling',
    ],
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'production',
    number: '03',
    title: 'Production',
    subtitle: 'Expertise & Execution',
    description: 'Production is the discipline that transforms design vision into lived reality. Our production team manages every logistical, technical, and operational detail—from vendor coordination through on-site installation—ensuring that the environment we deliver matches the environment we designed.',
    capabilities: [
      'Project management & timeline development',
      'Vendor coordination & contract management',
      'Technical production & engineering',
      'Logistics & transportation',
      'On-site installation & crew management',
      'Quality control & finishing',
      'Strike & post-event coordination',
    ],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  },
]

const differentiators = [
  {
    title: 'Integrated Approach',
    description: 'Design, fabrication, and production work as one unified process—not separate services stitched together.',
  },
  {
    title: 'Proprietary Capability',
    description: 'Our in-house fabrication means we control quality, iterate rapidly, and create truly custom elements.',
  },
  {
    title: 'Design Authority',
    description: 'Every environment we create carries a point of view. We are authors, not executors of others\' visions.',
  },
  {
    title: 'Material Intelligence',
    description: 'We understand how materials behave in space—their weight, texture, response to light, and atmospheric impact.',
  },
]

export default function ServicesPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Our Services
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
                Design intelligence.
                <br />
                Fabrication authority.
                <br />
                <span className="italic">Production expertise.</span>
              </h1>
            </div>
            <div className="lg:col-span-4 flex items-end">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed">
                We shape environments through a complete service architecture—from 
                initial concept through final installation. Each discipline informs 
                the others.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services */}
      {services.map((service, index) => (
        <section 
          key={service.id}
          id={service.id}
          className={index % 2 === 0 ? 'bg-background' : 'bg-secondary'}
        >
          <div className="py-24 lg:py-40 px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Content */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2 lg:col-start-8' : ''}`}>
                <div className="lg:sticky lg:top-32">
                  <span className="text-xs text-muted-foreground">{service.number}</span>
                  <h2 className="mt-4 font-serif text-4xl lg:text-5xl tracking-tight">{service.title}</h2>
                  <p className="mt-2 text-lg text-muted-foreground italic">{service.subtitle}</p>
                  <p className="mt-8 text-muted-foreground leading-relaxed">{service.description}</p>
                  
                  <div className="mt-12">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Capabilities</p>
                    <ul className="flex flex-col gap-3">
                      {service.capabilities.map((cap) => (
                        <li key={cap} className="text-sm text-foreground flex items-start gap-3">
                          <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Image */}
              <div className={`lg:col-span-6 ${index % 2 === 1 ? 'lg:order-1' : 'lg:col-start-7'}`}>
                <div className="aspect-[3/4] relative overflow-hidden editorial-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
      
      {/* Differentiators */}
      <section className="bg-charcoal text-cream py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                What Sets Us Apart
              </p>
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
                The difference
                <br />
                <span className="italic">is integration</span>
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {differentiators.map((item) => (
              <div key={item.title} className="py-8 border-t border-cream/10">
                <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{item.title}</h3>
                <p className="mt-4 text-cream/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Let's Work Together
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Ready to author
              <br />
              <span className="italic">your environment?</span>
            </h2>
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Whether you need full environment design, fabrication expertise, or 
              production management, we welcome conversations about how our 
              capabilities can serve your vision.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
              >
                Start an Inquiry
              </Link>
              <Link 
                href="/process"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
              >
                <span className="editorial-link">View Our Process</span>
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
      
      <Footer />
    </main>
  )
}
