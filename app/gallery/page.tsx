'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ArrowRight, Grid3X3, LayoutList } from 'lucide-react'
import { lockScroll, unlockScroll } from '@/lib/scroll-lock'

// ─────────────────────────────────────────────────────────────
// Project Data
// ─────────────────────────────────────────────────────────────

type Project = {
  id: string
  slug: string
  title: string
  planner?: string
  location: string
  region: string
  type: string
  year: string
  image: string
  images: string[]
}

const projects: Project[] = [
  {
    id: '01',
    slug: 'amangiri',
    title: 'Amangiri',
    location: 'Canyon Point, Utah',
    region: 'Utah',
    type: 'Private Celebration',
    year: '2024',
    image: '/images/gallery/amangiri/property-pool.jpg',
    images: [
      '/images/gallery/amangiri/property-pool.jpg',
      '/images/gallery/amangiri/property-night.jpg',
      '/images/gallery/amangiri/lounge-wide.jpg',
      '/images/gallery/amangiri/lounge-mesas.jpg',
      '/images/gallery/amangiri/lounge-firepit.jpg',
      '/images/gallery/amangiri/lounge-florals.jpg',
      '/images/gallery/amangiri/lounge-arrangement.jpg',
      '/images/gallery/amangiri/white-lounge.jpg',
      '/images/gallery/amangiri/branch-pedestal.jpg',
      '/images/gallery/amangiri/bud-vase-terrazzo.jpg',
      '/images/gallery/amangiri/tablescape-forsythia.jpg',
      '/images/gallery/amangiri/amangiri-dining-forsythia.jpg',
      '/images/gallery/amangiri/amangiri-dining-side.jpg',
      '/images/gallery/amangiri/styling-moment.jpg',
      '/images/gallery/amangiri/floral-pedestal.jpg',
      '/images/gallery/amangiri/ceramic-vases.jpg',
      '/images/gallery/amangiri/cherry-cocktails.jpg',
      '/images/gallery/amangiri/place-setting-dusk.jpg',
      '/images/gallery/amangiri/cocktail-hour.jpg',
      '/images/gallery/amangiri/dinner-candlelight.jpg',
      '/images/gallery/amangiri/amangiri-lounge.jpg',
      '/images/gallery/amangiri/amangiri-landscape.jpg',
      '/images/gallery/amangiri/lantern-path.jpg',
      '/images/gallery/amangiri/night-lights.jpg',
    ],
  },
  {
    id: '02',
    slug: 'lynden-lane',
    title: 'Lynden Lane',
    location: 'Telluride, Colorado',
    region: 'Colorado',
    type: 'Wedding',
    year: '2025',
    image: '/images/gallery/lynden-lane/venue-exterior.webp',
    images: [
      '/images/gallery/lynden-lane/venue-exterior.webp',
      '/images/gallery/lynden-lane/outdoor-lounge-bar.webp',
      '/images/gallery/lynden-lane/reception-wide.webp',
      '/images/gallery/lynden-lane/dining-pendants.webp',
      '/images/gallery/lynden-lane/dj-booth.webp',
      '/images/gallery/lynden-lane/bar-florals.webp',
      '/images/gallery/lynden-lane/bar-artwork.webp',
      '/images/gallery/lynden-lane/table-dusk.webp',
      '/images/gallery/lynden-lane/bar-candles.webp',
      '/images/gallery/lynden-lane/bar-full.webp',
      '/images/gallery/lynden-lane/place-settings.webp',
      '/images/gallery/lynden-lane/cowboy-art.webp',
      '/images/gallery/lynden-lane/cocktail-hour.webp',
      '/images/gallery/lynden-lane/seating-chart.webp',
      '/images/gallery/lynden-lane/wall-sconces.webp',
      '/images/gallery/lynden-lane/outdoor-lounge.webp',
      '/images/gallery/lynden-lane/shelf-styling.webp',
      '/images/gallery/lynden-lane/cowboy-hats.webp',
      '/images/gallery/lynden-lane/shelf-detail.webp',
      '/images/gallery/lynden-lane/hero-dining.webp',
    ],
  },
]

const allRegions = ['All', ...Array.from(new Set(projects.map(p => p.region))).sort()]

