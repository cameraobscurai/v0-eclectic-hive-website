'use client'

import React, {
  useEffect, useRef, useState,
  useImperativeHandle, forwardRef, useMemo, useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ClusteredProduct } from '@/lib/cluster-layout'

// Unified grid constants - tight grid, all products visible
const CARD_SIZE = 160
const CARD_GAP = 16
const GRID_COLS = 8     // Fixed columns for dense grid
const CANVAS_PAD = 40
const BOUNDS_MARGIN = 150

// ─── Canvas Card ──────────────────────────────────────────────────────────────

interface CanvasCardProps {
  product: ClusteredProduct
  imageUrl: string
  onClick: () => void
  index: number
  onImageError: (id: string, url: string) => void
}

function CanvasCard({ product, imageUrl, onClick, index, onImageError }: CanvasCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (error) return null

  return (
    <div 
      style={{ width: CARD_SIZE, height: CARD_SIZE, flexShrink: 0 }}
      className="relative"
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full h-full cursor-pointer text-left focus:outline-none"
        style={{ 
          display: 'block',
          // No borders, no backgrounds - floating object illusion
          background: 'transparent',
        }}
      >
        {/* Image container - no visible bounds */}
        <div className="absolute inset-0 p-2">
          {!loaded && (
            <div className="absolute inset-2 rounded-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-charcoal/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={product.name}
            className={cn(
              'w-full h-full object-contain transition-all duration-500',
              loaded ? 'opacity-100' : 'opacity-0',
              // Subtle scale on hover for tactile feel
              isHovered ? 'scale-105' : 'scale-100',
            )}
            loading={index < 16 ? 'eager' : 'lazy'}
            decoding={index < 8 ? 'sync' : 'async'}
            fetchPriority={index < 8 ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); onImageError(product.id, imageUrl) }}
            draggable={false}
            style={{
              // Crisp rendering
              imageRendering: 'auto',
              // Subtle drop shadow for floating effect
              filter: isHovered 
                ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' 
                : 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))',
              transition: 'filter 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Progressive disclosure - label only on hover */}
        <div
          className="absolute inset-x-0 -bottom-1 flex justify-center pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <div className="bg-charcoal/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <p className="text-[9px] tracking-[0.12em] text-cream uppercase font-medium whitespace-nowrap">
              {product.name}
            </p>
          </div>
        </div>
      </button>
    </div>
  )
}

// ─── Category Section Label ───────────────────────────────────────────────────

function CategoryLabel({ name, count }: { name: string; count: number }) {
  return (
    <div 
      className="col-span-full flex items-center gap-3 py-2"
      data-cluster={name}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 font-medium">
        {name}
      </span>
      <span className="text-[9px] text-charcoal/30">
        {count}
      </span>
      <div className="flex-1 h-px bg-charcoal/[0.06]" />
    </div>
  )
}

// ─── Canvas Grid (Transform-based free panning) ───────────────────────────────

export interface CanvasGridHandle {
  scrollToCluster: (subCategory: string) => void
  resetScroll: () => void
}

interface CanvasGridProps {
  products: ClusteredProduct[]
  activeSubCategory: string
  sortOrder: string[]
  getImageUrl: (p: ClusteredProduct) => string
  onCardClick: (p: ClusteredProduct) => void
  onImageError: (id: string, url: string) => void
}

