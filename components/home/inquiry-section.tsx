'use client'

import Link from 'next/link'
import { TextReveal, FadeUp } from '@/components/animations/text-reveal'

export function InquirySection() {
  return (
    <section className="bg-background py-32 lg:py-48">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-10">
              Begin a Conversation
            </p>
          </FadeUp>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
            <TextReveal splitBy="word" stagger={0.04} className="block">
              Ready to author
            </TextReveal>
            <TextReveal splitBy="word" stagger={0.04} delay={0.2} className="block italic">
              your environment?
            </TextReveal>
          </h2>
          
          <FadeUp delay={0.4}>
            <p className="mt-10 text-muted-foreground leading-relaxed max-w-xl mx-auto text-base lg:text-lg">
              We work with clients who value design intelligence, material consideration, 
              and the creation of spaces that cannot be replicated. Let us know about your vision.
            </p>
          </FadeUp>
          
          <FadeUp delay={0.5}>
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/contact"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-charcoal text-cream text-sm uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:bg-charcoal/90"
              >
                <span className="relative z-10">Start an Inquiry</span>
                <span className="absolute inset-0 bg-terracotta origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
              <Link 
                href="/process"
                className="inline-flex items-center gap-4 text-sm uppercase tracking-[0.15em] group py-5"
              >
                <span className="relative">
                  Learn Our Process
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
      
      {/* Symmetrical decorative elements */}
      <div className="mt-24 flex justify-center">
        <FadeUp delay={0.7}>
          <div className="flex items-center gap-8">
            <div className="w-16 h-px bg-border" />
            <div className="w-2 h-2 rotate-45 border border-muted-foreground/30" />
            <div className="w-16 h-px bg-border" />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
