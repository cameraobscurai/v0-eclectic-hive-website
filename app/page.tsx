import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { IntroSection } from '@/components/home/intro-section'
import { AtelierPreview } from '@/components/home/atelier-preview'
import { CollectionsSection } from '@/components/home/collections-section'
import { ServicesPreview } from '@/components/home/services-preview'
import { CaseStudiesSection } from '@/components/home/case-studies-section'
import { ProcessPreview } from '@/components/home/process-preview'
import { InquirySection } from '@/components/home/inquiry-section'

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <IntroSection />
      <AtelierPreview />
      <CollectionsSection />
      <ServicesPreview />
      <CaseStudiesSection />
      <ProcessPreview />
      <InquirySection />
      <Footer />
    </main>
  )
}
