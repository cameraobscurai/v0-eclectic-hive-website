'use client'

import Image from 'next/image'

export function AtelierHero() {
  return (
    <section className="relative min-h-[80vh] lg:min-h-screen bg-charcoal">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png"
          alt="Boucle chair in atmospheric setting"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-[80vh] lg:min-h-screen section-padding pb-16 lg:pb-24 pt-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Label */}
            <div className="lg:col-span-12">
              <p className="text-cream/50 text-xs uppercase tracking-wide mb-6">
                Atelier by The Hive
              </p>
            </div>
            
            {/* Main Headline */}
            <div className="lg:col-span-7">
              <h1 className="font-display text-cream text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-display font-light">
                <span className="italic">Imagined. Refined.</span>
                <br />
                <span className="italic">Crafted.</span>
              </h1>
            </div>
            
            {/* Subtext */}
            <div className="lg:col-span-5">
              <p className="text-cream/70 text-sm md:text-base lg:text-lg leading-relaxed max-w-xs md:max-w-md">
                The atelier is the creative engine of ECLECTIC HIVE—where fabrication, 
                material exploration, and design authorship converge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
