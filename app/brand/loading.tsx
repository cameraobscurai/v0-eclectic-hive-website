import { Navigation } from '@/components/navigation'

export default function BrandLoading() {
  return (
    <main className="min-h-screen bg-charcoal pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Hero skeleton */}
      <section className="relative py-16 px-8 lg:px-16 border-b border-cream/10">
        <div className="max-w-6xl mx-auto">
          <div className="h-3 w-24 bg-cream/10 rounded animate-pulse mb-4" />
          <div className="h-12 w-80 bg-cream/10 rounded animate-pulse mb-3" />
          <div className="h-5 w-64 bg-cream/5 rounded animate-pulse" />
        </div>
      </section>
      
      {/* Quick nav skeleton */}
      <nav className="sticky top-16 z-30 bg-charcoal/95 border-b border-cream/5">
        <div className="max-w-6xl mx-auto px-8 lg:px-16 py-4 flex gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="h-4 bg-cream/10 rounded animate-pulse"
              style={{ width: `${60 + Math.random() * 30}px` }}
            />
          ))}
        </div>
      </nav>
      
      {/* Content sections skeleton */}
      <section className="px-8 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-32 bg-cream/10 rounded animate-pulse mb-8" />
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="border border-cream/10 rounded-lg p-6">
                    <div className="h-5 w-28 bg-cream/10 rounded animate-pulse mb-3" />
                    <div className="h-3 w-full bg-cream/5 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
