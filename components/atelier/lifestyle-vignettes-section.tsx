'use client'

import Image from 'next/image'

const VIGNETTES = [
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_33_39%20AM-i3tVPuiTbhTLfdzp2THZmBRDfyaKBD.png', 
    title: 'The Gathered Table',
    caption: 'Linen, ceramic, and candlelight',
    span: 'col-span-12 md:col-span-8'
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png', 
    title: 'Quiet Corners',
    caption: 'Boucle, brass, and books',
    span: 'col-span-12 md:col-span-4'
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%281%29-ysnOsz5FYFEPQzufogthldORvQWG5F.png', 
    title: 'Objects of Interest',
    caption: 'Tableware, pottery, and provenance',
    span: 'col-span-12 md:col-span-4'
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_41%20AM%20%284%29-d9QCIVvJ0A0HwHkvgomCLIsSZpTltS.png', 
    title: 'Layered Comfort',
    caption: 'Textiles, pillows, and warmth',
    span: 'col-span-12 md:col-span-4'
  },
  { 
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%283%29-AJLa39oz4oGazs06HWIawRq61cYiuT.png', 
    title: 'Still Life',
    caption: 'Patina, pottery, and character',
    span: 'col-span-12 md:col-span-4'
  },
]

export function LifestyleVignettesSection() {
  return (
    <section className="py-24 md:py-32 bg-charcoal">
      <div className="container-padding max-w-[1600px] mx-auto">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-wide text-cream/40 mb-4">
            Styled Environments
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-display text-cream">
            Lifestyle Vignettes
          </h2>
          <p className="text-cream/50 mt-4 max-w-lg leading-relaxed">
            Beyond individual pieces—how our collection comes together to create 
            atmosphere, warmth, and story.
          </p>
        </div>

        {/* Vignettes Grid */}
        <div className="grid grid-cols-12 gap-4">
          {VIGNETTES.map((vignette, i) => (
            <div 
              key={i}
              className={`${vignette.span} group relative overflow-hidden`}
            >
              <div className="relative aspect-[4/3] md:aspect-square">
                <Image
                  src={vignette.src}
                  alt={vignette.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-cream text-lg font-display tracking-wide">{vignette.title}</p>
                  <p className="text-cream/60 text-sm mt-1">{vignette.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
