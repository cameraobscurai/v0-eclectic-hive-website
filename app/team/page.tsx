'use client'

import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const team = [
  {
    name: 'Jill Livingston',
    role: 'Owner | Creative Director',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712258096193-CJT28MWOXRK51XNWXYGH/Jill+BW.jpg',
  },
  {
    name: 'Nicholas Patterson',
    role: 'General Manager',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712258101227-SLM6TDBQGQSJ8DS5LK7B/NP+BW.jpg',
  },
  {
    name: 'Kurt Van Raden',
    role: 'Executive Producer',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712258109040-9UP5P3D3X4GZUMMPIVMJ/Kurt+BW.jpg',
  },
  {
    name: 'Brittany Farrow',
    role: 'Senior Designer',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712258115970-WP2DP7G6EG3P49U7GHZS/Britt+BW.jpg',
  },
  {
    name: 'Adrienne Moon',
    role: 'Resource Manager',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712258123182-BKZJX1O5QSJJ8H5EQKZB/Adrienne+BW.jpg',
  },
  {
    name: 'Patrick Batten',
    role: 'Inventory + Warehouse Manager',
    image: 'https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1712258131017-MJEPZ2IW04CKPX6WZJ8O/Patrick+BW.jpg',
  },
]

const values = [
  {
    title: 'Authorship',
    description: 'We create environments that carry a point of view. Every project is an authored expression, not an assembled collection.',
  },
  {
    title: 'Materiality',
    description: 'We understand how materials behave in space—their weight, texture, and response to light. This intelligence shapes every decision.',
  },
  {
    title: 'Integration',
    description: 'Design, fabrication, and production work as one unified process. This integration allows us to control quality and deliver excellence.',
  },
  {
    title: 'Intention',
    description: 'Nothing is arbitrary. Every spacing, proportion, and material choice serves the larger vision we are creating.',
  },
]

function TeamMember({ member, index }: { member: typeof team[0]; index: number }) {
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
      className={cn(
        'group transition-all duration-700',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[3/4] mb-8 overflow-hidden bg-muted">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className={cn(
            'object-cover transition-all duration-700',
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
            'group-hover:scale-105'
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <h3 className="font-serif text-2xl lg:text-3xl tracking-tight">{member.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
    </div>
  )
}

export default function TeamPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-8">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                The Hive
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
                A team that
                <br />
                <span className="italic">does it all</span>
              </h1>
            </div>
            <div className="lg:col-span-4 flex items-end">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed">
                Eclectic Hive is a collective of designers, fabricators, and producers 
                united by a commitment to creating spaces that cannot be replicated.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Grid */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {team.map((member, index) => (
              <TeamMember key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="bg-secondary py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Our Values
              </p>
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
                What we
                <br />
                <span className="italic">believe</span>
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {values.map((value) => (
              <div key={value.title} className="py-8 border-t border-border">
                <h3 className="font-serif text-xl lg:text-2xl tracking-tight">{value.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Studio */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
                Our Studio
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.1] tracking-tight">
                Denver, Colorado
              </h2>
              <div className="mt-8 flex flex-col gap-6 text-muted-foreground leading-relaxed">
                <p>
                  Our studio and fabrication workshop are located in Denver&apos;s RiNo 
                  district. The space serves as design studio, material library, 
                  sample room, and production workshop.
                </p>
                <p>
                  While we are based in Colorado, we work with clients throughout 
                  the Mountain West and beyond. Our production capability extends 
                  wherever the project requires.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/5ed7e5a6b0e8f77099d3fd2d/1591825920358-4LJJNRX3XZZWKL8JHM9V/Eclectic+Hive+Warehouse.jpg"
                  alt="Eclectic Hive Studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
