'use client'

import Link from 'next/link'
import { TextReveal, HighlightText, FadeUp } from '@/components/animations/text-reveal'

export function IntroSection() {
  return (
    <section className="bg-background py-28 lg:py-44">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Label */}
          <div className="lg:col-span-3">
            <FadeUp delay={0}>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Who We Are
              </p>
            </FadeUp>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <TextReveal 
              as="h2" 
              className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight"
              splitBy="word"
              stagger={0.03}
              duration={0.9}
            >
              Eclectic Hive is a design and fabrication studio that creates authored environments—spaces that feel constructed, intentional, and irreplaceable.
            </TextReveal>
            
            <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              <FadeUp delay={0.2} distance={30}>
                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  We are not a rental company. We are{' '}
                  <HighlightText highlightClassName="bg-terracotta/15">
                    environment architects
                  </HighlightText>
                  —shaping spaces through design intelligence, proprietary inventory, 
                  custom fabrication, and production expertise that transforms vision into physical form.
                </p>
              </FadeUp>
              <FadeUp delay={0.35} distance={30}>
                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  Every material is considered. Every construction is intentional. Every 
                  environment we create carries the{' '}
                  <HighlightText highlightClassName="bg-terracotta/15">
                    signature of our process
                  </HighlightText>
                  —from concept through completion.
                </p>
              </FadeUp>
            </div>
            
            <FadeUp delay={0.5} distance={20}>
              <div className="mt-14 flex flex-wrap gap-10">
                <Link 
                  href="/services"
                  className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group text-foreground"
                >
                  <span className="relative">
                    Our Approach
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
                <Link 
                  href="/team"
                  className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group text-foreground"
                >
                  <span className="relative">
                    Meet The Hive
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
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
