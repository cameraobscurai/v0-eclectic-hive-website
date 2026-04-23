'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

// ============ DATA ============

// Colors
const COLORS = [
  { name: 'Charcoal', hex: '#1a1a1a', use: 'Primary dark' },
  { name: 'Cream', hex: '#f5f0e8', use: 'Primary light' },
  { name: 'Sand', hex: '#d4c5b5', use: 'Accents' },
  { name: 'Warm White', hex: '#faf9f7', use: 'Light backgrounds' },
  { name: 'Brass', hex: '#b8a88a', use: 'Metallic accent' },
]

// Materials
const MATERIALS = [
  { name: 'White Oak', tone: 'Warm', desc: 'Honey undertones, visible grain' },
  { name: 'Brushed Brass', tone: 'Metallic', desc: 'Patinated gold, lived-in luxury' },
  { name: 'Belgian Linen', tone: 'Natural', desc: 'Unbleached, textured weave' },
  { name: 'Travertine', tone: 'Stone', desc: 'Soft cream, subtle pitting' },
  { name: 'Velvet', tone: 'Plush', desc: 'Deep charcoal, light-catching' },
  { name: 'Raw Plaster', tone: 'Tactile', desc: 'Imperfect, handmade quality' },
]

// Typography
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'.split('')
const NUMERALS = '0123456789'.split('')

const TYPE_HIERARCHY = [
  { level: 'H1', sample: 'ECLECTIC HIVE', font: 'Saol Display', size: '72px', tracking: '0.2em' },
  { level: 'H2', sample: 'Design + Production', font: 'Saol Display', size: '48px', tracking: '0.15em' },
  { level: 'H3', sample: 'Featured Collections', font: 'Saol Display', size: '32px', tracking: '0.1em' },
  { level: 'Body', sample: 'We design, build, and produce the environments you can\'t hire elsewhere.', font: 'Inter', size: '16px', tracking: '0.02em' },
  { level: 'Caption', sample: 'CANYON POINT, UTAH — 2024', font: 'Inter Light', size: '12px', tracking: '0.15em' },
  { level: 'Mono', sample: '96W × 24D × 41H', font: 'Geist Mono', size: '11px', tracking: '0.1em' },
]

// Voice
const VOICE_PILLARS = [
  { name: 'LUXE', ratio: '2 parts', desc: 'Sophisticated, refined, premium quality', examples: ['Curated collection', 'Artisan-crafted', 'Bespoke experience'] },
  { name: 'REGAL', ratio: '1 part', desc: 'Confident, authoritative, elevated', examples: ['Signature aesthetic', 'Timeless design', 'Distinguished quality'] },
  { name: 'EDGE', ratio: 'a dash', desc: 'Unexpected, bold, memorable', examples: ['Break the rules', 'Unforgettable moments', 'Push boundaries'] },
]

const TONE_CONTEXTS = [
  { context: 'Homepage', tone: 'Intriguing + Confident', edge: 4, example: 'Scroll-stopping. Let the work do the talking.' },
  { context: 'Collection', tone: 'Clean + Informative', edge: 2, example: 'Clear specs, no poetry. Let items breathe.' },
  { context: 'Gallery', tone: 'Cinematic + Evocative', edge: 3, example: 'Mood over information. Editorial captions.' },
  { context: 'Team', tone: 'Warm + Approachable', edge: 2, example: 'Professional but human. Show personality.' },
  { context: 'Contact', tone: 'Direct + Welcoming', edge: 1, example: 'Clear call to action. Easy to reach.' },
]

// Mood
const MOOD_WORDS = [
  { word: 'Cinematic', desc: 'Every frame could be a still from a film.' },
  { word: 'Grounded', desc: 'Natural materials, warm tones, tactile textures.' },
  { word: 'Curated', desc: 'Every element chosen with purpose.' },
  { word: 'Intimate', desc: 'Approachable luxury. Warmth over opulence.' },
  { word: 'Artful', desc: 'Gallery-worthy. Design as installation.' },
]

// Motion
const MOTION_PRINCIPLES = [
  { principle: 'Slow reveals', desc: 'Content emerges gradually. Time to breathe.' },
  { principle: 'Natural easing', desc: 'Organic movement like candlelight.' },
  { principle: 'Purpose-driven', desc: 'Animation serves the story.' },
  { principle: 'Restraint', desc: 'One animation at a time.' },
]

