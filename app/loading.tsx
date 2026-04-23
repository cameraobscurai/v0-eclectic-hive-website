import { Navigation } from '@/components/navigation'

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-charcoal">
      <Navigation />
      
      {/* Hero skeleton - full viewport */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Large text skeleton */}
        <div className="text-center">
          <div 
            className="h-16 md:h-24 lg:h-32 w-[300px] md:w-[500px] lg:w-[700px] bg-cream/5 rounded animate-pulse mx-auto"
          />
        </div>
        
        {/* Scroll indicator skeleton */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="h-12 w-px bg-cream/10 animate-pulse" />
        </div>
      </section>
    </main>
  )
}
