import { Navigation } from '@/components/navigation'

export default function ServicesLoading() {
  return (
    <main className="min-h-screen bg-cream pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Hero skeleton */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-16 border-b border-charcoal/5">
        <div className="max-w-3xl">
          <div className="h-3 w-20 bg-charcoal/10 rounded animate-pulse mb-6" />
          <div className="h-12 w-72 bg-charcoal/10 rounded animate-pulse mb-4" />
          <div className="h-4 w-full max-w-lg bg-charcoal/5 rounded animate-pulse" />
        </div>
      </section>
      
      {/* Services grid skeleton */}
      <section className="px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-charcoal/10 rounded-lg p-8">
              <div className="h-6 w-40 bg-charcoal/10 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-charcoal/5 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-charcoal/5 rounded animate-pulse" />
                <div className="h-3 w-3/5 bg-charcoal/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