// Photography
const PHOTO_STYLES = [
  { type: 'Inventory', specs: ['1:1 ratio', 'Neutral background', 'Clean, composed'], desc: 'No overlapping. Let items breathe.' },
  { type: 'Team', specs: ['Professional portraits', 'Personality showing', 'Workspace context'], desc: 'Professional but approachable.' },
  { type: 'Events', specs: ['Cinematic quality', 'Atmospheric lighting', 'Movement'], desc: 'A little sexy, a lot of intrigue.' },
]

// Don'ts
const DONTS = [
  { rule: 'Overlapping images', desc: 'Each image gets its own space.' },
  { rule: 'Corporate speak', desc: 'No synergy, leverage, best-in-class.' },
  { rule: 'Busy layouts', desc: 'White space is intentional.' },
  { rule: 'Stock photography', desc: 'Original or commissioned only.' },
  { rule: 'Gradient backgrounds', desc: 'Solid colors only.' },
  { rule: 'Decorative fonts', desc: 'Saol, Inter, Geist Mono only.' },
]

// Detail pages
const DETAIL_PAGES = [
  { href: '/brand/typography', title: 'Typography', desc: 'Interactive letterform views' },
  { href: '/brand/language', title: 'Language', desc: 'Full vocabulary + phrases' },
  { href: '/brand/visual', title: 'Visual', desc: 'Theme toggle + downloads' },
  { href: '/brand/guidelines', title: 'Guidelines', desc: 'Applications + collateral' },
]

