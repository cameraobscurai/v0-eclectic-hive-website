'use client'

import Link from 'next/link'
import { Magnetic } from '@/components/animations/motion-elements'

export function AtelierCTA() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Work With Us
          </p>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight font-light">
            Commission a piece.
            <br />
            <span className="italic">Author an environment.</span>
          </h2>
          
          <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl">
            Whether you need a single proprietary piece or a complete environment 
            designed and fabricated by our studio, we welcome conversations about 
            how our atelier can serve your vision.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-start gap-6">
            <Magnetic strength={0.25}>
              <Link 
                href="/contact#inquiry"
                className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
              >
                Start an Inquiry
              </Link>
            </Magnetic>
            <Link 
              href="/process"
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group py-4"
            >
              <span className="editorial-link">View Our Process</span>
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
  )
}
