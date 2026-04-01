'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { 
  prepareWithSegments, 
  layoutWithLines, 
  waitForFonts, 
  createFontString,
  type Line
} from '@/lib/pretext'

interface LineRevealProps {
  text: string
  className?: string
  fontFamily?: 'serif' | 'sans'
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  staggerDelay?: number
  threshold?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function LineReveal({
  text,
  className,
  fontFamily = 'serif',
  fontSize = 48,
  fontWeight = 400,
  lineHeight = 56,
  staggerDelay = 100,
  threshold = 0.2,
  tag: Tag = 'h2',
}: LineRevealProps) {
  const [lines, setLines] = useState<Line[]>([])
  const [isInView, setIsInView] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate line breaks using Pretext
  useEffect(() => {
    async function calculateLines() {
      await waitForFonts()
      setFontsReady(true)
      
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const family = fontFamily === 'serif' ? 'Playfair Display' : 'Inter'
      const font = createFontString(fontSize, family, fontWeight)
      
      const prepared = prepareWithSegments(text, font)
      const result = layoutWithLines(prepared, containerWidth, lineHeight)
      
      setLines(result.lines)
    }

    calculateLines()

    const handleResize = () => calculateLines()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [text, fontFamily, fontSize, fontWeight, lineHeight])

  // Intersection observer for triggering animation
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  const fontFamilyClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans'

  return (
    <Tag
      ref={containerRef}
      className={cn('relative overflow-hidden', fontFamilyClass, className)}
      style={{ 
        fontSize,
        fontWeight,
        lineHeight: `${lineHeight}px`,
      }}
      aria-label={text}
    >
      {/* Visually hidden full text for accessibility */}
      <span className="sr-only">{text}</span>
      
      {/* Animated lines */}
      {fontsReady && lines.map((line, i) => (
        <span
          key={i}
          className="block overflow-hidden"
          style={{ height: lineHeight }}
        >
          <span
            className={cn(
              'block transition-all duration-700 ease-out',
              isInView 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0'
            )}
            style={{
              transitionDelay: `${i * staggerDelay}ms`,
            }}
            aria-hidden="true"
          >
            {line.text}
          </span>
        </span>
      ))}
      
      {/* Fallback while measuring */}
      {!fontsReady && (
        <span className="opacity-0">{text}</span>
      )}
    </Tag>
  )
}

// Word-by-word reveal using Pretext for accurate breaks
interface WordRevealProps {
  text: string
  className?: string
  fontFamily?: 'serif' | 'sans'
  fontSize?: number
  fontWeight?: number
  staggerDelay?: number
  threshold?: number
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function WordReveal({
  text,
  className,
  fontFamily = 'serif',
  fontSize = 48,
  fontWeight = 400,
  staggerDelay = 50,
  threshold = 0.2,
  tag: Tag = 'h2',
}: WordRevealProps) {
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Split into words
  const words = text.split(/\s+/)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  const fontFamilyClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans'

  return (
    <Tag
      ref={containerRef}
      className={cn('flex flex-wrap', fontFamilyClass, className)}
      style={{ fontSize, fontWeight }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden mr-[0.3em]">
          <span
            className={cn(
              'inline-block transition-all duration-500 ease-out',
              isInView 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0'
            )}
            style={{
              transitionDelay: `${i * staggerDelay}ms`,
            }}
            aria-hidden="true"
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}

// Highlight sweep effect
interface HighlightRevealProps {
  text: string
  className?: string
  highlightColor?: string
  threshold?: number
}

export function HighlightReveal({
  text,
  className,
  highlightColor = 'rgba(195, 126, 99, 0.15)',
  threshold = 0.5,
}: HighlightRevealProps) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <span
      ref={ref}
      className={cn('relative inline', className)}
    >
      <span
        className={cn(
          'absolute inset-0 origin-left transition-transform duration-700 ease-out',
          isInView ? 'scale-x-100' : 'scale-x-0'
        )}
        style={{ backgroundColor: highlightColor }}
        aria-hidden="true"
      />
      <span className="relative">{text}</span>
    </span>
  )
}
