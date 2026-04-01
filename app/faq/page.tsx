'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PretextAccordion } from '@/components/pretext/accordion'
import { LineReveal } from '@/components/pretext/line-reveal'
import Link from 'next/link'

const faqs = [
  {
    category: 'Working With Us',
    items: [
      {
        id: 'event-types',
        question: 'What types of events do you work on?',
        answer: 'We design environments for weddings, corporate events, galas, private celebrations, brand activations, and experiential installations. Our work spans intimate gatherings of 20 to large-scale productions of 500+. The common thread is clients who value authored environments over assembled ones.',
      },
      {
        id: 'timeline',
        question: 'How far in advance should we reach out?',
        answer: 'For full environment design projects, we recommend reaching out 6-12 months before your event. For design consultation only, 3-6 months provides adequate time. For fabrication-only projects, timing depends on scope and complexity—some pieces require 8-12 weeks of production.',
      },
      {
        id: 'location',
        question: 'Do you work outside of Colorado?',
        answer: 'Yes. While our studio is based in Denver, we work with clients throughout the Mountain West and beyond. We have produced events in Aspen, Jackson Hole, Park City, and other destinations. Travel and logistics are factored into project proposals.',
      },
      {
        id: 'process',
        question: 'What is your design process like?',
        answer: 'Our process moves through five phases: Discovery, Concept Development, Design Development, Fabrication & Production, and Installation. Each phase has clear deliverables and client touchpoints. We believe in collaborative process with clear creative direction.',
      },
    ],
  },
  {
    category: 'Pricing & Investment',
    items: [
      {
        id: 'cost',
        question: 'How much does a project cost?',
        answer: 'Investment varies significantly based on scope, scale, and complexity. As a general orientation: full environment design projects typically begin at $25,000 for design services, with fabrication and production costs varying based on scope. Design consultation engagements begin at $5,000. We provide detailed proposals after initial consultation.',
      },
      {
        id: 'included',
        question: 'What is included in design fees?',
        answer: 'Design fees cover all creative development work: concept development, material direction, spatial planning, renderings, vendor specification, and design management through execution. Fabrication, rentals, florals, and other production elements are typically separate line items.',
      },
      {
        id: 'retainer',
        question: 'Do you require a retainer?',
        answer: 'Yes. We require a retainer to secure your date and begin work. Typically this is 50% of design fees at contract signing, with the balance due before installation. Fabrication and production invoices follow separate schedules based on vendor requirements.',
      },
    ],
  },
  {
    category: 'Services & Capabilities',
    items: [
      {
        id: 'fabrication-only',
        question: 'Can you handle just the fabrication?',
        answer: 'Yes. For event professionals who have their own design direction, we offer fabrication services through our atelier. This includes custom furniture, architectural elements, sculptural pieces, and specialty constructions. We require detailed specifications or work collaboratively to develop them.',
      },
      {
        id: 'rentals',
        question: 'Do you offer rentals?',
        answer: 'Our proprietary inventory is available for use within our design projects—not as standalone rentals. For clients seeking rental-only relationships, we maintain a separate inventory portal with select pieces available. However, our primary offering is the authored environment.',
      },
      {
        id: 'vendors',
        question: 'What about florals, catering, and other vendors?',
        answer: 'We focus on environment design, fabrication, and production. We do not provide florals, catering, or entertainment directly, but we work closely with preferred partners and can make recommendations. Our production team coordinates all vendors to ensure cohesive execution.',
      },
      {
        id: 'existing-vendors',
        question: 'Can you work with our existing vendors?',
        answer: 'Absolutely. We collaborate regularly with planners, florists, caterers, and other event professionals. Clear communication and shared commitment to excellence make these partnerships successful.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
              Frequently Asked Questions
            </p>
            <LineReveal
              text="Questions we hear often"
              tag="h1"
              fontFamily="serif"
              fontSize={56}
              lineHeight={64}
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight"
              staggerDelay={150}
            />
          </div>
        </div>
      </section>
      
      {/* FAQ Sections with Pretext Accordion */}
      {faqs.map((section, sectionIndex) => (
        <section 
          key={section.category}
          className={sectionIndex % 2 === 0 ? 'bg-background' : 'bg-secondary'}
        >
          <div className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-3">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground lg:sticky lg:top-32">
                  {section.category}
                </p>
              </div>
              <div className="lg:col-span-8">
                <PretextAccordion items={section.items} />
              </div>
            </div>
          </div>
        </section>
      ))}
      
      {/* CTA */}
      <section className="bg-charcoal text-cream py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-8">
              Still Have Questions?
            </p>
            <LineReveal
              text="Let's talk"
              tag="h2"
              fontFamily="serif"
              fontSize={48}
              lineHeight={56}
              className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
            />
            <p className="mt-8 text-cream/70 leading-relaxed max-w-xl">
              We welcome conversations about your project, our process, or anything 
              else you&apos;d like to understand before moving forward.
            </p>
            <div className="mt-12">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-cream text-charcoal text-sm uppercase tracking-widest hover:bg-cream/90 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
