import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { InquiryFlowWrapper } from '@/components/inquiry-flow-wrapper'

export const metadata: Metadata = {
  title: 'Contact | Eclectic Hive',
  description:
    'Start a conversation with the Eclectic Hive studio. Full-service event design and production house based in Denver, Colorado.',
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-cream h-[100svh] flex flex-col overflow-hidden">
      <Navigation />

      {/* Single-fold layout: headline left, form right on desktop; stacked on mobile */}
      <div className="flex-1 flex flex-col lg:flex-row section-padding pt-24 md:pt-28 pb-6 md:pb-8 gap-8 lg:gap-16 overflow-hidden">
        
        {/* Left column - Headline (fixed, doesn't scroll) */}
        <div className="lg:w-[45%] xl:w-[40%] flex flex-col justify-center shrink-0">
          {/* Eyebrow */}
          <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40 mb-4">
            Start a conversation
          </p>

          {/* Display headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-[4rem] font-light text-charcoal leading-[1.05] tracking-[-0.02em] mb-5">
            Let&apos;s make<br className="hidden sm:block" />
            something<br className="hidden sm:block" />
            unforgettable.
          </h1>

          {/* Sub-copy - hidden on mobile to save space */}
          <p className="hidden md:block text-charcoal/50 max-w-sm leading-relaxed text-[14px] mb-6">
            Every inquiry is reviewed personally. A few questions help us
            understand your vision.
          </p>

          {/* Footer info - desktop only */}
          <div className="hidden lg:flex flex-col gap-2 mt-auto pt-8">
            <p className="text-charcoal/35 text-[12px] tracking-[0.03em]">
              Prefer email?{' '}
              <a
                href="mailto:info@eclectichive.com"
                className="text-charcoal/55 hover:text-charcoal transition-colors underline underline-offset-4"
              >
                info@eclectichive.com
              </a>
            </p>
            <p className="text-charcoal/30 text-[12px] tracking-[0.03em]">
              Denver, CO · Salt Lake City, UT
            </p>
          </div>
        </div>

        {/* Right column - Form (scrollable if needed) */}
        <div className="lg:w-[55%] xl:w-[60%] flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <InquiryFlowWrapper />
        </div>
      </div>

      {/* Mobile footer info */}
      <div className="lg:hidden section-padding pb-4 pt-2 border-t border-charcoal/5">
        <div className="flex items-center justify-between text-[11px] text-charcoal/40">
          <a
            href="mailto:info@eclectichive.com"
            className="hover:text-charcoal transition-colors"
          >
            info@eclectichive.com
          </a>
          <span>Denver · Salt Lake City</span>
        </div>
      </div>
    </main>
  )
}
