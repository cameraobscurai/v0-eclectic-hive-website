import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AtelierHero } from '@/components/atelier/atelier-hero'
import { AtelierIntro } from '@/components/atelier/atelier-intro'
import { MaterialsSection } from '@/components/atelier/materials-section'
import { FabricationProcess } from '@/components/atelier/fabrication-process'
import { ProprietaryPieces } from '@/components/atelier/proprietary-pieces'
import { ColorwaysSection } from '@/components/atelier/colorways-section'
import { AtelierCTA } from '@/components/atelier/atelier-cta'

export const metadata: Metadata = {
  title: 'Atelier | Eclectic Hive',
  description: 'The creative engine of Eclectic Hive. Fabrication, materials, colorways, customization, and proprietary pieces authored by our studio.',
}

export default function AtelierPage() {
  return (
    <main>
      <Navigation />
      <AtelierHero />
      <AtelierIntro />
      <MaterialsSection />
      <FabricationProcess />
      <ProprietaryPieces />
      <ColorwaysSection />
      <AtelierCTA />
      <Footer />
    </main>
  )
}
