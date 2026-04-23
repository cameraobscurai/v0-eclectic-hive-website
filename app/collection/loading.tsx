import { Navigation } from '@/components/navigation'

// AAA Loading State - No flash of empty content
export default function CollectionLoading() {
  return (
    <main className="min-h-screen bg-white pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      {/* Category Bar Skeleton */}
      <section className="sticky top-0 z-40 bg-white">
        <div className="border-b border-charcoal/10">
          <div className="flex items-center lg:justify-center gap-1 py-3 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="h-8 rounded bg-neutral-100 animate-pulse"
                style={{ width: `${60 + Math.random() * 40}px` }}
              />
            ))}
          </div>
        </div>
        
        {/* Sub-category skeleton */}
        <div className="border-b border-charcoal/5 bg-white">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="h-7 rounded-full bg-neutral-100 animate-pulse"
                  style={{ width: `${50 + Math.random() * 30}px`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <div className="h-7 w-20 rounded-full bg-neutral-100 animate-pulse" />
          </div>
        </div>
        
        {/* Count skeleton - shows placeholder, not "0" */}
        <div className="flex items-center px-4 md:px-6 py-2 bg-neutral-50/50">
          <div className="h-3 w-24 rounded bg-neutral-200/50 animate-pulse" />
        </div>
      </section>
      
      {/* Product Grid Skeleton - Matches real grid layout exactly */}
      <section className="flex-1 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-r border-b border-charcoal/5">
              <div className="aspect-square bg-white p-4 lg:p-6">
                <div 
                  className="w-full h-full rounded bg-gradient-to-br from-neutral-50 to-neutral-100 relative overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
                    style={{ animationDelay: `${(i % 6) * 150}ms` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