const PRESS_LOGOS = [
  { name: 'Elle', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Elle%2BLogo%2Bw%2B2-OVQNlm5PY1I9dKvM2JblVMgBvFfYj7.webp' },
  { name: "Harper's Bazaar", src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bazaar%2BLogo%2BW-Y41iLCo3Nck09LLPlG974WK0B927jI.webp' },
  { name: 'The Knot', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h11ekHP7Chbg2IvGhPvl5IEqwDAW78.png' },
  { name: 'Vogue', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vogue%2Blogo%2Bw-NfImu5uR2feTV0gVZLpDgb3izl9xAO.webp' },
  { name: 'Martha Stewart', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MS%2Blogo%2Bw-qJWRNbqp0fnELXYBwPDut01f5GbAXE.webp' },
  { name: 'Brides', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Brides%2Blogo%2BW-mt7R82vdgFSNJzMdkravKAHEO77igK.webp' },
]

// ─────────────────────────────────────────────────────────────
// Lazy Loading Hook with Intersection Observer
// ─────────────────────────────────────────────────────────────

function useLazyLoad(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01, ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView, hasLoaded }
}

// ─────────────────────────────────────────────────────────────
// Grid Project Card with Lazy Loading
// ─────────────────────────────────────────────────────────────

function GridProjectCard({ 
  project, 
  onClick,
  isPriority = false,
  size = 'normal'
}: { 
  project: Project
  onClick: () => void
  isPriority?: boolean
  size?: 'normal' | 'large' | 'tall'
}) {
  const { ref, hasLoaded } = useLazyLoad()
  const [imageLoaded, setImageLoaded] = useState(false)

  const aspectClass = {
    normal: 'aspect-[4/5]',
    large: 'aspect-[16/10]',
    tall: 'aspect-[3/5]'
  }[size]

  return (
    <div ref={ref}>
      <button
        onClick={onClick}
        className={cn(
          'group relative w-full overflow-hidden bg-charcoal/30',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal',
          'transition-all duration-500',
          aspectClass
        )}
        aria-label={`View ${project.title} project`}
      >
        {/* Blur placeholder */}
        <div 
          className={cn(
            'absolute inset-0 bg-charcoal/50 transition-opacity duration-700',
            imageLoaded ? 'opacity-0' : 'opacity-100'
          )}
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-charcoal/20 to-charcoal/40" />
        </div>

        {/* Image - only load when in viewport */}
        {(isPriority || hasLoaded) && (
          <Image
            src={project.image}
            alt={`${project.title} - ${project.location}`}
            fill
            priority={isPriority}
            loading={isPriority ? 'eager' : 'lazy'}
            className={cn(
              'object-cover transition-all duration-700',
              'group-hover:scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Project Number */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
          <span className="text-cream/40 text-[10px] tracking-[0.3em] font-light">
            {project.id}
          </span>
        </div>
        
        {/* Project Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-cream/50 text-[10px] uppercase tracking-[0.2em] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            {project.region}
          </p>
          <h3 className="font-display text-lg lg:text-xl xl:text-2xl text-cream font-light tracking-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-cream/40 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <span>{project.type}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-cream/30" />
            <span>{project.year}</span>
          </div>
        </div>
        
        {/* Hover indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center backdrop-blur-sm bg-black/20 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <ArrowRight className="w-4 h-4 text-cream" />
          </div>
        </div>
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Filmstrip Card (horizontal scroll)
// ─────────────────────────────────────────────────────────────

function FilmstripCard({ 
  project, 
  onClick,
  isActive,
  isPriority = false
}: { 
  project: Project
  onClick: () => void
  isActive: boolean
  isPriority?: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex-shrink-0 w-[75vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw] snap-center',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal',
        'transition-all duration-500',
        isActive 
          ? 'opacity-100 scale-100' 
          : 'opacity-50 scale-[0.96] hover:opacity-70 hover:scale-[0.97]'
      )}
      aria-label={`View ${project.title} in ${project.region}`}
    >
      <div className={cn(
        "relative aspect-[4/5] overflow-hidden bg-charcoal/50",
        "shadow-2xl shadow-black/30",
        "ring-1 ring-white/5",
        "transition-shadow duration-500",
        isActive && "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
      )}>
        <Image
          src={project.image}
          alt={`${project.title} - ${project.location}`}
          fill
          priority={isPriority}
          loading={isPriority ? 'eager' : 'lazy'}
          className={cn(
            'object-cover transition-all duration-700',
            'group-hover:scale-105',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 75vw, (max-width: 768px) 60vw, (max-width: 1024px) 50vw, 40vw"
          quality={85}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-5 left-5">
          <span className="text-cream/40 text-xs tracking-[0.3em] font-light">
            {project.id}
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <p className="text-cream/50 text-[10px] uppercase tracking-[0.2em] mb-1.5">
            {project.region}
          </p>
          <h3 className="font-display text-xl lg:text-2xl text-cream font-light tracking-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-cream/40 text-xs">
            <span>{project.location}</span>
            <span className="w-1 h-1 rounded-full bg-cream/30" />
            <span>{project.type}</span>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full border border-cream/30 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <ArrowRight className="w-5 h-5 text-cream" />
          </div>
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Project Detail Panel with Enhanced Film Strip
// ─────────────────────────────────────────────────────────────

function ProjectPanel({ 
  project, 
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: { 
  project: Project | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const filmstripRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setImageLoaded(false)
    setCurrentImageIndex(0)
  }, [project?.id])

  // Auto-scroll filmstrip to current thumbnail
  useEffect(() => {
    if (filmstripRef.current && project) {
      const thumbnail = filmstripRef.current.children[currentImageIndex] as HTMLElement
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [currentImageIndex, project])
  
  const currentImage = project?.images?.[currentImageIndex] || project?.image || ''
  const totalImages = project?.images?.length || 1

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') {
        if (currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1)
          setImageLoaded(false)
        }
      }
      if (e.key === 'ArrowRight') {
        if (currentImageIndex < totalImages - 1) {
          setCurrentImageIndex(currentImageIndex + 1)
          setImageLoaded(false)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose, currentImageIndex, totalImages])

  useEffect(() => {
    if (project) {
      lockScroll()
      return () => unlockScroll()
    }
  }, [project])

  if (!project) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-charcoal"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-cream/60 hover:text-cream transition-colors rounded-full hover:bg-white/10"
        aria-label="Close project details"
      >
        <X className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>
      
      {currentImageIndex > 0 && (
        <button
          onClick={() => { setCurrentImageIndex(currentImageIndex - 1); setImageLoaded(false) }}
          className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-cream/50 hover:text-cream transition-colors bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}
      {currentImageIndex < totalImages - 1 && (
        <button
          onClick={() => { setCurrentImageIndex(currentImageIndex + 1); setImageLoaded(false) }}
          className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-cream/50 hover:text-cream transition-colors bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      )}
      
      <div className="h-full flex flex-col lg:flex-row">
        <div className="relative h-[55vh] lg:h-full lg:w-2/3 bg-black">
          {/* Loading placeholder */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
            imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}>
            <div className="w-8 h-8 border-2 border-cream/20 border-t-cream/60 rounded-full animate-spin" />
          </div>
          
          <Image
            src={currentImage}
            alt={`${project.title} - Image ${currentImageIndex + 1} of ${totalImages}`}
            fill
            className={cn(
              'object-contain transition-opacity duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
            quality={90}
          />
          
          {/* Enhanced Film Strip Thumbnail Bar */}
          {totalImages > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12 pb-3">
              <div className="relative px-4 lg:px-6">
                {/* Scrollable thumbnail strip */}
                <div 
                  ref={filmstripRef}
                  className="flex gap-1.5 lg:gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {project.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentImageIndex(idx); setImageLoaded(false) }}
                      className={cn(
                        'relative flex-shrink-0 w-14 h-10 lg:w-16 lg:h-12 overflow-hidden snap-center transition-all duration-200 rounded-sm',
                        idx === currentImageIndex 
                          ? 'ring-2 ring-sand ring-offset-1 ring-offset-black opacity-100 scale-105' 
                          : 'opacity-40 hover:opacity-70 grayscale hover:grayscale-0'
                      )}
                      aria-label={`Go to image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-3 mt-3 text-cream/40 text-[10px] tracking-wider">
                  <span className="font-mono">{(currentImageIndex + 1).toString().padStart(2, '0')}</span>
                  <div className="w-16 h-px bg-cream/10 relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-sand transition-all duration-300"
                      style={{ width: `${((currentImageIndex + 1) / totalImages) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono">{totalImages.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 lg:w-1/3 p-6 lg:p-10 xl:p-12 flex flex-col justify-center overflow-y-auto bg-charcoal">
          <div className="max-w-md">
            <span className="text-cream/25 text-sm tracking-[0.3em] font-light">
              {project.id} / {projects.length.toString().padStart(2, '0')}
            </span>
            
            <p className="text-sand text-[10px] uppercase tracking-[0.2em] mt-6 lg:mt-8 mb-2">
              {project.region}
            </p>
            
            <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl text-cream font-light tracking-tight leading-[1.1]">
              {project.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 text-cream/45 text-sm">
              <span>{project.location}</span>
              <span className="w-1 h-1 rounded-full bg-cream/25" />
              <span>{project.type}</span>
              <span className="w-1 h-1 rounded-full bg-cream/25" />
              <span>{project.year}</span>
            </div>
            
            <div className="w-10 h-px bg-cream/15 my-6 lg:my-8" />
            
            <p className="text-cream/55 leading-relaxed text-sm lg:text-base">
              A bespoke environment crafted by Eclectic Hive, 
              bringing intentional design and material intelligence to {project.location}.
            </p>
            
            <div className="mt-8 lg:mt-10">
              <Link
                href="/contact#inquiry"
                className="inline-flex items-center gap-2.5 text-cream text-sm uppercase tracking-[0.15em] hover:text-sand transition-colors group"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="flex items-center justify-between mt-10 lg:mt-12 pt-6 border-t border-cream/10">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={cn(
                  'flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors',
                  hasPrev ? 'text-cream/50 hover:text-cream' : 'text-cream/15 cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={cn(
                  'flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] transition-colors',
                  hasNext ? 'text-cream/50 hover:text-cream' : 'text-cream/15 cursor-not-allowed'
                )}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Gallery Page
// ─────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'filmstrip'>('grid')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.region === activeFilter)
  
  const selectedIndex = selectedProject 
    ? filteredProjects.findIndex(p => p.id === selectedProject.id)
    : -1
  
  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedProject(filteredProjects[selectedIndex - 1])
    }
  }, [selectedIndex, filteredProjects])
  
  const handleNext = useCallback(() => {
    if (selectedIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[selectedIndex + 1])
    }
  }, [selectedIndex, filteredProjects])
  
  // Track active card on filmstrip scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container || viewMode !== 'filmstrip') return
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.firstElementChild?.clientWidth || 0
      const gap = 16
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(index, filteredProjects.length - 1))
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [filteredProjects.length, viewMode])
  
  const regionCounts = projects.reduce((acc, p) => {
    acc[p.region] = (acc[p.region] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main id="main-content" className="bg-charcoal min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-8 lg:pt-36 lg:pb-12 px-4 lg:px-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-cream/35 text-[10px] uppercase tracking-[0.3em] mb-3">
                The Gallery
              </p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-cream font-light uppercase tracking-[0.15em]">
                {filteredProjects.length} Environments
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <p className="text-cream/45 text-sm max-w-xs leading-relaxed hidden md:block">
                Each project represents a complete expression of design intelligence.
              </p>
              
              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-cream/5 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' ? 'bg-cream/10 text-cream' : 'text-cream/40 hover:text-cream/60'
                  )}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('filmstrip')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'filmstrip' ? 'bg-cream/10 text-cream' : 'text-cream/40 hover:text-cream/60'
                  )}
                  aria-label="Filmstrip view"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Filter Pills */}
      {projects.length > 0 && allRegions.length > 2 && (
        <section className="pb-6 lg:pb-10 px-4 lg:px-8">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-wrap gap-2">
              {allRegions.map((region) => {
                const isActive = activeFilter === region
                const count = region === 'All' ? projects.length : regionCounts[region]
                return (
                  <button
                    key={region}
                    onClick={() => setActiveFilter(region)}
                    className={cn(
                      'px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-all duration-300 border rounded-full',
                      isActive
                        ? 'bg-cream text-charcoal border-cream'
                        : 'bg-transparent text-cream/50 border-cream/15 hover:border-cream/30 hover:text-cream/70'
                    )}
                  >
                    {region}
                    {count > 1 && (
                      <span className={cn('ml-1.5', isActive ? 'text-charcoal/50' : 'text-cream/30')}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Main Content Area */}
      <section className="pb-12 lg:pb-20">
        {filteredProjects.length > 0 ? (
          viewMode === 'grid' ? (
            // Responsive CSS Grid Layout
            <div className="px-4 lg:px-8">
              <div className="max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                  {filteredProjects.map((project, index) => (
                    <GridProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => setSelectedProject(project)}
                      isPriority={index < 4}
                      size={index === 0 ? 'large' : 'normal'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Filmstrip Horizontal Scroll
            <>
              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 lg:px-8 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredProjects.map((project, index) => (
                  <FilmstripCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    isActive={index === activeIndex}
                    isPriority={index < 2}
                  />
                ))}
                <div className="flex-shrink-0 w-4 lg:w-8" aria-hidden="true" />
              </div>
              
              {/* Progress Indicator */}
              <div className="px-4 lg:px-8 mt-6">
                <div className="max-w-[1800px] mx-auto flex items-center gap-3">
                  <span className="text-cream/35 text-[10px] tracking-wider tabular-nums font-mono">
                    {(activeIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 max-w-xs h-px bg-cream/10 relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-sand transition-all duration-300"
                      style={{ width: `${((activeIndex + 1) / filteredProjects.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-cream/35 text-[10px] tracking-wider tabular-nums font-mono">
                    {filteredProjects.length.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              <div className="px-4 lg:px-8 mt-4">
                <p className="text-cream/25 text-[10px] uppercase tracking-[0.2em]">
                  Drag or scroll to explore
                </p>
              </div>
            </>
          )
        ) : (
          <div className="px-4 lg:px-8 py-20 lg:py-28">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-cream/25 text-[10px] uppercase tracking-[0.3em] mb-3">
                Coming Soon
              </p>
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-cream/50 font-light tracking-wide mb-4">
                Gallery Loading
              </h2>
              <p className="text-cream/35 text-sm leading-relaxed">
                Approved projects will appear here.
              </p>
            </div>
          </div>
        )}
      </section>
      
      {/* Project Index List */}
      {filteredProjects.length > 0 && (
        <section className="bg-cream/[0.03] py-12 lg:py-20 px-4 lg:px-8">
          <div className="max-w-[1800px] mx-auto">
            <p className="text-cream/35 text-[10px] uppercase tracking-[0.3em] mb-8">
              Project Index
            </p>
            
            <div className="space-y-0">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="w-full group py-4 lg:py-5 border-b border-cream/8 flex items-center gap-4 lg:gap-8 text-left hover:bg-cream/[0.03] transition-colors px-2 -mx-2 rounded"
                >
                  <span className="text-cream/25 text-sm tracking-wider w-6 flex-shrink-0 tabular-nums font-mono">
                    {project.id}
                  </span>
                  <span className="font-display text-lg lg:text-xl text-cream font-light flex-1 group-hover:text-sand transition-colors">
                    {project.title}
                  </span>
                  <span className="hidden lg:block text-cream/35 text-sm w-32">
                    {project.type}
                  </span>
                  <span className="text-cream/25 text-sm w-12 text-right tabular-nums font-mono">
                    {project.year}
                  </span>
                  <ArrowRight className="w-4 h-4 text-cream/25 group-hover:text-sand group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 lg:py-24 px-4 lg:px-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="max-w-xl">
            <p className="text-cream/35 text-[10px] uppercase tracking-[0.3em] mb-4">
              Your Project
            </p>
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-cream font-light uppercase tracking-[0.15em] leading-[1.2]">
              Ready to add your environment to our archive?
            </h2>
            <p className="mt-5 text-cream/45 leading-relaxed text-sm max-w-md">
              Every project in our portfolio represents a client who trusted us to 
              author something extraordinary.
            </p>
            <div className="mt-8">
              <Link 
                href="/contact#inquiry"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-cream text-charcoal text-[11px] uppercase tracking-[0.15em] hover:bg-sand transition-colors group rounded-sm"
              >
                <span>Start an Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* As Featured In */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="px-4 lg:px-8 max-w-[1800px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 xl:gap-16">
            {PRESS_LOGOS.map((logo, i) => (
              <div
                key={i}
                className="relative w-24 h-10 md:w-32 md:h-12 lg:w-36 lg:h-14 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              >
                <Image
                  src={logo.src}
                  alt={`Featured in ${logo.name}`}
                  fill
                  className="object-contain invert"
                  sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Project Detail Panel */}
      <ProjectPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={selectedIndex > 0}
        hasNext={selectedIndex < filteredProjects.length - 1}
      />
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
