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
    role: 'Owner & Creative Director',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/4abbdec3-cc0e-47c9-b75e-9eecef715811/Jill+Livingston+2023+Headshot+Close+Up.jpg',
  },
  {
    name: 'Annie Ohman',
    role: 'Director of Company Operations',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/fb2af9f1-b449-42c1-9fd6-4429fcd73350/Annie-001.jpg',
  },
  {
    name: 'Sam Young',
    role: 'Project Manager',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/261b3a32-4959-4e54-a945-67666a7b0709/Sam+Young+v3.png',
  },
  {
    name: 'Amanda Ferguson',
    role: 'Senior Designer',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/b56b8da0-ecf7-42b4-b81b-99fe7b64e4ad/Amanda+Ferguson%2C+Senior+Designer+B%2BW.jpg',
  },
  {
    name: 'Patrick Batten',
    role: 'Director of Warehouse Operations',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c932a1b6-1a1b-4c88-9e06-a237a6443aa1/Eclectic+Hive-Carrie+King+Photographer-154.jpg?refresh=1',
  },
  {
    name: 'Adrienne Moon',
    role: 'Purchasing & Inventory Specialist',
    image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/f12cd93a-f5bc-4a26-b18b-e63e2c68e754/Adrienne+Moon.jpg?refresh=2',
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
                  src="https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/c932a1b6-1a1b-4c88-9e06-a237a6443aa1/Eclectic+Hive-Carrie+King+Photographer-154.jpg"
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
