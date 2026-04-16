import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      <section id="main-content" className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4">
            404
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.12em] font-semibold uppercase text-charcoal mb-6">
            Page Not Found
          </h1>
          <p className="text-charcoal/60 mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-charcoal text-cream text-sm uppercase tracking-[0.2em] hover:bg-charcoal/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
