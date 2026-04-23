'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// Color palette from the brand
const COLORS = [
  { name: 'Charcoal', hex: '#1a1a1a', use: 'Primary background, text' },
  { name: 'Cream', hex: '#f5f0e8', use: 'Primary text on dark, cards' },
  { name: 'Sand', hex: '#d4c5b5', use: 'Accents, hover states' },
  { name: 'Warm White', hex: '#faf9f7', use: 'Light mode backgrounds' },
]

// Typography samples
const TYPE_SAMPLES = [
  { style: 'Display', font: 'Saol Display', sample: 'Aa', weight: 'Light Italic' },
  { style: 'Body', font: 'Inter', sample: 'Aa', weight: 'Regular' },
  { style: 'Mono', font: 'JetBrains Mono', sample: '01', weight: 'Regular' },
]

// Voice formula
const VOICE_FORMULA = ['Confident', 'Warm', 'Refined', 'Direct']

// Photography styles
const PHOTO_STYLES = [
  { type: 'Inventory', desc: 'Clean and composed. No overlapping.' },
  { type: 'Team', desc: 'Professional but approachable.' },
  { type: 'Events', desc: 'Cinematic. A little sexy, a lot of intrigue.' },
]

// Detailed pages for deep dives
const DETAIL_PAGES = [
  { href: '/brand/typography', title: 'Typography', desc: 'Letterforms, construction, hierarchy, numerals' },
  { href: '/brand/language', title: 'Language', desc: 'Phrases, vocabulary, voice formula, tone' },
  { href: '/brand/visual', title: 'Visual System', desc: 'Colors, materials, mood, motion' },
  { href: '/brand/guidelines', title: 'Guidelines', desc: 'Architecture, photography, applications, don\'ts' },
]

