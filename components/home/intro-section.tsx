import Link from 'next/link'

export function IntroSection() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Label */}
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Who We Are
            </p>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-balance">
              Eclectic Hive is a design and fabrication studio that creates 
              <span className="italic"> authored environments</span>—spaces that feel 
              constructed, intentional, and irreplaceable.
            </h2>
            
            <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <p className="text-muted-foreground leading-relaxed">
                We are not a rental company. We are environment architects—shaping spaces 
                through design intelligence, proprietary inventory, custom fabrication, 
                and production expertise that transforms vision into physical form.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every material is considered. Every construction is intentional. Every 
                environment we create carries the signature of our process—from concept 
                through completion.
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8">
              <Link 
                href="/services"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group text-foreground"
              >
                <span className="editorial-link">Our Approach</span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/team"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group text-foreground"
              >
                <span className="editorial-link">Meet The Hive</span>
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
      </div>
    </section>
  )
}
