# Gallery & Atelier Page Code Export

Complete source code for the Gallery and Atelier pages with all components.

---

## Gallery Page

### File Structure
```
app/gallery/
├── page.tsx          # Main gallery page (797 lines)
├── layout.tsx        # Metadata
└── loading.tsx       # Loading state

components/gallery/
├── distorted-card.tsx    # Scroll velocity distortion wrapper
└── distortion-filter.tsx # SVG filter injection
```

---

### `app/gallery/layout.tsx`

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Gallery | ECLECTIC HIVE',
  description: 'Selected work from ECLECTIC HIVE — luxury event design and production across Colorado, Utah, and beyond.',
  robots: { index: true, follow: true },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

---

### `app/gallery/page.tsx`

```tsx
'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { lockScroll, unlockScroll } from '@/lib/scroll-lock'
import { useScrollVelocity } from '@/hooks/use-scroll-velocity'
import { DistortionFilter } from '@/components/gallery/distortion-filter'
import { DistortedCard } from '@/components/gallery/distorted-card'

// ─────────────────────────────────────────────────────────────
// Project Data - Add approved galleries here
// Each project needs: id, slug, title, planner, location, type, year, image
// ─────────────────────────────────────────────────────────────

type Project = {
  id: string
  slug: string
  title: string
  planner?: string // Optional planner/designer name
  location: string // Full location (e.g., "Canyon Point, Utah")
  region: string // State/country for filtering (e.g., "Utah")
  type: string
  year: string
  image: string // Cover image for the filmstrip
  images: string[] // All images for the detail view
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
      // Opening: Iconic property establishing shots
      '/images/gallery/amangiri/property-pool.jpg',
      '/images/gallery/amangiri/property-night.jpg',
      // Desert lounge - wide to detail rhythm
      '/images/gallery/amangiri/lounge-wide.jpg',
      '/images/gallery/amangiri/lounge-mesas.jpg',
      '/images/gallery/amangiri/lounge-firepit.jpg',
      '/images/gallery/amangiri/lounge-florals.jpg',
      '/images/gallery/amangiri/lounge-arrangement.jpg',
      // White canyon lounge vignette
      '/images/gallery/amangiri/white-lounge.jpg',
      '/images/gallery/amangiri/branch-pedestal.jpg',
      '/images/gallery/amangiri/bud-vase-terrazzo.jpg',
      // Tablescape sequence - day to dusk
      '/images/gallery/amangiri/tablescape-forsythia.jpg',
      '/images/gallery/amangiri/amangiri-dining-forsythia.jpg',
      '/images/gallery/amangiri/amangiri-dining-side.jpg',
      '/images/gallery/amangiri/styling-moment.jpg',
      // Detail moments
      '/images/gallery/amangiri/floral-pedestal.jpg',
      '/images/gallery/amangiri/ceramic-vases.jpg',
      '/images/gallery/amangiri/cherry-cocktails.jpg',
      '/images/gallery/amangiri/place-setting-dusk.jpg',
      // Evening atmosphere - the payoff
      '/images/gallery/amangiri/cocktail-hour.jpg',
      '/images/gallery/amangiri/dinner-candlelight.jpg',
      '/images/gallery/amangiri/amangiri-lounge.jpg',
      '/images/gallery/amangiri/amangiri-landscape.jpg',
      // Night close - lanterns leading into darkness
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

// Extract unique regions for filtering
const allRegions = ['All', ...Array.from(new Set(projects.map(p => p.region))).sort()]

// Press logos - where their work has been featured
const PRESS_LOGOS = [
  { name: 'Elle', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Elle%2BLogo%2Bw%2B2-OVQNlm5PY1I9dKvM2JblVMgBvFfYj7.webp' },
  { name: "Harper's Bazaar", src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bazaar%2BLogo%2BW-Y41iLCo3Nck09LLPlG974WK0B927jI.webp' },
  { name: 'The Knot', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-h11ekHP7Chbg2IvGhPvl5IEqwDAW78.png' },
  { name: 'Vogue', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vogue%2Blogo%2Bw-NfImu5uR2feTV0gVZLpDgb3izl9xAO.webp' },
  { name: 'Martha Stewart', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MS%2Blogo%2Bw-qJWRNbqp0fnELXYBwPDut01f5GbAXE.webp' },
  { name: 'Brides', src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Brides%2Blogo%2BW-mt7R82vdgFSNJzMdkravKAHEO77igK.webp' },
]

// ─────────────────────────────────────────────────────────────
// Project Card Component
// ─────────────────────────────────────────────────────────────

function ProjectCard({ 
  project, 
  onClick,
  isActive,
  isPriority = false
}: { 
  project: typeof projects[0]
  onClick: () => void
  isActive: boolean
  isPriority?: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-[85vw] md:w-[60vw] lg:w-[45vw] xl:w-[40vw] snap-center',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal',
        'transition-all duration-500',
        isActive 
          ? 'opacity-100 scale-100' 
          : 'opacity-60 scale-[0.97] hover:opacity-80 hover:scale-[0.98]'
      )}
      aria-label={`View ${project.title} in ${project.region}`}
    >
      {/* Image Container - elevated with shadow */}
      <div className={cn(
        "relative aspect-[4/5] overflow-hidden bg-charcoal/50",
        "shadow-2xl shadow-black/40",
        "ring-1 ring-white/5",
        "transition-shadow duration-500",
        isActive && "shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)]"
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
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 60vw, 45vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Project Number */}
        <div className="absolute top-6 left-6">
          <span className="text-cream/50 text-xs tracking-[0.3em] font-light">
            {project.id}
          </span>
        </div>
        
        {/* Project Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <p className="text-cream/60 text-xs uppercase tracking-[0.2em] mb-2">
            {project.region}
          </p>
          <h3 className="font-display text-2xl lg:text-3xl text-cream font-light tracking-tight">
            {project.title}
          </h3>
          <div className="flex items-center gap-3 mt-3 text-cream/50 text-xs">
            <span>{project.location}</span>
            <span className="w-1 h-1 rounded-full bg-cream/30" />
            <span>{project.type}</span>
          </div>
        </div>
        
        {/* Hover Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full border border-cream/30 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <ArrowRight className="w-5 h-5 text-cream" />
          </div>
        </div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Project Detail Panel (Inline Expansion)
// ─────────────────────────────────────────────────────────────

function ProjectPanel({ 
  project, 
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: { 
  project: typeof projects[0] | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Reset image loaded state and index when project changes
  useEffect(() => {
    setImageLoaded(false)
    setCurrentImageIndex(0)
  }, [project?.id])
  
  // Get current image
  const currentImage = project?.images?.[currentImageIndex] || project?.image || ''
  const totalImages = project?.images?.length || 1

  // Keyboard navigation - arrow keys for images within project
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return
      if (e.key === 'Escape') onClose()
      // Arrow keys navigate images within the current project
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

  // Lock body scroll when panel is open - ref-counted for iOS Safari
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
      {/* Close Button - safe area for notched phones */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-cream/70 hover:text-cream transition-colors safe-area-top"
        style={{ top: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))' }}
        aria-label="Close project details"
      >
        <X className="w-6 h-6" />
      </button>
      
      {/* Image Navigation Arrows - navigate within project images */}
      {currentImageIndex > 0 && (
        <button
          onClick={() => { setCurrentImageIndex(currentImageIndex - 1); setImageLoaded(false) }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-cream/50 hover:text-cream transition-colors bg-black/20 backdrop-blur-sm rounded-full"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentImageIndex < totalImages - 1 && (
        <button
          onClick={() => { setCurrentImageIndex(currentImageIndex + 1); setImageLoaded(false) }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-cream/50 hover:text-cream transition-colors bg-black/20 backdrop-blur-sm rounded-full"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      
      {/* Content */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* Image Side - taller on mobile for better viewing */}
        <div className="relative h-[55svh] lg:h-full lg:w-2/3">
          <Image
            src={currentImage}
            alt={`${project.title} - Image ${currentImageIndex + 1} of ${totalImages}`}
            fill
            className={cn(
              'object-cover transition-opacity duration-500',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal/20 lg:bg-gradient-to-l" />
          
          {/* Film Strip Thumbnail Bar */}
          {totalImages > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-16 pb-4">
              <div className="relative">
                {/* Film strip sprocket holes - top */}
                <div className="absolute -top-3 left-0 right-0 flex justify-center gap-[52px] px-4 overflow-hidden">
                  {Array.from({ length: Math.ceil(totalImages * 1.5) }).map((_, i) => (
                    <div key={`top-${i}`} className="w-2 h-2 rounded-sm bg-cream/10 flex-shrink-0" />
                  ))}
                </div>
                
                {/* Scrollable thumbnail strip */}
                <div 
                  className="flex gap-2 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {project.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentImageIndex(idx); setImageLoaded(false) }}
                      className={cn(
                        'relative flex-shrink-0 w-16 h-12 overflow-hidden snap-center transition-all duration-200',
                        idx === currentImageIndex 
                          ? 'ring-2 ring-sand ring-offset-1 ring-offset-black/50 opacity-100' 
                          : 'opacity-50 hover:opacity-80 grayscale hover:grayscale-0'
                      )}
                      aria-label={`Go to image ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      {/* Frame number overlay */}
                      <span className="absolute bottom-0.5 right-1 text-[8px] text-cream/60 font-mono">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
                
                {/* Film strip sprocket holes - bottom */}
                <div className="absolute -bottom-3 left-0 right-0 flex justify-center gap-[52px] px-4 overflow-hidden">
                  {Array.from({ length: Math.ceil(totalImages * 1.5) }).map((_, i) => (
                    <div key={`bottom-${i}`} className="w-2 h-2 rounded-sm bg-cream/10 flex-shrink-0" />
                  ))}
                </div>
              </div>
              
              {/* Image counter text */}
              <div className="flex items-center justify-center gap-3 mt-4 text-cream/40 text-xs tracking-wider">
                <span className="font-mono">{(currentImageIndex + 1).toString().padStart(2, '0')}</span>
                <span className="w-8 h-px bg-cream/20" />
                <span className="font-mono">{totalImages.toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Info Side - with safe area bottom for home indicator */}
        <div className="flex-1 lg:w-1/3 p-8 pb-safe lg:p-12 xl:p-16 flex flex-col justify-center overflow-y-auto" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}>
          <div className="max-w-md">
            {/* Project Number */}
            <span className="text-cream/30 text-sm tracking-[0.3em] font-light">
              {project.id} / {projects.length.toString().padStart(2, '0')}
            </span>
            
            {/* Region */}
            <p className="text-sand text-xs uppercase tracking-[0.2em] mt-8 mb-3">
              {project.region}
            </p>
            
            {/* Title */}
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-cream font-light tracking-tight leading-[1.1]">
              {project.title}
            </h2>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 text-cream/50 text-sm">
              <span>{project.location}</span>
              <span className="w-1 h-1 rounded-full bg-cream/30" />
              <span>{project.type}</span>
              <span className="w-1 h-1 rounded-full bg-cream/30" />
              <span>{project.year}</span>
            </div>
            
            {/* Divider */}
            <div className="w-12 h-px bg-cream/20 my-8" />
            
            {/* Description */}
            <p className="text-cream/60 leading-relaxed">
              A bespoke environment crafted by Eclectic Hive, 
              bringing intentional design and material intelligence to {project.location}.
            </p>
            
            {/* Project Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-cream/10">
              <button
                onClick={onPrev}
                disabled={!hasPrev}
                className={cn(
                  'flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors',
                  hasPrev ? 'text-cream/60 hover:text-cream' : 'text-cream/20 cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Project</span>
              </button>
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={cn(
                  'flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors',
                  hasNext ? 'text-cream/60 hover:text-cream' : 'text-cream/20 cursor-not-allowed'
                )}
              >
                <span>Next Project</span>
                <ChevronRight className="w-4 h-4" />
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
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const velocityRef = useScrollVelocity(scrollRef)
  
  // Filter projects by region
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.region === activeFilter)
  
  // Get current project index in filtered list
  const selectedIndex = selectedProject 
    ? filteredProjects.findIndex(p => p.id === selectedProject.id)
    : -1
  
  // Navigation handlers
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
  
  // Track active card on scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.firstElementChild?.clientWidth || 0
      const gap = 24 // gap-6 = 24px
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(index, filteredProjects.length - 1))
    }
    
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [filteredProjects.length])
  
  // Count by region for filter badges
  const regionCounts = projects.reduce((acc, p) => {
    acc[p.region] = (acc[p.region] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main id="main-content" className="bg-charcoal min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-cream/40 text-xs uppercase tracking-wide mb-4">
                The Gallery
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-cream font-light tracking-display">
                {filteredProjects.length} Environments
              </h1>
            </div>
            
            <p className="text-cream/50 text-base lg:text-lg max-w-md leading-relaxed">
              Each project represents a complete expression of design intelligence, 
              fabrication capability, and production expertise.
            </p>
          </div>
        </div>
      </section>
      
      {/* Filter Pills - By Region/Location */}
      {projects.length > 0 && allRegions.length > 2 && (
        <section className="pb-8 lg:pb-12 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3">
              {allRegions.map((region) => {
              const isActive = activeFilter === region
              const count = region === 'All' ? projects.length : regionCounts[region]
              return (
                <button
                  key={region}
                  onClick={() => setActiveFilter(region)}
                  className={cn(
                    'px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300 border',
                    isActive
                      ? 'bg-cream text-charcoal border-cream'
                      : 'bg-transparent text-cream/60 border-cream/20 hover:border-cream/40 hover:text-cream'
                  )}
                >
                  {region}
                  {count > 1 && (
                    <span className={cn(
                      'ml-2 opacity-50',
                      isActive ? 'text-charcoal/60' : 'text-cream/40'
                    )}>
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
      
      <DistortionFilter />
      
      {/* Horizontal Filmstrip */}
      <section className="pb-16 lg:pb-24">
        {filteredProjects.length > 0 ? (
          <>
            {/* Scrollable Container */}
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 lg:px-12 pb-4 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {filteredProjects.map((project, index) => (
                <DistortedCard
                  key={project.id}
                  velocityRef={velocityRef}
                  className="flex-shrink-0"
                >
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    isActive={index === activeIndex}
                    isPriority={index === 0}
                  />
                </DistortedCard>
              ))}
              
              {/* End spacer for last card */}
              <div className="flex-shrink-0 w-6 lg:w-12" aria-hidden="true" />
            </div>
            
            {/* Progress Indicator */}
            <div className="px-6 lg:px-12 mt-8">
              <div className="max-w-7xl mx-auto flex items-center gap-4">
                <span className="text-cream/40 text-xs tracking-wider tabular-nums">
                  {(activeIndex + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex-1 h-px bg-cream/10 relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-sand transition-all duration-300"
                    style={{ width: `${((activeIndex + 1) / filteredProjects.length) * 100}%` }}
                  />
                </div>
                <span className="text-cream/40 text-xs tracking-wider tabular-nums">
                  {filteredProjects.length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            
            {/* Scroll Hint */}
            <div className="px-6 lg:px-12 mt-6">
              <div className="max-w-7xl mx-auto">
                <p className="text-cream/30 text-xs uppercase tracking-[0.2em]">
                  Drag or scroll to explore
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Empty State - No projects yet */
          <div className="px-6 lg:px-12 py-24 lg:py-32">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-cream/30 text-xs uppercase tracking-[0.3em] mb-4">
                Coming Soon
              </p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-cream/60 font-light tracking-wide mb-6">
                Gallery Loading
              </h2>
              <p className="text-cream/40 text-sm leading-relaxed">
                Approved projects will appear here. Each gallery showcases complete environments 
                designed in collaboration with premier event planners.
              </p>
            </div>
          </div>
        )}
      </section>
      
      {/* Index List (Alternative View) - Only show when projects exist */}
      {filteredProjects.length > 0 && (
        <section className="bg-cream/5 py-16 lg:py-24 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-cream/40 text-xs uppercase tracking-[0.3em] mb-12">
              Project Index
            </p>
            
            <div className="space-y-0">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="w-full group py-6 border-b border-cream/10 flex items-center gap-6 lg:gap-12 text-left hover:bg-cream/5 transition-colors px-4 -mx-4"
                >
                  {/* Number */}
                  <span className="text-cream/30 text-sm tracking-wider w-8 flex-shrink-0 tabular-nums">
                    {project.id}
                  </span>
                  
                  {/* Title */}
                  <span className="font-display text-xl lg:text-2xl text-cream font-light flex-1 group-hover:text-sand transition-colors">
                    {project.title}
                  </span>
                  
                  {/* Planner */}
                  {project.planner && (
                    <span className="hidden md:block text-cream/50 text-sm flex-1">
                      {project.planner}
                    </span>
                  )}
                  
                  {/* Type */}
                  <span className="hidden lg:block text-cream/40 text-sm w-40">
                    {project.type}
                  </span>
                  
                  {/* Year */}
                  <span className="text-cream/30 text-sm w-16 text-right tabular-nums">
                    {project.year}
                  </span>
                  
                  {/* Arrow */}
                  <ArrowRight className="w-4 h-4 text-cream/30 group-hover:text-sand group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-cream/40 text-xs uppercase tracking-[0.3em] mb-6">
              Your Project
            </p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-cream font-light uppercase tracking-[0.2em] leading-[1.15]">
              Ready to add your environment to our archive?
            </h2>
            <p className="mt-6 text-cream/50 leading-relaxed max-w-xl">
              Every project in our portfolio represents a client who trusted us to 
              author something extraordinary. We welcome conversations about how 
              we can create your next environment.
            </p>
            <div className="mt-10">
              <Link 
                href="/contact#inquiry"
                className="inline-flex items-center gap-3 px-8 py-4 bg-cream text-charcoal text-sm uppercase tracking-[0.15em] hover:bg-sand transition-colors group"
              >
                <span>Start an Inquiry</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* As Featured In - Cream background like their old site */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16 xl:gap-20">
            {PRESS_LOGOS.map((logo, i) => (
              <div
                key={i}
                className="relative w-28 h-12 md:w-36 md:h-14 lg:w-44 lg:h-16 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              >
                <Image
                  src={logo.src}
                  alt={`Featured in ${logo.name}`}
                  fill
                  className="object-contain invert"
                  sizes="(max-width: 768px) 112px, (max-width: 1024px) 144px, 176px"
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
      
      {/* Hide scrollbar globally for this page */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
```

---

### `components/gallery/distorted-card.tsx`

```tsx
'use client'

import { useEffect, useRef } from 'react'

interface DistortedCardProps {
  children: React.ReactNode
  velocityRef: React.MutableRefObject<number>
  className?: string
}

/**
 * Wraps a card with scroll-velocity-driven SVG distortion.
 * Uses RAF for smooth lerp animation — no React re-renders during scroll.
 * At rest: sharp images. During fast scroll: subtle wave distortion.
 */
export function DistortedCard({ children, velocityRef, className }: DistortedCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const currentScale = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    function animate() {
      const el = wrapperRef.current
      if (!el) {
        rafId.current = requestAnimationFrame(animate)
        return
      }

      // Target scale: velocity magnitude → distortion amount
      const targetScale = Math.abs(velocityRef.current) * 22

      // Lerp toward target: fast to distort (0.25), slow to settle (0.06)
      const lerpSpeed = targetScale > currentScale.current ? 0.25 : 0.06
      currentScale.current += (targetScale - currentScale.current) * lerpSpeed

      // Apply filter only when distortion is visible
      if (currentScale.current > 0.1) {
        el.style.filter = `url(#gallery-distort)`
        // Update the shared SVG displacement scale
        const displacementEl = document.getElementById('gallery-displacement')
        if (displacementEl) {
          displacementEl.setAttribute('scale', currentScale.current.toFixed(2))
        }
      } else {
        el.style.filter = 'none'
        currentScale.current = 0
      }

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  // velocityRef is a stable ref, doesn't need to be a dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  )
}
```

---

### `components/gallery/distortion-filter.tsx`

```tsx
'use client'

import { useEffect } from 'react'

let injected = false

/**
 * Injects a shared SVG filter for gallery scroll distortion.
 * Uses feTurbulence + feDisplacementMap for a subtle wave effect.
 * The scale value is animated externally via setDistortionScale().
 */
export function DistortionFilter() {
  useEffect(() => {
    if (injected || typeof document === 'undefined') return
    injected = true

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML = `
      <defs>
        <filter id="gallery-distort" x="-5%" y="-5%" width="110%" height="110%"
                color-interpolation-filters="sRGB">
          <feTurbulence
            id="gallery-turbulence"
            type="fractalNoise"
            baseFrequency="0.015 0.035"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            id="gallery-displacement"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    `
    document.body.appendChild(svg)
  }, [])

  return null
}

/**
 * Animate the distortion scale — called by DistortedCard on each frame.
 */
export function setDistortionScale(scale: number) {
  const el = document.getElementById('gallery-displacement')
  if (el) el.setAttribute('scale', scale.toString())
}
```

---

## Atelier Page

### File Structure
```
app/atelier/
├── page.tsx      # Main atelier page
└── loading.tsx   # Loading state

components/atelier/
├── atelier-hero.tsx           # Hero section with image frames
├── atelier-cta.tsx            # Call-to-action section
├── the-space-section.tsx      # Section 01: The Space
├── the-humans-section.tsx     # Section 02: The Humans (team)
└── the-fabrication-section.tsx # Section 03: The Fabrication
```

---

### `app/atelier/page.tsx`

```tsx
import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AtelierHero } from '@/components/atelier/atelier-hero'
import { TheSpaceSection } from '@/components/atelier/the-space-section'
import { TheHumansSection } from '@/components/atelier/the-humans-section'
import { TheFabricationSection } from '@/components/atelier/the-fabrication-section'
import { AtelierCTA } from '@/components/atelier/atelier-cta'

export const metadata: Metadata = {
  title: 'Atelier by The Hive | ECLECTIC HIVE',
  description: 'The Space. The Humans. The Fabrication. Our full-service design and production studio where ideas become tangible.',
}

export default function AtelierPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />
      <AtelierHero />
      
      {/* Section 01: The Space */}
      <TheSpaceSection />
      
      {/* Section 02: The Humans */}
      <TheHumansSection />
      
      {/* Section 03: The Fabrication */}
      <TheFabricationSection />
      
      <AtelierCTA />
      <Footer />
    </main>
  )
}
```

---

### `components/atelier/atelier-hero.tsx`

```tsx
'use client'

import { cn } from '@/lib/utils'

// Placeholder frame component - clean window for future imagery
function ImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-charcoal/[0.03] border border-charcoal/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Corner brackets to indicate frame */}
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-charcoal/20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-charcoal/20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-charcoal/20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-charcoal/20" />
      
      {/* Center crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-charcoal/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-charcoal/10" />
        </div>
      </div>
      
      {/* Optional label */}
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/30 font-mono">
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

export function AtelierHero() {
  return (
    <section className="relative min-h-screen bg-cream pt-24 lg:pt-28">
      
      {/* Main hero grid */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Label */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-charcoal/40">Atelier by The Hive</span>
              <div className="flex-1 h-px bg-charcoal/10" />
            </div>
          </div>
          
          {/* Cinematic grid layout */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Large hero frame - left side */}
            <div className="col-span-12 lg:col-span-7">
              <ImageFrame 
                aspectRatio="16/10" 
                label="Hero Image"
                className="h-[50vh] lg:h-[65vh]"
              />
            </div>
            
            {/* Right column - headline + secondary frame */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {/* Headline */}
              <div className="flex-1 flex flex-col justify-center py-8 lg:py-0">
                <h1 className="font-brand text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.05] tracking-[0.08em] text-charcoal uppercase" style={{ fontWeight: 400 }}>
                  Imagined.
                  <br />
                  Refined.
                  <br />
                  Crafted.
                </h1>
                <p className="mt-6 text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md">
                  The atelier is the creative engine of ECLECTIC HIVE—where fabrication, 
                  material exploration, and design authorship converge.
                </p>
              </div>
              
              {/* Secondary frame */}
              <ImageFrame 
                aspectRatio="3/2" 
                label="Detail Shot"
                className="hidden lg:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

### `components/atelier/the-space-section.tsx`

```tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Placeholder frame component
function ImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-charcoal/[0.03] border border-charcoal/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-charcoal/20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-charcoal/20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-charcoal/20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-charcoal/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-charcoal/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-charcoal/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/30 font-mono">{label}</span>
        </div>
      )}
    </div>
  )
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

export function TheSpaceSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (reducedMotion) { setIsInView(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <section ref={ref} id="the-space" className="bg-cream">
      {/* Section Header */}
      <div className="section-padding py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Section number + title */}
            <div className="col-span-12 lg:col-span-5">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-xs text-charcoal/40">01</span>
                <div className="w-12 h-px bg-charcoal/20" />
              </div>
              <h2 
                className={cn(
                  'font-brand text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] uppercase text-charcoal transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ fontWeight: 400 }}
              >
                The Space
              </h2>
              <p 
                className={cn(
                  'mt-6 text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-700 delay-100',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                Creative work hub. Where ideas become tangible and inventory becomes experience.
              </p>
            </div>
            
            {/* Right: Horizontal image strip */}
            <div className="col-span-12 lg:col-span-7">
              <div 
                className={cn(
                  'grid grid-cols-2 gap-4 transition-all duration-700 delay-200',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
              >
                <ImageFrame aspectRatio="4/5" label="Design Studio" />
                <ImageFrame aspectRatio="4/5" label="Warehouse" />
              </div>
            </div>
          </div>
          
          {/* Full-width cinematic frame */}
          <div 
            className={cn(
              'mt-16 lg:mt-24 transition-all duration-700 delay-300',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )}
          >
            <ImageFrame 
              aspectRatio="21/9" 
              label="Panoramic Studio View"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

### `components/atelier/the-humans-section.tsx`

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const team = [
  { name: 'Jill Livingston', role: 'Founder | Creative Director' },
  { name: 'Annie Ohman', role: 'Director of Company Operations' },
  { name: 'Amanda Ferguson', role: 'Senior Designer' },
  { name: 'Erin Purnell', role: 'Associate Designer' },
  { name: 'Adrienne Moon', role: 'Purchasing & Inventory Specialist' },
  { name: 'Nathan Alexander', role: 'Lead Fabricator' },
  { name: 'Cat Moore', role: 'Brand & Marketing' },
  { name: 'Sam Young', role: 'Project Manager' },
  { name: 'Ryan Kankowski', role: 'Project Manager' },
  { name: 'Stephen Proud', role: 'Warehouse & Fleet Specialist' },
  { name: 'Sarah Lilly-Ray', role: 'Warehouse Operations' },
  { name: 'Regina Mennig', role: 'Accounting & Business Manager' },
  { name: 'Judgy Morales', role: 'Human Resources' },
]

// Placeholder portrait frame
function PortraitFrame({ name, role }: { name: string; role: string }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-sand/50 border border-charcoal/10 overflow-hidden mb-4">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-charcoal/15" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-charcoal/15" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-charcoal/15" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-charcoal/15" />
        
        {/* Center indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-charcoal/10" />
        </div>
      </div>
      <h3 className="font-brand text-sm tracking-[0.08em] text-charcoal" style={{ fontWeight: 400 }}>{name}</h3>
      <p className="text-xs text-charcoal/50 mt-1">{role}</p>
    </div>
  )
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

export function TheHumansSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (prefersReducedMotion) { setIsInView(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section ref={ref} id="the-humans" className="bg-sand/30 py-24 lg:py-32">
      <div className="section-padding max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-12 lg:col-span-6">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-xs text-charcoal/40">02</span>
              <div className="w-12 h-px bg-charcoal/20" />
            </div>
            <h2 
              className={cn(
                'font-brand text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] uppercase text-charcoal transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ fontWeight: 400 }}
            >
              The Humans
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:flex lg:items-end">
            <p 
              className={cn(
                'text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-700 delay-100',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Professional but approachable. We love what we do—and it shows.
            </p>
          </div>
        </div>

        {/* Team Grid - Leadership Row */}
        <div 
          className={cn(
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 transition-all duration-700 delay-200',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {team.slice(0, 4).map((member) => (
            <PortraitFrame key={member.name} name={member.name} role={member.role} />
          ))}
        </div>
        
        {/* Team Grid - Rest of Team */}
        <div 
          className={cn(
            'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 transition-all duration-700 delay-300',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {team.slice(4).map((member) => (
            <PortraitFrame key={member.name} name={member.name} role={member.role} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### `components/atelier/the-fabrication-section.tsx`

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Product placeholder data
const products = [
  { name: 'Sylvanus Green & Ash Sofa', description: 'Channel tufting with walnut frame' },
  { name: 'Lindt Toffee Velvet Sofa', description: 'Channel tufted velvet' },
  { name: 'Sidony Wood + White Loveseat', description: 'Teak frame with linen cushions' },
  { name: 'Reshma Botanical Sofa', description: 'Sculptural botanical print' },
  { name: 'Ava Sage Velvet Chair', description: 'Mid-century sculptural arms' },
]

// Dark-themed placeholder frame for charcoal sections
function DarkImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-cream/[0.03] border border-cream/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-cream/15" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-cream/15" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-cream/15" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-cream/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-cream/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-cream/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-cream/30 font-mono">{label}</span>
        </div>
      )}
    </div>
  )
}

// Light-themed placeholder frame
function LightImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-charcoal/[0.02] border border-charcoal/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-charcoal/15" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-charcoal/15" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-charcoal/15" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-charcoal/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-charcoal/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-charcoal/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/30 font-mono">{label}</span>
        </div>
      )}
    </div>
  )
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

export function TheFabricationSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (reducedMotion) { setIsInView(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.02 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <section ref={ref} id="the-fabrication">
      {/* Section Header - Light background */}
      <div className="bg-cream section-padding py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            <div className="col-span-12 lg:col-span-5">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-xs text-charcoal/40">03</span>
                <div className="w-12 h-px bg-charcoal/20" />
              </div>
              <h2 
                className={cn(
                  'font-brand text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] uppercase text-charcoal transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                )}
                style={{ fontWeight: 400 }}
              >
                The Fabrication
              </h2>
              <p 
                className={cn(
                  'mt-6 text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md transition-all duration-700 delay-100',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                Each piece can be tailored. This isn&apos;t rental inventory—it&apos;s a starting point.
              </p>
            </div>
            
            {/* Process visualization */}
            <div className="col-span-12 lg:col-span-7">
              <div 
                className={cn(
                  'grid grid-cols-3 gap-4 transition-all duration-700 delay-200',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
              >
                <div className="text-center">
                  <LightImageFrame aspectRatio="1/1" label="Design" />
                  <p className="text-xs uppercase tracking-[0.12em] text-charcoal/40 mt-3">01 Design</p>
                </div>
                <div className="text-center">
                  <LightImageFrame aspectRatio="1/1" label="Customize" />
                  <p className="text-xs uppercase tracking-[0.12em] text-charcoal/40 mt-3">02 Customize</p>
                </div>
                <div className="text-center">
                  <LightImageFrame aspectRatio="1/1" label="Fabricate" />
                  <p className="text-xs uppercase tracking-[0.12em] text-charcoal/40 mt-3">03 Fabricate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Seating - Dark section */}
      <div className="bg-charcoal text-cream py-24 lg:py-32">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/40">Signature Seating</p>
          </div>
          
          {/* Horizontal scroll filmstrip */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-5 px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
            {products.map((product, i) => (
              <div key={i} className="flex-shrink-0 w-[75vw] md:w-[50vw] lg:w-[35vw]">
                <DarkImageFrame aspectRatio="4/3" label={`Product ${i + 1}`} />
                <div className="mt-4">
                  <p className="text-cream text-base lg:text-lg">{product.name}</p>
                  <p className="text-cream/50 text-sm mt-1">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableware - Light section */}
      <div className="bg-cream section-padding py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Tableware Collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LightImageFrame aspectRatio="16/10" label="Collection 01" />
            <LightImageFrame aspectRatio="16/10" label="Collection 02" />
            <LightImageFrame aspectRatio="16/10" label="Collection 03" />
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

### `components/atelier/atelier-cta.tsx`

```tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

// Dark-themed placeholder frame
function DarkImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-cream/[0.03] border border-cream/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-cream/15" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-cream/15" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-cream/15" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-cream/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-cream/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-cream/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-cream/30 font-mono">{label}</span>
        </div>
      )}
    </div>
  )
}

export function AtelierCTA() {
  return (
    <section className="bg-charcoal text-cream">
      <div className="section-padding py-24 lg:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: CTA content */}
          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-brand text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[0.08em] text-cream" style={{ fontWeight: 400 }}>
              Start a conversation.
            </h2>
            
            <Link 
              href="/contact"
              className="inline-flex items-center gap-4 mt-8 text-sm uppercase tracking-[0.15em] text-cream/70 hover:text-cream transition-colors group"
            >
              <span>Get in touch</span>
              <span className="w-8 h-px bg-cream/40 group-hover:w-12 transition-all duration-300" />
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          
          {/* Right: Featured image placeholder */}
          <div className="col-span-12 lg:col-span-7">
            <DarkImageFrame 
              aspectRatio="16/9" 
              label="Featured Project"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## Dependencies

These pages require the following shared utilities and hooks:

- `@/lib/utils` - `cn()` classname utility
- `@/lib/scroll-lock` - `lockScroll()`, `unlockScroll()` for iOS-safe scroll locking
- `@/hooks/use-scroll-velocity` - `useScrollVelocity()` for distortion effect
- `@/components/navigation` - Site navigation
- `@/components/footer` - Site footer
- `lucide-react` - Icons (X, ChevronLeft, ChevronRight, ArrowRight)
