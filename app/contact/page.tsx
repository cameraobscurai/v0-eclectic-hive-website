import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { InquiryFlow } from '@/components/inquiry-flow'

export const metadata: Metadata = {
  title: 'Contact | Eclectic Hive',
  description:
    'Start a conversation with the Eclectic Hive studio. Full-service event design and production house based in Denver, Colorado.',
}

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-cream min-h-screen">
      <Navigation />

      {/* Editorial header */}
      <section className="pt-40 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4">
            Let&apos;s talk
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.12em] font-semibold uppercase text-charcoal mb-6">
            Start a Conversation
          </h1>
          <p className="text-charcoal/60 max-w-lg leading-relaxed">
            We review every inquiry personally. A few questions help us
            understand your vision so our first conversation is as useful
            as possible.
          </p>
          <div className="mt-12 h-px bg-charcoal/10" />
        </div>
      </section>

      {/* Multi-step inquiry flow */}
      <InquiryFlow />

      {/* Direct email fallback */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 h-px bg-charcoal/10" />
          <p className="text-charcoal/40 text-sm">
            Prefer email?{' '}
            <a
              href="mailto:hello@eclectichive.com"
              className="text-charcoal/60 hover:text-charcoal transition-colors underline underline-offset-4"
            >
              hello@eclectichive.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
