'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useFontsReady } from '@/hooks/use-pretext'
import { prepareText, layoutText, findShrinkwrapWidth, createFontString } from '@/lib/pretext'

interface ShrinkwrapQuoteProps {
  children: string
  className?: string
  maxWidth?: number
  fontSize?: number
  lineHeight?: number
  attribution?: string
  align?: 'left' | 'center' | 'right'
  accentColor?: string
}

/**
 * Pull quote that shrinks to the tightest width possible
 * while maintaining its natural line count.
 * 
 * Uses Pretext binary search to find minimum width.
 */
export function ShrinkwrapQuote({
  children,
  className,
  maxWidth = 600,
  fontSize = 24,
  lineHeight = 36,
  attribution,
  align = 'center',
  accentColor = 'var(--terracotta)',
}: ShrinkwrapQuoteProps) {
  const [shrinkWidth, setShrinkWidth] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const fontsReady = useFontsReady()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fontsReady || !children) return

    const calculate = async () => {
      const font = createFontString(fontSize, 'serif', 400, 'italic')
      const prepared = await prepareText(children, font)
      
      // Find the tightest width that maintains line count
      const width = findShrinkwrapWidth(prepared, maxWidth, lineHeight)
      
      // Add a small padding for visual comfort
      setShrinkWidth(Math.ceil(width * 1.02))
      setReady(true)
    }

    calculate()
  }, [children, maxWidth, fontSize, lineHeight, fontsReady])

  const alignmentClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[align]

  return (
    <div
      ref={ref}
      className={cn(
        'relative transition-all duration-700',
        alignmentClass,
        !ready && 'opacity-0 translate-y-4',
        ready && 'opacity-100 translate-y-0',
        className
      )}
      style={{
        maxWidth: shrinkWidth ?? maxWidth,
      }}
    >
      {/* Decorative accent */}
      <div
        className="absolute -left-6 top-0 w-1 h-full rounded-full opacity-60"
        style={{ backgroundColor: accentColor }}
      />
      
      {/* Quote mark */}
      <span
        className="absolute -top-8 -left-4 font-serif text-6xl opacity-20 leading-none select-none"
        style={{ color: accentColor }}
        aria-hidden="true"
      >
        &ldquo;
      </span>
      
      <blockquote
        className="font-serif italic text-foreground/90 relative"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}px`,
        }}
      >
        {children}
      </blockquote>
      
      {attribution && (
        <cite className="block mt-6 text-sm text-muted-foreground not-italic uppercase tracking-[0.15em]">
          {attribution}
        </cite>
      )}
    </div>
  )
}
