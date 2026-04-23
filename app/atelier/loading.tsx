import { Navigation } from '@/components/navigation'

export default function AtelierLoading() {
  return (
    <main className="min-h-screen bg-charcoal pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Hero skeleton */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-16 px-6 lg:px-16">
        <div className="relative z-10 max-w-2xl">
          <div className="h-3 w-24 bg-cream/10 rounded animate-pulse mb-6" />
          <div className="h-14 w-80 bg-cream/10 rounded animate-pulse mb-4" />
          <div className="h-5 w-96 bg-cream/5 rounded animate-pulse" />
        </div>
      </section>
      
      {/* Content skeleton */}
      <section className="px-6 lg:px-16 py-20 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-16 w-16 rounded-full bg-charcoal/5 mx-auto mb-6 animate-pulse" />
                <div className="h-5 w-32 bg-charcoal/10 rounded mx-auto mb-3 animate-pulse" />
                <div className="h-3 w-full bg-charcoal/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
