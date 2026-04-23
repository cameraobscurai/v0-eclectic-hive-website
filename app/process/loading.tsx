import { Navigation } from '@/components/navigation'

export default function ProcessLoading() {
  return (
    <main className="min-h-screen bg-charcoal pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Hero skeleton */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-16">
        <div className="max-w-3xl">
          <div className="h-3 w-16 bg-cream/10 rounded animate-pulse mb-6" />
          <div className="h-12 w-64 bg-cream/10 rounded animate-pulse mb-4" />
          <div className="h-4 w-96 bg-cream/5 rounded animate-pulse" />
        </div>
      </section>
      
      {/* Steps skeleton */}
      <section className="px-6 lg:px-16 pb-20">
        <div className="max-w-4xl mx-auto space-y-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-8">
              <div className="h-8 w-8 rounded-full bg-cream/10 animate-pulse flex-shrink-0" />
              <div className="flex-1">
                <div className="h-6 w-48 bg-cream/10 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-cream/5 rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-cream/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
