'use client'

import {
  useEffect, useRef, useState,
  useImperativeHandle, forwardRef, useMemo, useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buildClusters, CANVAS_CONSTANTS } from '@/lib/cluster-layout'
import type { ClusteredProduct, Cluster } from '@/lib/cluster-layout'

const { CARD_SIZE, CARD_GAP, LABEL_GUTTER } = CANVAS_CONSTANTS

// 2D Canvas layout constants
const CANVAS_2D = {
  CLUSTER_H_GAP: 60,    // Horizontal gap between clusters
  CLUSTER_V_GAP: 100,   // Vertical gap between cluster rows (larger for better separation)
  CANVAS_PAD: 64,       // Padding around the entire canvas
  COLS_PER_ROW: 2,      // Fewer clusters per row = more rows = vertical scrolling enabled
}

// ─── Canvas Card ──────────────────────────────────────────────────────────────
// Crisp, sharp rendering — no blur effects

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
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full h-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-charcoal/20 bg-white border border-charcoal/[0.04] transition-shadow duration-200 hover:shadow-lg hover:shadow-charcoal/5"
        style={{ display: 'block' }}
      >
        {/* Image — crisp rendering */}
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
            style={{ imageRendering: 'auto' }} // Crisp rendering
          />
        </div>

        {/* Hover reveal */}
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
      {/* Sub-category label */}
      <div className="mb-3 flex items-baseline gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/50 font-medium">
          {cluster.subCategory === 'Other' ? cluster.products[0]?.category : cluster.subCategory}
        </span>
        <span className="text-[9px] text-charcoal/25">
          {cluster.products.length} {cluster.products.length === 1 ? 'piece' : 'pieces'}
        </span>
      </div>

      {/* Card grid — column-major for spatial room feel */}
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

// ─── Canvas Grid (Omnidirectional) ────────────────────────────────────────────

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

  // Momentum drag — pointer events with inertia on release
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, scrollX: 0, scrollY: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastPos = useRef({ x: 0, y: 0 })
  const inertiaRaf = useRef<number>(0)
  const cursorClass = useRef<'cursor-grab' | 'cursor-grabbing'>('cursor-grab')
  const [, forceUpdate] = useState(0)

  // Build clusters
  const clusters = useMemo(
    () => buildClusters(products, sortOrder, 600), // Fixed height for consistent layout
    [products, sortOrder],
  )

  // Calculate canvas dimensions for 2D layout
  const canvasDimensions = useMemo(() => {
    if (clusters.length === 0) return { width: 0, height: 0 }

    // Arrange clusters in rows
    const rows: Cluster[][] = []
    for (let i = 0; i < clusters.length; i += CANVAS_2D.COLS_PER_ROW) {
      rows.push(clusters.slice(i, i + CANVAS_2D.COLS_PER_ROW))
    }

    // Calculate max width needed per row
    let maxRowWidth = 0
    rows.forEach(row => {
      let rowWidth = 0
      row.forEach((cluster, idx) => {
        const cols = Math.ceil(cluster.products.length / 2)
        const clusterWidth = (cols * CARD_SIZE) + ((cols - 1) * CARD_GAP)
        rowWidth += clusterWidth
        if (idx < row.length - 1) rowWidth += CANVAS_2D.CLUSTER_H_GAP
      })
      maxRowWidth = Math.max(maxRowWidth, rowWidth)
    })

    // Calculate total height - each row has 2 card rows + label
    const singleRowHeight = (2 * CARD_SIZE) + CARD_GAP + 40 // 40px for label area
    const totalHeight = (rows.length * singleRowHeight) + ((rows.length - 1) * CANVAS_2D.CLUSTER_V_GAP)

    // Ensure minimum dimensions for scrollability
    return {
      width: Math.max(maxRowWidth + (CANVAS_2D.CANVAS_PAD * 2), 1200),
      height: Math.max(totalHeight + (CANVAS_2D.CANVAS_PAD * 2), 1000),
    }
  }, [clusters])

  // Arrange clusters into a 2D grid
  const clusterRows = useMemo(() => {
    const rows: Cluster[][] = []
    for (let i = 0; i < clusters.length; i += CANVAS_2D.COLS_PER_ROW) {
      rows.push(clusters.slice(i, i + CANVAS_2D.COLS_PER_ROW))
    }
    return rows
  }, [clusters])

  // Inertia animation on release
  const startInertia = useCallback(() => {
    cancelAnimationFrame(inertiaRaf.current)

    function tick() {
      if (!containerRef.current) return
      velocity.current.x *= 0.92 // friction
      velocity.current.y *= 0.92

      if (Math.abs(velocity.current.x) < 0.5 && Math.abs(velocity.current.y) < 0.5) {
        velocity.current = { x: 0, y: 0 }
        return
      }

      containerRef.current.scrollLeft += velocity.current.x
      containerRef.current.scrollTop += velocity.current.y
      inertiaRaf.current = requestAnimationFrame(tick)
    }

    inertiaRaf.current = requestAnimationFrame(tick)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return // left button only
    cancelAnimationFrame(inertiaRaf.current)
    isDragging.current = true
    velocity.current = { x: 0, y: 0 }
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollX: containerRef.current?.scrollLeft ?? 0,
      scrollY: containerRef.current?.scrollTop ?? 0,
    }
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    cursorClass.current = 'cursor-grabbing'
    forceUpdate(n => n + 1)
    e.preventDefault()
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return

    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    containerRef.current.scrollLeft = dragStart.current.scrollX - dx
    containerRef.current.scrollTop = dragStart.current.scrollY - dy

    // Track velocity for inertia
    velocity.current = {
      x: -(e.clientX - lastPos.current.x),
      y: -(e.clientY - lastPos.current.y),
    }
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    cursorClass.current = 'cursor-grab'
    forceUpdate(n => n + 1)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    startInertia()
  }, [startInertia])

  // Pause global Lenis when canvas is mounted
  useEffect(() => {
    const globalLenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis
    globalLenis?.stop()
    setMounted(true)
    return () => {
      cancelAnimationFrame(inertiaRaf.current)
      globalLenis?.start()
    }
  }, [])

  // Imperative handle
  useImperativeHandle(ref, () => ({
    scrollToCluster(subCategory: string) {
      // Cancel any ongoing inertia
      cancelAnimationFrame(inertiaRaf.current)
      velocity.current = { x: 0, y: 0 }
      
      const el = contentRef.current?.querySelector(`[data-cluster="${subCategory}"]`) as HTMLElement
      if (!el || !containerRef.current) return
      
      const containerRect = containerRef.current.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const scrollLeft = containerRef.current.scrollLeft + elRect.left - containerRect.left - CANVAS_2D.CANVAS_PAD
      const scrollTop = containerRef.current.scrollTop + elRect.top - containerRect.top - CANVAS_2D.CANVAS_PAD
      
      containerRef.current.scrollTo({
        left: Math.max(0, scrollLeft),
        top: Math.max(0, scrollTop),
        behavior: 'smooth',
      })
    },
    resetScroll() {
      cancelAnimationFrame(inertiaRaf.current)
      velocity.current = { x: 0, y: 0 }
      containerRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    },
  }), [])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (document.querySelector('[role="dialog"]')) return
      if (!containerRef.current) return

      const amount = 200
      const current = containerRef.current

      switch (e.key) {
        case 'ArrowRight':
          current.scrollBy({ left: amount, behavior: 'smooth' })
          e.preventDefault()
          break
        case 'ArrowLeft':
          current.scrollBy({ left: -amount, behavior: 'smooth' })
          e.preventDefault()
          break
        case 'ArrowDown':
          current.scrollBy({ top: amount, behavior: 'smooth' })
          e.preventDefault()
          break
        case 'ArrowUp':
          current.scrollBy({ top: -amount, behavior: 'smooth' })
          e.preventDefault()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative w-full h-full bg-cream/30" style={{ overflow: 'hidden' }}>
      {/* Scroll container — omnidirectional drag with inertia */}
      <div
        ref={containerRef}
        className={cn('absolute inset-0 scrollbar-hide', cursorClass.current)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          overflow: 'scroll',
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none',
          touchAction: 'none', // prevents browser from handling touch scroll, which would fight our drag
        }}
      >
        {/* Content canvas — explicit dimensions enable scrolling */}
        <div
          ref={contentRef}
          style={{
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            padding: CANVAS_2D.CANVAS_PAD,
            boxSizing: 'border-box',
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
      </div>

      {/* Subtle corner gradients for depth */}
      <div
        className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.8), transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(255,255,255,0.9), transparent 70%)',
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
            Drag or use arrow keys to explore
          </p>
        </motion.div>
      )}

      {/* Mini-map indicator */}
      <MiniMap
        containerRef={containerRef}
        canvasWidth={canvasDimensions.width}
        canvasHeight={canvasDimensions.height}
      />
    </div>
  )
})

