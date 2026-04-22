'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

export default function GridSystem() {
  const [showGrid, setShowGrid] = useState(true)
  const [showBaseline, setShowBaseline] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const gridColor = theme === 'dark' ? 'bg-cream/10' : 'bg-charcoal/10'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const accent = theme === 'dark' ? 'bg-red-500/20 border-red-500/40' : 'bg-red-500/10 border-red-500/30'
  const accentText = theme === 'dark' ? 'text-red-400' : 'text-red-600'

  return (
    <main id="specimen-content" className={`min-h-screen ${bg} relative overflow-hidden`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-grid-${theme}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50 flex gap-2 flex-wrap">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-colors ${
            showGrid 
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
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 text-xs uppercase tracking-widest rounded bg-white/80 text-charcoal border border-charcoal/20"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* 12-column grid overlay */}
      {showGrid && (
        <div className="absolute inset-0 px-8 lg:px-16 pointer-events-none">
          <div className="h-full max-w-6xl mx-auto grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`${gridColor} relative`}>
                <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono ${textMuted}`}>
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8px baseline grid overlay */}
      {showBaseline && (
        <div className="absolute inset-0 pointer-events-none" style={{ 
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, ${theme === 'dark' ? 'rgba(245,242,237,0.05)' : 'rgba(26,26,26,0.05)'} 7px, ${theme === 'dark' ? 'rgba(245,242,237,0.05)' : 'rgba(26,26,26,0.05)'} 8px)`,
          backgroundSize: '100% 8px'
        }} />
      )}

      {/* Content */}
      <div className="relative z-10 px-8 lg:px-16 py-24 min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Header */}
          <div className="mb-24">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-6`}>
              Construction System
            </p>
            <h1 className={`font-serif ${text} text-6xl lg:text-8xl tracking-tight mb-4`}>
              12-Column Grid
            </h1>
            <p className={`${textMuted} text-lg max-w-xl`}>
              Flexible grid with 4-unit gutters and 8px baseline rhythm
            </p>
          </div>

          {/* Grid specifications */}
          <div className="grid grid-cols-12 gap-4 mb-24">
            {/* Full width element */}
            <div className={`col-span-12 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>12 Columns — Full Width</span>
            </div>
            
            {/* 6+6 split */}
            <div className={`col-span-6 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>6 Col</span>
            </div>
            <div className={`col-span-6 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>6 Col</span>
            </div>
            
            {/* 4+4+4 */}
            <div className={`col-span-4 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>4</span>
            </div>
            <div className={`col-span-4 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>4</span>
            </div>
            <div className={`col-span-4 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>4</span>
            </div>
            
            {/* 3+3+3+3 */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`col-span-3 h-16 ${accent} border rounded flex items-center justify-center`}>
                <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>3</span>
              </div>
            ))}
            
            {/* Asymmetric 8+4 */}
            <div className={`col-span-8 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>8 Columns — Content</span>
            </div>
            <div className={`col-span-4 h-16 ${accent} border rounded flex items-center justify-center`}>
              <span className={`${accentText} text-xs font-mono uppercase tracking-wider`}>4 — Sidebar</span>
            </div>
          </div>

          {/* Spacing scale */}
          <div className="mb-24">
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-8`}>
              8px Baseline Spacing Scale
            </p>
            
            <div className="flex items-end gap-6">
              {[8, 16, 24, 32, 48, 64, 96, 128].map((size) => (
                <div key={size} className="flex flex-col items-center">
                  <div 
                    className={`w-12 ${gridColor} rounded-sm`}
                    style={{ height: size }}
                  />
                  <span className={`${textMuted} text-xs font-mono mt-3`}>{size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className={`${accentText} text-xs font-mono uppercase tracking-wider mb-2`}>Max Width</p>
              <p className={`font-serif ${text} text-3xl tracking-tight`}>1152px</p>
              <p className={`${textMuted} text-xs mt-2`}>6xl container</p>
            </div>
            <div>
              <p className={`${accentText} text-xs font-mono uppercase tracking-wider mb-2`}>Gutter</p>
              <p className={`font-serif ${text} text-3xl tracking-tight`}>16px</p>
              <p className={`${textMuted} text-xs mt-2`}>gap-4</p>
            </div>
            <div>
              <p className={`${accentText} text-xs font-mono uppercase tracking-wider mb-2`}>Margin</p>
              <p className={`font-serif ${text} text-3xl tracking-tight`}>32—64px</p>
              <p className={`${textMuted} text-xs mt-2`}>px-8 lg:px-16</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
