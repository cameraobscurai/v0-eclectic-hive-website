'use client'

import Link from 'next/link'
import { Parallax, Reveal} from '@/components/animations/motion-elements'

export function WarehouseSection() {
  return (
    <section className="bg-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image — moves fast (feels close, foreground) */}
          <Parallax speed={0.4} direction="up" className="relative aspect-[4/3] bg-sand">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-charcoal/20 rounded-sm flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Warehouse</p>
            </div>
          </Parallax>

          {/* Content — wipes in from right */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6">
              Warehouse
            </p>
            <Reveal direction="right" delay={0.1} overlayColor="bg-cream">
              <h2 className="font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase text-charcoal">
                The Hive Signature Collection
              </h2>
            </Reveal>
            <Parallax speed={0.15} direction="up">
              <p className="mt-6 text-charcoal/70 leading-relaxed">
                Our warehouse houses the Signature Collection—a curated inventory of 
                proprietary lounge furniture, decor, and accessories designed and 
                fabricated by our studio.
              </p>
              <p className="mt-4 text-charcoal/70 leading-relaxed">
                Modern but timeless. Everything in the collection is designed to be 
                complimentary while standing on its own—pieces that work together or 
                apart to create environments with intention.
              </p>
            </Parallax>
            <div className="mt-8">
              <Link 
                href="/collection"
                className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-charcoal hover:text-charcoal/70 transition-colors group"
              >
                <span>Browse the Collection</span>
                <span className="w-8 h-px bg-charcoal group-hover:w-12 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
