'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DownloadButton } from '@/components/specimen/download-button'

const COLORS = [
  { name: 'Charcoal', hex: '#1a1a1a', rgb: '26, 26, 26', usage: 'Primary dark, backgrounds, text' },
  { name: 'Cream', hex: '#f5f2ed', rgb: '245, 242, 237', usage: 'Primary light, backgrounds, text' },
  { name: 'Sand', hex: '#d4cdc4', rgb: '212, 205, 196', usage: 'Warm neutral, borders, muted' },
  { name: 'Black', hex: '#000000', rgb: '0, 0, 0', usage: 'Pure black, maximum contrast' },
  { name: 'Brass', hex: '#b8a88a', rgb: '184, 168, 138', usage: 'Metallic accent, warmth' },
]

const MATERIALS = [
  { name: 'White Oak', tone: 'Warm', desc: 'Honey undertones, visible grain' },
  { name: 'Brushed Brass', tone: 'Metallic', desc: 'Patinated gold, lived-in luxury' },
  { name: 'Belgian Linen', tone: 'Natural', desc: 'Unbleached, textured weave' },
  { name: 'Travertine', tone: 'Stone', desc: 'Soft cream, subtle pitting' },
  { name: 'Velvet', tone: 'Plush', desc: 'Deep charcoal, light-catching' },
  { name: 'Raw Plaster', tone: 'Tactile', desc: 'Imperfect, handmade quality' },
]

const SPACING = [
  { px: 4, rem: '0.25', use: 'Tight spacing' },
  { px: 8, rem: '0.5', use: 'Base unit' },
  { px: 16, rem: '1', use: 'Component padding' },
  { px: 24, rem: '1.5', use: 'Section gaps' },
  { px: 32, rem: '2', use: 'Card padding' },
  { px: 48, rem: '3', use: 'Section padding mobile' },
  { px: 64, rem: '4', use: 'Section padding tablet' },
  { px: 80, rem: '5', use: 'Section padding desktop' },
  { px: 96, rem: '6', use: 'Hero spacing' },
  { px: 128, rem: '8', use: 'Major sections' },
]

