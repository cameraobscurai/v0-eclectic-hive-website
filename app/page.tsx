'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'
import { prepareTextWithSegments, layoutWithLines, createFontString, waitForFonts, type Line } from '@/lib/pretext'

const heroImages = [
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710309793584-V7I937AO0B569QLUFQPA/Welcome+Party+Fireside.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710309985795-PTFDFO4WGSM8T1VVYNJP/Beach+Day+Island.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1710384808225-7LX3MKZOXMSOCNP9DIG8/Main+Banner8.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/705fc6dd-e54a-462b-b0ab-3c32792e9848/Ceremony.jpg',
  'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/7a238894-ee5c-4c2b-8dbf-d9ce53adf674/Tent+Detail.jpg',
]

const portfolioProjects = [
  { title: 'Brush Creek Ranch', planner: 'Easton Events', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/2db573b8-41e3-4083-9bbb-8c1f0238705e/Reception+4.jpg' },
  { title: 'Caribou Club', planner: 'Birch Design Studio', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/5f04747d-1cc8-453c-96ae-6935b023c23f/Caribou+Rehearsal+Dinner+Tablescape+2.jpg' },
  { title: 'Denver Celebration', planner: 'Banks + Leaf', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/3181fcca-b89e-46e8-9cbf-c6df4184c80f/2021_09_05_sapnaari-sp-0108.jpg' },
  { title: 'WestWorld Reception', planner: 'Gold Leaf Events', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/a9d917a6-6644-46d7-9371-ab4326c5e6e8/WestWorld+Reception.jpg' },
]

export default function HomePage() {
  return (
    <main className="bg-background">
      <Navigation />
      <HeroSection />
      <WorkSection />
      <StudioSection />
      <InquirySection />
      <Footer />
    </main>
  )
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  
  const calculateLines = useCallback(async () => {
    await waitForFonts()
    const text = "Design + Production for events that demand more"
    const font = createFontString(18, 'sans', 400)
    const prepared = prepareTextWithSegments(text, font)
    const containerWidth = containerRef.current?.offsetWidth || 400
    const result = layoutWithLines(prepared, Math.min(containerWidth, 500), 28)
    setLines(result.lines)
  }, [])
  
  useEffect(() => {
    setLoaded(true)
    calculateLines()
    window.addEventListener('resize', calculateLines)
    return () => window.removeEventListener('resize', calculateLines)
  }, [calculateLines])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal">
      <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-5">
        {heroImages.map((src, i) => (
          <div key={i} className={cn('relative overflow-hidden transition-all duration-1000 ease-out', i >= 3 ? 'hidden md:block' : '', loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105')} style={{ transitionDelay: `${i * 150}ms` }}>
            <Image src={src} alt="" fill className="object-cover" priority={i < 3} />
            <div className="absolute inset-0 bg-charcoal/40" />
          </div>
        ))}
      </div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-cream px-6">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-tight mb-8 overflow-hidden">
          {'Eclectic Hive'.split('').map((char, i) => (
            <span key={i} className={cn('inline-block transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full')} style={{ transitionDelay: `${600 + i * 40}ms` }}>{char === ' ' ? '\u00A0' : char}</span>
          ))}
        </h1>
        <div ref={containerRef} className="text-center max-w-xl">
          {lines.length > 0 ? lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <p className={cn('text-sm md:text-base text-cream/70 tracking-wide transition-all duration-700', loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full')} style={{ transitionDelay: `${1200 + i * 100}ms` }}>{line.text}</p>
            </div>
          )) : <p className={cn('text-sm md:text-base text-cream/70 tracking-wide transition-all duration-700', loaded ? 'opacity-100' : 'opacity-0')} style={{ transitionDelay: '1200ms' }}>Design + Production for events that demand more</p>}
        </div>
        <div className={cn('absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000', loaded ? 'opacity-100' : 'opacity-0')} style={{ transitionDelay: '1600ms' }}>
          <div className="w-px h-16 bg-cream/30 relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1/2 bg-cream animate-scroll-down" /></div>
        </div>
      </div>
    </section>
  )
}

function WorkSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } }, { threshold: 0.1 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect() }, [])

  return (
    <section ref={ref} className="py-32 lg:py-48 px-6 lg:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="overflow-hidden"><p className={cn('text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4 transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')}>Selected Work</p></div>
          <div className="overflow-hidden"><h2 className={cn('font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: '100ms' }}>Environments built</h2></div>
          <div className="overflow-hidden"><h2 className={cn('font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: '200ms' }}>with intention</h2></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {portfolioProjects.map((project, i) => <ProjectCard key={project.title} project={project} index={i} isInView={isInView} isLarge={i === 0} />)}
        </div>
        <div className="overflow-hidden mt-16 text-center">
          <Link href="/gallery" className={cn('inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-all duration-700 group', isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0')} style={{ transitionDelay: '800ms' }}>View All Projects<span className="w-8 h-px bg-charcoal group-hover:w-12 transition-all duration-300" /></Link>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index, isInView, isLarge }: { project: typeof portfolioProjects[0]; index: number; isInView: boolean; isLarge: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <Link href="/gallery" className={cn('group relative block overflow-hidden transition-all duration-1000', isLarge ? 'md:col-span-2 aspect-[2/1]' : 'aspect-[4/3]', isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')} style={{ transitionDelay: `${300 + index * 150}ms` }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-colors duration-500" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
        <div className="overflow-hidden"><p className={cn('text-xs uppercase tracking-[0.2em] text-cream/70 mb-2 transition-all duration-500', isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')}>{project.planner}</p></div>
        <div className="overflow-hidden"><h3 className="font-serif text-2xl lg:text-3xl text-cream">{project.title.split('').map((char, i) => <span key={i} className={cn('inline-block transition-all duration-500', isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: `${i * 30}ms` }}>{char === ' ' ? '\u00A0' : char}</span>)}</h3></div>
      </div>
    </Link>
  )
}

function StudioSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } }, { threshold: 0.2 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect() }, [])

  return (
    <section ref={ref} className="bg-charcoal text-cream">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className={cn('relative aspect-square lg:aspect-auto lg:h-full min-h-[500px] overflow-hidden', isInView ? 'opacity-100' : 'opacity-0')} style={{ transition: 'opacity 1s ease-out' }}>
          <Image src="https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/cfa4c553-1dd4-42dd-8576-0bc47ec25447/Eclectic+Hive-Carrie+King+Photographer-199.jpg" alt="Eclectic Hive Studio" fill className={cn('object-cover transition-transform duration-1000', isInView ? 'scale-100' : 'scale-110')} />
        </div>
        <div className="flex items-center px-8 lg:px-16 xl:px-24 py-24 lg:py-32">
          <div className="max-w-lg">
            <div className="overflow-hidden"><p className={cn('text-xs uppercase tracking-[0.3em] text-cream/50 mb-6 transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: '200ms' }}>The Studio</p></div>
            <h2 className="font-serif text-4xl md:text-5xl mb-8">{['Design-led.', 'Fabrication-fluent.'].map((word, wi) => <span key={wi} className="overflow-hidden inline-block mr-3"><span className={cn('inline-block transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: `${300 + wi * 150}ms` }}>{word}</span></span>)}</h2>
            <p className={cn('text-cream/70 leading-relaxed mb-8 relative transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')} style={{ transitionDelay: '500ms' }}>Eclectic Hive is a Denver-based event design and production studio. We create <span className="relative inline-block"><span className="relative z-10">authored environments</span><span className={cn('absolute inset-0 bg-terracotta/30 -mx-1 origin-left transition-transform duration-700', isInView ? 'scale-x-100' : 'scale-x-0')} style={{ transitionDelay: '900ms' }} /></span> through proprietary inventory, material intelligence, and production expertise.</p>
            <div className={cn('flex flex-wrap gap-6 transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')} style={{ transitionDelay: '700ms' }}>
              <Link href="/team" className="text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-cream transition-colors relative group">Meet The Hive<span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" /></Link>
              <Link href="/inventory" className="text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-cream transition-colors relative group">Browse Inventory<span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" /></Link>
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
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } }, { threshold: 0.3 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect() }, [])

  return (
    <section ref={ref} className="py-32 lg:py-48 px-6 lg:px-12 bg-cream">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-8">{"Let's build something together".split(' ').map((word, i) => <span key={i} className="overflow-hidden inline-block mr-[0.25em]"><span className={cn('inline-block transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: `${i * 80}ms` }}>{word}</span></span>)}</h2>
        <div className="overflow-hidden"><p className={cn('text-charcoal/60 max-w-xl mx-auto mb-12 transition-all duration-700', isInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0')} style={{ transitionDelay: '400ms' }}>Whether you&apos;re a planner with a vision or a couple dreaming of the impossible, we&apos;d love to hear from you.</p></div>
        <div className="overflow-hidden"><Link href="/contact" className={cn('inline-block px-10 py-4 bg-charcoal text-cream text-sm uppercase tracking-[0.2em] hover:bg-charcoal/90 transition-all duration-500', isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0')} style={{ transitionDelay: '500ms' }}>Start a Conversation</Link></div>
      </div>
    </section>
  )
}
