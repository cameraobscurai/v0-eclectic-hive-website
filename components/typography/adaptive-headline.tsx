'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useContainerWidth, useFontsReady } from '@/hooks/use-pretext'
import { findAdaptiveFontSize, FONTS } from '@/lib/pretext'

interface AdaptiveHeadlineProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  className?: string
  minSize?: number
  maxSize?: number
  lineHeightRatio?: number
  weight?: number
  italic?: boolean
  fontFamily?: keyof typeof FONTS
  maxLines?: number
  animateIn?: boolean
  animationDelay?: number
}

/**
 * Headline that automatically sizes to fit its container
 * without breaking words mid-word.
 * 
 * Uses Pretext for accurate text measurement without DOM reflow.
 */
export function AdaptiveHeadline({
  children,
  as: Component = 'h1',
  className,
  minSize = 24,
  maxSize = 200,
  lineHeightRatio = 0.95,
  weight = 400,
  italic = false,
  fontFamily = 'serif',
  maxLines = 3,
  animateIn = false,
  animationDelay = 0,
}: AdaptiveHeadlineProps) {
  const [containerRef, containerWidth] = useContainerWidth()
  const [fontSize, setFontSize] = useState(minSize)
  const [ready, setReady] = useState(false)
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!fontsReady || containerWidth <= 0 || !children) return

    const calculate = async () => {
      const result = await findAdaptiveFontSize(
        children,
        fontFamily,
        containerWidth,
        16 * lineHeightRatio,
        minSize,
        maxSize,
        weight,
        italic ? 'italic' : 'normal'
      )

      // Ensure we don't exceed maxLines
      if (result.lineCount <= maxLines) {
        setFontSize(result.fontSize)
      } else {
        // Binary search for size that fits maxLines
        let lo = minSize
        let hi = result.fontSize
        let bestSize = minSize

        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2)
          const testResult = await findAdaptiveFontSize(
            children,
            fontFamily,
            containerWidth,
            16 * lineHeightRatio,
            mid,
            mid,
            weight,
            italic ? 'italic' : 'normal'
          )

          if (testResult.lineCount <= maxLines) {
            bestSize = mid
            lo = mid + 1
          } else {
            hi = mid - 1
          }
        }

        setFontSize(bestSize)
      }

      setReady(true)
    }

    calculate()
  }, [children, fontFamily, containerWidth, lineHeightRatio, minSize, maxSize, weight, italic, maxLines, fontsReady])

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className="w-full">
      <Component
        className={cn(
          'font-serif tracking-tight transition-all duration-700',
          italic && 'italic',
          animateIn && !ready && 'opacity-0 translate-y-4',
          animateIn && ready && 'opacity-100 translate-y-0',
          className
        )}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: lineHeightRatio,
          transitionDelay: animateIn ? `${animationDelay}ms` : undefined,
        }}
      >
        {children}
      </Component>
    </div>
  )
}
