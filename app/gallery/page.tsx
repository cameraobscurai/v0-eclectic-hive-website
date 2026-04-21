'use client'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Project Data - Add approved galleries here
// Each project needs: id, slug, title, planner, location, type, year, image
// ─────────────────────────────────────────────────────────────

type Project = {
  id: string
  slug: string
  title: string
  planner: string
  location: string
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
    planner: 'Eclectic Hive',
    location: 'Canyon Point, Utah',
    type: 'Private Celebration',
    year: '2024',
    image: '/images/gallery/amangiri/amangiri-landscape.jpg',
    images: [
      '/images/gallery/amangiri/amangiri-landscape.jpg',
      '/images/gallery/amangiri/amangiri-dining-forsythia.jpg',
      '/images/gallery/amangiri/amangiri-dining-side.jpg',
      '/images/gallery/amangiri/amangiri-lounge.jpg',
    ],
  },
]

// Extract unique planners for filtering
const allPlanners = ['All', ...Array.from(new Set(projects.map(p => p.planner)))]

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
  isActive 
}: { 
  project: typeof projects[0]
  onClick: () => void
  isActive: boolean
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] xl:w-[40vw] snap-center',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal',
        'transition-all duration-500',
        isActive ? 'opacity-100' : 'opacity-70 hover:opacity-90'
      )}
      aria-label={`View ${project.title} by ${project.planner}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/50">
        <Image
          src={project.image}
          alt={`${project.title} - ${project.planner}`}
          fill
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
            {project.planner}
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

  // Lock body scroll when panel is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
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
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
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
        {/* Image Side */}
        <div className="relative h-[50vh] lg:h-full lg:w-2/3">
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
          
          {/* Image counter */}
          {totalImages > 1 && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
              {project.images?.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentImageIndex(idx); setImageLoaded(false) }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    idx === currentImageIndex 
                      ? 'bg-cream w-6' 
                      : 'bg-cream/40 hover:bg-cream/60'
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Info Side */}
        <div className="flex-1 lg:w-1/3 p-8 lg:p-12 xl:p-16 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md">
            {/* Project Number */}
            <span className="text-cream/30 text-sm tracking-[0.3em] font-light">
              {project.id} / {projects.length.toString().padStart(2, '0')}
            </span>
            
            {/* Planner */}
            <p className="text-sand text-xs uppercase tracking-[0.2em] mt-8 mb-3">
              {project.planner}
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
            
            {/* Description placeholder */}
            <p className="text-cream/60 leading-relaxed">
              A bespoke environment designed in collaboration with {project.planner}, 
              bringing intentional design and material intelligence to {project.location}.
            </p>
            
            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 text-cream text-sm uppercase tracking-[0.15em] hover:text-sand transition-colors group"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
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
// ──────────���──────────────────────────────────────────────────

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Filter projects
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.planner === activeFilter)
  
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
  
  // Count by planner for filter badges
  const plannerCounts = projects.reduce((acc, p) => {
    acc[p.planner] = (acc[p.planner] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main id="main-content" className="bg-charcoal min-h-screen">
      <Navigation />
      
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-cream/40 text-xs uppercase tracking-[0.3em] mb-4">
                The Gallery
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-cream font-light uppercase tracking-[0.2em]">
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
      
      {/* ─────────────────────────────────────────────────────────────
          Filter Pills - Only show when projects exist
      ───────────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="pb-8 lg:pb-12 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3">
              {allPlanners.map((planner) => {
              const isActive = activeFilter === planner
              const count = planner === 'All' ? projects.length : plannerCounts[planner]
              return (
                <button
                  key={planner}
                  onClick={() => setActiveFilter(planner)}
                  className={cn(
                    'px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-300 border',
                    isActive
                      ? 'bg-cream text-charcoal border-cream'
                      : 'bg-transparent text-cream/60 border-cream/20 hover:border-cream/40 hover:text-cream'
                  )}
                >
                  {planner}
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
      
      {/* ─────────────────────────────────────────────────────────────
          Horizontal Filmstrip
      ───────────────────────────────────────────────────────────── */}
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                  isActive={index === activeIndex}
                />
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
      
      {/* ─────────────────────────────────────────────────────────────
          Index List (Alternative View) - Only show when projects exist
      ───────────────────────────────────────────────────────────── */}
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
                  <span className="hidden md:block text-cream/50 text-sm flex-1">
                    {project.planner}
                  </span>
                  
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
      
      {/* ─────────────────────────────────────────────────────────────
          CTA Section
      ───────────────────────────────────────────────────────────── */}
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
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-cream text-charcoal text-sm uppercase tracking-[0.15em] hover:bg-sand transition-colors group"
              >
                <span>Start an Inquiry</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* ─────────────────────────────────────────────────────────────
          As Featured In
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-cream/10">
        <div className="px-6 lg:px-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-cream/30 text-center mb-10">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {PRESS_LOGOS.map((logo, i) => (
              <div
                key={i}
                className="relative w-20 h-8 md:w-24 md:h-10 opacity-40 hover:opacity-70 transition-opacity"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* ─────────────────────────────────────────────────────────────
          Project Detail Panel
      ───────────────────────────────────────────────────────────── */}
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
