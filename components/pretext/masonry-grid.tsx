'use client'

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { prepare, layout, waitForFonts, createFontString } from '@/lib/pretext'

interface MasonryItem {
  id: string
  content: ReactNode
  text?: string // Text content for height calculation
}

interface MasonryGridProps {
  items: MasonryItem[]
  columns?: number
  gap?: number
  className?: string
  baseHeight?: number // Base height for non-text content (images, etc)
  renderItem: (item: MasonryItem, calculatedHeight: number) => ReactNode
}

interface ItemPosition {
  id: string
  x: number
  y: number
  height: number
}

export function PretextMasonryGrid({ 
  items, 
  columns = 3, 
  gap = 24,
  className,
  baseHeight = 200,
  renderItem
}: MasonryGridProps) {
  const [positions, setPositions] = useState<ItemPosition[]>([])
  const [containerHeight, setContainerHeight] = useState(0)
  const [columnWidth, setColumnWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontsReady, setFontsReady] = useState(false)

  const calculateLayout = useCallback(async () => {
    await waitForFonts()
    setFontsReady(true)
    
    if (!containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const colWidth = (containerWidth - gap * (columns - 1)) / columns
    setColumnWidth(colWidth)

    const font = createFontString(14, 'Inter', 400)
    const lineHeight = 22

    // Track the bottom of each column
    const columnBottoms = new Array(columns).fill(0)
    const newPositions: ItemPosition[] = []

    for (const item of items) {
      // Find the shortest column
      const shortestCol = columnBottoms.indexOf(Math.min(...columnBottoms))
      
      // Calculate item height using Pretext if there's text
      let itemHeight = baseHeight
      if (item.text) {
        const prepared = prepare(item.text, font)
        const result = layout(prepared, colWidth - 32, lineHeight) // 32px for padding
        itemHeight = baseHeight + result.height + 48 // base + text + padding
      }

      newPositions.push({
        id: item.id,
        x: shortestCol * (colWidth + gap),
        y: columnBottoms[shortestCol],
        height: itemHeight,
      })

      columnBottoms[shortestCol] += itemHeight + gap
    }

    setPositions(newPositions)
    setContainerHeight(Math.max(...columnBottoms) - gap)
  }, [items, columns, gap, baseHeight])

  useEffect(() => {
    calculateLayout()

    const handleResize = () => {
      calculateLayout()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateLayout])

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        position: 'relative',
        height: containerHeight,
        opacity: fontsReady ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {positions.map((pos) => {
        const item = items.find(i => i.id === pos.id)
        if (!item) return null

        return (
          <div
            key={pos.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: columnWidth,
              height: pos.height,
            }}
          >
            {renderItem(item, pos.height)}
          </div>
        )
      })}
    </div>
  )
}

// Simpler version for equal-width items where only height varies
interface SimpleMasonryProps {
  children: ReactNode[]
  columns?: number
  gap?: number
  className?: string
}

export function SimpleMasonry({ 
  children, 
  columns = 3, 
  gap = 24,
  className 
}: SimpleMasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnAssignments, setColumnAssignments] = useState<number[]>([])

  useEffect(() => {
    // Simple round-robin assignment for now
    // In production, would measure and assign to shortest column
    const assignments = children.map((_, i) => i % columns)
    setColumnAssignments(assignments)
  }, [children, columns])

  const columnChildren: ReactNode[][] = Array.from({ length: columns }, () => [])
  children.forEach((child, i) => {
    const col = columnAssignments[i] ?? i % columns
    columnChildren[col].push(
      <div key={i} style={{ marginBottom: gap }}>
        {child}
      </div>
    )
  })

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ 
        display: 'flex',
        gap,
      }}
    >
      {columnChildren.map((colChildren, i) => (
        <div key={i} style={{ flex: 1 }}>
          {colChildren}
        </div>
      ))}
    </div>
  )
}
