'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  prepareText,
  prepareTextWithSegments,
  layoutText,
  layoutTextWithLines,
  findShrinkwrapWidth,
  findAdaptiveFontSize,
  preCalculateHeight,
  getLineHeightPx,
  createFontString,
  FONTS,
  type PreparedText,
  type PreparedTextWithSegments,
  type LayoutResult,
  type LayoutWithLinesResult,
} from '@/lib/pretext'

/**
 * Hook to track font loading state.
 * Returns true when all fonts are loaded and ready for measurement.
 */
export function useFontsReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    document.fonts.ready.then(() => setReady(true))
  }, [])

  return ready
}

/**
 * Hook to measure text and get layout dimensions.
 * Re-measures on resize (layout() is cheap).
 */
export function useTextLayout(
  text: string,
  font: string,
  lineHeight: number,
  maxWidth?: number
): LayoutResult | null {
  const [prepared, setPrepared] = useState<PreparedText | null>(null)
  const [result, setResult] = useState<LayoutResult | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fontsReady = useFontsReady()

  // Prepare text once when fonts load (expensive)
  useEffect(() => {
    if (!fontsReady || !text) return

    prepareText(text, font).then(setPrepared)
  }, [text, font, fontsReady])

  // Layout on resize (cheap)
  useEffect(() => {
    if (!prepared) return

    const measure = () => {
      const width = maxWidth ?? containerRef.current?.offsetWidth ?? 300
      setResult(layoutText(prepared, width, lineHeight))
    }

    measure()

    const observer = new ResizeObserver(measure)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [prepared, maxWidth, lineHeight])

  return result
}

/**
 * Hook for shrinkwrap text containers.
 * Finds the minimum width that maintains line count.
 */
export function useShrinkwrap(
  text: string,
  font: string,
  lineHeight: number,
  maxWidth: number,
  targetLineCount?: number
): { width: number; height: number; lineCount: number } | null {
  const [prepared, setPrepared] = useState<PreparedText | null>(null)
  const [result, setResult] = useState<{ width: number; height: number; lineCount: number } | null>(null)
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!fontsReady || !text) return
    prepareText(text, font).then(setPrepared)
  }, [text, font, fontsReady])

  useEffect(() => {
    if (!prepared) return

    const shrinkWidth = findShrinkwrapWidth(prepared, maxWidth, lineHeight, targetLineCount)
    const layout = layoutText(prepared, shrinkWidth, lineHeight)

    setResult({
      width: shrinkWidth,
      height: layout.height,
      lineCount: layout.lineCount,
    })
  }, [prepared, maxWidth, lineHeight, targetLineCount])

  return result
}

/**
 * Hook for adaptive headline sizing.
 * Finds largest font size that doesn't break words mid-word.
 */
export function useAdaptiveHeadline(
  text: string,
  fontFamily: keyof typeof FONTS | string,
  containerWidth: number,
  lineHeightRatio: number = 1.1,
  minSize: number = 24,
  maxSize: number = 200,
  weight: number = 400,
  style: 'normal' | 'italic' = 'normal'
): { fontSize: number; lineCount: number; height: number; ready: boolean } {
  const [result, setResult] = useState({ fontSize: minSize, lineCount: 1, height: minSize * lineHeightRatio, ready: false })
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!fontsReady || !text || containerWidth <= 0) return

    findAdaptiveFontSize(
      text,
      fontFamily,
      containerWidth,
      16 * lineHeightRatio, // Base line height
      minSize,
      maxSize,
      weight,
      style
    ).then((r) => setResult({ ...r, ready: true }))
  }, [text, fontFamily, containerWidth, lineHeightRatio, minSize, maxSize, weight, style, fontsReady])

  return result
}

/**
 * Hook to get individual line data for animations.
 * Use for word-by-word or line-by-line reveals.
 */
export function useTextLines(
  text: string,
  font: string,
  lineHeight: number,
  maxWidth: number
): { lines: LayoutWithLinesResult['lines']; ready: boolean } {
  const [prepared, setPrepared] = useState<PreparedTextWithSegments | null>(null)
  const [result, setResult] = useState<{ lines: LayoutWithLinesResult['lines']; ready: boolean }>({ lines: [], ready: false })
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!fontsReady || !text) return
    prepareTextWithSegments(text, font).then(setPrepared)
  }, [text, font, fontsReady])

  useEffect(() => {
    if (!prepared) return
    const layout = layoutTextWithLines(prepared, maxWidth, lineHeight)
    setResult({ lines: layout.lines, ready: true })
  }, [prepared, maxWidth, lineHeight])

  return result
}

/**
 * Hook for pre-calculating heights of multiple items.
 * Perfect for virtualized lists.
 */
export function useVirtualizedHeights(
  items: { id: string; text: string }[],
  font: string,
  maxWidth: number,
  lineHeight: number
): Map<string, number> {
  const [heights, setHeights] = useState<Map<string, number>>(new Map())
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!fontsReady || items.length === 0) return

    const calculate = async () => {
      const newHeights = new Map<string, number>()

      for (const item of items) {
        const h = await preCalculateHeight(item.text, font, maxWidth, lineHeight)
        newHeights.set(item.id, h)
      }

      setHeights(newHeights)
    }

    calculate()
  }, [items, font, maxWidth, lineHeight, fontsReady])

  return heights
}

/**
 * Hook for container width tracking.
 * Returns ref and current width for Pretext calculations.
 */
export function useContainerWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width)
      }
    })

    observer.observe(element)
    setWidth(element.offsetWidth)

    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

/**
 * Hook for measuring an element's computed line-height in pixels.
 */
export function useLineHeightPx(ref: React.RefObject<HTMLElement>): number {
  const [lineHeight, setLineHeight] = useState(24)

  useEffect(() => {
    if (ref.current) {
      setLineHeight(getLineHeightPx(ref.current))
    }
  }, [ref])

  return lineHeight
}