export const CanvasGrid = forwardRef<CanvasGridHandle, CanvasGridProps>(function CanvasGrid(
  { products, activeSubCategory, sortOrder, getImageUrl, onCardClick, onImageError },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Transform-based pan state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTime = useRef(0)
  const inertiaRaf = useRef<number>(0)

  // Group products by sub-category while maintaining sort order
  const groupedProducts = useMemo(() => {
    const groups: { category: string; products: ClusteredProduct[] }[] = []
    const categoryMap = new Map<string, ClusteredProduct[]>()
    
    // Group products
    products.forEach(p => {
      const cat = p._subCategory || p.sub_category || 'Other'
      if (!categoryMap.has(cat)) categoryMap.set(cat, [])
      categoryMap.get(cat)!.push(p)
    })
    
    // Sort categories by sortOrder
    const orderedCategories = sortOrder.length > 0 
      ? sortOrder.filter(c => categoryMap.has(c))
      : Array.from(categoryMap.keys())
    
    // Add any categories not in sortOrder
    categoryMap.forEach((_, cat) => {
      if (!orderedCategories.includes(cat)) orderedCategories.push(cat)
    })
    
    orderedCategories.forEach(cat => {
      const prods = categoryMap.get(cat)
      if (prods && prods.length > 0) {
        groups.push({ category: cat, products: prods })
      }
    })
    
    return groups
  }, [products, sortOrder])

  // Calculate content dimensions for bounds
  const contentSize = useMemo(() => {
    if (products.length === 0) return { width: 0, height: 0 }
    
    // Grid width
    const gridWidth = (GRID_COLS * CARD_SIZE) + ((GRID_COLS - 1) * CARD_GAP)
    
    // Count total rows needed (products + category labels)
    let totalItems = 0
    groupedProducts.forEach(g => {
      totalItems += 1 // category label takes a row
      totalItems += Math.ceil(g.products.length / GRID_COLS) * GRID_COLS // products
    })
    const totalRows = Math.ceil(totalItems / GRID_COLS) + groupedProducts.length
    const gridHeight = (totalRows * (CARD_SIZE + CARD_GAP))
    
    return {
      width: gridWidth + (CANVAS_PAD * 2),
      height: gridHeight + (CANVAS_PAD * 2),
    }
  }, [products, groupedProducts])

  // Constrain position within bounds
  const constrainPosition = useCallback((x: number, y: number) => {
    const container = containerRef.current
    if (!container) return { x, y }
    
    const containerW = container.clientWidth
    const containerH = container.clientHeight
    
    // Calculate bounds - content should stay mostly visible
    const minX = -(contentSize.width - containerW + BOUNDS_MARGIN)
    const maxX = BOUNDS_MARGIN
    const minY = -(contentSize.height - containerH + BOUNDS_MARGIN)
    const maxY = BOUNDS_MARGIN
    
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    }
  }, [contentSize])

  // Inertia animation with bounds
  const startInertia = useCallback(() => {
    cancelAnimationFrame(inertiaRaf.current)

    // Cap velocity
    const maxV = 40
    velocity.current.x = Math.max(-maxV, Math.min(maxV, velocity.current.x))
    velocity.current.y = Math.max(-maxV, Math.min(maxV, velocity.current.y))

    function tick() {
      velocity.current.x *= 0.94
      velocity.current.y *= 0.94

      if (Math.abs(velocity.current.x) < 0.2 && Math.abs(velocity.current.y) < 0.2) {
        velocity.current = { x: 0, y: 0 }
        return
      }

      setPosition(prev => {
        const newPos = constrainPosition(
          prev.x + velocity.current.x,
          prev.y + velocity.current.y,
        )
        // If we hit a bound, kill velocity in that direction
        if (newPos.x !== prev.x + velocity.current.x) velocity.current.x = 0
        if (newPos.y !== prev.y + velocity.current.y) velocity.current.y = 0
        return newPos
      })

      inertiaRaf.current = requestAnimationFrame(tick)
    }

    inertiaRaf.current = requestAnimationFrame(tick)
  }, [constrainPosition])

  // Pointer handlers for drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    // Allow clicks on buttons
    if ((e.target as HTMLElement).closest('button')) return

    cancelAnimationFrame(inertiaRaf.current)
    isDragging.current = true
    velocity.current = { x: 0, y: 0 }
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    }
    lastPos.current = { x: e.clientX, y: e.clientY }
    lastTime.current = performance.now()
    containerRef.current?.setPointerCapture(e.pointerId)
  }, [position])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    const newPos = constrainPosition(
      dragStart.current.posX + dx,
      dragStart.current.posY + dy,
    )
    setPosition(newPos)

    // Calculate velocity for inertia
    const now = performance.now()
    const dt = Math.max(1, now - lastTime.current)
    velocity.current = {
      x: ((e.clientX - lastPos.current.x) / dt) * 16,
      y: ((e.clientY - lastPos.current.y) / dt) * 16,
    }
    lastPos.current = { x: e.clientX, y: e.clientY }
    lastTime.current = now
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    containerRef.current?.releasePointerCapture(e.pointerId)
    startInertia()
  }, [startInertia])

  // Wheel handler for trackpad/mouse scroll
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    cancelAnimationFrame(inertiaRaf.current)

    // Trackpad gestures have smaller deltas, mouse wheel has larger
    const multiplier = e.ctrlKey ? 0.5 : 1.2

    setPosition(prev => constrainPosition(
      prev.x - e.deltaX * multiplier,
      prev.y - e.deltaY * multiplier,
    ))
  }, [constrainPosition])

  // Pause global Lenis
  useEffect(() => {
    const globalLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis
    globalLenis?.stop()
    setMounted(true)
    return () => {
      cancelAnimationFrame(inertiaRaf.current)
      globalLenis?.start()
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (document.querySelector('[role="dialog"]')) return

      const amount = 120

      switch (e.key) {
        case 'ArrowRight':
          setPosition(prev => constrainPosition(prev.x - amount, prev.y))
          e.preventDefault()
          break
        case 'ArrowLeft':
          setPosition(prev => constrainPosition(prev.x + amount, prev.y))
          e.preventDefault()
          break
        case 'ArrowDown':
          setPosition(prev => constrainPosition(prev.x, prev.y - amount))
          e.preventDefault()
          break
        case 'ArrowUp':
          setPosition(prev => constrainPosition(prev.x, prev.y + amount))
          e.preventDefault()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [constrainPosition])

  // Imperative handle
  useImperativeHandle(ref, () => ({
    scrollToCluster(subCategory: string) {
      cancelAnimationFrame(inertiaRaf.current)
      velocity.current = { x: 0, y: 0 }

      const el = contentRef.current?.querySelector(`[data-cluster="${subCategory}"]`) as HTMLElement
      if (!el || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()

      // Calculate where the element currently is relative to container top
      const targetX = position.x // Keep horizontal position
      const targetY = -(elRect.top - containerRect.top - 20 - position.y)

      // Animate to position
      const startX = position.x
      const startY = position.y
      const startTime = performance.now()
      const duration = 500

      function animate() {
        const elapsed = performance.now() - startTime
        const progress = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - progress, 3)

        setPosition(constrainPosition(
          startX + (targetX - startX) * eased,
          startY + (targetY - startY) * eased,
        ))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    },
    resetScroll() {
      cancelAnimationFrame(inertiaRaf.current)
      velocity.current = { x: 0, y: 0 }

      const startX = position.x
      const startY = position.y
      const startTime = performance.now()
      const duration = 400

      function animate() {
        const elapsed = performance.now() - startTime
        const progress = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - progress, 3)

        setPosition({
          x: startX * (1 - eased),
          y: startY * (1 - eased),
        })

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    },
  }), [position, constrainPosition])

  // Determine grid width
  const gridWidth = (GRID_COLS * CARD_SIZE) + ((GRID_COLS - 1) * CARD_GAP)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden',
        isDragging.current ? 'cursor-grabbing' : 'cursor-grab'
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      style={{ 
        touchAction: 'none',
        background: '#faf9f7',
      }}
    >
      {/* Transformed content - single unified grid */}
      <div
        ref={contentRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          willChange: 'transform',
          padding: CANVAS_PAD,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={products.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_COLS}, ${CARD_SIZE}px)`,
              gap: CARD_GAP,
              width: gridWidth,
            }}
          >
            {groupedProducts.map((group, groupIdx) => {
              const isHighlighted = activeSubCategory === 'All' || activeSubCategory === group.category
              return (
                <React.Fragment key={group.category}>
                  {/* Category label spans full width */}
                  <CategoryLabel name={group.category} count={group.products.length} />
                  
                  {/* Products in this category */}
                  {group.products.map((product, i) => (
                    <div 
                      key={product.id}
                      style={{
                        opacity: isHighlighted ? 1 : 0.3,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <CanvasCard
                        product={product}
                        imageUrl={getImageUrl(product)}
                        onClick={() => onCardClick(product)}
                        index={groupIdx * 100 + i}
                        onImageError={onImageError}
                      />
                    </div>
                  ))}
                </React.Fragment>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle edge fade */}
      <div className="absolute inset-x-0 top-0 h-8 pointer-events-none bg-gradient-to-b from-[#faf9f7] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none bg-gradient-to-t from-[#faf9f7] to-transparent" />

      {/* Navigation hint */}
      {mounted && !isDragging.current && position.x === 0 && position.y === 0 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/25">
            Scroll or drag to explore
          </p>
        </motion.div>
      )}
    </div>
  )
})
