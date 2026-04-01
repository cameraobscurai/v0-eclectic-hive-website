'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { PretextReveal, PretextHighlight } from '@/components/typography/pretext-reveal'
import { ShrinkwrapQuote } from '@/components/typography/shrinkwrap-quote'
import { FadeUp } from '@/components/animations/text-reveal'

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-background py-28 lg:py-44">
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
            {/* Main statement with Pretext line-by-line reveal */}
            <PretextReveal
              as="h2"
              fontSize={32}
              lineHeight={44}
              fontFamily="serif"
              className="text-foreground tracking-tight"
              trigger={isInView}
              initialDelay={200}
              staggerDelay={80}
            >
              Eclectic Hive is a design and fabrication studio that creates authored environments—spaces that feel constructed, intentional, and irreplaceable.
            </PretextReveal>
            
            <div className="mt-14 lg:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              <FadeUp delay={0.3} distance={30}>
                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  We are not a rental company. We are{' '}
                  <PretextHighlight trigger={isInView} delay={800}>
                    environment architects
                  </PretextHighlight>
                  —shaping spaces through design intelligence, proprietary inventory, 
                  custom fabrication, and production expertise that transforms vision into physical form.
                </p>
              </FadeUp>
              <FadeUp delay={0.45} distance={30}>
                <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                  Every material is considered. Every construction is intentional. Every 
                  environment we create carries the{' '}
                  <PretextHighlight trigger={isInView} delay={1000}>
                    signature of our process
                  </PretextHighlight>
                  —from concept through completion.
                </p>
              </FadeUp>
            </div>
            
            {/* Shrinkwrap Pull Quote */}
            <div className="mt-20 lg:mt-28">
              <ShrinkwrapQuote
                maxWidth={500}
                fontSize={22}
                lineHeight={34}
                attribution="Our Philosophy"
                align="left"
              >
                Design is not decoration—it is the deliberate orchestration of space, material, and intention.
              </ShrinkwrapQuote>
            </div>
            
            <FadeUp delay={0.6} distance={20}>
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
