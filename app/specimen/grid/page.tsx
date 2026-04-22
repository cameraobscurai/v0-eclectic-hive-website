'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

export default function GridSystem() {
  const [showBaseline, setShowBaseline] = useState(true)
  const [showColumns, setShowColumns] = useState(true)
  const [showType, setShowType] = useState(true)
  
  return (
    <main id="specimen-content" className="min-h-screen bg-cream relative overflow-hidden">
      <DownloadButton targetId="specimen-content" filename="eclectic-hive-grid-system" />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setShowColumns(!showColumns)}
          className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
            showColumns 
              ? 'bg-charcoal text-cream' 
              : 'bg-white/80 text-charcoal border border-charcoal/20'
          }`}
        >
          Columns
        </button>
        <button
          onClick={() => setShowBaseline(!showBaseline)}
          className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
            showBaseline 
              ? 'bg-charcoal text-cream' 
              : 'bg-white/80 text-charcoal border border-charcoal/20'
          }`}
        >
          Baseline
        </button>
        <button
          onClick={() => setShowType(!showType)}
          className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
            showType 
              ? 'bg-charcoal text-cream' 
              : 'bg-white/80 text-charcoal border border-charcoal/20'
          }`}
        >
          Type
        </button>
      </div>

      {/* 12-column grid overlay */}
      {showColumns && (
        <div className="absolute inset-0 pointer-events-none" style={{ padding: '0 48px' }}>
          <div className="h-full grid grid-cols-12 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-red-500/5 border-l border-r border-red-500/10" />
            ))}
          </div>
        </div>
      )}

      {/* 8px baseline grid overlay */}
      {showBaseline && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(26,26,26,0.03) 7px, rgba(26,26,26,0.03) 8px)'
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-12 lg:p-16 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-16">
            <p>Grid System — 12 Columns / 8px Baseline</p>
            <p>Margin: 48px / Gutter: 24px</p>
          </div>

          {showType && (
            <>
              {/* Type on grid */}
              <div className="grid grid-cols-12 gap-6 mb-24">
                <div className="col-span-8">
                  <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-4">
                    H1 — Spans 8 columns
                  </p>
                  <h1 className="font-serif text-charcoal text-5xl lg:text-7xl tracking-[0.15em] uppercase">
                    ECLECTIC HIVE
                  </h1>
                </div>
                <div className="col-span-4 flex items-end">
                  <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider">
                    4-col offset for asymmetry
                  </p>
                </div>
              </div>

              {/* Body text grid */}
              <div className="grid grid-cols-12 gap-6 mb-24">
                <div className="col-span-3">
                  <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider">
                    Section Label
                  </p>
                </div>
                <div className="col-span-6">
                  <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-4">
                    Body — Spans 6 columns (50%)
                  </p>
                  <p className="font-sans text-charcoal text-base leading-relaxed">
                    Our process is designed to honor both creative ambition and practical reality. 
                    We guide clients through a structured journey that transforms initial vision 
                    into authored environment.
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider">
                    3-col margin
                  </p>
                </div>
              </div>

              {/* Measurements */}
              <div className="border-t border-charcoal/10 pt-12">
                <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-8">
                  Spacing Scale — 8px increments
                </p>
                
                <div className="flex items-end gap-4">
                  {[8, 16, 24, 32, 48, 64, 96, 128].map((size) => (
                    <div key={size} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-charcoal/20 relative"
                        style={{ height: size }}
                      >
                        {/* Dimension line */}
                        <div className="absolute -left-4 top-0 bottom-0 w-px bg-red-500/60" />
                        <div className="absolute -left-5 top-0 w-2 h-px bg-red-500/60" />
                        <div className="absolute -left-5 bottom-0 w-2 h-px bg-red-500/60" />
                      </div>
                      <span className="text-charcoal/50 text-xs font-mono mt-3">{size}px</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column width spec */}
              <div className="border-t border-charcoal/10 pt-12 mt-12">
                <p className="text-charcoal/40 text-xs font-mono uppercase tracking-wider mb-4">
                  Construction Notes
                </p>
                <div className="font-mono text-xs text-charcoal/60 space-y-1">
                  <p>Grid: 12 columns</p>
                  <p>Gutter: 24px</p>
                  <p>Margin: 48px (desktop) / 24px (mobile)</p>
                  <p>Max-width: 1280px</p>
                  <p>Baseline: 8px</p>
                  <p>Type scale: 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64, 80, 96</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
