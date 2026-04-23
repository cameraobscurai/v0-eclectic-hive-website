'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showTagline?: boolean
  variant?: 'light' | 'dark'
}

// Logo mark - circular icon with horizontal bar (from brand guide)
export function LogoMark({ className, variant = 'dark' }: Omit<LogoProps, 'showTagline'>) {
  const color = variant === 'dark' ? 'var(--charcoal)' : 'var(--cream)'
  
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      className={cn('w-10 h-10', className)}
      aria-label="ECLECTIC HIVE logo mark"
    >
      {/* Outer circle */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        stroke={color} 
        strokeWidth="1.5" 
        fill="none"
      />
      {/* Horizontal bar */}
      <line 
        x1="8" 
        y1="24" 
        x2="40" 
        y2="24" 
        stroke={color} 
        strokeWidth="1.5"
      />
    </svg>
  )
}

// Full wordmark with optional tagline (from brand guide)
export function Logo({ className, showTagline = false, variant = 'dark' }: LogoProps) {
  const color = variant === 'dark' ? 'text-charcoal' : 'text-cream'
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Wordmark - wide tracked uppercase */}
      <span 
        className={cn(
          'font-display text-lg tracking-[0.35em] uppercase font-light',
          color
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ECLECTIC HIVE
      </span>
      
      {/* Tagline with horizontal rules */}
      {showTagline && (
        <div className={cn('flex items-center gap-3 mt-1', color)}>
          <span className="w-6 h-px bg-current" />
          <span 
            className="text-xs tracking-[0.2em] lowercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            design + production
          </span>
          <span className="w-6 h-px bg-current" />
        </div>
      )}
    </div>
  )
}

// Combined logo mark + wordmark
export function LogoFull({ className, variant = 'dark' }: Omit<LogoProps, 'showTagline'>) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <LogoMark variant={variant} />
      <Logo variant={variant} showTagline />
    </div>
  )
}

// Navigation logo - simplified for header (editorial serif, italic)
export function NavLogo({ className, variant = 'dark' }: Omit<LogoProps, 'showTagline'>) {
  const color = variant === 'dark' ? 'text-charcoal' : 'text-cream'
  
  return (
    <span 
      className={cn(
        'font-display text-xl tracking-tight font-light italic',
        color,
        className
      )}
    >
      ECLECTIC HIVE
    </span>
  )
}
