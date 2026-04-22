'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MaterialSwatch } from './material-swatch'
import type { MaterialType } from './shaders'

// Material configurations with calibrated palettes
// These colors are derived from Eclectic Hive's actual inventory
const MATERIAL_CONFIG: Record<MaterialType, {
  label: string
  description: string
  variants: Array<{ name: string; color: string }>
  pieceCount: number
}> = {
  velvet: {
    label: 'Velvet',
    description: 'Rich pile that catches light at every angle',
    variants: [
      { name: 'Midnight', color: '#1a1a2e' },
      { name: 'Burgundy', color: '#722f37' },
      { name: 'Forest', color: '#2d5a27' },
      { name: 'Blush', color: '#de9c9c' },
    ],
    pieceCount: 42,
  },
  leather: {
    label: 'Leather',
    description: 'Full-grain hides with natural character',
    variants: [
      { name: 'Cognac', color: '#8b4513' },
      { name: 'Espresso', color: '#2c1810' },
      { name: 'Saddle', color: '#c19a6b' },
    ],
    pieceCount: 28,
  },
  linen: {
    label: 'Linen',
    description: 'Breathable weaves with organic texture',
    variants: [
      { name: 'Natural', color: '#f5f5dc' },
      { name: 'Oatmeal', color: '#d4c5a9' },
      { name: 'Stone', color: '#b8b09a' },
    ],
    pieceCount: 35,
  },
  wood: {
    label: 'Wood',
    description: 'Solid hardwoods with distinct grain',
    variants: [
      { name: 'Walnut', color: '#5c4033' },
      { name: 'White Oak', color: '#deb887' },
      { name: 'Ebony', color: '#1c1c1c' },
    ],
    pieceCount: 56,
  },
  metal: {
    label: 'Metal',
    description: 'Brushed and polished finishes',
    variants: [
      { name: 'Brushed Steel', color: '#b8b8b8' },
      { name: 'Brass', color: '#b5a642' },
      { name: 'Matte Black', color: '#2a2a2a' },
    ],
    pieceCount: 31,
  },
  marble: {
    label: 'Marble',
    description: 'Natural stone with unique veining',
    variants: [
      { name: 'Carrara', color: '#f0f0f0' },
      { name: 'Nero', color: '#1a1a1a' },
      { name: 'Verde', color: '#4a6b5c' },
    ],
    pieceCount: 18,
  },
}

const MATERIALS = Object.keys(MATERIAL_CONFIG) as MaterialType[]

export function MaterialPaletteSection() {
  const [activeMaterial, setActiveMaterial] = useState<MaterialType | null>(null)
  const [activeVariant, setActiveVariant] = useState<number>(0)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  // Intersection observer for entry animation
  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Navigate to collection filtered by material
  const handleMaterialClick = (material: MaterialType) => {
    if (activeMaterial === material) {
      // Second click navigates to collection
      router.push(`/collection?material=${material}`)
    } else {
      setActiveMaterial(material)
      setActiveVariant(0)
    }
  }

  const config = activeMaterial ? MATERIAL_CONFIG[activeMaterial] : null

  return (
    <section 
      ref={sectionRef}
      className="bg-cream py-24 lg:py-32 overflow-hidden"
    >
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className={cn(
            "max-w-2xl mb-16 transition-all duration-700",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6">
            Material Vocabulary
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.1em] font-light uppercase text-charcoal">
            Touch Before You See
          </h2>
          <p className="mt-6 text-charcoal/70 leading-relaxed">
            Every material in our collection is selected for how it feels, ages, and interacts 
            with light. Hover to experience each texture. Click to explore pieces.
          </p>
        </div>

        {/* Material Grid */}
        <div 
          className={cn(
            "grid grid-cols-3 md:grid-cols-6 gap-4 lg:gap-6 transition-all duration-700 delay-200",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {MATERIALS.map((material, i) => {
            const materialConfig = MATERIAL_CONFIG[material]
            const isActive = activeMaterial === material
            const variant = materialConfig.variants[isActive ? activeVariant : 0]

            return (
              <div
                key={material}
                className={cn(
                  "group relative transition-all duration-500",
                  isInView && "opacity-100",
                  !isInView && "opacity-0"
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Swatch - elevated with shadow */}
                <div 
                  className={cn(
                    "aspect-square relative overflow-hidden rounded-sm transition-all duration-300",
                    "shadow-lg shadow-charcoal/10 hover:shadow-xl hover:shadow-charcoal/15",
                    "group-hover:-translate-y-1",
                    isActive && "ring-2 ring-charcoal ring-offset-4 ring-offset-cream shadow-xl shadow-charcoal/20"
                  )}
                >
                  <MaterialSwatch
                    material={material}
                    baseColor={variant.color}
                    isActive={isActive}
                    onActivate={() => handleMaterialClick(material)}
                  />
                  
                  {/* Hover overlay with piece count */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-charcoal/60 flex items-center justify-center transition-opacity duration-300",
                      "opacity-0 group-hover:opacity-100",
                      isActive && "opacity-100"
                    )}
                  >
                    <div className="text-center text-cream">
                      <span className="block text-2xl font-display">{materialConfig.pieceCount}</span>
                      <span className="block text-[10px] uppercase tracking-widest">pieces</span>
                    </div>
                  </div>
                </div>

                {/* Label */}
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-charcoal/70 text-center">
                  {materialConfig.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* Expanded Detail Panel */}
        <div 
          className={cn(
            "mt-12 overflow-hidden transition-all duration-500",
            activeMaterial ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {config && activeMaterial && (
            <div className="bg-sand/30 rounded-sm p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Material Info */}
                <div className="lg:max-w-md">
                  <h3 className="font-display text-2xl tracking-[0.15em] uppercase text-charcoal">
                    {config.label}
                  </h3>
                  <p className="mt-2 text-charcoal/70">{config.description}</p>
                  
                  {/* Variant Swatches */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest text-charcoal/50">Variants:</span>
                    <div className="flex gap-2">
                      {config.variants.map((variant, i) => (
                        <button
                          key={variant.name}
                          onClick={() => setActiveVariant(i)}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all duration-200",
                            i === activeVariant && "ring-2 ring-charcoal ring-offset-2 ring-offset-sand/30"
                          )}
                          style={{ backgroundColor: variant.color }}
                          title={variant.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-start lg:items-end gap-4">
                  <p className="text-sm text-charcoal/60">
                    <span className="text-2xl font-display text-charcoal">{config.pieceCount}</span>
                    {' '}pieces in {config.label.toLowerCase()}
                  </p>
                  <button
                    onClick={() => router.push(`/collection?material=${activeMaterial}`)}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.2em] hover:bg-charcoal/90 transition-colors"
                  >
                    <span>Browse {config.label}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
