'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { cn } from '@/lib/utils'

// Lazy load the 3D showcase for performance
const Home3DShowcase = lazy(() => import('@/components/home-3d-showcase').then(mod => ({ default: mod.Home3DShowcase })))

// ─── Data ─────────────────────────────────────────────────────────────────────

// New Collections product images
const NEW_COLLECTION_PRODUCTS = [
  {
    name: 'GEORGIA Sconce',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GEORGIA%2BSconce%2B1-rnc4CfwUpYrddyEN1oZ9B2AK5yhfyz.webp',
  },
  {
    name: 'CRESSIDA Table Lamp',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CRESSIDA%2BTable%2BLamp-7vpkT2QzVYlThgDRVshSk3XOLY5ja7.webp',
  },
  {
    name: 'JINA Duo',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JINA%2BDuo-j7eLEUai1yqDNA6NSfIq4Nj5UJZoX4.webp',
  },
  {
    name: 'AGATHA Duo',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AGATHA%2BDuo-KYMnfwMmh4lt6l8yfhY7AuLhem533g.webp',
  },
  {
    name: 'CONCRETA Wall Sconce',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CONCRETA%2BWall%2BSconce%2B0-49NNZi7tHXTuGuSL9ieNtbgm24eKPZ.webp',
  },
  {
    name: 'CULETTA Marble Lamp',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CULETTA%2BMarble%2BCab%2BLamp-wy4XnS6P7WgnkozWwyGLs9QO2FmtNx.webp',
  },
  {
    name: 'ARIA Table Lamp',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%27-z4pajVWeYKYf27FFw5FgQdOlsgJXHN.webp',
  },
  {
    name: 'MELA Marble Tray',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MELA%2BMarble%2BTray-QoJv0kKnBPqyBPPcBUG4rfKdBygHGI.webp',
  },
  {
    name: 'RODRICK Cab Lamp',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RODRICK%2BCab%2BLamp-xwOJ67xlzwd3KMRN3gaZI4kpY58w8f.webp',
  },
  {
    name: 'DIVYA Paper Mache Vase',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DIVYA%2BPaper%2BMache%2BVase-FZmZcEEla0Nxg0lEbpyyB6zomAHgDE.webp',
  },
]

const PORTFOLIO_PROJECTS = [
  {
    title: 'Brush Creek Ranch',
    planner: 'Easton Events',
    image:
      'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2db573b8-41e3-4083-9bbb-8c1f0238705e/Reception+4.jpg',
  },
  {
    title: 'Caribou Club',
    planner: 'Birch Design Studio',
    image:
      'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5f04747d-1cc8-453c-96ae-6935b023c23f/Caribou+Rehearsal+Dinner+Tablescape+2.jpg',
  },
  {
    title: 'Denver Celebration',
    planner: 'Banks + Leaf',
    image:
      'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/3181fcca-b89e-46e8-9cbf-c6df4184c80f/2021_09_05_sapnaari-sp-0108.jpg',
  },
  {
    title: 'WestWorld Reception',
    planner: 'Gold Leaf Events',
    image:
      'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/a9d917a6-6644-46d7-9371-ab4326c5e6e8/WestWorld+Reception.jpg',
  },
]

// Press logos - white logos on beige background
const PRESS_LOGOS = [
  {
    name: 'Elle',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Elle%2BLogo%2Bw%2B2-OVQNlm5PY1I9dKvM2JblVMgBvFfYj7.webp',
  },
  {
    name: "Harper's Bazaar",
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bazaar%2BLogo%2BW-Y41iLCo3Nck09LLPlG974WK0B927jI.webp',
  },
  {
    name: 'The Knot',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h11ekHP7Chbg2IvGhPvl5IEqwDAW78.png',
  },
  {
    name: 'Vogue',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vogue%2Blogo%2Bw-NfImu5uR2feTV0gVZLpDgb3izl9xAO.webp',
  },
  {
    name: 'Martha Stewart Weddings',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MS%2Blogo%2Bw-qJWRNbqp0fnELXYBwPDut01f5GbAXE.webp',
  },
  {
    name: 'Brides',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Brides%2Blogo%2BW-mt7R82vdgFSNJzMdkravKAHEO77igK.webp',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main id="main-content" className="bg-background">
      <Navigation />
      <HeroSection />
      <PressSection />
      
      {/* 3D Product Showcase - after press logos */}
      <Suspense fallback={
        <section className="bg-cream py-16 lg:py-24">
          <div className="max-w-[1800px] mx-auto px-6 lg:px-16">
            <div 
              className="rounded-2xl bg-[#E8E0D4] animate-pulse"
              style={{ aspectRatio: '21 / 9', maxHeight: '65vh' }}
            />
          </div>
        </section>
      }>
        <Home3DShowcase />
      </Suspense>
      
      <NewCollectionsSection />
      <WorkSection />
      <StudioSection />
      <InquirySection />
      <Footer />
    </main>
  )
}

