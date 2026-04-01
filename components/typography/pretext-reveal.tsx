'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useFontsReady, useContainerWidth } from '@/hooks/use-pretext'
import { prepareTextWithSegments, layoutTextWithLines, createFontString } from '@/lib/pretext'

interface PretextRevealProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  className?: string
  fontSize?: number
  lineHeight?: number
  fontFamily?: 'serif' | 'sans'
  weight?: number
  italic?: boolean
  staggerDelay?: number // Delay between each line
  initialDelay?: number // Delay before animation starts
  trigger?: boolean // External trigger for animation
  onComplete?: () => void
}

/**
 * Text reveal animation powered by Pretext.
 * Animates line-by-line with accurate line breaks calculated without DOM reflow.
 */
export function PretextReveal({
  children,
  as: Component = 'p',
  className,
  fontSize = 18,
  lineHeight = 28,
  fontFamily = 'sans',
  weight = 400,
  italic = false,
  staggerDelay = 100,
  initialDelay = 0,
  trigger = true,
  onComplete,
}: PretextRevealProps) {
  const [containerRef, containerWidth] = useContainerWidth()
  const [lines, setLines] = useState<string[]>([])
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [ready, setReady] = useState(false)
  const fontsReady = useFontsReady()
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const hasAnimated = useRef(false)

  // Calculate lines using Pretext
  useEffect(() => {
    if (!fontsReady || containerWidth <= 0 || !children) return

    const calculate = async () => {
      const font = createFontString(fontSize, fontFamily, weight, italic ? 'italic' : 'normal')
      const prepared = await prepareTextWithSegments(children, font)
      const layout = layoutTextWithLines(prepared, containerWidth, lineHeight)

      setLines(layout.lines.map(line => line.text))
      setReady(true)
    }

    calculate()
  }, [children, containerWidth, fontSize, lineHeight, fontFamily, weight, italic, fontsReady])

  // Animate lines in
  useEffect(() => {
    if (!ready || !trigger || hasAnimated.current || lines.length === 0) return

    hasAnimated.current = true

    const startAnimation = () => {
      let currentLine = 0

      const animate = () => {
        if (currentLine <= lines.length) {
          setVisibleLines(currentLine)
          currentLine++
          animationRef.current = setTimeout(animate, staggerDelay)
        } else {
          onComplete?.()
        }
      }

      animate()
    }

    const delayTimer = setTimeout(startAnimation, initialDelay)

    return () => {
      clearTimeout(delayTimer)
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [ready, trigger, lines.length, staggerDelay, initialDelay, onComplete])

  // Reset on text change
  useEffect(() => {
    hasAnimated.current = false
    setVisibleLines(0)
  }, [children])

  if (!ready) {
    // Invisible placeholder to prevent layout shift
    return (
      <div ref={containerRef as React.RefObject<HTMLDivElement>} className="w-full">
        <Component
          className={cn('opacity-0', className)}
          style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
        >
          {children}
        </Component>
      </div>
    )
  }

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className="w-full">
      <Component
        className={cn(
          fontFamily === 'serif' ? 'font-serif' : 'font-sans',
          italic && 'italic',
          className
        )}
        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
        aria-label={children}
      >
        {lines.map((line, index) => (
          <span
            key={index}
            className={cn(
              'inline-block transition-all duration-500 ease-out',
              index < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
            style={{
              transitionDelay: `${index * 30}ms`,
            }}
          >
            {line}
            {index < lines.length - 1 && ' '}
          </span>
        ))}
      </Component>
    </div>
  )
}

/**
 * Highlight text that reveals with a background color sweep.
 * Uses Pretext to know exact text dimensions.
 */
interface PretextHighlightProps {
  children: string
  className?: string
  highlightColor?: string
  textColor?: string
  trigger?: boolean
  delay?: number
}

export function PretextHighlight({
  children,
  className,
  highlightColor = 'rgba(180, 120, 90, 0.2)',
  textColor,
  trigger = true,
  delay = 0,
}: PretextHighlightProps) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!trigger || !fontsReady) return

    const timer = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(timer)
  }, [trigger, delay, fontsReady])

  return (
    <span
      ref={ref}
      className={cn('relative inline', className)}
      style={{ color: textColor }}
    >
      <span
        className="absolute inset-0 -mx-1 -my-0.5 transition-transform duration-700 ease-out origin-left"
        style={{
          backgroundColor: highlightColor,
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
        }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </span>
  )
}
