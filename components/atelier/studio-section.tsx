'use client'

import { Reveal, Parallax } from '@/components/animations/motion-elements'

export function StudioSection() {
  return (
    <section className="bg-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image — wipes in from left */}
          <Reveal direction="left" delay={0} overlayColor="bg-cream" className="relative aspect-[4/3] bg-sand">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-charcoal/20 rounded-sm flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Design Studio</p>
            </div>
          </Reveal>

          {/* Content — text drifts slower (background feel) */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6">
              Design Studio
            </p>
            <h2 className="font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase text-charcoal">
              The creative work hub
            </h2>
            <Parallax speed={0.2} direction="up">
              <p className="mt-6 text-charcoal/70 leading-relaxed">
                Our Denver studio is where ideas become tangible. Here, design concepts 
                are developed, materials are sourced and tested, and every detail is 
                considered before anything reaches fabrication.
              </p>
              <p className="mt-4 text-charcoal/70 leading-relaxed">
                This is where the cinematic, art-forward approach that defines our work 
                takes shape—where mood boards become environments and sketches become 
                proprietary pieces.
              </p>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  )
}
