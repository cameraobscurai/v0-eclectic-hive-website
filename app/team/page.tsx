import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'

export const metadata: Metadata = {
  title: 'The Hive | Eclectic Hive',
  description: 'Meet the people behind Eclectic Hive. Designers, fabricators, and producers who author extraordinary environments.',
}

const team = [
  {
    name: 'Alexandra Vance',
    role: 'Founder & Creative Director',
    bio: 'Alexandra founded Eclectic Hive after fifteen years leading design for luxury hospitality and private events. Her vision guides every environment we create—balancing aesthetic ambition with practical intelligence.',
  },
  {
    name: 'Marcus Chen',
    role: 'Head of Fabrication',
    bio: 'Marcus brings twenty years of architectural fabrication experience to our atelier. His expertise in materials, construction methods, and finish work ensures that every piece we create meets our exacting standards.',
  },
  {
    name: 'Sophia Reed',
    role: 'Senior Designer',
    bio: 'Sophia leads concept development and material direction for our projects. Her background in interior architecture and textile design brings depth to every palette and spatial decision.',
  },
  {
    name: 'David Okafor',
    role: 'Production Director',
    bio: 'David manages the complex logistics that transform design vision into lived reality. His fifteen years in event production ensure that every installation is executed with precision.',
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
                The people who
                <br />
                <span className="italic">author environments</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {team.map((member) => (
              <div key={member.name} className="group">
                <div className="mb-8">
                  <ImagePlaceholder 
                    aspectRatio="portrait"
                    label={member.name.split(' ')[0]}
                  />
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl tracking-tight">{member.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{member.role}</p>
                <p className="mt-4 text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
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
              <ImagePlaceholder 
                aspectRatio="landscape"
                label="Studio"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
