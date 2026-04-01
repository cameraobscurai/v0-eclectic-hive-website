'use client'

import Link from 'next/link'
import { TextReveal, FadeUp } from '@/components/animations/text-reveal'
import { ImageReveal } from '@/components/animations/scroll-section'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'

export function AtelierPreview() {
  return (
    <section className="bg-secondary py-28 lg:py-44">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <div className="lg:col-span-3">
            <FadeUp>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Atelier by The Hive
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-6">
            <TextReveal
              as="h2"
              className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight"
              splitBy="word"
              stagger={0.04}
            >
              The creative engine of our studio
            </TextReveal>
          </div>
        </div>
        
        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          {/* Large Image */}
          <div className="md:col-span-7">
            <ImageReveal direction="up" delay={0}>
              <ImagePlaceholder 
                aspectRatio="portrait" 
                label="Fabrication"
              />
            </ImageReveal>
          </div>
          
          {/* Stacked Images */}
          <div className="md:col-span-5 flex flex-col gap-4 lg:gap-6">
            <ImageReveal direction="up" delay={0.15}>
              <ImagePlaceholder 
                aspectRatio="landscape" 
                label="Materials"
              />
            </ImageReveal>
            <ImageReveal direction="up" delay={0.3}>
              <ImagePlaceholder 
                aspectRatio="landscape" 
                label="Workshop"
              />
            </ImageReveal>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-20 lg:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-5 lg:col-start-4">
            <FadeUp delay={0.1}>
              <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                Our atelier is where materiality meets intention. From custom fabrication 
                to proprietary colorways, every piece carries the mark of hands that 
                understand both craft and concept.
              </p>
            </FadeUp>
          </div>
          <div className="lg:col-span-3 flex items-end">
            <FadeUp delay={0.2}>
              <Link 
                href="/atelier"
                className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group"
              >
                <span className="relative">
                  Enter Atelier
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-foreground/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
