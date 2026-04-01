'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { LineReveal, HighlightReveal } from '@/components/pretext/line-reveal'
import { ShrinkwrapBubble } from '@/components/pretext/shrinkwrap-bubble'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const projects = [
  {
    id: 'easton-brush-creek',
    title: 'Brush Creek Ranch',
    planner: 'Easton Events',
    type: 'Private Celebration',
    scope: 'Full Environment Design',
    year: '2024',
    description: 'An immersive ranch celebration blending rustic elegance with refined design. Custom fabricated installations and material-driven environments for an unforgettable mountain experience.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173556231-U5Z6HJ7N0B9I9FJ5F8GN/Eclectic+Hive+Event+Design.jpg',
    featured: true,
    quote: 'Beyond what we imagined possible.',
  },
  {
    id: 'diwan-brush-creek',
    title: 'Brush Creek Ranch',
    planner: 'Diwan by Design',
    type: 'Wedding',
    scope: 'Design & Fabrication',
    year: '2024',
    description: 'A celebration of cultures through design. Bespoke lounge environments, custom lighting, and curated material palettes.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173471821-HO5VQOMV0UZUBL9NFVXU/Diwan+by+Design+Wedding.jpg',
    featured: true,
    quote: 'Every detail was considered.',
  },
  {
    id: 'banks-leaf-denver',
    title: 'Denver',
    planner: 'Banks + Leaf',
    type: 'Corporate Event',
    scope: 'Full Environment Design',
    year: '2024',
    description: 'Urban sophistication meets mountain sensibility. A corporate gathering transformed through intentional design and material intelligence.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173430989-DJBQ2XQRLRX3NXMQQL9M/Banks+%2B+Leaf+Denver.jpg',
    featured: false,
  },
  {
    id: 'love-this-day',
    title: 'Brush Creek Ranch',
    planner: 'Love This Day',
    type: 'Wedding',
    scope: 'Design & Production',
    year: '2023',
    description: 'Romance meets rugged beauty. A celebration designed around natural textures, warm metals, and organic florals.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173499927-KBHSVKH4RQJLXHVIJXZH/Love+This+Day+Wedding.jpg',
    featured: false,
  },
  {
    id: 'birch-caribou',
    title: 'Caribou Club',
    planner: 'Birch Design Studio',
    type: 'Private Event',
    scope: 'Design & Fabrication',
    year: '2023',
    description: 'Intimate elegance in Aspen. Custom lounge installations and bespoke design elements for an exclusive mountain club setting.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173395127-N1F3HRYQXQDJJ4ZQK5JT/Birch+Design+Studio.jpg',
    featured: false,
  },
  {
    id: 'gold-leaf-aspen',
    title: 'Aspen',
    planner: 'Gold Leaf Events',
    type: 'Wedding',
    scope: 'Full Environment Design',
    year: '2023',
    description: 'Mountain grandeur with refined detail. A celebration that honored the landscape while creating intimate spaces for connection.',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712173521632-OVQXO4W0MWFNKQBZ8JXP/Gold+Leaf+Events+Aspen.jpg',
    featured: false,
  },
]

const featuredProjects = projects.filter(p => p.featured)
const archiveProjects = projects.filter(p => !p.featured)

function FeaturedProject({ project, index }: { project: typeof projects[0]; index: number }) {
  const [isInView, setIsInView] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
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
            <div className="relative aspect-[16/10] transition-transform duration-700 group-hover:scale-105">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className={cn(
                  'object-cover transition-opacity duration-700',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 1024px) 100vw, 60vw"
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
            <span>{project.planner}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{project.year}</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl tracking-tight">{project.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{project.type}</p>
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
  const [imageLoaded, setImageLoaded] = useState(false)
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
        <div className="relative aspect-[4/3] transition-transform duration-700 group-hover:scale-105">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={cn(
              'object-cover transition-opacity duration-700',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
        <span>{project.planner}</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span>{project.year}</span>
      </div>
      <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{project.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{project.type}</p>
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
                Design + Production
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
      
      {/* Archive */}
      <section className="bg-secondary py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16">
            Archive
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
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
