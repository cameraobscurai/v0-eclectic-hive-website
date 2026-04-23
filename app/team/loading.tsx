import { Navigation } from '@/components/navigation'

export default function TeamLoading() {
  return (
    <main className="min-h-screen bg-cream pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Hero skeleton */}
      <section className="relative py-20 lg:py-32 px-6 lg:px-16">
        <div className="max-w-4xl">
          <div className="h-3 w-16 bg-charcoal/10 rounded animate-pulse mb-6" />
          <div className="h-10 w-80 bg-charcoal/10 rounded animate-pulse mb-4" />
          <div className="h-4 w-96 bg-charcoal/5 rounded animate-pulse" />
        </div>
      </section>
      
      {/* Team grid skeleton */}
      <section className="px-6 lg:px-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group">
              <div className="aspect-[3/4] bg-charcoal/5 rounded-lg relative overflow-hidden mb-4">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-charcoal/5 to-transparent animate-shimmer"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              </div>
              <div className="h-5 w-32 bg-charcoal/10 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-charcoal/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
