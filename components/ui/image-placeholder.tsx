'use client'

import { cn } from '@/lib/utils'

interface ImagePlaceholderProps {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide' | 'hero'
  className?: string
  label?: string
  variant?: 'default' | 'dark' | 'light'
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/10]',
  hero: 'aspect-[21/9]',
}

export function ImagePlaceholder({ 
  aspectRatio = 'landscape', 
  className,
  label,
  variant = 'default'
}: ImagePlaceholderProps) {
  const bgClass = variant === 'dark' 
    ? 'bg-charcoal' 
    : variant === 'light' 
    ? 'bg-cream' 
    : 'bg-secondary'

  const textClass = variant === 'dark'
    ? 'text-cream/20'
    : 'text-charcoal/20'

  return (
    <div 
      className={cn(
        aspectRatioClasses[aspectRatio],
        bgClass,
        'relative overflow-hidden flex items-center justify-center',
        className
      )}
    >
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(${variant === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${variant === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Subtle diagonal lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            ${variant === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 80px,
            ${variant === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 81px
          )`,
        }}
      />
      
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Minimal logo mark */}
        <div className={cn('w-12 h-12 border rounded-full flex items-center justify-center', variant === 'dark' ? 'border-cream/10' : 'border-charcoal/10')}>
          <div className={cn('w-2 h-2 rounded-full', variant === 'dark' ? 'bg-cream/20' : 'bg-charcoal/20')} />
        </div>
        
        {label && (
          <span className={cn('text-xs uppercase tracking-[0.2em]', textClass)}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// Hero-specific placeholder with more visual interest
export function HeroPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 bg-charcoal overflow-hidden pointer-events-none', className)}>
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal" />
      
      {/* Subtle radial gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(166, 124, 82, 0.15) 0%, transparent 50%)',
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />
    </div>
  )
}
