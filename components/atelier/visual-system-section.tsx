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

          {/* Row 2: Top View + Material Cues */}
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

          {/* Row 3: Process Flow */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="03" label="Process" />
            <div className="grid grid-cols-4 gap-3 md:gap-6">
              <div className="relative">
                <div className="absolute -top-5 left-0 text-[8px] uppercase tracking-wide text-charcoal/40">
                  Source Reference
                </div>
                <ProductCard 
                  src="/images/atelier/green-channel-sofa.png" 
                  alt="Source reference"
                  className="aspect-[4/3] grayscale opacity-60"
                />
                <div className="absolute top-1/2 -right-3 md:-right-5 transform -translate-y-1/2 z-10 hidden md:block">
                  <svg className="w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-5 left-0 text-[8px] uppercase tracking-wide text-charcoal/40">
                  Simplified
                </div>
                <ProductCard 
                  src="/images/atelier/green-channel-sofa.png" 
                  alt="Simplified silhouette"
                  className="aspect-[4/3] opacity-40"
                />
                <div className="absolute top-1/2 -right-3 md:-right-5 transform -translate-y-1/2 z-10 hidden md:block">
                  <svg className="w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-5 left-0 text-[8px] uppercase tracking-wide text-charcoal/40">
                  Clean Asset
                </div>
                <ProductCard 
                  src="/images/atelier/green-channel-sofa.png" 
                  alt="Clean asset view"
                  className="aspect-[4/3]"
                />
                <div className="absolute top-1/2 -right-3 md:-right-5 transform -translate-y-1/2 z-10 hidden md:block">
                  <svg className="w-4 h-4 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-5 left-0 text-[8px] uppercase tracking-wide text-charcoal/40">
                  System View
                </div>
                <ProductCard 
                  src="/images/atelier/green-channel-sofa.png" 
                  alt="Exploded system view"
                  className="aspect-[4/3]"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Palette + Finishes */}
          <div className="col-span-12 border-t border-charcoal/10 pt-8 mt-4">
            <SectionLabel number="06" label="Palette + Finishes" />
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

        </div>
      </div>
    </section>
  )
}
