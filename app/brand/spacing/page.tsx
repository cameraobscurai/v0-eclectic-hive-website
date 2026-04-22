'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

const SPACING_SCALE = [
  { px: 4, name: 'xxs', tailwind: 'p-1' },
  { px: 8, name: 'xs', tailwind: 'p-2' },
  { px: 12, name: 'sm', tailwind: 'p-3' },
  { px: 16, name: 'md', tailwind: 'p-4' },
  { px: 20, name: 'lg', tailwind: 'p-5' },
  { px: 24, name: 'xl', tailwind: 'p-6' },
  { px: 32, name: '2xl', tailwind: 'p-8' },
  { px: 40, name: '3xl', tailwind: 'p-10' },
  { px: 48, name: '4xl', tailwind: 'p-12' },
  { px: 64, name: '5xl', tailwind: 'p-16' },
  { px: 80, name: '6xl', tailwind: 'p-20' },
  { px: 96, name: '7xl', tailwind: 'p-24' },
  { px: 128, name: '8xl', tailwind: 'p-32' },
]

const SECTION_SPACING = [
  { name: 'Section SM', mobile: 40, tablet: 64, desktop: 80, class: 'section-padding-sm' },
  { name: 'Section MD', mobile: 64, tablet: 96, desktop: 128, class: 'section-padding' },
  { name: 'Section LG', mobile: 80, tablet: 128, desktop: 160, class: 'section-padding-lg' },
]

export default function Spacing() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  const barBg = theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'
  const barAccent = theme === 'dark' ? 'bg-cream' : 'bg-charcoal'
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-spacing-${theme}`} />
      
      {/* Controls */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1.5 text-xs uppercase tracking-widest rounded bg-white/80 text-charcoal border border-charcoal/20"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
      
      {/* Hero */}
      <section className={`px-8 lg:px-16 pt-24 pb-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.3em] mb-4`}>
          Spacing System
        </p>
        <h1 className={`font-serif ${text} text-5xl lg:text-7xl tracking-tight mb-4`}>
          SPACING
        </h1>
        <p className={`${textMuted} max-w-xl`}>
          8px baseline grid. Consistent rhythm creates visual harmony across all components and layouts.
        </p>
      </section>
      
      {/* Base Unit */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <div className="max-w-4xl">
          <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-8`}>
            Base Unit
          </p>
          <div className="flex items-end gap-8">
            <div className={`w-16 h-16 ${barAccent} rounded-sm`} />
            <div>
              <p className={`${text} font-serif text-6xl tracking-tight`}>8px</p>
              <p className={`${textMuted} text-sm mt-2`}>
                All spacing derives from this base unit
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Spacing Scale */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Spacing Scale
        </p>
        <div className="space-y-4">
          {SPACING_SCALE.map((space) => (
            <div key={space.px} className="flex items-center gap-6">
              <div 
                className={`${barAccent} h-6 rounded-sm transition-all`} 
                style={{ width: `${Math.min(space.px * 2, 256)}px` }}
              />
              <div className="flex items-baseline gap-4 min-w-[200px]">
                <span className={`${text} font-mono text-sm w-12`}>{space.px}px</span>
                <span className={`${textMuted} font-mono text-xs uppercase`}>{space.name}</span>
                <span className={`${textMuted} font-mono text-xs opacity-50`}>{space.tailwind}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Section Spacing */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Section Padding (Responsive)
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SECTION_SPACING.map((section) => (
            <div key={section.name} className={`p-6 rounded border ${border}`}>
              <p className={`${text} font-serif text-xl mb-4`}>{section.name}</p>
              <div className={`${textMuted} font-mono text-xs space-y-2`}>
                <div className="flex justify-between">
                  <span>Mobile</span>
                  <span>{section.mobile}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Tablet</span>
                  <span>{section.tablet}px</span>
                </div>
                <div className="flex justify-between">
                  <span>Desktop</span>
                  <span>{section.desktop}px</span>
                </div>
              </div>
              <p className={`${textMuted} font-mono text-[10px] mt-4 opacity-50`}>
                .{section.class}
              </p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Container Padding */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Container Padding
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`p-6 rounded border ${border}`}>
            <p className={`${text} font-mono text-sm mb-2`}>Mobile</p>
            <p className={`${text} font-serif text-3xl`}>20px</p>
            <p className={`${textMuted} font-mono text-xs mt-2`}>px-5</p>
          </div>
          <div className={`p-6 rounded border ${border}`}>
            <p className={`${text} font-mono text-sm mb-2`}>Tablet</p>
            <p className={`${text} font-serif text-3xl`}>32px</p>
            <p className={`${textMuted} font-mono text-xs mt-2`}>md:px-8</p>
          </div>
          <div className={`p-6 rounded border ${border}`}>
            <p className={`${text} font-mono text-sm mb-2`}>Desktop</p>
            <p className={`${text} font-serif text-3xl`}>48px</p>
            <p className={`${textMuted} font-mono text-xs mt-2`}>lg:px-12</p>
          </div>
        </div>
      </section>
      
      {/* Visual Rhythm Example */}
      <section className={`px-8 lg:px-16 py-16`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Visual Rhythm Example
        </p>
        <div className={`max-w-2xl p-8 rounded border ${border}`}>
          <p className={`${text} font-serif text-2xl mb-6`}>Section Title</p>
          <p className={`${textMuted} mb-8`}>
            Body text with proper spacing creates visual rhythm. The gap between elements follows the 8px grid.
          </p>
          <div className="flex gap-4">
            <div className={`px-6 py-3 ${barAccent} rounded`}>
              <span className={theme === 'dark' ? 'text-charcoal' : 'text-cream'}>Button</span>
            </div>
            <div className={`px-6 py-3 border ${border} rounded`}>
              <span className={text}>Secondary</span>
            </div>
          </div>
        </div>
        <div className={`mt-8 ${textMuted} font-mono text-xs`}>
          <p>Title → Body: 24px (mb-6)</p>
          <p>Body → Buttons: 32px (mb-8)</p>
          <p>Button gap: 16px (gap-4)</p>
          <p>Button padding: 24px × 12px (px-6 py-3)</p>
        </div>
      </section>
    </main>
  )
}
