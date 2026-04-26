'use client'

import Link from 'next/link'

export function AtelierCTA() {
  return (
    <section className="bg-charcoal text-cream py-24 lg:py-32">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-display font-light">
              <span className="italic">Let&apos;s create</span>
              <br />
              something together.
            </h2>
          </div>
          
          <div className="lg:text-right">
            <Link 
              href="/contact"
              className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-cream transition-colors group"
            >
              <span>Get in touch</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
