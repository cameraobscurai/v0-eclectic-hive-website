'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { LineReveal, HighlightReveal } from '@/components/pretext/line-reveal'
import { ShrinkwrapBubble } from '@/components/pretext/shrinkwrap-bubble'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const projects = [
  {
    id: 'aspen-summit',
    title: 'Aspen Summit',
    type: 'Corporate Retreat',
    scope: 'Full Environment Design',
    year: '2024',
    description: 'A three-day executive retreat transformed into an immersive alpine environment. Custom fabricated installations, material-driven design, and production management for 200 guests.',
    highlights: ['Custom timber installations', 'Bespoke furniture collection', 'Full production management'],
    featured: true,
    quote: 'Beyond what we imagined possible.',
  },
  {
    id: 'gallery-nocturne',
    title: 'Gallery Nocturne',
    type: 'Private Celebration',
    scope: 'Design & Fabrication',
    year: '2024',
    description: 'An evening celebration within a private gallery space. Moody atmosphere, architectural lighting, and custom-fabricated sculptural elements.',
    highlights: ['Sculptural centerpieces', 'Atmospheric lighting design', 'Material palette curation'],
    featured: true,
    quote: 'Every detail was considered.',
  },
  {
    id: 'terra-celebration',
    title: 'Terra Celebration',
    type: 'Wedding',
    scope: 'Full Environment Design',
    year: '2024',
    description: 'An outdoor celebration grounded in earthy materiality. Terracotta, natural linens, and custom metalwork created an environment that felt both elevated and rooted.',
    highlights: ['Custom arch fabrication', 'Proprietary colorway development', 'Botanical design direction'],
    featured: false,
  },
  {
    id: 'meridian-launch',
    title: 'Meridian Launch',
    type: 'Brand Activation',
    scope: 'Design & Production',
    year: '2023',
    description: 'A product launch event that transformed a warehouse into an experiential brand environment. Modular installations, integrated technology, and spatial narrative.',
    highlights: ['Modular display system', 'Integrated AV production', 'Brand environment design'],
    featured: false,
  },
  {
    id: 'vesper-gala',
    title: 'Vesper Gala',
    type: 'Benefit Gala',
    scope: 'Design & Fabrication',
    year: '2023',
    description: 'An evening benefit transformed through warm metals, candlelight, and velvet textures. Intimate atmosphere within a grand ballroom setting.',
    highlights: ['Custom table designs', 'Brass fixture fabrication', 'Lighting atmosphere design'],
    featured: false,
  },
  {
    id: 'founders-retreat',
    title: 'Founders Retreat',
    type: 'Corporate Event',
    scope: 'Full Environment Design',
    year: '2023',
    description: 'A leadership retreat designed to inspire strategic thinking. Natural materials, considered space planning, and an atmosphere of focused intention.',
    highlights: ['Environment strategy', 'Custom workspace design', 'Full production coordination'],
    featured: false,
  },
]

const featuredProjects = projects.filter(p => p.featured)
const archiveProjects = projects.filter(p => !p.featured)

function FeaturedProject({ project, index }: { project: typeof projects[0]; index: number }) {
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
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
    >
      {/* Image */}
      <Link
        href={`/gallery/${project.id}`}
        className={cn(
          'group',
          index % 2 === 0 ? 'lg:col-span-7' : 'lg:col-span-7 lg:col-start-6 lg:order-2'
        )}
      >
        <div className="overflow-hidden">
          <div 
            className={cn(
              'transition-all duration-1000',
              isInView ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            )}
          >
            <div className="transition-transform duration-700 group-hover:scale-105">
              <ImagePlaceholder 
                aspectRatio="wide"
                label={project.title}
              />
            </div>
          </div>
        </div>
      </Link>
      
      {/* Info */}
      <div 
        className={cn(
          'flex flex-col justify-center',
          index % 2 === 0 ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-4 lg:order-1'
        )}
      >
        <div 
          className={cn(
            'transition-all duration-1000 delay-200',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <span>{project.type}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{project.year}</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl tracking-tight">{project.title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>
          
          {/* Shrinkwrap quote */}
          {project.quote && (
            <div className="mt-8">
              <ShrinkwrapBubble 
                text={project.quote}
                maxWidth={300}
                variant="accent"
              />
            </div>
          )}
          
          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Highlights</p>
            <ul className="flex flex-wrap gap-2">
              {project.highlights.map((h) => (
                <li key={h} className="text-xs text-foreground bg-secondary px-3 py-1">
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <Link
              href={`/gallery/${project.id}`}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors editorial-link"
            >
              View Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArchiveCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

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
    <Link
      ref={ref}
      href={`/gallery/${project.id}`}
      className={cn(
        'group block transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-6 overflow-hidden">
        <div className="transition-transform duration-700 group-hover:scale-105">
          <ImagePlaceholder 
            aspectRatio="landscape"
            label={project.title}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
        <span>{project.type}</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span>{project.year}</span>
      </div>
      <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{project.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{project.scope}</p>
    </Link>
  )
}

export default function GalleryPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Selected Work
              </p>
              <LineReveal
                text="Environments we have authored"
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
                Each project represents a complete expression of our{' '}
                <HighlightReveal text="design intelligence" highlightColor="rgba(255,255,255,0.1)" />,{' '}
                fabrication capability, and production expertise.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16">
            Featured Projects
          </p>
          
          <div className="flex flex-col gap-24 lg:gap-32">
            {featuredProjects.map((project, index) => (
              <FeaturedProject key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Archive with staggered reveal */}
      <section className="bg-secondary py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16">
            Archive
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {archiveProjects.map((project, index) => (
              <ArchiveCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              Your Project
            </p>
            <LineReveal
              text="Ready to add your environment to our archive?"
              tag="h2"
              fontFamily="serif"
              fontSize={48}
              lineHeight={56}
              className="text-3xl md:text-4xl lg:text-5xl tracking-tight"
              staggerDelay={100}
            />
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl">
              Every project in our portfolio represents a client who trusted us to 
              author something extraordinary. We welcome conversations about how 
              we can create your next environment.
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