// ─── Mini-map for spatial orientation ─────────────────────────────────────────

function MiniMap({
  containerRef,
  canvasWidth,
  canvasHeight,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  canvasWidth: number
  canvasHeight: number
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !viewportRef.current) return

    let hideTimeout: NodeJS.Timeout

    function update() {
      if (!container || !viewportRef.current) return

      // Show mini-map briefly on scroll
      setVisible(true)
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => setVisible(false), 1500)

      const scrollLeft = container.scrollLeft
      const scrollTop = container.scrollTop
      const viewWidth = container.clientWidth
      const viewHeight = container.clientHeight

      // Calculate viewport position as percentage
      const xPercent = canvasWidth > viewWidth ? (scrollLeft / (canvasWidth - viewWidth)) * 100 : 0
      const yPercent = canvasHeight > viewHeight ? (scrollTop / (canvasHeight - viewHeight)) * 100 : 0

      // Calculate viewport size as percentage
      const wPercent = Math.min(100, (viewWidth / canvasWidth) * 100)
      const hPercent = Math.min(100, (viewHeight / canvasHeight) * 100)

      viewportRef.current.style.left = `${xPercent * (1 - wPercent / 100)}%`
      viewportRef.current.style.top = `${yPercent * (1 - hPercent / 100)}%`
      viewportRef.current.style.width = `${wPercent}%`
      viewportRef.current.style.height = `${hPercent}%`
    }

    update()
    container.addEventListener('scroll', update, { passive: true })
    return () => {
      container.removeEventListener('scroll', update)
      clearTimeout(hideTimeout)
    }
  }, [containerRef, canvasWidth, canvasHeight])

  if (canvasWidth === 0 || canvasHeight === 0) return null

  return (
    <div
      className={cn(
        'absolute bottom-4 left-4 w-16 h-12 bg-white/80 border border-charcoal/10 rounded transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        ref={viewportRef}
        className="absolute bg-charcoal/20 rounded-sm transition-all duration-100"
        style={{ minWidth: 4, minHeight: 4 }}
      />
    </div>
  )
}
