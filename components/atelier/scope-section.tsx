'use client'

import { Parallax, Reveal } from '@/components/animations/motion-elements'

const capabilities = [
  {
    title: 'Environment Design',
    description: 'Complete spatial design for events, from concept through execution.',
  },
  {
    title: 'Custom Fabrication',
    description: 'Bespoke furniture, installations, and architectural elements built in-house.',
  },
  {
    title: 'Material Curation',
    description: 'Sourcing and specifying materials that elevate the design narrative.',
  },
  {
    title: 'Production Management',
    description: 'End-to-end coordination ensuring flawless delivery on site.',
  },
  {
    title: 'Inventory Rental',
    description: 'Access to our Signature Collection of proprietary lounge and decor pieces.',
  },
  {
    title: 'Destination Events',
    description: 'We travel wherever our clients and their visions take us.',
  },
]

export function ScopeSection() {
  return (
    <section className="bg-charcoal text-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Header — sticky on desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-6">
              Scope of Work
            </p>
            <Reveal direction="up" delay={0} overlayColor="bg-charcoal">
              <h2 className="font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase">
                Full-service design + production
              </h2>
            </Reveal>
          </div>

          {/* Capabilities Grid — alternating motion types for depth */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {capabilities.map((item, i) => (
                // ODD items: Parallax (slower, background feel)
                // EVEN items: Reveal wipe (foreground feel)
                i % 2 === 0 ? (
                  <Parallax key={item.title} speed={0.15} direction="up">
                    <div className="border-t border-cream/20 pt-6">
                      <h3 className="font-display text-xl tracking-tight font-normal mb-3">{item.title}</h3>
                      <p className="text-cream/60 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </Parallax>
                ) : (
                  <Reveal key={item.title} direction="left" delay={i * 0.05} overlayColor="bg-charcoal">
                    <div className="border-t border-cream/20 pt-6">
                      <h3 className="font-display text-xl tracking-tight font-normal mb-3">{item.title}</h3>
                      <p className="text-cream/60 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </Reveal>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
