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
        id: 'process',
        question: 'What is your process for new clients?',
        answer: 'During a consultation call with our team, we learn about your vision and how we can best support you. Once direction is established, we create a budget range and prepare a 1-2 page Style Guide. A non-refundable Creative Services Fee and signed contract secures your date, after which your designer creates a customized proposal with detailed estimate.',
      },
      {
        id: 'proposals',
        question: 'Do you provide proposals before signing a contract?',
        answer: 'In an effort to protect our time with clients who have made a financial investment to our team, we do not provide full design proposals without receiving a Creative Services Fee and signed contract. Contracted clients receive prioritized attention and time with design and logistical details.',
      },
      {
        id: 'location',
        question: 'Do you work outside of Colorado?',
        answer: 'We are predominantly a destination design house, traveling wherever our clients and projects take us. We offer both domestic and international design services and support. Our fees include accommodations, per diems and mileage for those projects.',
      },
      {
        id: 'minimums',
        question: 'Do you have minimum project requirements?',
        answer: 'We do not have set minimums as the availability of our team and inventory shifts throughout the year, depending on existing booked events and seasonality of our inquiries. Our team works closely together to discuss every opportunity to ensure we can successfully fulfill the scope of services requested.',
      },
    ],
  },
  {
    category: 'Services & Capabilities',
    items: [
      {
        id: 'full-service',
        question: 'What does full-service design include?',
        answer: 'We are a full-service design and production house. Our curated collection includes lounge furniture, bars + cocktail tables, lighting, tableware, dining tables + chairs, custom designs and fabrication, stage design, dance floor vinyl, food + beverage styling, graphics, drape, and accents/styling.',
      },
      {
        id: 'production',
        question: 'What production services do you offer?',
        answer: 'We provide full production management including space planning + CAD design, 3D modeling of event spaces, vendor management, production timeline management, logistical on-site management, support with permit and code inspections, entertainment management and run of show.',
      },
      {
        id: 'rentals',
        question: 'Can I just rent items without design services?',
        answer: 'We are happy to provide rental-only services for those clients who do not need design or production support but want access to our inventory collection. However, our primary offering is the authored environment—designed, fabricated, and produced as a complete expression.',
      },
      {
        id: 'planners',
        question: 'Do you work with event planners?',
        answer: 'We provide full production management to planners who wish to remain client + guest-facing, while we ensure a seamless production from pre-planning to execution behind the scenes. This allows planners to focus on their strengths while we handle the technical production.',
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