export default function BrandIndex() {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-20 px-8 lg:px-16 border-b border-cream/10 overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none" aria-hidden="true">
          <span className="font-serif text-cream/[0.03] tracking-tight" style={{ fontSize: 'clamp(150px, 25vw, 350px)', lineHeight: 0.85 }}>E</span>
          <span className="font-serif text-cream/[0.03] tracking-tight -ml-[0.05em]" style={{ fontSize: 'clamp(150px, 25vw, 350px)', lineHeight: 0.85 }}>H</span>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="text-cream/40 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Brand System — Complete Reference</p>
          <h1 className="font-display text-cream text-4xl sm:text-5xl lg:text-6xl tracking-[0.08em] uppercase mb-3">ECLECTIC HIVE</h1>
          <p className="text-cream/40 text-base lg:text-lg italic">"Two parts luxe, one part regal, and a dash of edge."</p>
        </div>
      </section>

      {/* ============ QUICK NAV ============ */}
      <nav className="sticky top-16 z-30 bg-charcoal/95 backdrop-blur-sm border-b border-cream/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-4 flex gap-6 overflow-x-auto">
          {['Architecture', 'Colors', 'Materials', 'Typography', 'Voice', 'Mood', 'Motion', 'Photography', 'Don\'ts', 'Downloads'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase().replace("'", "").replace(' ', '-')}`}
              className="text-cream/40 text-xs uppercase tracking-[0.15em] hover:text-cream/70 transition-colors whitespace-nowrap"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        
        {/* ============ 01 ARCHITECTURE ============ */}
        <section id="architecture" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">01 — Brand Architecture</p>
          
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <div className="border border-cream/20 rounded-lg p-8 text-center">
              <p className="text-cream text-xl lg:text-2xl tracking-[0.12em] uppercase font-light">ECLECTIC HIVE</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-3 uppercase">Parent Umbrella</p>
              <p className="text-cream/40 text-sm mt-4">Full-service design, fabrication, and rentals</p>
            </div>
            <div className="border border-cream/10 rounded-lg p-8 text-center">
              <p className="text-cream/70 text-lg lg:text-xl tracking-[0.1em] uppercase font-light">ATELIER by THE HIVE</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-3 uppercase">Design & Fabrication</p>
              <p className="text-cream/40 text-sm mt-4">Custom builds, bespoke environments</p>
              <p className="text-cream/50 text-sm italic mt-4 font-display">Imagined. Refined. Crafted.</p>
            </div>
            <div className="border border-cream/10 rounded-lg p-8 text-center">
              <p className="text-cream/70 text-lg lg:text-xl tracking-[0.1em] uppercase font-light">HIVE SIGNATURE COLLECTION</p>
              <p className="text-cream/30 text-[10px] tracking-wider mt-3 uppercase">Inventory Wing</p>
              <p className="text-cream/40 text-sm mt-4">Curated rental inventory</p>
            </div>
          </div>
        </section>

        {/* ============ 02 COLORS ============ */}
        <section id="colors" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">02 — Color Palette</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {COLORS.map((color) => (
              <div key={color.name}>
                <div className="aspect-[4/3] rounded-lg mb-3 border border-cream/10" style={{ backgroundColor: color.hex }} />
                <p className="text-cream text-sm">{color.name}</p>
                <p className="text-cream/40 text-xs font-mono mt-1">{color.hex}</p>
                <p className="text-cream/30 text-xs mt-1">{color.use}</p>
              </div>
            ))}
          </div>
          
          {/* Tonal range */}
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-wider mb-4">Tonal Range</p>
          <div className="h-12 rounded-lg overflow-hidden flex">
            {['#000000', '#1a1a1a', '#333333', '#666666', '#999999', '#b8a88a', '#d4cdc4', '#e8e4de', '#f5f2ed', '#ffffff'].map((hex) => (
              <div key={hex} className="flex-1" style={{ backgroundColor: hex }} />
            ))}
          </div>
        </section>

        {/* ============ 03 MATERIALS ============ */}
        <section id="materials" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">03 — Material Library</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {MATERIALS.map((mat, i) => (
              <div key={mat.name} className="border border-cream/10 rounded-lg overflow-hidden">
                <div 
                  className="aspect-square"
                  style={{
                    backgroundColor: ['#8B7355', '#b8a88a', '#c4b8a8', '#e8e0d4', '#2a2a2a', '#d8d0c8'][i],
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="p-3">
                  <p className="text-cream text-sm">{mat.name}</p>
                  <p className="text-cream/30 text-[10px] mt-1">{mat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 04 TYPOGRAPHY ============ */}
        <section id="typography" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">04 — Typography</p>
          
          {/* Letterform */}
          <div className="mb-16">
            <p className="text-cream/20 text-[10px] font-mono uppercase tracking-wider mb-6">Primary Letterform</p>
            <div className="flex items-center justify-center py-12 border border-cream/10 rounded-lg mb-4">
              <span className="font-serif text-cream" style={{ fontSize: 'min(40vw, 300px)', lineHeight: 0.85 }}>H</span>
            </div>
            <p className="text-cream/30 text-xs font-mono text-center">Saol Display Light — Cap Height: 700</p>
          </div>
          
          {/* Alphabet */}
          <div className="mb-16">
            <p className="text-cream/20 text-[10px] font-mono uppercase tracking-wider mb-6">Character Set</p>
            <div className="grid grid-cols-13 gap-0 mb-4">
              {UPPERCASE.map((letter) => (
                <div key={letter} className="aspect-square flex items-center justify-center text-cream font-serif text-lg lg:text-2xl border-b border-r border-cream/5">
                  {letter}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-13 gap-0 mb-4">
              {LOWERCASE.map((letter) => (
                <div key={letter} className="aspect-square flex items-center justify-center text-cream font-serif text-lg lg:text-2xl border-b border-r border-cream/5">
                  {letter}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-10 gap-0">
              {NUMERALS.map((num) => (
                <div key={num} className="aspect-square flex items-center justify-center text-cream font-serif text-lg lg:text-2xl border-b border-r border-cream/5">
                  {num}
                </div>
              ))}
            </div>
          </div>
          
          {/* Hierarchy */}
          <div>
            <p className="text-cream/20 text-[10px] font-mono uppercase tracking-wider mb-6">Type Hierarchy</p>
            <div className="space-y-6">
              {TYPE_HIERARCHY.map((item) => (
                <div key={item.level} className="grid grid-cols-12 gap-4 items-baseline pb-4 border-b border-cream/5">
                  <div className="col-span-1">
                    <span className="text-cream/30 text-[10px] font-mono">{item.level}</span>
                  </div>
                  <div className="col-span-7">
                    <p className={`text-cream ${item.level.startsWith('H') ? 'font-serif' : item.level === 'Mono' ? 'font-mono' : ''}`} style={{ fontSize: item.size, letterSpacing: item.tracking, lineHeight: 1.2 }}>
                      {item.sample}
                    </p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-cream/30 text-[10px] font-mono">{item.font} / {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 05 VOICE ============ */}
        <section id="voice" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">05 — Voice & Tone</p>
          
          {/* Formula */}
          <div className="text-center mb-16">
            <p className="font-display text-cream text-2xl lg:text-3xl italic">"Two parts luxe, one part regal, and a dash of edge."</p>
          </div>
          
          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {VOICE_PILLARS.map((pillar) => (
              <div key={pillar.name} className="border border-cream/10 rounded-lg p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-serif text-cream text-xl">{pillar.name}</h3>
                  <span className="text-cream/30 text-xs font-mono">{pillar.ratio}</span>
                </div>
                <p className="text-cream/40 text-sm mb-4">{pillar.desc}</p>
                <div className="space-y-2">
                  {pillar.examples.map((ex) => (
                    <p key={ex} className="text-cream/60 text-sm italic">"{ex}"</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Tone by context */}
          <p className="text-cream/20 text-[10px] font-mono uppercase tracking-wider mb-6">Tone by Context</p>
          <div className="space-y-4">
            {TONE_CONTEXTS.map((item) => (
              <div key={item.context} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-cream/5">
                <div className="col-span-2">
                  <p className="text-cream text-sm">{item.context}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-cream/40 text-sm">{item.tone}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${i <= item.edge ? 'bg-cream' : 'bg-cream/10'}`} />
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <p className="text-cream/30 text-sm italic">"{item.example}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 06 MOOD ============ */}
        <section id="mood" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">06 — Mood & Atmosphere</p>
          
          <div className="grid md:grid-cols-5 gap-4">
            {MOOD_WORDS.map((item) => (
              <div key={item.word} className="border border-cream/10 rounded-lg p-6">
                <p className="font-display text-cream text-lg italic mb-2">{item.word}</p>
                <p className="text-cream/30 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 07 MOTION ============ */}
        <section id="motion" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">07 — Motion Principles</p>
          
          <div className="grid md:grid-cols-4 gap-4">
            {MOTION_PRINCIPLES.map((item) => (
              <div key={item.principle} className="border border-cream/10 rounded-lg p-6">
                <p className="text-cream text-sm mb-2">{item.principle}</p>
                <p className="text-cream/30 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 08 PHOTOGRAPHY ============ */}
        <section id="photography" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">08 — Photography Standards</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {PHOTO_STYLES.map((style) => (
              <div key={style.type} className="border border-cream/10 rounded-lg overflow-hidden">
                <div className={`aspect-video flex items-center justify-center ${style.type === 'Events' ? 'bg-charcoal/80' : 'bg-cream/5'}`}>
                  <span className="text-cream/20 text-4xl font-display italic">{style.type[0]}</span>
                </div>
                <div className="p-6">
                  <p className="text-cream text-sm uppercase tracking-wider mb-2">{style.type}</p>
                  <p className="text-cream/40 text-sm mb-4">{style.desc}</p>
                  <ul className="space-y-1">
                    {style.specs.map((spec) => (
                      <li key={spec} className="text-cream/30 text-xs font-mono flex items-center gap-2">
                        <span className="w-1 h-1 bg-cream/30 rounded-full" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 09 DON'TS ============ */}
        <section id="donts" className="px-8 lg:px-16 py-20 border-b border-cream/5">
          <p className="text-red-400/60 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">09 — Critical Don'ts</p>
          
          <div className="grid md:grid-cols-3 gap-4">
            {DONTS.map((item) => (
              <div key={item.rule} className="border border-red-400/20 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">✕</span>
                  <div>
                    <p className="text-cream/80 font-medium mb-1">{item.rule}</p>
                    <p className="text-cream/40 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ 10 DOWNLOADS ============ */}
        <section id="downloads" className="px-8 lg:px-16 py-20">
          <p className="text-cream/30 text-[10px] font-mono uppercase tracking-[0.3em] mb-10">10 — Interactive Pages + Downloads</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DETAIL_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group border border-cream/10 rounded-lg p-6 hover:border-cream/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <ArrowUpRight className="w-4 h-4 text-cream/20 group-hover:text-cream/50 transition-colors" />
                </div>
                <p className="text-cream text-base mb-2">{page.title}</p>
                <p className="text-cream/40 text-sm">{page.desc}</p>
              </Link>
            ))}
          </div>
          
          <p className="text-cream/20 text-xs mt-8">Each page includes dark/light theme toggle and PNG export for presentations.</p>
        </section>

      </div>

      {/* Footer */}
      <section className="px-8 lg:px-16 py-12 border-t border-cream/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream/20 text-xs font-mono uppercase tracking-widest mb-2">Brand Guidelines v1.0</p>
          <p className="font-display text-cream/40 text-lg italic">"Two parts luxe, one part regal, and a dash of edge."</p>
        </div>
      </section>
    </main>
  )
}
