'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { 
  prepareWithSegments, 
  layoutNextLine, 
  waitForFonts, 
  createFontString,
  type Cursor,
  type PreparedTextWithSegments
} from '@/lib/pretext'

interface EditorialFlowProps {
  text: string
  className?: string
  columns?: 1 | 2
  lineHeight?: number
  fontSize?: number
  obstacleLeft?: { width: number; height: number } | null
  obstacleRight?: { width: number; height: number } | null
}

export function EditorialFlow({ 
  text, 
  className,
  columns = 1,
  lineHeight = 28,
  fontSize = 16,
  obstacleLeft = null,
  obstacleRight = null,
}: EditorialFlowProps) {
  const [lines, setLines] = useState<{ text: string; x: number; y: number; width: number }[]>([])
  const [fontsReady, setFontsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function layoutText() {
      await waitForFonts()
      setFontsReady(true)
      
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const columnGap = 48
      const columnWidth = columns === 2 
        ? (containerWidth - columnGap) / 2 
        : containerWidth

      const font = createFontString(fontSize, 'Inter', 400)
      const prepared = prepareWithSegments(text, font)

      const layoutLines: { text: string; x: number; y: number; width: number }[] = []
      let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 }
      let y = 0
      let currentColumn = 0

      while (cursor.segmentIndex < prepared.segments.length) {
        // Calculate available width accounting for obstacles
        let availableWidth = columnWidth
        let xOffset = currentColumn * (columnWidth + columnGap)

        // Check if we're in obstacle zone
        if (currentColumn === 0 && obstacleLeft) {
          if (y < obstacleLeft.height) {
            availableWidth = columnWidth - obstacleLeft.width - 16
            xOffset = obstacleLeft.width + 16
          }
        }
        if (currentColumn === 1 && obstacleRight) {
          if (y < obstacleRight.height) {
            availableWidth = columnWidth - obstacleRight.width - 16
          }
        }

        const line = layoutNextLine(prepared, cursor, availableWidth)
        if (!line) break

        layoutLines.push({
          text: line.text,
          x: xOffset,
          y: y,
          width: line.width,
        })

        cursor = line.end
        y += lineHeight

        // Check if we need to switch columns
        if (columns === 2 && y > 400 && currentColumn === 0) {
          currentColumn = 1
          y = 0
        }
      }

      setLines(layoutLines)
    }

    layoutText()
  }, [text, columns, lineHeight, fontSize, obstacleLeft, obstacleRight])

  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        opacity: fontsReady ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className="absolute text-muted-foreground leading-relaxed"
          style={{
            left: line.x,
            top: line.y,
            fontSize,
          }}
        >
          {line.text}
        </span>
      ))}
      {/* Reserve space */}
      <div style={{ height: Math.max(...lines.map(l => l.y + lineHeight), 0) }} />
    </div>
  )
}

// Pull quote that text flows around
interface PullQuoteFlowProps {
  text: string
  quote: string
  quotePosition?: 'left' | 'right'
  className?: string
}

export function PullQuoteFlow({
  text,
  quote,
  quotePosition = 'right',
  className,
}: PullQuoteFlowProps) {
  const [lines, setLines] = useState<{ text: string; x: number; y: number }[]>([])
  const [fontsReady, setFontsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const quoteWidth = 280
  const quoteHeight = 160
  const lineHeight = 26
  const fontSize = 16

  useEffect(() => {
    async function layoutText() {
      await waitForFonts()
      setFontsReady(true)
      
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const font = createFontString(fontSize, 'Inter', 400)
      const prepared = prepareWithSegments(text, font)

      const layoutLines: { text: string; x: number; y: number }[] = []
      let cursor: Cursor = { segmentIndex: 0, graphemeIndex: 0 }
      let y = 0

      while (cursor.segmentIndex < prepared.segments.length) {
        // Calculate available width - narrow when beside quote
        let availableWidth = containerWidth
        let xOffset = 0

        if (y < quoteHeight + 24) {
          if (quotePosition === 'right') {
            availableWidth = containerWidth - quoteWidth - 32
          } else {
            availableWidth = containerWidth - quoteWidth - 32
            xOffset = quoteWidth + 32
          }
        }

        const line = layoutNextLine(prepared, cursor, availableWidth)
        if (!line) break

        layoutLines.push({
          text: line.text,
          x: xOffset,
          y: y,
        })

        cursor = line.end
        y += lineHeight
      }

      setLines(layoutLines)
    }

    layoutText()
  }, [text, quote, quotePosition])

  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        opacity: fontsReady ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Pull quote */}
      <blockquote
        className={cn(
          'absolute bg-secondary p-6 font-serif text-lg italic leading-relaxed',
          quotePosition === 'right' ? 'right-0' : 'left-0'
        )}
        style={{ width: quoteWidth, top: 0 }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Flowed text */}
      {lines.map((line, i) => (
        <span
          key={i}
          className="absolute text-muted-foreground"
          style={{
            left: line.x,
            top: line.y,
            fontSize,
            lineHeight: `${lineHeight}px`,
          }}
        >
          {line.text}
        </span>
      ))}

      {/* Reserve space */}
      <div style={{ height: Math.max(...lines.map(l => l.y + lineHeight), quoteHeight + 48) }} />
    </div>
  )
}
