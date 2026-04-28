'use client'

import { cn } from '@/lib/utils'

// Placeholder frame component - clean window for future imagery
function ImageFrame({ 
  aspectRatio = '4/3', 
  label,
  className 
}: { 
  aspectRatio?: string
  label?: string
  className?: string 
}) {
  return (
    <div 
      className={cn(
        'relative bg-charcoal/[0.03] border border-charcoal/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Corner brackets to indicate frame */}
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-charcoal/20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-charcoal/20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-charcoal/20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-charcoal/20" />
      
      {/* Center crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-charcoal/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-charcoal/10" />
        </div>
      </div>
      
      {/* Optional label */}
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/30 font-mono">
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

export function AtelierHero() {
  return (
    <section className="relative min-h-screen bg-cream pt-24 lg:pt-28">
      
      {/* Main hero grid */}
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Label */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-charcoal/40">Atelier by The Hive</span>
              <div className="flex-1 h-px bg-charcoal/10" />
            </div>
          </div>
          
          {/* Cinematic grid layout */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Large hero frame - left side */}
            <div className="col-span-12 lg:col-span-7">
              <ImageFrame 
                aspectRatio="16/10" 
                label="Hero Image"
                className="h-[50vh] lg:h-[65vh]"
              />
            </div>
            
            {/* Right column - headline + secondary frame */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {/* Headline */}
              <div className="flex-1 flex flex-col justify-center py-8 lg:py-0">
                <h1 className="font-brand text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.05] tracking-[0.08em] text-charcoal uppercase" style={{ fontWeight: 400 }}>
                  Imagined.
                  <br />
                  Refined.
                  <br />
                  Crafted.
                </h1>
                <p className="mt-6 text-charcoal/60 text-base lg:text-lg leading-relaxed max-w-md">
                  The atelier is the creative engine of ECLECTIC HIVE—where fabrication, 
                  material exploration, and design authorship converge.
                </p>
              </div>
              
              {/* Secondary frame */}
              <ImageFrame 
                aspectRatio="3/2" 
                label="Detail Shot"
                className="hidden lg:block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
