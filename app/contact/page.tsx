import type { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { InquiryFlowWrapper } from '@/components/inquiry-flow-wrapper'

export const metadata: Metadata = {
  title: 'Contact | ECLECTIC HIVE',
  description:
    'Start a conversation with the ECLECTIC HIVE studio. Full-service event design and production house based in Denver, Colorado.',
}

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-cream min-h-screen">
      <Navigation />

      {/* Editorial header */}
      <section className="pt-40 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-wide text-charcoal/50 mb-4">
            Let&apos;s talk
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-display font-light text-charcoal mb-6">
            Start a Conversation
          </h1>
          <p className="text-charcoal/60 max-w-lg leading-relaxed mb-6">
            We review every inquiry personally. A few questions help us
            understand your vision so our first conversation is as useful
            as possible.
          </p>
          
          {/* Two-audience pathways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 border border-charcoal/10 rounded-sm">
              <p className="text-charcoal/80 mb-2">
                <span className="font-medium">Event planners:</span> We specialize in production partnerships.
              </p>
              <Link 
                href="/atelier" 
                className="text-charcoal/50 hover:text-charcoal underline underline-offset-4 transition-colors"
              >
                See how that works →
              </Link>
            </div>
            <div className="p-4 border border-charcoal/10 rounded-sm">
              <p className="text-charcoal/80 mb-2">
                <span className="font-medium">First time hiring a design firm?</span> Here&apos;s exactly what happens next.
              </p>
              <Link 
                href="/process" 
                className="text-charcoal/50 hover:text-charcoal underline underline-offset-4 transition-colors"
              >
                View our process →
              </Link>
            </div>
          </div>
          
          <div className="mt-12 h-px bg-charcoal/10" />
        </div>
      </section>

      {/* Multi-step inquiry flow - connected to inquiry store */}
      <InquiryFlowWrapper />

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
