'use client'

import { forwardRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * BlendText - Auto-inverting text that adapts to any background
 * 
 * Uses CSS mix-blend-difference to automatically show light text on dark backgrounds
 * and dark text on light backgrounds. Perfect for:
 * - Fixed/sticky headers that scroll over varying sections
 * - Overlay text on images
 * - Text that spans multiple background colors
 * 
 * Note: For best results, use solid colors (cream/charcoal) rather than transparent.
 * The blend effect works by inverting colors, so cream (#f5f2ed) over charcoal (#2a2a2a)
 * becomes a contrasting light color, and vice versa.
 */

type BlendMode = 'difference' | 'exclusion' | 'multiply' | 'screen' | 'overlay'

interface BlendTextProps {
  children: ReactNode
  as?: ElementType
  className?: string
  blend?: BlendMode
  /** When true, text is always cream color (use over known dark backgrounds) */
  forceLight?: boolean
  /** When true, text is always charcoal color (use over known light backgrounds) */
  forceDark?: boolean
}

export const BlendText = forwardRef<HTMLElement, BlendTextProps>(
  ({ children, as: Component = 'span', className, blend = 'difference', forceLight, forceDark, ...props }, ref) => {
    // If forcing a color, don't use blend mode
    const useBlend = !forceLight && !forceDark
    
    return (
      <Component
        ref={ref}
        className={cn(
          // Base text color is cream - blend will invert it over light backgrounds
          forceLight ? 'text-cream' : forceDark ? 'text-charcoal' : 'text-cream',
          // Apply blend mode
          useBlend && blend === 'difference' && 'mix-blend-difference',
          useBlend && blend === 'exclusion' && 'mix-blend-exclusion',
          useBlend && blend === 'multiply' && 'mix-blend-multiply',
          useBlend && blend === 'screen' && 'mix-blend-screen',
          useBlend && blend === 'overlay' && 'mix-blend-overlay',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

BlendText.displayName = 'BlendText'

/**
 * BlendHeadline - Auto-inverting display text for hero sections
 */
export function BlendHeadline({ 
  children, 
  className,
  blend = 'difference',
}: { 
  children: ReactNode
  className?: string
  blend?: BlendMode
}) {
  return (
    <h1 
      className={cn(
        'font-display text-cream tracking-[0.1em] font-light uppercase',
        blend === 'difference' && 'mix-blend-difference',
        blend === 'exclusion' && 'mix-blend-exclusion',
        className
      )}
    >
      {children}
    </h1>
  )
}

/**
 * BlendContainer - Wrapper that applies blend mode to all children
 * Useful for sections of UI that should all invert together
 */
export function BlendContainer({ 
  children, 
  className,
  blend = 'difference',
  active = true,
}: { 
  children: ReactNode
  className?: string
  blend?: BlendMode
  /** Toggle blend mode on/off (useful for scroll-based activation) */
  active?: boolean
}) {
  return (
    <div 
      className={cn(
        active && blend === 'difference' && 'mix-blend-difference',
        active && blend === 'exclusion' && 'mix-blend-exclusion',
        className
      )}
    >
      {children}
    </div>
  )
}
