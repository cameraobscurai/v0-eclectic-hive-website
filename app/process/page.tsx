'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { LineReveal, HighlightReveal } from '@/components/pretext/line-reveal'
import { Magnetic } from '@/components/animations/motion-elements'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const processPhases = [
  {
    number: '01',
    title: 'Consultation',
    duration: 'Initial Call',
    description: 'During a consultation call with our team, we learn about your vision for the project and how we can best support you. Once a clear direction is established, we work together to create a budget range, ensuring your vision aligns with the investment necessary to bring those ideas to life.',
    deliverables: ['Vision alignment', 'Budget framework', 'Scope discussion'],
  },
  {
    number: '02',
    title: 'Style Guide',
    duration: '1-2 weeks',
    description: 'We prepare a one to two-page Style Guide that visually summarizes the direction we have in mind for you. This serves as the creative foundation before we invest deeper design resources.',
    deliverables: ['Visual direction', 'Mood references', 'Creative summary'],
  },
  {
    number: '03',
    title: 'Contract & Fee',
    duration: 'Upon Approval',
    description: 'A non-refundable Creative Services Fee and signed contract will be collected after receiving the Style Guide, which secures the date with our team. Contracted clients receive prioritized attention and time with design and logistical details.',
    deliverables: ['Signed contract', 'Creative Services Fee', 'Date secured'],
  },
  {
    number: '04',
    title: 'Full Proposal',
    duration: '2-4 weeks',
    description: 'From there, your designer will begin creating a customized and robust proposal with a supporting detailed estimate. This includes space planning, CAD design, 3D modeling of event spaces, and comprehensive vendor specifications.',
    deliverables: ['Design proposal', 'Detailed estimate', 'CAD layouts', '3D renderings'],
  },
  {
    number: '05',
    title: 'Production & Execution',
    duration: 'Event Timeline',
    description: 'We provide full production management—vendor management, production timeline management, logistical on-site management, support with permit and code inspections, entertainment management and run of show.',
    deliverables: ['Vendor coordination', 'On-site management', 'Timeline execution', 'Full installation'],
  },
]

const engagementTypes = [
  {
    title: 'Full-Service Design + Production',
    description: 'We are a full-service design and production house, taking your vision and molding that with our approach to cinematic and art-forward design. Includes lounge furniture, bars, lighting, tableware, dining, custom fabrication, stage design, graphics, drape, and styling.',
    ideal: 'Clients who want a fully authored environment with comprehensive production management from pre-planning to execution.',
  },
  {
    title: 'Production Management',
    description: 'Full production management for planners who wish to remain client and guest-facing, while we ensure seamless production behind the scenes. Includes space planning, CAD, 3D modeling, vendor management, timeline management, and on-site logistics.',
    ideal: 'Planners who need expert production support while maintaining client relationships.',
  },
  {
    title: 'Rental-Only Services',
    description: 'For clients who do not need design or production support but want access to our curated inventory collection of lounge furniture, bars, cocktail tables, lighting, tableware, and accents.',
    ideal: 'Event professionals who have their own design direction but want access to our proprietary pieces.',
  },
]

// Scroll-driven timeline that draws itself as you scroll
function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  return (
    <div ref={containerRef} className="relative border-l border-charcoal/10 ml-4 pl-8">
      {/* The line that draws down as you scroll */}
      <motion.div
        className="absolute left-0 top-0 w-px bg-charcoal origin-top"
        style={{
          scaleY: scrollYProgress,
          height: '100%',
        }}
      />

      {/* Each phase with scroll-activated dot */}
      {processPhases.map((phase, i) => {
        const phaseProgress = i / processPhases.length
        
        return (
          <ProcessPhaseItem 
            key={phase.number} 
            phase={phase} 
            index={i}
            phaseProgress={phaseProgress}
            scrollYProgress={scrollYProgress}
          />
        )
      })}
    </div>
  )
}

// Individual phase item with scroll-linked dot activation
function ProcessPhaseItem({ 
  phase, 
  index, 
  phaseProgress, 
  scrollYProgress 
}: { 
  phase: typeof processPhases[0]
  index: number
  phaseProgress: number
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const dotOpacity = useTransform(
    scrollYProgress,
    [phaseProgress - 0.05, phaseProgress + 0.05],
    [0.2, 1]
  )
  const dotScale = useTransform(
    scrollYProgress,
    [phaseProgress - 0.05, phaseProgress + 0.05],
    [0.6, 1]
  )

  return (
    <div className="relative mb-16 lg:mb-24">
      {/* Dot on the timeline */}
      <motion.div
        style={{ opacity: dotOpacity, scale: dotScale }}
        className="absolute -left-11 top-2 w-3 h-3 rounded-full border border-charcoal bg-cream"
      />
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-1">
          <span className="text-xs text-muted-foreground tabular-nums">
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
            {phase.deliverables.map((item) => (
              <li key={item} className="text-sm text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
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
          
          {/* Process Phases — scroll-driven timeline */}
          <ProcessTimeline />
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
              <Magnetic strength={0.25}>
                <Link 
                  href="/contact#inquiry"
                  className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
                >
                  Start an Inquiry
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