export default function Visual() {
  const [view, setView] = useState<'colors' | 'materials' | 'grid' | 'spacing'>('colors')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'

  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-visual-${view}-${theme}`} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-cream/10">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/brand" className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors">
            ← Brand
          </Link>
          <div className="flex gap-1">
            {(['colors', 'materials', 'grid', 'spacing'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded transition-colors ${
                  view === v 
                    ? 'bg-cream text-charcoal' 
                    : 'text-cream/60 hover:text-cream'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-cream/60 text-xs font-mono uppercase tracking-wider hover:text-cream transition-colors"
          >
            {theme === 'dark' ? '◐ Light' : '◑ Dark'}
          </button>
        </div>
      </nav>

      {/* COLORS VIEW */}
      {view === 'colors' && (
        <div className="pt-24">
          {/* Hero split */}
          <div className="h-[50vh] flex">
            <div className="flex-1 bg-charcoal flex items-center justify-center">
              <span className="font-serif text-cream text-6xl lg:text-8xl tracking-wide">COLOR</span>
            </div>
            <div className="flex-1 bg-cream flex items-center justify-center">
              <span className="font-serif text-charcoal text-6xl lg:text-8xl tracking-wide">TONE</span>
            </div>
          </div>
          
          {/* Color swatches */}
          <div className={`p-8 lg:p-16 ${bg}`}>
            <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-8`}>Primary Palette</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {COLORS.map((color) => (
                <div key={color.name}>
                  <div 
                    className="aspect-[4/3] rounded-lg mb-4 border border-black/5"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className={`font-serif ${text} text-lg mb-1`}>{color.name}</p>
                  <p className={`${textMuted} text-xs font-mono mb-1`}>{color.hex}</p>
                  <p className={`${textMuted} text-xs font-mono mb-2`}>RGB {color.rgb}</p>
                  <p className={`${textMuted} text-[10px]`}>{color.usage}</p>
                </div>
              ))}
            </div>
            
            {/* Tonal range */}
            <div className="mt-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-6`}>Tonal Range</p>
              <div className="h-16 rounded-lg overflow-hidden flex">
                <div className="flex-1 bg-black" />
                <div className="flex-1 bg-[#1a1a1a]" />
                <div className="flex-1 bg-[#333333]" />
                <div className="flex-1 bg-[#666666]" />
                <div className="flex-1 bg-[#999999]" />
                <div className="flex-1 bg-[#b8a88a]" />
                <div className="flex-1 bg-[#d4cdc4]" />
                <div className="flex-1 bg-[#e8e4de]" />
                <div className="flex-1 bg-[#f5f2ed]" />
                <div className="flex-1 bg-white border-l border-black/5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATERIALS VIEW */}
      {view === 'materials' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Material Library</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>Texture + Finish</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {MATERIALS.map((mat, i) => (
                <div key={mat.name} className={`border ${border} rounded-lg overflow-hidden`}>
                  <div 
                    className="aspect-square"
                    style={{
                      backgroundColor: i === 0 ? '#8B7355' : i === 1 ? '#b8a88a' : i === 2 ? '#c4b8a8' : i === 3 ? '#e8e0d4' : i === 4 ? '#2a2a2a' : '#d8d0c8',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <p className={`font-serif ${text} text-lg`}>{mat.name}</p>
                      <span className={`${textMuted} text-[10px] font-mono uppercase`}>{mat.tone}</span>
                    </div>
                    <p className={`${textMuted} text-xs`}>{mat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {view === 'grid' && (
        <div className="pt-24 bg-cream min-h-screen">
          <div className="max-w-6xl mx-auto p-8 lg:p-16">
            <div className="mb-12">
              <p className="text-charcoal/40 text-xs font-mono uppercase tracking-[0.2em] mb-2">Layout System</p>
              <h2 className="font-serif text-charcoal text-3xl tracking-wide">12-Column Grid</h2>
            </div>
            
            {/* Grid visualization */}
            <div className="relative h-64 mb-12 rounded-lg overflow-hidden border border-charcoal/10">
              <div className="absolute inset-0 grid grid-cols-12 gap-4 p-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-charcoal/10 rounded flex items-end justify-center pb-2">
                    <span className="text-charcoal/30 text-[10px] font-mono">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Column spans */}
            <div className="space-y-4 mb-12">
              <p className="text-charcoal/40 text-[10px] font-mono uppercase tracking-wider mb-4">Common Spans</p>
              {[
                { cols: 12, label: 'Full Width', use: 'Hero sections, full-bleed' },
                { cols: 8, label: 'Content', use: 'Main content, centered' },
                { cols: 6, label: 'Half', use: 'Side-by-side layouts' },
                { cols: 4, label: 'Third', use: 'Cards, gallery items' },
                { cols: 3, label: 'Quarter', use: 'Thumbnails, icons' },
              ].map((span) => (
                <div key={span.cols} className="grid grid-cols-12 gap-4 items-center">
                  <div className={`col-span-${span.cols} bg-charcoal h-10 rounded flex items-center px-4`}>
                    <span className="text-cream text-xs font-mono">{span.cols} cols</span>
                  </div>
                  <div className={`col-span-${12 - span.cols} flex items-center gap-4`}>
                    <span className="text-charcoal/60 text-sm">{span.label}</span>
                    <span className="text-charcoal/40 text-xs">{span.use}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Container specs */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { breakpoint: 'Mobile', width: '100%', padding: '20px', cols: '4' },
                { breakpoint: 'Tablet', width: '768px', padding: '32px', cols: '8' },
                { breakpoint: 'Desktop', width: '1280px', padding: '48px', cols: '12' },
              ].map((bp) => (
                <div key={bp.breakpoint} className="border border-charcoal/10 rounded-lg p-4">
                  <p className="font-serif text-charcoal text-lg mb-3">{bp.breakpoint}</p>
                  <div className="space-y-1 text-xs font-mono text-charcoal/60">
                    <p>Max: {bp.width}</p>
                    <p>Padding: {bp.padding}</p>
                    <p>Columns: {bp.cols}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SPACING VIEW */}
      {view === 'spacing' && (
        <div className={`pt-24 p-8 lg:p-16 ${bg}`}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-2`}>Spacing System</p>
              <h2 className={`font-serif ${text} text-3xl tracking-wide`}>8px Base Unit</h2>
            </div>
            
            {/* Scale visualization */}
            <div className="space-y-4">
              {SPACING.map((space) => (
                <div key={space.px} className="flex items-center gap-6">
                  <div className="w-20 text-right">
                    <span className={`${textMuted} text-xs font-mono`}>{space.px}px</span>
                  </div>
                  <div 
                    className={`h-6 ${theme === 'dark' ? 'bg-cream/40' : 'bg-charcoal/40'} rounded-sm`}
                    style={{ width: `${space.px}px` }}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`${textMuted} text-xs font-mono`}>{space.rem}rem</span>
                    <span className={`${textMuted} text-xs`}>{space.use}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Section padding examples */}
            <div className="mt-16">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-6`}>Section Padding</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { size: 'Small', py: '48px', use: 'Compact sections' },
                  { size: 'Medium', py: '80px', use: 'Standard sections' },
                  { size: 'Large', py: '128px', use: 'Hero, major breaks' },
                ].map((section) => (
                  <div 
                    key={section.size} 
                    className={`border ${border} rounded-lg flex flex-col items-center justify-center`}
                    style={{ paddingTop: section.py, paddingBottom: section.py }}
                  >
                    <p className={`font-serif ${text} text-lg`}>{section.size}</p>
                    <p className={`${textMuted} text-xs font-mono mt-1`}>{section.py}</p>
                    <p className={`${textMuted} text-[10px] mt-2`}>{section.use}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
