'use client'

import {
  useEffect, useRef, useState,
  useImperativeHandle, forwardRef, useMemo, useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buildClusters, CANVAS_CONSTANTS } from '@/lib/cluster-layout'
import type { ClusteredProduct, Cluster } from '@/lib/cluster-layout'

// Canvas constants - balanced spacing for usability
const CARD_SIZE = 180
const CARD_GAP = 24

const CANVAS_2D = {
  CLUSTER_H_GAP: 80,    // Comfortable horizontal gaps
  CLUSTER_V_GAP: 100,   // Comfortable vertical gaps
  CANVAS_PAD: 60,       // Moderate padding
  COLS_PER_ROW: 3,
  BOUNDS_MARGIN: 200,   // How far past content edge user can pan
}

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

// ─── Cluster Block ────────────────────────────────────────────────────────────

interface ClusterBlockProps {
  cluster: Cluster
  getImageUrl: (p: ClusteredProduct) => string
  onCardClick: (p: ClusteredProduct) => void
  onImageError: (id: string, url: string) => void
  isHighlighted: boolean
  maxRows?: number
}

function ClusterBlock({
  cluster, getImageUrl, onCardClick,
  onImageError, isHighlighted, maxRows = 2,
}: ClusterBlockProps) {
  const cols = Math.ceil(cluster.products.length / maxRows)
  const [isClusterHovered, setIsClusterHovered] = useState(false)

  return (
    <div
      className="relative"
      style={{
        opacity: isHighlighted ? 1 : 0.25,
        transition: 'opacity 0.5s ease',
      }}
      data-cluster={cluster.subCategory}
      onMouseEnter={() => setIsClusterHovered(true)}
      onMouseLeave={() => setIsClusterHovered(false)}
    >
      {/* Minimal cluster label - only visible on hover for clean look */}
      <div 
        className="absolute -top-8 left-0"
        style={{
          opacity: isClusterHovered ? 1 : 0,
          transform: isClusterHovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-charcoal/40 font-medium">
          {cluster.subCategory === 'Other' ? cluster.products[0]?.category : cluster.subCategory}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: `repeat(${maxRows}, ${CARD_SIZE}px)`,
          gridTemplateColumns: `repeat(${cols}, ${CARD_SIZE}px)`,
          gridAutoFlow: 'column',
          gap: CARD_GAP,
        }}
      >
        {cluster.products.map((product, i) => (
          <CanvasCard
            key={product.id}
            product={product}
            imageUrl={getImageUrl(product)}
            onClick={() => onCardClick(product)}
            index={i}
            onImageError={onImageError}
          />
        ))}
      </div>
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

  // Build clusters
  const clusters = useMemo(
    () => buildClusters(products, sortOrder, 600),
    [products, sortOrder],
  )

  // Arrange clusters into rows
  const clusterRows = useMemo(() => {
    const rows: Cluster[][] = []
    for (let i = 0; i < clusters.length; i += CANVAS_2D.COLS_PER_ROW) {
      rows.push(clusters.slice(i, i + CANVAS_2D.COLS_PER_ROW))
    }
    return rows
  }, [clusters])

  // Calculate content dimensions for bounds
  const contentSize = useMemo(() => {
    if (clusters.length === 0) return { width: 0, height: 0 }
    
    // Calculate max width of any row
    let maxRowWidth = 0
    clusterRows.forEach(row => {
      let rowWidth = 0
      row.forEach((cluster, idx) => {
        const cols = Math.ceil(cluster.products.length / 2)
        const clusterWidth = (cols * CARD_SIZE) + ((cols - 1) * CARD_GAP)
        rowWidth += clusterWidth
        if (idx < row.length - 1) rowWidth += CANVAS_2D.CLUSTER_H_GAP
      })
      maxRowWidth = Math.max(maxRowWidth, rowWidth)
    })
    
    // Calculate total height
    const rowHeight = (2 * CARD_SIZE) + CARD_GAP
    const totalHeight = (clusterRows.length * rowHeight) + ((clusterRows.length - 1) * CANVAS_2D.CLUSTER_V_GAP)
    
    return {
      width: maxRowWidth + (CANVAS_2D.CANVAS_PAD * 2),
      height: totalHeight + (CANVAS_2D.CANVAS_PAD * 2),
    }
  }, [clusters, clusterRows])

  // Constrain position within bounds
  const constrainPosition = useCallback((x: number, y: number) => {
    const container = containerRef.current
    if (!container) return { x, y }
    
    const containerW = container.clientWidth
    const containerH = container.clientHeight
    const margin = CANVAS_2D.BOUNDS_MARGIN
    
    // Calculate bounds - content should stay mostly visible
    const minX = -(contentSize.width - containerW + margin)
    const maxX = margin
    const minY = -(contentSize.height - containerH + margin)
    const maxY = margin
    
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

      // Calculate where the element currently is relative to container center
      const targetX = -(elRect.left - containerRect.left - containerRect.width / 2 + elRect.width / 2 - position.x)
      const targetY = -(elRect.top - containerRect.top - containerRect.height / 2 + elRect.height / 2 - position.y)

      // Animate to position
      const startX = position.x
      const startY = position.y
      const startTime = performance.now()
      const duration = 600

      function animate() {
        const elapsed = performance.now() - startTime
        const progress = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic

        setPosition({
          x: startX + (targetX - startX) * eased,
          y: startY + (targetY - startY) * eased,
        })

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
  }), [position])

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
        // Seamless background - matches site cream/off-white
        background: 'linear-gradient(135deg, #faf9f7 0%, #f5f4f2 100%)',
      }}
    >
      {/* Transformed content */}
      <div
        ref={contentRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          willChange: 'transform',
          padding: CANVAS_2D.CANVAS_PAD,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={products.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
            style={{ gap: CANVAS_2D.CLUSTER_V_GAP }}
          >
            {clusterRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-row items-start"
                style={{ gap: CANVAS_2D.CLUSTER_H_GAP }}
              >
                {row.map(cluster => (
                  <ClusterBlock
                    key={cluster.subCategory}
                    cluster={cluster}
                    getImageUrl={getImageUrl}
                    onCardClick={onCardClick}
                    onImageError={onImageError}
                    isHighlighted={
                      activeSubCategory === 'All' ||
                      activeSubCategory === cluster.subCategory
                    }
                    maxRows={2}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Corner gradients for depth */}
      <div
        className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.9), transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(255,255,255,0.95), transparent 70%)',
        }}
      />

      {/* Subtle navigation hint - fades out after first interaction */}
      {mounted && !isDragging.current && position.x === 0 && position.y === 0 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-[9px] uppercase tracking-[0.2em] text-charcoal/25">
            Drag to explore
          </p>
        </motion.div>
      )}
    </div>
  )
})
