import Image from 'next/image'

export function AtelierIntro() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Text */}
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
              The Creative Engine
            </p>
            
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.1] tracking-tight">
              Construction
              <br />
              <span className="italic">as authorship</span>
            </h2>
            
            <div className="mt-8 flex flex-col gap-6">
              <p className="text-muted-foreground leading-relaxed">
                The atelier exists at the intersection of design intelligence and 
                physical making. Here, concepts take form through hands that understand 
                both the why and the how—where every cut, finish, and construction 
                decision serves the larger vision.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This is not a production facility. It is a studio where proprietary 
                pieces are born, where materials are interrogated, and where the 
                signature of our process becomes visible.
              </p>
            </div>
          </div>
          
          {/* Right Column - Images */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] relative overflow-hidden editorial-image">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop"
                  alt="Hands at work"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-[3/4] relative overflow-hidden editorial-image mt-12">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop"
                  alt="Material detail"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
