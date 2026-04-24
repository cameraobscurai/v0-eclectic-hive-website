import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AtelierHero } from '@/components/atelier/atelier-hero'
import { TheSpaceSection } from '@/components/atelier/the-space-section'
import { TheHumansSection } from '@/components/atelier/the-humans-section'
import { TheFabricationSection } from '@/components/atelier/the-fabrication-section'
import { AtelierCTA } from '@/components/atelier/atelier-cta'

export const metadata: Metadata = {
  title: 'Atelier by The Hive | ECLECTIC HIVE',
  description: 'The Space. The Humans. The Fabrication. Our full-service design and production studio where ideas become tangible.',
}

export default function AtelierPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />
      <AtelierHero />
      
      {/* Section 01: The Space */}
      <TheSpaceSection />
      
      {/* Section 02: The Humans */}
      <TheHumansSection />
      
      {/* Section 03: The Fabrication */}
      <TheFabricationSection />
      
      <AtelierCTA />
      <Footer />
    </main>
  )
}
