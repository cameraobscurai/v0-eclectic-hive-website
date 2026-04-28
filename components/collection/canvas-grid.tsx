'use client'

import {
  useEffect, useRef, useState,
  useImperativeHandle, forwardRef, useMemo, useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buildClusters, CANVAS_CONSTANTS } from '@/lib/cluster-layout'
import type { ClusteredProduct, Cluster } from '@/lib/cluster-layout'

const { CARD_SIZE, CARD_GAP } = CANVAS_CONSTANTS

// 2D Canvas layout constants
const CANVAS_2D = {
  CLUSTER_H_GAP: 80,
  CLUSTER_V_GAP: 100,
  CANVAS_PAD: 80,
  COLS_PER_ROW: 2,
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
    <div style={{ width: CARD_SIZE, height: CARD_SIZE, flexShrink: 0 }}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full h-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-charcoal/20 bg-white border border-charcoal/[0.04] transition-shadow duration-200 hover:shadow-lg hover:shadow-charcoal/5"
        style={{ display: 'block' }}
      >
        <div className="absolute inset-0 p-4 lg:p-6">
          {!loaded && (
            <div className="absolute inset-4 lg:inset-6 bg-neutral-50/50">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={product.name}
            className={cn(
              'w-full h-full object-contain transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            loading={index < 12 ? 'eager' : 'lazy'}
            decoding={index < 6 ? 'sync' : 'async'}
            fetchPriority={index < 6 ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); onImageError(product.id, imageUrl) }}
            draggable={false}
          />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden"
          style={{
            clipPath: isHovered ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
            transition: 'clip-path 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="bg-white/98 px-4 py-3 border-t border-charcoal/6">
            <p className="text-[11px] tracking-[0.08em] text-charcoal uppercase font-medium truncate">
              {product.name}
            </p>
            <p className="text-[9px] tracking-[0.1em] text-charcoal/40 uppercase mt-0.5">
              Quick View
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

  return (
    <div
      className="relative"
      style={{
        opacity: isHighlighted ? 1 : 0.3,
        transition: 'opacity 0.35s ease',
      }}
      data-cluster={cluster.subCategory}
    >
      <div className="mb-3 flex items-baseline gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 font-medium">
          {cluster.subCategory === 'Other' ? cluster.products[0]?.category : cluster.subCategory}
        </span>
        <span className="text-[9px] text-charcoal/25">
          {cluster.products.length} {cluster.products.length === 1 ? 'piece' : 'pieces'}
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

  // Inertia animation
  const startInertia = useCallback(() => {
    cancelAnimationFrame(inertiaRaf.current)

    // Cap velocity
    const maxV = 50
    velocity.current.x = Math.max(-maxV, Math.min(maxV, velocity.current.x))
    velocity.current.y = Math.max(-maxV, Math.min(maxV, velocity.current.y))

    function tick() {
      velocity.current.x *= 0.95
      velocity.current.y *= 0.95

      if (Math.abs(velocity.current.x) < 0.1 && Math.abs(velocity.current.y) < 0.1) {
        velocity.current = { x: 0, y: 0 }
        return
      }

      setPosition(prev => ({
        x: prev.x + velocity.current.x,
        y: prev.y + velocity.current.y,
      }))

      inertiaRaf.current = requestAnimationFrame(tick)
    }

    inertiaRaf.current = requestAnimationFrame(tick)
  }, [])

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

    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    })

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
    // Multiply for faster movement
    const multiplier = e.ctrlKey ? 0.5 : 1.5

    setPosition(prev => ({
      x: prev.x - e.deltaX * multiplier,
      y: prev.y - e.deltaY * multiplier,
    }))
  }, [])

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

      const amount = 150

      switch (e.key) {
        case 'ArrowRight':
          setPosition(prev => ({ ...prev, x: prev.x - amount }))
          e.preventDefault()
          break
        case 'ArrowLeft':
          setPosition(prev => ({ ...prev, x: prev.x + amount }))
          e.preventDefault()
          break
        case 'ArrowDown':
          setPosition(prev => ({ ...prev, y: prev.y - amount }))
          e.preventDefault()
          break
        case 'ArrowUp':
          setPosition(prev => ({ ...prev, y: prev.y + amount }))
          e.preventDefault()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        'relative w-full h-full overflow-hidden bg-cream/30',
        isDragging.current ? 'cursor-grabbing' : 'cursor-grab'
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      style={{ touchAction: 'none' }}
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

      {/* Navigation hint */}
      {mounted && (
        <motion.div
          className="absolute bottom-4 right-4 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-charcoal/30">
            Drag or scroll to explore
          </p>
        </motion.div>
      )}

      {/* Position indicator */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <p className="text-[9px] font-mono text-charcoal/20">
          {Math.round(position.x)}, {Math.round(position.y)}
        </p>
      </div>
    </div>
  )
})
