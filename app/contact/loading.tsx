import { Navigation } from '@/components/navigation'

export default function ContactLoading() {
  return (
    <main className="min-h-screen bg-charcoal pt-[72px] lg:pt-[88px]">
      <Navigation />
      
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-88px)]">
        {/* Left - Info skeleton */}
        <section className="px-6 lg:px-16 py-16 flex flex-col justify-center">
          <div className="max-w-md">
            <div className="h-3 w-20 bg-cream/10 rounded animate-pulse mb-6" />
            <div className="h-10 w-64 bg-cream/10 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-cream/5 rounded animate-pulse mb-8" />
            
            <div className="space-y-4">
              <div className="h-4 w-48 bg-cream/10 rounded animate-pulse" />
              <div className="h-4 w-36 bg-cream/10 rounded animate-pulse" />
              <div className="h-4 w-52 bg-cream/10 rounded animate-pulse" />
            </div>
          </div>
        </section>
        
        {/* Right - Form skeleton */}
        <section className="bg-cream/5 px-6 lg:px-16 py-16 flex flex-col justify-center">
          <div className="max-w-md space-y-6">
            <div className="h-12 w-full bg-cream/5 rounded animate-pulse" />
            <div className="h-12 w-full bg-cream/5 rounded animate-pulse" />
            <div className="h-12 w-full bg-cream/5 rounded animate-pulse" />
            <div className="h-32 w-full bg-cream/5 rounded animate-pulse" />
            <div className="h-12 w-40 bg-cream/10 rounded animate-pulse" />
          </div>
        </section>
      </div>
    </main>
  )
}
