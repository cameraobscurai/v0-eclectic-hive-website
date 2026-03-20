import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Assets Portal | Eclectic Hive',
  description: 'Access our inventory of proprietary pieces and curated rentals. A resource for event professionals working with Eclectic Hive.',
}

const collections = [
  {
    name: 'Furniture',
    count: 45,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Seating',
    count: 68,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Lighting',
    count: 32,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Objects',
    count: 120,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop',
  },
]

export default function AssetsPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Assets Portal
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
                Proprietary inventory
                <br />
                <span className="italic">& curated resources</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex items-end">
              <p className="text-cream/70 leading-relaxed">
                Our inventory exists as extension of the studio&apos;s design world—
                pieces designed, fabricated, or curated to support the environments 
                we create.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Important Note */}
      <section className="bg-secondary py-16 lg:py-20">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h2 className="font-serif text-2xl lg:text-3xl tracking-tight">
                A note on inventory access
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
                Our inventory portal is designed for event professionals already working 
                with Eclectic Hive or exploring a potential collaboration. Access requires 
                approval and is granted to qualified professionals on a project basis.
              </p>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <Link 
                href="/contact"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
              >
                <span className="editorial-link">Request Access</span>
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
        </div>
      </section>
      
      {/* Collections Preview */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:mb-24">
            <div className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Collections
              </p>
            </div>
            <div className="lg:col-span-6">
              <h2 className="font-serif text-3xl md:text-4xl leading-[1.1] tracking-tight">
                Browse by category
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Our inventory spans furniture, seating, lighting, objects, textiles, 
                and architectural elements. Each piece has been selected or created 
                to meet our standards for quality and design integrity.
              </p>
            </div>
          </div>
          
          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <div key={collection.name} className="group cursor-pointer">
                <div className="aspect-[3/4] relative overflow-hidden editorial-image mb-4">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-cream text-sm uppercase tracking-widest">
                      Login to View
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-lg tracking-tight">{collection.name}</h3>
                  <span className="text-xs text-muted-foreground">{collection.count} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Login Section */}
      <section className="bg-charcoal text-cream py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-8">
                Portal Access
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
                Already have
                <br />
                <span className="italic">access?</span>
              </h2>
              <p className="mt-8 text-cream/70 leading-relaxed">
                If you&apos;ve been approved for portal access, log in below to browse 
                our full inventory, view pricing, and submit hold requests.
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="bg-cream/5 p-8 lg:p-12">
                <div className="flex flex-col gap-6">
                  <div>
                    <label htmlFor="portal-email" className="block text-sm text-cream/70 mb-2">Email</label>
                    <input
                      type="email"
                      id="portal-email"
                      className="w-full px-4 py-3 bg-cream/10 border-0 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-1 focus:ring-cream/30"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="portal-password" className="block text-sm text-cream/70 mb-2">Password</label>
                    <input
                      type="password"
                      id="portal-password"
                      className="w-full px-4 py-3 bg-cream/10 border-0 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-1 focus:ring-cream/30"
                      placeholder="Your password"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full px-8 py-4 bg-cream text-charcoal text-sm uppercase tracking-widest hover:bg-cream/90 transition-colors mt-2"
                  >
                    Sign In
                  </button>
                  <p className="text-center text-xs text-cream/40">
                    Need access?{' '}
                    <Link href="/contact" className="text-cream/60 hover:text-cream transition-colors">
                      Request an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
