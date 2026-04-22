'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'
import { ArrowRight, Plus, Check, X } from 'lucide-react'

export default function Components() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-components-${theme}`} />
      
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
          UI Components
        </p>
        <h1 className={`font-serif ${text} text-5xl lg:text-7xl tracking-tight mb-4`}>
          COMPONENTS
        </h1>
        <p className={`${textMuted} max-w-xl`}>
          Core UI elements with proper sizing, states, and specifications.
        </p>
      </section>
      
      {/* Buttons */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Buttons
        </p>
        
        <div className="space-y-8">
          {/* Primary */}
          <div>
            <p className={`${textMuted} text-xs font-mono mb-4`}>Primary</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className={`px-6 py-3 ${theme === 'dark' ? 'bg-cream text-charcoal' : 'bg-charcoal text-cream'} font-mono text-xs uppercase tracking-[0.15em] hover:opacity-90 transition-opacity press-effect`}>
                Inquire
              </button>
              <button className={`px-6 py-3 ${theme === 'dark' ? 'bg-cream text-charcoal' : 'bg-charcoal text-cream'} font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:opacity-90 transition-opacity press-effect`}>
                View Collection <ArrowRight className="w-3 h-3" />
              </button>
              <button className={`px-6 py-3 ${theme === 'dark' ? 'bg-cream/50 text-charcoal/50' : 'bg-charcoal/50 text-cream/50'} font-mono text-xs uppercase tracking-[0.15em] cursor-not-allowed`}>
                Disabled
              </button>
            </div>
            <p className={`${textMuted} font-mono text-[10px] mt-4`}>
              Height: 44px (touch target) • Padding: 24px × 12px • Font: Mono 12px • Tracking: 0.15em
            </p>
          </div>
          
          {/* Secondary */}
          <div>
            <p className={`${textMuted} text-xs font-mono mb-4`}>Secondary / Outline</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className={`px-6 py-3 border ${border} ${text} font-mono text-xs uppercase tracking-[0.15em] hover:bg-cream/5 transition-colors press-effect`}>
                Learn More
              </button>
              <button className={`px-6 py-3 border ${border} ${text} font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-cream/5 transition-colors press-effect`}>
                <Plus className="w-3 h-3" /> Add to Inquiry
              </button>
            </div>
          </div>
          
          {/* Text/Link */}
          <div>
            <p className={`${textMuted} text-xs font-mono mb-4`}>Text / Link</p>
            <div className="flex flex-wrap gap-6 items-center">
              <button className={`${text} font-mono text-xs uppercase tracking-[0.15em] editorial-link`}>
                View All
              </button>
              <button className={`${text} font-mono text-xs uppercase tracking-[0.15em] flex items-center gap-1 editorial-link`}>
                Explore <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Icon */}
          <div>
            <p className={`${textMuted} text-xs font-mono mb-4`}>Icon Buttons</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className={`w-11 h-11 flex items-center justify-center border ${border} ${text} hover:bg-cream/5 transition-colors rounded press-effect`}>
                <Plus className="w-4 h-4" />
              </button>
              <button className={`w-11 h-11 flex items-center justify-center ${theme === 'dark' ? 'bg-cream text-charcoal' : 'bg-charcoal text-cream'} rounded press-effect`}>
                <Check className="w-4 h-4" />
              </button>
              <button className={`w-11 h-11 flex items-center justify-center border ${border} ${textMuted} hover:text-red-500 hover:border-red-500/30 transition-colors rounded press-effect`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`${textMuted} font-mono text-[10px] mt-4`}>
              Size: 44px × 44px (minimum touch target) • Icon: 16px
            </p>
          </div>
        </div>
      </section>
      
      {/* Form Elements */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Form Elements
        </p>
        
        <div className="max-w-md space-y-8">
          {/* Text Input */}
          <div>
            <label className={`block ${textMuted} text-xs font-mono uppercase tracking-[0.15em] mb-2`}>
              Full Name
            </label>
            <input 
              type="text" 
              placeholder="Enter your name"
              className={`w-full px-4 py-3 bg-transparent border ${border} ${text} placeholder:${textMuted} font-mono text-sm focus:outline-none focus:border-cream/30 transition-colors`}
            />
            <p className={`${textMuted} font-mono text-[10px] mt-2`}>
              Height: 48px • Padding: 16px × 12px • Border: 1px
            </p>
          </div>
          
          {/* Textarea */}
          <div>
            <label className={`block ${textMuted} text-xs font-mono uppercase tracking-[0.15em] mb-2`}>
              Project Details
            </label>
            <textarea 
              placeholder="Describe your vision..."
              rows={4}
              className={`w-full px-4 py-3 bg-transparent border ${border} ${text} placeholder:${textMuted} font-mono text-sm focus:outline-none focus:border-cream/30 transition-colors resize-none`}
            />
          </div>
          
          {/* Select */}
          <div>
            <label className={`block ${textMuted} text-xs font-mono uppercase tracking-[0.15em] mb-2`}>
              Project Type
            </label>
            <select className={`w-full px-4 py-3 bg-transparent border ${border} ${text} font-mono text-sm focus:outline-none focus:border-cream/30 transition-colors appearance-none`}>
              <option>Private Event</option>
              <option>Corporate</option>
              <option>Wedding</option>
            </select>
          </div>
        </div>
      </section>
      
      {/* Cards */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Cards
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Card */}
          <div className={`border ${border} p-6 hover-lift cursor-pointer`}>
            <div className={`aspect-[4/3] ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'} mb-4`} />
            <p className={`${text} font-serif text-xl mb-2`}>Product Title</p>
            <p className={`${textMuted} text-sm`}>Brief description of the item or collection piece.</p>
          </div>
          
          {/* Featured Card */}
          <div className={`border ${border} p-0 overflow-hidden hover-lift cursor-pointer`}>
            <div className={`aspect-[4/3] ${theme === 'dark' ? 'bg-cream/10' : 'bg-charcoal/10'}`} />
            <div className="p-6">
              <p className={`${textMuted} text-xs font-mono uppercase tracking-wider mb-2`}>Featured</p>
              <p className={`${text} font-serif text-xl mb-2`}>Collection Name</p>
              <p className={`${textMuted} text-sm`}>Extended description with more context.</p>
            </div>
          </div>
          
          {/* Glass Card */}
          <div className="glass p-6 cursor-pointer">
            <div className={`aspect-[4/3] bg-cream/5 mb-4 rounded`} />
            <p className="text-cream font-serif text-xl mb-2">Glass Card</p>
            <p className="text-cream/60 text-sm">On dark backgrounds with blur effect.</p>
          </div>
        </div>
        
        <p className={`${textMuted} font-mono text-[10px] mt-6`}>
          Padding: 24px • Border: 1px • Gap: 24px • Hover: translateY(-8px)
        </p>
      </section>
      
      {/* Badges / Tags */}
      <section className={`px-8 lg:px-16 py-16`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Badges + Tags
        </p>
        
        <div className="flex flex-wrap gap-3">
          <span className={`px-3 py-1 ${theme === 'dark' ? 'bg-cream/10 text-cream' : 'bg-charcoal/10 text-charcoal'} font-mono text-xs uppercase tracking-wider`}>
            New
          </span>
          <span className={`px-3 py-1 border ${border} ${text} font-mono text-xs uppercase tracking-wider`}>
            Available
          </span>
          <span className={`px-3 py-1 ${theme === 'dark' ? 'bg-cream text-charcoal' : 'bg-charcoal text-cream'} font-mono text-xs uppercase tracking-wider`}>
            Featured
          </span>
          <span className={`px-3 py-1 bg-red-900/20 text-red-400 font-mono text-xs uppercase tracking-wider`}>
            Sold Out
          </span>
        </div>
        
        <p className={`${textMuted} font-mono text-[10px] mt-6`}>
          Padding: 12px × 4px • Font: Mono 12px • Tracking: 0.1em
        </p>
      </section>
    </main>
  )
}
