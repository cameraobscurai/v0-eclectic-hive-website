import Link from 'next/link'
import Image from 'next/image'

const caseStudies = [
  {
    id: 'aspen-summit',
    title: 'Aspen Summit',
    type: 'Corporate Retreat',
    scope: 'Design, Fabrication, Production',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'gallery-nocturne',
    title: 'Gallery Nocturne',
    type: 'Private Celebration',
    scope: 'Full Environment Design',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
  },
]

export function CaseStudiesSection() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Selected Work
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Environments
              <br />
              <span className="italic">we have authored</span>
            </h2>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <Link 
              href="/gallery"
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
            >
              <span className="editorial-link">View Gallery</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Case Studies */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {caseStudies.map((study, index) => (
            <Link 
              key={study.id}
              href={`/gallery/${study.id}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Image - alternating layout */}
              <div className={`${index % 2 === 0 ? 'lg:col-span-7' : 'lg:col-span-7 lg:col-start-6 lg:order-2'} aspect-[16/10] relative overflow-hidden editorial-image`}>
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Info */}
              <div className={`${index % 2 === 0 ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-4 lg:order-1'} flex flex-col justify-center`}>
                <span className="text-xs text-muted-foreground mb-4">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-2xl lg:text-3xl tracking-tight">{study.title}</h3>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">{study.type}</p>
                  <p className="text-sm text-muted-foreground">{study.scope}</p>
                </div>
                <div className="mt-6">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors editorial-link">
                    View Project
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