export default function BrandIndex() {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* Hero - Compact */}
      <section className="relative pt-32 pb-16 px-8 lg:px-16 border-b border-cream/10 overflow-hidden">
        {/* Ghost EH letters */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none" aria-hidden="true">
          <span className="font-serif text-cream/[0.03] tracking-tight" style={{ fontSize: 'clamp(150px, 25vw, 350px)', lineHeight: 0.85 }}>E</span>
          <span className="font-serif text-cream/[0.03] tracking-tight -ml-[0.05em]" style={{ fontSize: 'clamp(150px, 25vw, 350px)', lineHeight: 0.85 }}>H</span>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Brand System</p>
          <h1 className="font-display text-cream text-4xl sm:text-5xl lg:text-6xl tracking-[0.08em] uppercase mb-3">ECLECTIC HIVE</h1>
          <p className="text-cream/40 text-base lg:text-lg italic">"Two parts luxe, one part regal, and a dash of edge."</p>
        </div>
      </section>

      {/* Quick Nav */}
      <nav className="sticky top-16 z-30 bg-charcoal/95 backdrop-blur-sm border-b border-cream/5">
        <div className="max-w-6xl mx-auto px-8 lg:px-16 py-4 flex gap-6 overflow-x-auto">
          {['Architecture', 'Colors', 'Typography', 'Voice', 'Photography', 'Deep Dives'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-cream/40 text-xs uppercase tracking-[0.15em] hover:text-cream/70 transition-colors whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* ============ ARCHITECTURE ============ */}
      <section id="architecture" className="px-8 lg:px-16 py-16 border-b border-cream/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">01 — Brand Architecture</p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Parent */}
            <div className="border border-cream/20 rounded-lg p-8 text-center">
              <p className="text-cream text-xl lg:text-2xl tracking-[0.12em] uppercase font-light">ECLECTIC HIVE</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-3 uppercase">Parent Umbrella</p>
              <p className="text-cream/40 text-sm mt-4">Full-service design, fabrication, and rentals</p>
            </div>
            
            {/* Atelier */}
            <div className="border border-cream/10 rounded-lg p-8 text-center">
              <p className="text-cream/70 text-lg lg:text-xl tracking-[0.1em] uppercase font-light">ATELIER by THE HIVE</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-3 uppercase">Design & Fabrication</p>
              <p className="text-cream/40 text-sm mt-4">Custom builds, bespoke environments</p>
              <p className="text-cream/50 text-sm italic mt-4 font-display">Imagined. Refined. Crafted.</p>
            </div>
            
            {/* Collection */}
            <div className="border border-cream/10 rounded-lg p-8 text-center">
              <p className="text-cream/70 text-lg lg:text-xl tracking-[0.1em] uppercase font-light">HIVE SIGNATURE COLLECTION</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-3 uppercase">Inventory Wing</p>
              <p className="text-cream/40 text-sm mt-4">Curated rental inventory</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COLORS ============ */}
      <section id="colors" className="px-8 lg:px-16 py-16 border-b border-cream/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">02 — Color Palette</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLORS.map((color) => (
              <div key={color.name} className="group">
                <div 
                  className="aspect-[4/3] rounded-lg mb-3 border border-cream/10"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-cream text-sm">{color.name}</p>
                <p className="text-cream/40 text-xs font-mono mt-1">{color.hex}</p>
                <p className="text-cream/30 text-xs mt-2">{color.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TYPOGRAPHY ============ */}
      <section id="typography" className="px-8 lg:px-16 py-16 border-b border-cream/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">03 — Typography</p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {TYPE_SAMPLES.map((type) => (
              <div key={type.style} className="border border-cream/10 rounded-lg p-8">
                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-cream/30 text-[10px] font-mono uppercase tracking-wider">{type.style}</span>
                  <span className="text-cream/20 text-[10px]">{type.weight}</span>
                </div>
                <p className={`text-cream text-6xl mb-4 ${type.style === 'Display' ? 'font-display italic' : type.style === 'Mono' ? 'font-mono' : 'font-sans'}`}>
                  {type.sample}
                </p>
                <p className="text-cream/50 text-sm">{type.font}</p>
              </div>
            ))}
          </div>
          
          {/* Sample headline */}
          <div className="mt-12 pt-12 border-t border-cream/5">
            <p className="text-cream/30 text-[10px] font-mono uppercase tracking-wider mb-6">Sample Pairing</p>
            <h2 className="font-display text-cream text-3xl lg:text-5xl italic tracking-wide mb-4">
              The art of atmosphere
            </h2>
            <p className="text-cream/50 text-base max-w-xl leading-relaxed">
              We design, build, and produce the environments you can&apos;t hire elsewhere. 
              Every project begins with a story and ends with an experience.
            </p>
          </div>
        </div>
      </section>

      {/* ============ VOICE ============ */}
      <section id="voice" className="px-8 lg:px-16 py-16 border-b border-cream/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">04 — Voice & Tone</p>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Voice formula */}
            <div>
              <p className="text-cream/40 text-xs uppercase tracking-wider mb-6">Voice Formula</p>
              <div className="flex flex-wrap gap-3">
                {VOICE_FORMULA.map((word, i) => (
                  <span key={word} className="flex items-center gap-2">
                    <span className="px-4 py-2 border border-cream/20 rounded-full text-cream text-sm">{word}</span>
                    {i < VOICE_FORMULA.length - 1 && <span className="text-cream/20">+</span>}
                  </span>
                ))}
              </div>
              <p className="text-cream/40 text-sm mt-6 italic">"Two parts luxe, one part regal, and a dash of edge."</p>
            </div>
            
            {/* Do / Don't */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-cream/40 text-xs uppercase tracking-wider mb-4">Say</p>
                <ul className="space-y-2 text-cream/60 text-sm">
                  <li>"We craft environments"</li>
                  <li>"Curated collection"</li>
                  <li>"Art-forward design"</li>
                </ul>
              </div>
              <div>
                <p className="text-cream/40 text-xs uppercase tracking-wider mb-4">Don&apos;t Say</p>
                <ul className="space-y-2 text-cream/30 text-sm line-through">
                  <li>"We do events"</li>
                  <li>"Rental inventory"</li>
                  <li>"Pretty decorations"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PHOTOGRAPHY ============ */}
      <section id="photography" className="px-8 lg:px-16 py-16 border-b border-cream/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">05 — Photography</p>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {PHOTO_STYLES.map((style) => (
              <div key={style.type} className="border border-cream/10 rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-charcoal/50 flex items-center justify-center">
                  <span className="text-cream/10 text-6xl font-display italic">{style.type[0]}</span>
                </div>
                <div className="p-6">
                  <p className="text-cream text-sm uppercase tracking-wider">{style.type}</p>
                  <p className="text-cream/40 text-sm mt-2">{style.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DEEP DIVES ============ */}
      <section id="deep-dives" className="px-8 lg:px-16 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-8">06 — Detailed Reference</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DETAIL_PAGES.map((page, i) => (
              <Link
                key={page.href}
                href={page.href}
                className="group border border-cream/10 rounded-lg p-6 hover:border-cream/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-cream/20 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
                  <ArrowUpRight className="w-4 h-4 text-cream/20 group-hover:text-cream/50 transition-colors" />
                </div>
                <p className="text-cream text-base mb-2">{page.title}</p>
                <p className="text-cream/40 text-sm">{page.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-8 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto border-t border-cream/10 pt-8">
          <p className="text-cream/20 text-xs">
            Internal brand reference. Each detail page includes interactive previews and downloadable assets.
          </p>
        </div>
      </section>
    </main>
  )
}
