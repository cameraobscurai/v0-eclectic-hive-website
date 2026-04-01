'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Real images from eclectichive.com
const heroImages = [
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710309985795-PTFDFO4WGSM8T1VVYNJP/Beach+Day+Island.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1fdfcfcf-5f32-4cdf-bb2c-5186f15ba199/Lounge+2.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710384808225-7LX3MKZOXMSOCNP9DIG8/Main+Banner8.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/705fc6dd-e54a-462b-b0ab-3c32792e9848/Ceremony.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/7a238894-ee5c-4c2b-8dbf-d9ce53adf674/Tent+Detail.jpg',
]

const portfolioProjects = [
  {
    title: 'Brush Creek Ranch',
    planner: 'Easton Events',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2db573b8-41e3-4083-9bbb-8c1f0238705e/Reception+4.jpg',
  },
  {
    title: 'Caribou Club',
    planner: 'Birch Design Studio',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5f04747d-1cc8-453c-96ae-6935b023c23f/Caribou+Rehearsal+Dinner+Tablescape+2.jpg',
  },
  {
    title: 'Denver Wedding',
    planner: 'Banks + Leaf',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/3181fcca-b89e-46e8-9cbf-c6df4184c80f/2021_09_05_sapnaari-sp-0108.jpg',
  },
  {
    title: 'WestWorld Reception',
    planner: 'Gold Leaf Events',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/a9d917a6-6644-46d7-9371-ab4326c5e6e8/WestWorld+Reception.jpg',
  },
]

export default function HomePage() {
  return (
    <main className="bg-background">
      <Navigation />
      
      {/* HERO - Full viewport, cinematic grid */}
      <HeroSection />
      
      {/* WORK - Let the portfolio speak */}
      <WorkSection />
      
      {/* STUDIO - Who we are */}
      <StudioSection />
      
      {/* INQUIRY - Simple CTA */}
      <InquirySection />
      
      <Footer />
    </main>
  )
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      {/* Image Grid - 5 columns like their current site */}
      <div className="absolute inset-0 grid grid-cols-5">
        {heroImages.map((src, i) => (
          <div 
            key={i} 
            className={cn(
              'relative overflow-hidden transition-all duration-1000',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              priority={i < 3}
            />
            <div className="absolute inset-0 bg-charcoal/30" />
          </div>
        ))}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-cream">
        <div 
          className={cn(
            'text-center transition-all duration-1000 delay-500',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6">
            Eclectic Hive
          </h1>
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-cream/70">
            Design + Production
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div 
          className={cn(
            'absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="w-px h-16 bg-cream/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-cream animate-scroll-down" />
          </div>
        </div>
      </div>
    </section>
  )
}

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
        {/* Section header */}
        <div 
          className={cn(
            'mb-20 transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4">Selected Work</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal max-w-2xl">
            Environments built with intention
          </h2>
        </div>
        
        {/* Project Grid - asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {portfolioProjects.map((project, i) => (
            <Link
              key={project.title}
              href="/gallery"
              className={cn(
                'group relative block overflow-hidden transition-all duration-1000',
                i === 0 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-[4/3]',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/70 mb-2">{project.planner}</p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-cream">{project.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View all link */}
        <div 
          className={cn(
            'mt-16 text-center transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          <Link 
            href="/gallery"
            className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-colors group"
          >
            View All Projects
            <span className="w-8 h-px bg-charcoal group-hover:w-12 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  )
}

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
      { threshold: 0.1 }
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
            'relative aspect-square lg:aspect-auto lg:h-full min-h-[500px] transition-all duration-1000',
            isInView ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src="https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/cfa4c553-1dd4-42dd-8576-0bc47ec25447/Eclectic+Hive-Carrie+King+Photographer-199.jpg"
            alt="Eclectic Hive Studio"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="flex items-center px-8 lg:px-16 xl:px-24 py-24 lg:py-32">
          <div className="max-w-lg">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '200ms' }}
            >
              The Studio
            </p>
            <h2 
              className={cn(
                'font-serif text-4xl md:text-5xl mb-8 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '300ms' }}
            >
              Design-led. Fabrication-fluent.
            </h2>
            <p 
              className={cn(
                'text-cream/70 leading-relaxed mb-8 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '400ms' }}
            >
              Eclectic Hive is a Denver-based event design and production studio. 
              We create authored environments through proprietary inventory, 
              material intelligence, and production expertise. From concept to 
              installation, we handle every detail.
            </p>
            <div 
              className={cn(
                'flex flex-wrap gap-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '500ms' }}
            >
              <Link 
                href="/team"
                className="text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-cream transition-colors relative group"
              >
                Meet The Hive
                <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
              <Link 
                href="/inventory"
                className="text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-cream transition-colors relative group"
              >
                Browse Inventory
                <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

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
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-32 lg:py-48 px-6 lg:px-12 bg-cream">
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className={cn(
            'font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-8 transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          Let&apos;s build something together
        </h2>
        <p 
          className={cn(
            'text-charcoal/60 max-w-xl mx-auto mb-12 transition-all duration-1000',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '150ms' }}
        >
          Whether you&apos;re a planner with a vision or a couple dreaming of the impossible, 
          we&apos;d love to hear from you.
        </p>
        <Link
          href="/contact"
          className={cn(
            'inline-block px-10 py-4 bg-charcoal text-cream text-sm uppercase tracking-[0.2em] hover:bg-charcoal/90 transition-all duration-500',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '300ms' }}
        >
          Start a Conversation
        </Link>
      </div>
    </section>
  )
}
