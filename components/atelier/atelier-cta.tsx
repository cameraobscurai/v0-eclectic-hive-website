'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

// Dark-themed placeholder frame
function DarkImageFrame({ 
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
        'relative bg-cream/[0.03] border border-cream/10 overflow-hidden',
        className
      )}
      style={{ aspectRatio }}
    >
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-cream/15" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-cream/15" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-cream/15" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-cream/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-6 h-px bg-cream/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-cream/10" />
        </div>
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-cream/30 font-mono">{label}</span>
        </div>
      )}
    </div>
  )
}

export function AtelierCTA() {
  return (
    <section className="bg-charcoal text-cream">
      <div className="section-padding py-24 lg:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: CTA content */}
          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-brand text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[0.08em] text-cream" style={{ fontWeight: 400 }}>
              Start a conversation.
            </h2>
            
            <Link 
              href="/contact"
              className="inline-flex items-center gap-4 mt-8 text-sm uppercase tracking-[0.15em] text-cream/70 hover:text-cream transition-colors group"
            >
              <span>Get in touch</span>
              <span className="w-8 h-px bg-cream/40 group-hover:w-12 transition-all duration-300" />
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          
          {/* Right: Featured image placeholder */}
          <div className="col-span-12 lg:col-span-7">
            <DarkImageFrame 
              aspectRatio="16/9" 
              label="Featured Project"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
