'use client'

import { HeroPlaceholder } from '@/components/ui/image-placeholder'

export function AtelierHero() {
  return (
    <section className="relative min-h-[80vh] lg:min-h-screen bg-charcoal">
      {/* Background */}
      <div className="absolute inset-0">
        <HeroPlaceholder />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-[80vh] lg:min-h-screen px-6 lg:px-12 pb-16 lg:pb-24 pt-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Label */}
            <div className="lg:col-span-12">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Atelier by The Hive
              </p>
            </div>
            
            {/* Main Headline */}
            <div className="lg:col-span-7">
              <h1 className="font-display text-cream text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight font-light">
                <span className="italic">Imagined. Refined.</span>
                <br />
                <span className="italic">Crafted.</span>
              </h1>
            </div>
            
            {/* Subtext */}
            <div className="lg:col-span-5">
              <p className="text-cream/70 text-base lg:text-lg leading-relaxed max-w-md">
                The atelier is the creative engine of ECLECTIC HIVE—a space where 
                fabrication, material exploration, and design authorship converge to 
                shape environments that cannot be replicated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
