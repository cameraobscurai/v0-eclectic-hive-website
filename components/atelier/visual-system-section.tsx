'use client'

import Image from 'next/image'
import { useRef } from 'react'

// Figma-style numbered section header
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="text-[10px] text-charcoal/40 font-mono">{number}</span>
      <span className="text-[10px] uppercase tracking-wide text-charcoal/60">{label}</span>
    </div>
  )
}

// Individual product card with subtle border
function ProductCard({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string
  alt: string
  className?: string 
}) {
  return (
    <div className={`relative bg-[#f8f7f5] border border-charcoal/5 overflow-hidden group ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  )
}

// Process step with arrow
function ProcessStep({ 
  label, 
  isLast = false 
}: { 
  label: string
  isLast?: boolean 
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-24 bg-charcoal/5 border border-charcoal/10 flex items-center justify-center">
        <span className="text-[9px] uppercase tracking-wide text-charcoal/50">{label}</span>
      </div>
      {!isLast && (
        <svg className="w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </div>
  )
}

// Color/material swatch
function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="w-10 h-10 rounded-full border border-charcoal/10"
        style={{ backgroundColor: color }}
      />
      <span className="text-[8px] uppercase tracking-wide text-charcoal/40">{label}</span>
    </div>
  )
}

export function VisualSystemSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-cream border-t border-charcoal/10"
    >
      <div className="container-padding max-w-[1600px] mx-auto">
        
        {/* Section Title */}
        <div className="mb-16 md:mb-24">
          <p className="text-[10px] uppercase tracking-wide text-charcoal/40 mb-4">
            Design + Production
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-display text-charcoal">
            Visual System
          </h2>
        </div>

        {/* Main Grid - Figma-style layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          
          {/* Row 1: Isometric Views + Exploded View */}
          <div className="col-span-12 lg:col-span-8 border-b border-charcoal/10 pb-8 mb-8 lg:border-b-0 lg:pb-0 lg:mb-0 lg:border-r lg:pr-8">
            <SectionLabel number="01" label="Isometric Views" />
            <div className="grid grid-cols-3 gap-3">
              <ProductCard 
                src="/images/atelier/sidony-loveseat.png" 
                alt="Sidony Wood + White Loveseat"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/green-channel-sofa.png" 
                alt="Green Channel Tufted Sofa"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/iron-bench.png" 
                alt="Black Iron Bench"
                className="aspect-square"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <SectionLabel number="04" label="Exploded View" />
            <ProductCard 
              src="/images/atelier/sidony-loveseat.png" 
              alt="Sidony construction detail"
              className="aspect-[4/5]"
            />
          </div>

          {/* Row 2: Top View (Furniture) */}
          <div className="col-span-12 lg:col-span-8 border-t border-charcoal/10 pt-8 mt-4 lg:border-r lg:pr-8">
            <SectionLabel number="02" label="Top View" />
            <div className="grid grid-cols-3 gap-3">
              <ProductCard 
                src="/images/atelier/rosalind-banquette.png" 
                alt="Rosalind Cream Velvet Banquette - top view"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/black-cane-chair.png" 
                alt="Black Cane Chair - top view"
                className="aspect-square"
              />
              <ProductCard 
                src="/images/atelier/ava-sage-chair.png" 
                alt="Ava Sage Velvet Chair"
                className="aspect-square"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="05" label="Material Cues" />
            <div className="grid grid-cols-5 gap-6 py-8">
              <div className="aspect-square bg-gradient-to-br from-[#c9b99a] to-[#a89070] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#e8e4df] to-[#d4cdc4] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#f5f3f0] to-[#e8e2da] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#c4a962] to-[#9a7f3c] rounded" />
              <div className="aspect-square bg-gradient-to-br from-[#5a6b4a] to-[#3d4a32] rounded" />
            </div>
            <div className="grid grid-cols-5 gap-6 text-center">
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Oak</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Linen</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Plaster</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Brass</span>
              <span className="text-[8px] uppercase tracking-wide text-charcoal/40">Sage</span>
            </div>
          </div>

          {/* Row 2b: Tableware System - Full Width */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="02b" label="Tableware Collections" />
            <div className="relative aspect-[16/7] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_13_08%20AM-cuAv2o9C6y11pcarZNqzqEKYnyIjcT.png"
                alt="Complete tableware system - place settings, dinnerware, flatware, glassware, serving pieces"
                fill
                className="object-contain p-6"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Row 2c: Dinnerware + Glassware Grid */}
          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:border-r md:pr-4">
            <SectionLabel number="02c" label="Dinnerware" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%282%29-0zX2cuKc6paMuf77FLcquXFUaTAiZ7.png"
                alt="Dinnerware stacks - navy, white, marble, scalloped collections"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:pl-4">
            <SectionLabel number="02d" label="Glassware" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_18_29%20AM-c2Qro4enKvZSCX7hpsrqDk1WuhS1em.png"
                alt="Glassware collections - amber, crystal, blush, sage, clear stemware"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Row 2e: Flatware + Lighting */}
          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:border-r md:pr-4">
            <SectionLabel number="02e" label="Flatware" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_18_34%20AM-RzlhofmL5EQTqjDOAgEo8oBNqr61I2.png"
                alt="Flatware collections - bone, tortoise, copper, gold, steel finishes"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 border-t border-charcoal/10 pt-8 mt-4 md:pl-4">
            <SectionLabel number="02f" label="Lighting" />
            <div className="relative aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_22_22%20AM-OmoDdFeniqqk82l8iegQh31luyI75r.png"
                alt="Lighting collection - table lamps, floor lamps, lanterns, votives"
                fill
                className="object-contain p-4"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Row 3: Palette + Finishes */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="03" label="Palette + Finishes" />
            <div className="flex flex-wrap gap-6 md:gap-10 py-4">
              <Swatch color="#f5f2ed" label="Cream" />
              <Swatch color="#d4cdc4" label="Sand" />
              <Swatch color="#c9b99a" label="Oak" />
              <Swatch color="#5a6b4a" label="Sage" />
              <Swatch color="#c4a962" label="Mustard" />
              <Swatch color="#4a3728" label="Espresso" />
              <Swatch color="#1a1a1a" label="Black" />
            </div>
          </div>

          {/* Row 5: Dinnerware Variations - Horizontal Scroll */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="04" label="Dinnerware Variations" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {[
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%283%29-ISawYAP157izouDbFgfnV2fKubjwQQ.png", alt: "Dinnerware set - grey, botanical, speckle" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%281%29-VwfITiRdTSCrFbSP4c2A7fZG6DVZxD.png", alt: "Dinnerware set - sage, marble, fluted" },
                { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_15_29%20AM%20%284%29-1T6kh8prKXIs1wYtSGCMq96AUqaK0Q.png", alt: "Dinnerware set - navy, botanical, mixed" },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="relative flex-shrink-0 w-[400px] md:w-[500px] aspect-[16/9] bg-white border border-charcoal/5 overflow-hidden"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-contain p-4"
                    sizes="500px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 6: Signature Seating - Multi-Angle Product Cards */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="05" label="Signature Seating" />
            
            {/* Horizontal scroll of multi-angle product cards */}
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
              {[
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_28%20AM%20%286%29-lYpmyiS81qFDNgsRkfTsHW0YSpljEO.png", 
                  name: "Rosalind Cream Velvet Round Banquette",
                  dimensions: "90\" Dia × 30\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_27%20AM%20%283%29-0qcQ5hbbwcJshm8BWyIN1OPztzAHdO.png", 
                  name: "Artesia Chair",
                  dimensions: "28\"W × 28\"D × 32\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_28%20AM%20%287%29-9TDTsweuOPUkyvW4Ed5CFdzxDLgKss.png", 
                  name: "Lindt Toffee Velvet Channel Tufted Sofa",
                  dimensions: "91\"W × 38\"D × 31\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_27%20AM%20%282%29-2apBC5MfVkeCgmFq0t8CDDE3mgWQzq.png", 
                  name: "Reshma Botanical Sculptural Sofa",
                  dimensions: "82.5\"W × 34\"D × 28\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_27%20AM%20%281%29-ueuKdp8IfGOb8XxfNDcBLowfTdmqol.png", 
                  name: "Sylvanus Green & Ash Sofa",
                  dimensions: "79\"W × 34\"D × 30\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_29%20AM%20%288%29-THD1sMx5FsRGs3RFErQ0Jjcv74pWqU.png", 
                  name: "Alora Botanical Sculptural Chair",
                  dimensions: "33\"W × 30.5\"D × 30\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_28%20AM%20%285%29-UUCy5NsKMwYprrruLUS8IL41qb9XJK.png", 
                  name: "Sidony Wood + White Loveseat",
                  dimensions: "94\"W × 30\"D × 32\"H"
                },
                { 
                  src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2005_11_28%20AM%20%284%29-4kZyZ7DWmgcJEtK9JfClJAZYqNfNwB.png", 
                  name: "Ava Sage Velvet Chair",
                  dimensions: "26\"W × 33\"D × 35\"H"
                },
              ].map((piece, i) => (
                <div 
                  key={i}
                  className="relative flex-shrink-0 w-[480px] md:w-[560px] lg:w-[640px] group"
                >
                  {/* The composed multi-angle image */}
                  <div className="relative aspect-square bg-[#e8e6e2] overflow-hidden">
                    <Image
                      src={piece.src}
                      alt={piece.name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="640px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
