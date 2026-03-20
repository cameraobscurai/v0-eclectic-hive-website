import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Gallery | Eclectic Hive',
  description: 'Selected work and case studies. Evidence of our capability to author extraordinary environments.',
}

const projects = [
  {
    id: 'aspen-summit',
    title: 'Aspen Summit',
    type: 'Corporate Retreat',
    scope: 'Full Environment Design',
    year: '2024',
    description: 'A three-day executive retreat transformed into an immersive alpine environment. Custom fabricated installations, material-driven design, and production management for 200 guests.',
    highlights: ['Custom timber installations', 'Bespoke furniture collection', 'Full production management'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'gallery-nocturne',
    title: 'Gallery Nocturne',
    type: 'Private Celebration',
    scope: 'Design & Fabrication',
    year: '2024',
    description: 'An evening celebration within a private gallery space. Moody atmosphere, architectural lighting, and custom-fabricated sculptural elements.',
    highlights: ['Sculptural centerpieces', 'Atmospheric lighting design', 'Material palette curation'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'terra-celebration',
    title: 'Terra Celebration',
    type: 'Wedding',
    scope: 'Full Environment Design',
    year: '2024',
    description: 'An outdoor celebration grounded in earthy materiality. Terracotta, natural linens, and custom metalwork created an environment that felt both elevated and rooted.',
    highlights: ['Custom arch fabrication', 'Proprietary colorway development', 'Botanical design direction'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop',
    featured: false,
  },
]

const featuredProjects = projects.filter(p => p.featured)
const archiveProjects = projects.filter(p => !p.featured)

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
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
                Environments
                <br />
                <span className="italic">we have authored</span>
              </h1>
            </div>
            <div className="lg:col-span-4 flex items-end">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed">
                Each project represents a complete expression of our design intelligence, 
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
              <Link
                key={project.id}
                href={`/gallery/${project.id}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                {/* Image */}
                <div className={`${index % 2 === 0 ? 'lg:col-span-7' : 'lg:col-span-7 lg:col-start-6 lg:order-2'} aspect-[16/10] relative overflow-hidden editorial-image`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Info */}
                <div className={`${index % 2 === 0 ? 'lg:col-span-4 lg:col-start-9' : 'lg:col-span-4 lg:order-1'} flex flex-col justify-center`}>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span>{project.type}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>{project.year}</span>
                  </div>
                  <h2 className="font-serif text-3xl lg:text-4xl tracking-tight">{project.title}</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{project.description}</p>
                  <div className="mt-6">
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
      
      {/* Archive */}
      <section className="bg-secondary py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16">
            Archive
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {archiveProjects.map((project) => (
              <Link
                key={project.id}
                href={`/gallery/${project.id}`}
                className="group"
              >
                <div className="aspect-[4/3] relative overflow-hidden editorial-image mb-6">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span>{project.type}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{project.year}</span>
                </div>
                <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{project.scope}</p>
              </Link>
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
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
              Ready to add your
              <br />
              <span className="italic">environment to our archive?</span>
            </h2>
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
