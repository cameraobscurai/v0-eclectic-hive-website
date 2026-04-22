'use client'

import { useState } from 'react'
import { DownloadButton } from '@/components/specimen/download-button'

export default function Effects() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const bg = theme === 'dark' ? 'bg-charcoal' : 'bg-cream'
  const text = theme === 'dark' ? 'text-cream' : 'text-charcoal'
  const textMuted = theme === 'dark' ? 'text-cream/40' : 'text-charcoal/40'
  const border = theme === 'dark' ? 'border-cream/10' : 'border-charcoal/10'
  
  return (
    <main id="specimen-content" className={`min-h-screen ${bg}`}>
      <DownloadButton targetId="specimen-content" filename={`eclectic-hive-effects-${theme}`} />
      
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
          Visual Effects
        </p>
        <h1 className={`font-serif ${text} text-5xl lg:text-7xl tracking-tight mb-4`}>
          EFFECTS
        </h1>
        <p className={`${textMuted} max-w-xl`}>
          Glassmorphism, animations, and visual treatments that define the brand aesthetic.
        </p>
      </section>
      
      {/* Glassmorphism */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Glassmorphism System
        </p>
        
        {/* Glass demo with image background */}
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/90 to-sand/30" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Glass panels */}
          <div className="absolute inset-0 flex items-center justify-center gap-8 p-8">
            <div className="glass p-8 rounded-lg w-64">
              <p className="text-cream/40 text-xs font-mono uppercase tracking-wider mb-2">.glass</p>
              <p className="text-cream font-serif text-xl">Default Glass</p>
              <p className="text-cream/60 text-sm mt-2">blur-12 / white 4% / border 8%</p>
            </div>
            
            <div className="glass-dark p-8 rounded-lg w-64">
              <p className="text-cream/40 text-xs font-mono uppercase tracking-wider mb-2">.glass-dark</p>
              <p className="text-cream font-serif text-xl">Dark Glass</p>
              <p className="text-cream/60 text-sm mt-2">blur-12 / black 40% / border 8%</p>
            </div>
            
            <div className="glass-interactive p-8 rounded-lg w-64 cursor-pointer">
              <p className="text-cream/40 text-xs font-mono uppercase tracking-wider mb-2">.glass-interactive</p>
              <p className="text-cream font-serif text-xl">Hover Me</p>
              <p className="text-cream/60 text-sm mt-2">Hover to see effect</p>
            </div>
          </div>
        </div>
        
        {/* Glass code reference */}
        <div className={`p-6 rounded border ${border} font-mono text-xs ${textMuted}`}>
          <p>backdrop-filter: blur(12px);</p>
          <p>background-color: rgba(255, 255, 255, 0.04);</p>
          <p>border: 1px solid rgba(255, 255, 255, 0.08);</p>
        </div>
      </section>
      
      {/* Animation Timing */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Easing Curves
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {[
            { name: 'Cinematic', css: 'cubic-bezier(0.22, 1, 0.36, 1)', class: 'ease-cinematic' },
            { name: 'Expo Out', css: 'cubic-bezier(0.16, 1, 0.3, 1)', class: 'ease-expo-out' },
            { name: 'Expo In', css: 'cubic-bezier(0.7, 0, 0.84, 0)', class: 'ease-expo-in' },
            { name: 'Spring', css: 'cubic-bezier(0.5, 1.5, 0.8, 1)', class: 'ease-spring' },
          ].map((curve) => (
            <div key={curve.name} className={`p-6 rounded border ${border}`}>
              <p className={`${text} font-serif text-xl mb-2`}>{curve.name}</p>
              <p className={`${textMuted} font-mono text-[10px] mb-4`}>{curve.css}</p>
              <div className={`h-12 ${theme === 'dark' ? 'bg-cream/10' : 'bg-charcoal/10'} rounded overflow-hidden`}>
                <div 
                  className={`h-full w-8 ${theme === 'dark' ? 'bg-cream' : 'bg-charcoal'} rounded animate-slide-demo`}
                  style={{ 
                    animation: 'slide-demo 2s infinite',
                    animationTimingFunction: curve.css
                  }}
                />
              </div>
              <p className={`${textMuted} font-mono text-xs mt-3`}>.{curve.class}</p>
            </div>
          ))}
        </div>
        
        <style jsx>{`
          @keyframes slide-demo {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(calc(100% + 150px)); }
          }
        `}</style>
      </section>
      
      {/* Animation Presets */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Animation Presets
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { name: 'Fade Up', class: 'animate-fade-up', desc: 'Default reveal animation' },
            { name: 'Scale Up', class: 'animate-scale-up', desc: 'Modal/card entrance' },
            { name: 'Slide Left', class: 'animate-slide-left', desc: 'Drawer entrance' },
          ].map((anim) => (
            <div key={anim.name} className={`p-6 rounded border ${border}`}>
              <div className={`h-32 ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'} rounded flex items-center justify-center mb-4`}>
                <div 
                  className={`w-16 h-16 ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'} rounded ${anim.class}`}
                  style={{ animationIterationCount: 'infinite', animationDuration: '2s' }}
                />
              </div>
              <p className={`${text} font-serif text-lg`}>{anim.name}</p>
              <p className={`${textMuted} text-xs mb-2`}>{anim.desc}</p>
              <p className={`${textMuted} font-mono text-xs opacity-50`}>.{anim.class}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Hover Effects */}
      <section className={`px-8 lg:px-16 py-16 border-b ${border}`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Hover Effects
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`p-6 rounded border ${border}`}>
            <div className={`h-32 ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'} rounded flex items-center justify-center mb-4`}>
              <div className={`w-24 h-16 ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'} rounded hover-lift cursor-pointer`} />
            </div>
            <p className={`${text} font-serif text-lg`}>Hover Lift</p>
            <p className={`${textMuted} text-xs mb-2`}>Cards, buttons</p>
            <p className={`${textMuted} font-mono text-xs opacity-50`}>.hover-lift</p>
          </div>
          
          <div className={`p-6 rounded border ${border}`}>
            <div className={`h-32 ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'} rounded flex items-center justify-center mb-4 overflow-hidden`}>
              <div className={`w-24 h-16 ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'} rounded hover-zoom cursor-pointer`} />
            </div>
            <p className={`${text} font-serif text-lg`}>Hover Zoom</p>
            <p className={`${textMuted} text-xs mb-2`}>Images, galleries</p>
            <p className={`${textMuted} font-mono text-xs opacity-50`}>.hover-zoom</p>
          </div>
          
          <div className={`p-6 rounded border ${border}`}>
            <div className={`h-32 ${theme === 'dark' ? 'bg-cream/5' : 'bg-charcoal/5'} rounded flex items-center justify-center mb-4`}>
              <div className={`w-24 h-16 ${theme === 'dark' ? 'bg-cream' : 'bg-charcoal'} rounded press-effect cursor-pointer flex items-center justify-center`}>
                <span className={theme === 'dark' ? 'text-charcoal' : 'text-cream'}>Click</span>
              </div>
            </div>
            <p className={`${text} font-serif text-lg`}>Press Effect</p>
            <p className={`${textMuted} text-xs mb-2`}>Buttons, CTAs</p>
            <p className={`${textMuted} font-mono text-xs opacity-50`}>.press-effect</p>
          </div>
        </div>
      </section>
      
      {/* Stagger Delays */}
      <section className={`px-8 lg:px-16 py-16`}>
        <p className={`${textMuted} text-xs font-mono uppercase tracking-[0.2em] mb-12`}>
          Stagger Delays
        </p>
        
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i}
              className={`w-12 h-12 ${theme === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20'} rounded animate-fade-up`}
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
        
        <div className={`font-mono text-xs ${textMuted}`}>
          <p>.stagger-1 → 0.05s</p>
          <p>.stagger-2 → 0.10s</p>
          <p>.stagger-3 → 0.15s</p>
          <p>... increment by 50ms</p>
        </div>
      </section>
    </main>
  )
}
