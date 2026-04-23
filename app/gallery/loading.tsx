import { Navigation } from '@/components/navigation'

export default function GalleryLoading() {
  return (
    <main className="min-h-screen bg-charcoal pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Hero skeleton */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end pb-12 px-6 lg:px-16">
        <div className="relative z-10 max-w-2xl">
          <div className="h-3 w-20 bg-cream/10 rounded animate-pulse mb-4" />
          <div className="h-12 w-64 bg-cream/10 rounded animate-pulse mb-3" />
          <div className="h-4 w-48 bg-cream/5 rounded animate-pulse" />
        </div>
      </section>
      
      {/* Projects skeleton - filmstrip style */}
      <section className="px-6 lg:px-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg">
              <div 
                className="aspect-[4/5] bg-cream/5 relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/5 to-transparent animate-shimmer"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="h-4 w-32 bg-cream/10 rounded animate-pulse mb-2" />
                <div className="h-3 w-24 bg-cream/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