// ─── Press strip ──────────────────────────────────────────────────────────────
// Pure CSS marquee — no JS, no layout shift, no library.
// Duplicating the logo array creates seamless infinite scroll.

function PressSection() {
  return (
    <section className="bg-[#D5CDC5] py-16 lg:py-24">
      {/* Label */}
      <div className="flex items-center gap-3 mb-10 px-6 lg:px-16">
        <span className="w-5 h-px bg-charcoal/15" />
        <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/35">
          As featured in
        </p>
      </div>
      
      {/* Large logos - matching their live site exactly */}
      <div className="px-6 lg:px-20">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 lg:gap-x-20">
          {PRESS_LOGOS.map((logo, i) => (
            <div
              key={i}
              className="relative h-8 w-28 lg:h-12 lg:w-40 shrink-0"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── New Collections Carousel ─────────────────────────────────────────────────

function NewCollectionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white">
      {/* Header */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="overflow-hidden">
              <h2 
                className={cn(
                  "text-2xl md:text-3xl lg:text-4xl tracking-[0.15em] uppercase font-light text-charcoal transition-all duration-700",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                )}
              >
                New Collections
              </h2>
            </div>
          </div>
          
          {/* Navigation arrows */}
          <div 
            className={cn(
              "flex items-center gap-3 transition-all duration-700 delay-300",
              isInView ? "opacity-100" : "opacity-0"
            )}
          >
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300",
                canScrollLeft 
                  ? "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream" 
                  : "border-charcoal/10 text-charcoal/20 cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300",
                canScrollRight 
                  ? "border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cream" 
                  : "border-charcoal/10 text-charcoal/20 cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Products carousel */}
      <div 
        ref={scrollRef}
        className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide px-6 lg:px-16 pb-4"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {NEW_COLLECTION_PRODUCTS.map((product, i) => (
          <Link
            href="/collection"
            key={product.name}
            className={cn(
              "group flex-shrink-0 w-[280px] lg:w-[320px] transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ 
              scrollSnapAlign: 'start',
              transitionDelay: `${200 + i * 80}ms`
            }}
          >
            <div className="relative aspect-[3/4] bg-[#F8F6F3] mb-4 overflow-hidden">
              <Image
                src={product.src}
                alt={product.name}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                sizes="320px"
              />
            </div>
            <p className="text-sm tracking-[0.1em] text-charcoal/70 group-hover:text-charcoal transition-colors">
              {product.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Work section ─────────────────────────────────────────────────────────────

function WorkSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-32 lg:py-48 px-6 lg:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="mb-20">
          <div className="overflow-hidden">
            <p
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4 transition-all duration-700',
                isInView
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              )}
            >
              Selected Work
            </p>
          </div>
          {['Imagined. Refined.', 'Crafted.'].map((line, i) => (
            <div key={line} className="overflow-hidden">
              <h2
                className={cn(
                  'font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-light italic text-charcoal transition-all duration-700',
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0'
                )}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {PORTFOLIO_PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              isInView={isInView}
              isLarge={i === 0}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="overflow-hidden mt-16 text-center">
          <Link
            href="/gallery"
            className={cn(
              'inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-all duration-700 group',
              isInView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            View All Projects
            <span className="w-8 h-px bg-charcoal group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isInView,
  isLarge,
}: {
  project: (typeof PORTFOLIO_PROJECTS)[0]
  index: number
  isInView: boolean
  isLarge: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/gallery"
      className={cn(
        'group relative block overflow-hidden transition-all duration-1000',
        isLarge ? 'md:col-span-2 aspect-[2/1]' : 'aspect-[4/3]',
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${300 + index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        // FIX: sizes prop — tells Next.js the render size at each breakpoint
        sizes={
          isLarge
            ? '(max-width: 768px) 100vw, 100vw'
            : '(max-width: 768px) 100vw, 50vw'
        }
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors duration-500" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
        <div className="overflow-hidden">
          <p
            className={cn(
              'text-xs uppercase tracking-[0.2em] text-cream/70 mb-2 transition-all duration-500',
              isHovered
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            )}
          >
            {project.planner}
          </p>
        </div>
        <div className="overflow-hidden">
          <h3 className="font-display text-2xl lg:text-3xl tracking-tight font-light italic text-cream">
            {project.title.split('').map((char, i) => (
              <span
                key={i}
                className={cn(
                  'inline-block transition-all duration-500',
                  isHovered
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0'
                )}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h3>
        </div>
      </div>
    </Link>
  )
}

// ─── Studio section ───────────────────────────────────────────────────────────

function StudioSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-charcoal text-cream">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Image */}
        <div
          className={cn(
            'relative aspect-square lg:aspect-auto lg:h-full min-h-[500px] overflow-hidden transition-opacity duration-1000',
            isInView ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src="https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/cfa4c553-1dd4-42dd-8576-0bc47ec25447/Eclectic+Hive-Carrie+King+Photographer-199.jpg"
            alt="Eclectic Hive studio"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              'object-cover transition-transform duration-1000',
              isInView ? 'scale-100' : 'scale-110'
            )}
          />
        </div>

        {/* Copy */}
        <div className="flex items-center px-8 lg:px-16 xl:px-24 py-24 lg:py-32">
          <div className="max-w-lg">
            <div className="overflow-hidden">
              <p
                className={cn(
                  'text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-700',
                  isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0'
                )}
                style={{ transitionDelay: '200ms' }}
              >
                The Studio
              </p>
            </div>

            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-light italic mb-8">
              {['Two parts luxe,', 'one part regal.'].map((line, i) => (
                <span key={i} className="overflow-hidden block">
                  <span
                    className={cn(
                      'inline-block transition-all duration-700',
                      isInView
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-full opacity-0'
                    )}
                    style={{ transitionDelay: `${300 + i * 150}ms` }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h2>

            <p
              className={cn(
                'text-cream/70 leading-relaxed mb-8 transition-all duration-700',
                isInView
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: '500ms' }}
            >
              We are a full-service design and production house, taking our
              clients&apos; vision and molding that with our approach to
              cinematic and art-forward design. Predominantly a destination
              design house, traveling wherever our clients and projects
              take us.
            </p>

            <div
              className={cn(
                'flex flex-wrap gap-6 transition-all duration-700',
                isInView
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: '700ms' }}
            >
              {[
                { href: '/atelier', label: 'The Atelier' },
                { href: '/collection', label: 'Signature Collection' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-cream transition-colors relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Inquiry CTA ────────────��─────────────────────────────────────────────────

function InquirySection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-32 lg:py-48 px-6 lg:px-12 bg-cream"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight font-light italic text-charcoal mb-8">
          {"Let's create something unforgettable"
            .split(' ')
            .map((word, i) => (
              <span
                key={i}
                className="overflow-hidden inline-block mr-[0.25em]"
              >
                <span
                  className={cn(
                    'inline-block transition-all duration-700',
                    isInView
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0'
                  )}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {word}
                </span>
              </span>
            ))}
        </h2>

        <div className="overflow-hidden">
          <p
            className={cn(
              'text-charcoal/60 max-w-xl mx-auto mb-12 transition-all duration-700',
              isInView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-full opacity-0'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            Whether you&apos;re a planner with a vision or a couple
            dreaming of the impossible, we&apos;d love to hear from you.
          </p>
        </div>

        <div className="overflow-hidden">
          <Link
            href="/contact"
            className={cn(
              'inline-block px-10 py-4 bg-charcoal text-cream text-sm uppercase tracking-[0.2em] hover:bg-charcoal/90 transition-all duration-500',
              isInView
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
            style={{ transitionDelay: '500ms' }}
          >
            Start a Conversation
          </Link>
        </div>
      </div>
    </section>
  )
}
