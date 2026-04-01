'use client'

import { useState, useRef, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { LineReveal, HighlightReveal } from '@/components/pretext/line-reveal'
import { PullQuoteFlow } from '@/components/pretext/editorial-flow'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const processPhases = [
  {
    number: '01',
    title: 'Discovery',
    duration: '1-2 weeks',
    description: 'We begin by understanding the full context of your vision—the event, the space, the audience, the feeling you want to create. This phase includes site visits, reference sharing, and deep conversation about what the environment should accomplish.',
    deliverables: ['Vision brief', 'Site analysis', 'Initial budget framework'],
  },
  {
    number: '02',
    title: 'Concept Development',
    duration: '2-4 weeks',
    description: 'Our design team translates discovery insights into visual and spatial concepts. We develop mood directions, material palettes, layout studies, and preliminary renderings that communicate the environment we are proposing.',
    deliverables: ['Concept presentation', 'Material direction', 'Spatial layouts', 'Budget refinement'],
  },
  {
    number: '03',
    title: 'Design Development',
    duration: '3-6 weeks',
    description: 'With concept approved, we move into detailed design. This includes custom fabrication drawings, finish selections, lighting plans, and vendor coordination. Every element is specified and sourced.',
    deliverables: ['Detailed renderings', 'Fabrication specs', 'Vendor contracts', 'Final budget'],
  },
  {
    number: '04',
    title: 'Fabrication & Production',
    duration: '4-12 weeks',
    description: 'Our atelier and production team bring the design to life. Custom pieces are fabricated, materials are prepared, and all logistics are coordinated for seamless installation.',
    deliverables: ['Custom fabrication', 'Material preparation', 'Production timeline', 'Installation plan'],
  },
  {
    number: '05',
    title: 'Installation & Execution',
    duration: '1-5 days',
    description: 'On-site, our production team orchestrates the transformation. Every element is placed, lit, and refined until the environment achieves its intended impact.',
    deliverables: ['Full installation', 'Final styling', 'Quality control', 'Client walkthrough'],
  },
]

const engagementTypes = [
  {
    title: 'Full Environment Design',
    description: 'Complete design, fabrication, and production services from concept through execution.',
    ideal: 'Clients who want a fully authored environment with proprietary elements and comprehensive production management.',
  },
  {
    title: 'Design Consultation',
    description: 'Strategic design direction and concept development without full production services.',
    ideal: 'Clients with existing production teams who need creative direction and design expertise.',
  },
  {
    title: 'Fabrication Only',
    description: 'Custom fabrication services for specific pieces or elements designed by our atelier.',
    ideal: 'Event professionals who need proprietary pieces or custom fabrication for their designs.',
  },
]

function ProcessPhase({ phase, index }: { phase: typeof processPhases[0]; index: number }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={ref}
      className={cn(
        'py-12 lg:py-16 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="lg:col-span-1">
        <span 
          className={cn(
            'text-xs text-muted-foreground tabular-nums transition-all duration-500',
            isInView && 'text-terracotta'
          )}
          style={{ transitionDelay: `${index * 100 + 200}ms` }}
        >
          {phase.number}
        </span>
      </div>
      <div className="lg:col-span-3">
        <h3 className="font-serif text-2xl lg:text-3xl tracking-tight">{phase.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{phase.duration}</p>
      </div>
      <div className="lg:col-span-5">
        <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
      </div>
      <div className="lg:col-span-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Deliverables</p>
        <ul className="flex flex-col gap-1">
          {phase.deliverables.map((item, i) => (
            <li 
              key={item} 
              className={cn(
                'text-sm text-foreground transition-all duration-500',
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              )}
              style={{ transitionDelay: `${index * 100 + i * 50 + 300}ms` }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function EngagementCard({ type, index }: { type: typeof engagementTypes[0]; index: number }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={ref}
      className={cn(
        'p-8 bg-secondary transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{type.title}</h3>
      <p className="mt-4 text-muted-foreground leading-relaxed text-sm">{type.description}</p>
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Ideal For</p>
        <p className="text-sm text-foreground">{type.ideal}</p>
      </div>
    </div>
  )
}

export default function ProcessPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Working With The Hive
              </p>
              <LineReveal
                text="From vision to realization"
                tag="h1"
                fontFamily="serif"
                fontSize={64}
                lineHeight={72}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight"
                staggerDelay={150}
              />
            </div>
            <div className="lg:col-span-4 flex items-end">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed">
                Our process is designed to honor both{' '}
                <HighlightReveal text="creative ambition" highlightColor="rgba(255,255,255,0.1)" />{' '}
                and practical reality. We guide clients through a structured journey that transforms 
                initial vision into authored environment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Overview */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Our Process
              </p>
            </div>
            <div className="lg:col-span-6">
              <LineReveal
                text="Five phases. One authored outcome."
                tag="h2"
                fontFamily="serif"
                fontSize={40}
                lineHeight={48}
                className="text-3xl md:text-4xl tracking-tight"
                staggerDelay={100}
              />
            </div>
          </div>
          
          {/* Process Phases with animations */}
          <div className="border-t border-border">
            {processPhases.map((phase, index) => (
              <ProcessPhase key={phase.number} phase={phase} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Image Break */}
      <section className="bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ImagePlaceholder 
            aspectRatio="landscape"
            label="Design"
            className="aspect-[4/3]"
          />
          <ImagePlaceholder 
            aspectRatio="landscape"
            label="Fabrication"
            className="aspect-[4/3]"
          />
        </div>
      </section>
      
      {/* Engagement Types */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Engagement Types
              </p>
            </div>
            <div className="lg:col-span-6">
              <LineReveal
                text="How we work with clients"
                tag="h2"
                fontFamily="serif"
                fontSize={40}
                lineHeight={48}
                className="text-3xl md:text-4xl tracking-tight"
                staggerDelay={100}
              />
              <p className="mt-8 text-muted-foreground leading-relaxed">
                Every project is different. We offer several engagement structures 
                depending on your needs, timeline, and existing resources.
              </p>
            </div>
          </div>
          
          {/* Engagement Cards with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {engagementTypes.map((type, index) => (
              <EngagementCard key={type.title} type={type} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Design-Led vs Rental with Pull Quote Flow */}
      <section className="bg-charcoal text-cream py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-8">
                An Important Distinction
              </p>
              <LineReveal
                text="Design-led. Not rental-first."
                tag="h2"
                fontFamily="serif"
                fontSize={48}
                lineHeight={56}
                className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
                staggerDelay={100}
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center gap-6">
              <p className="text-cream/70 leading-relaxed">
                Eclectic Hive is not a rental company with nice inventory. We are a{' '}
                <HighlightReveal text="design and fabrication studio" highlightColor="rgba(195, 126, 99, 0.3)" />{' '}
                that happens to have proprietary pieces available for use within our projects.
              </p>
              <p className="text-cream/70 leading-relaxed">
                This distinction matters. When you work with us, you are hiring design 
                intelligence and fabrication capability—not simply selecting items from 
                a catalog. Our inventory supports the design vision, never drives it.
              </p>
              <p className="text-cream/70 leading-relaxed">
                For clients seeking rental-only relationships, we maintain a separate 
                inventory portal. But our primary offering is the authored environment—
                designed, fabricated, and produced as a complete expression.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Investment */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Investment
              </p>
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.1] tracking-tight">
                Pricing orientation
              </h2>
              <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
                <p>
                  Our projects vary significantly in scope, scale, and complexity. We 
                  provide detailed proposals after initial consultation rather than 
                  publishing fixed rates.
                </p>
                <p>
                  As a general orientation: full environment design projects typically 
                  begin at{' '}
                  <HighlightReveal text="$25,000 for design services" />, with fabrication and production 
                  costs varying based on scope. Design consultation engagements begin 
                  at $5,000.
                </p>
                <p>
                  We are transparent about budget from the first conversation and work 
                  to align scope with available investment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-secondary py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Begin
            </p>
            <LineReveal
              text="Ready to start a conversation?"
              tag="h2"
              fontFamily="serif"
              fontSize={48}
              lineHeight={56}
              className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
              staggerDelay={100}
            />
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl">
              Tell us about your event, your vision, and your timeline. We respond 
              to every inquiry and will let you know if we are the right fit.
            </p>
            <div className="mt-12">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
              >
                Start an Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
