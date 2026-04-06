import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AtelierHero } from '@/components/atelier/atelier-hero'
import { TeamSection } from '@/components/atelier/team-section'
import { ScopeSection } from '@/components/atelier/scope-section'
import { StudioSection } from '@/components/atelier/studio-section'
import { FabricationSection } from '@/components/atelier/fabrication-section'
import { WarehouseSection } from '@/components/atelier/warehouse-section'
import { AtelierCTA } from '@/components/atelier/atelier-cta'

export const metadata: Metadata = {
  title: 'Atelier by The Hive | Eclectic Hive',
  description: 'Imagined. Refined. Crafted. Our full-service design and production studio—team, scope of work, design studio, fabrication capacity, and warehouse.',
}

export default function AtelierPage() {
  return (
    <main>
      <Navigation />
      <AtelierHero />
      <TeamSection />
      <ScopeSection />
      <StudioSection />
      <FabricationSection />
      <WarehouseSection />
      <AtelierCTA />
      <Footer />
    </main>
  )
}
