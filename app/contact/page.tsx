import type { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { InquiryFlowWrapper } from '@/components/inquiry-flow-wrapper'

export const metadata: Metadata = {
  title: 'Contact | Eclectic Hive',
  description:
    'Start a conversation with the Eclectic Hive studio. Full-service event design and production house based in Denver, Colorado.',
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-cream min-h-screen">
      <Navigation />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="pt-36 md:pt-44 section-padding">
        <div className="max-w-2xl mx-auto">

          {/* Eyebrow */}
          <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/40 mb-5">
            Start a conversation
          </p>

          {/* Display headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] font-light text-charcoal leading-[1.0] tracking-[-0.02em] mb-8">
            Let&apos;s make<br />
            something<br />
            unforgettable.
          </h1>

          {/* Sub-copy */}
          <p className="text-charcoal/50 max-w-md leading-relaxed text-[15px] mb-10">
            Every inquiry is reviewed personally. A few questions help us
            understand your vision so our first conversation is as useful
            as possible.
          </p>

          {/* Audience pathways — minimal, not boxy */}
          <div className="flex flex-col sm:flex-row gap-x-10 gap-y-3 text-sm mb-14">
            <div className="flex items-baseline gap-2.5">
              <span className="w-px h-3 bg-charcoal/20 shrink-0 self-center" />
              <span className="text-charcoal/45 tracking-[0.03em]">
                Event planners —{' '}
                <Link
                  href="/atelier"
                  className="text-charcoal/60 hover:text-charcoal underline underline-offset-4 transition-colors"
                >
                  see how we partner
                </Link>
              </span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="w-px h-3 bg-charcoal/20 shrink-0 self-center" />
              <span className="text-charcoal/45 tracking-[0.03em]">
                First time?{' '}
                <Link
                  href="/process"
                  className="text-charcoal/60 hover:text-charcoal underline underline-offset-4 transition-colors"
                >
                  view our process
                </Link>
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-charcoal/8" />
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <InquiryFlowWrapper />

      {/* ── Footer note ────────────────────────────────────────────────────── */}
      <section className="section-padding pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="h-px bg-charcoal/8 mb-8" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
            <p className="text-charcoal/35 text-[13px] tracking-[0.03em]">
              Prefer email?{' '}
              <a
                href="mailto:info@eclectichive.com"
                className="text-charcoal/55 hover:text-charcoal transition-colors underline underline-offset-4"
              >
                info@eclectichive.com
              </a>
            </p>
            <p className="text-charcoal/35 text-[13px] tracking-[0.03em]">
              Denver, CO · Salt Lake City, UT
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
