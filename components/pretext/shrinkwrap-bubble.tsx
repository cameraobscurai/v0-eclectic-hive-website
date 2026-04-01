'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { prepare, layout, findShrinkwrapWidth, waitForFonts, createFontString } from '@/lib/pretext'

interface ShrinkwrapBubbleProps {
  text: string
  maxWidth?: number
  className?: string
  variant?: 'default' | 'dark' | 'accent'
  as?: 'blockquote' | 'div' | 'p'
}

export function ShrinkwrapBubble({ 
  text, 
  maxWidth = 400,
  className,
  variant = 'default',
  as: Component = 'blockquote'
}: ShrinkwrapBubbleProps) {
  const [optimalWidth, setOptimalWidth] = useState<number | null>(null)
  const [fontsReady, setFontsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function calculateWidth() {
      await waitForFonts()
      setFontsReady(true)
      
      const font = createFontString(18, 'Playfair Display', 400, 'italic')
      const lineHeight = 28
      
      const prepared = prepare(text, font)
      const shrinkWidth = findShrinkwrapWidth(prepared, maxWidth, lineHeight)
      
      // Add padding (px-8 = 32px each side)
      setOptimalWidth(shrinkWidth + 64)
    }
    
    calculateWidth()
  }, [text, maxWidth])

  const variantStyles = {
    default: 'bg-secondary text-foreground',
    dark: 'bg-charcoal text-cream',
    accent: 'bg-terracotta/10 text-foreground border-l-2 border-terracotta',
  }

  return (
    <div ref={containerRef} className="flex justify-center">
      <Component
        className={cn(
          'px-8 py-6 font-serif text-lg italic leading-relaxed transition-all duration-700',
          variantStyles[variant],
          fontsReady ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{ 
          width: optimalWidth || 'auto',
          maxWidth: maxWidth + 64,
        }}
      >
        {text}
      </Component>
    </div>
  )
}

// Testimonial variant with attribution
interface TestimonialBubbleProps extends ShrinkwrapBubbleProps {
  author: string
  role?: string
}

export function TestimonialBubble({ 
  text, 
  author,
  role,
  maxWidth = 450,
  className,
  variant = 'default'
}: TestimonialBubbleProps) {
  const [optimalWidth, setOptimalWidth] = useState<number | null>(null)
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    async function calculateWidth() {
      await waitForFonts()
      setFontsReady(true)
      
      const font = createFontString(18, 'Playfair Display', 400, 'italic')
      const lineHeight = 28
      
      const prepared = prepare(text, font)
      const shrinkWidth = findShrinkwrapWidth(prepared, maxWidth, lineHeight)
      
      setOptimalWidth(shrinkWidth + 64)
    }
    
    calculateWidth()
  }, [text, maxWidth])

  const variantStyles = {
    default: 'bg-secondary',
    dark: 'bg-charcoal text-cream',
    accent: 'bg-terracotta/5 border-l-2 border-terracotta',
  }

  return (
    <figure 
      className={cn(
        'transition-all duration-700',
        fontsReady ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ 
        width: optimalWidth || 'auto',
        maxWidth: maxWidth + 64,
      }}
    >
      <blockquote
        className={cn(
          'px-8 py-6 font-serif text-lg italic leading-relaxed',
          variantStyles[variant]
        )}
      >
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="mt-4 px-8">
        <span className="text-sm font-medium">{author}</span>
        {role && (
          <span className="text-sm text-muted-foreground"> — {role}</span>
        )}
      </figcaption>
    </figure>
  )
}
