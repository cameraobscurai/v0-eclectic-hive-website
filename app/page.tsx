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

// Press logos from Vercel Blob (these are already on the existing site)
const PRESS_LOGOS = [
  {
    name: 'Elle',
    src: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/75bd222a-7422-4812-acbc-de6094cc3f94/Elle+Logo+w+2.png',
  },
  {
    name: "Harper's Bazaar",
    src: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/175c3488-357e-4471-bf57-5166361f5f6f/Bazaar+Logo+W.png',
  },
  {
    name: 'The Knot',
    src: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/6f4d4842-fc45-4e36-970d-0324904ae858/Knot+logo+w.png',
  },
  {
    name: 'Vogue',
    src: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/04f5af04-4d91-415f-b7bc-df4f3763fd6f/Vogue+logo+w.png',
  },
  {
    name: 'Martha Stewart Weddings',
    src: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/9e18aea5-5eef-4cd3-817f-f11d9d8be2c1/MS+logo+w.png',
  },
  {
    name: 'Brides',
    src: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/04db900a-8f7b-4b97-a29c-8b4adf39d66b/Brides+logo+W.png',
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
    <section className="bg-[#E8E0D4] py-20 lg:py-28">
      {/* Label */}
      <div className="flex items-center gap-3 mb-12 px-6 lg:px-16">
        <span className="w-6 h-px bg-charcoal/20" />
        <p className="text-[11px] tracking-[0.3em] uppercase text-charcoal/40">
          As featured in
        </p>
      </div>
      
      {/* Large logos - static display like their site */}
      <div className="px-6 lg:px-16">
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10 lg:gap-x-24">
          {PRESS_LOGOS.map((logo, i) => (
            <div
              key={i}
              className="relative h-10 w-32 lg:h-14 lg:w-44 shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
                sizes="176px"
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
            </div>
          ))}
        </div>
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
