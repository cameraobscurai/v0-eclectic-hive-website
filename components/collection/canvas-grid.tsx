'use client'

import {
  useEffect, useRef, useState,
  useImperativeHandle, forwardRef, useMemo,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useHorizontalLenis } from '@/hooks/use-horizontal-lenis'
import { buildClusters, getTotalCanvasWidth, getRowCount, CANVAS_CONSTANTS } from '@/lib/cluster-layout'
import type { ClusteredProduct, Cluster } from '@/lib/cluster-layout'

const { CARD_SIZE, CARD_GAP, LABEL_GUTTER } = CANVAS_CONSTANTS

// ─── SVG Distortion Filter ────────────────────────────────────────────────────
// Separate ID from gallery to avoid conflicts

let canvasFilterInjected = false

function CanvasDistortionFilter() {
  useEffect(() => {
    if (canvasFilterInjected || typeof document === 'undefined') return
    canvasFilterInjected = true

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML = `
      <defs>
        <filter id="canvas-distort" x="-5%" y="-5%" width="110%" height="110%"
                color-interpolation-filters="sRGBLinear">
          <feTurbulence
            id="canvas-turbulence"
            type="fractalNoise"
            baseFrequency="0.012 0.028"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            id="canvas-displacement"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    `
    document.body.appendChild(svg)
  }, [])
  return null
}

// ─── Canvas Card ──────────────────────────────────────────────────────────────
// Self-contained card for canvas mode. Same visual as ProductCard but
// fixed size and aware of the shared distortion filter.

interface CanvasCardProps {
  product: ClusteredProduct
  imageUrl: string
  onClick: () => void
  velocityRef: React.MutableRefObject<number>
  index: number
  onImageError: (id: string, url: string) => void
}

function CanvasCard({ product, imageUrl, onClick, velocityRef, index, onImageError }: CanvasCardProps) {
  const [loaded, setLoaded]   = useState(false)
  const [error, setError]     = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const wrapperRef            = useRef<HTMLDivElement>(null)
  const currentScale          = useRef(0)
  const rafId                 = useRef<number>(0)

  // Per-card distortion — same pattern as DistortedCard in gallery
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    function animate() {
      const el = wrapperRef.current
      if (!el) { rafId.current = requestAnimationFrame(animate); return }

      const targetScale = Math.abs(velocityRef.current) * 18
      const lerpSpeed   = targetScale > currentScale.current ? 0.22 : 0.06
      currentScale.current += (targetScale - currentScale.current) * lerpSpeed

      if (currentScale.current > 0.1) {
        el.style.filter = 'url(#canvas-distort)'
        const disp = document.getElementById('canvas-displacement')
        if (disp) disp.setAttribute('scale', currentScale.current.toFixed(2))
      } else {
        el.style.filter = 'none'
        currentScale.current = 0
      }

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  }, [velocityRef])

  if (error) return null

  return (
    <div
      ref={wrapperRef}
      style={{ width: CARD_SIZE, height: CARD_SIZE, flexShrink: 0 }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full h-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-charcoal/20 bg-white"
        style={{ display: 'block' }}
      >
        {/* Image */}
        <div className="absolute inset-0 p-4 lg:p-6">
          {!loaded && (
            <div className="absolute inset-4 lg:inset-6 bg-white">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-100/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={product.name}
            className={cn(
              'w-full h-full object-contain transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            loading={index < 6 ? 'eager' : 'lazy'}
            decoding={index < 3 ? 'sync' : 'async'}
            fetchPriority={index < 3 ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); onImageError(product.id, imageUrl) }}
          />
        </div>

        {/* Clip-path hover reveal — identical to grid mode */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden"
          style={{
            clipPath:  isHovered ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
            transition: 'clip-path 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="bg-white/96 backdrop-blur-sm px-4 py-4 border-t border-charcoal/6">
            <p className="text-[11px] tracking-[0.08em] text-charcoal uppercase font-medium truncate">
              {product.name}
            </p>
            <p className="text-[9px] tracking-[0.1em] text-charcoal/40 uppercase mt-1">
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
  rows: number
  getImageUrl: (p: ClusteredProduct) => string
  onCardClick: (p: ClusteredProduct) => void
  velocityRef: React.MutableRefObject<number>
  onImageError: (id: string, url: string) => void
  isHighlighted: boolean  // true when this sub-category is "active"
}

function ClusterBlock({
  cluster, rows, getImageUrl, onCardClick,
  velocityRef, onImageError, isHighlighted,
}: ClusterBlockProps) {
  const cols = Math.ceil(cluster.products.length / rows)

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'row',
        flexShrink:    0,
        position:      'relative',
        // Dim non-highlighted clusters when a sub-category is active
        opacity:       isHighlighted ? 1 : 0.35,
        transition:    'opacity 0.4s ease',
      }}
      data-cluster={cluster.subCategory}
    >
      {/* Vertical label */}
      <div
        style={{
          width:           LABEL_GUTTER,
          flexShrink:      0,
          display:         'flex',
          alignItems:      'flex-end',
          paddingBottom:   12,
          paddingRight:    16,
        }}
      >
        <span
          style={{
            writingMode:   'vertical-rl',
            transform:     'rotate(180deg)',
            fontSize:       10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         isHighlighted ? 'rgba(26,26,26,0.6)' : 'rgba(26,26,26,0.2)',
            transition:    'color 0.4s ease',
            whiteSpace:    'nowrap',
            userSelect:    'none',
          }}
        >
          {cluster.subCategory === 'Other' ? cluster.products[0]?.category : cluster.subCategory}
          <span style={{ opacity: 0.5, marginLeft: 8 }}>
            {cluster.products.length}
          </span>
        </span>
      </div>

      {/* Card grid — column-major order (fills top→bottom, left→right) */}
      <div
        style={{
          display:             'grid',
          gridTemplateRows:    `repeat(${rows}, ${CARD_SIZE}px)`,
          gridTemplateColumns: `repeat(${cols}, ${CARD_SIZE}px)`,
          gridAutoFlow:        'column',
          gap:                  CARD_GAP,
        }}
      >
        {cluster.products.map((product, i) => (
          <CanvasCard
            key={product.id}
            product={product}
            imageUrl={getImageUrl(product)}
            onClick={() => onCardClick(product)}
            velocityRef={velocityRef}
            index={i}
            onImageError={onImageError}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Canvas Grid ──────────────────────────────────────────────────────────────

export interface CanvasGridHandle {
  scrollToCluster: (subCategory: string) => void
  resetScroll: () => void
}

interface CanvasGridProps {
  products: ClusteredProduct[]
  activeSubCategory: string   // 'All' or a sub-category name
  sortOrder: string[]         // SUB_CATEGORY_SORT_ORDER[activeCategory] or []
  getImageUrl: (p: ClusteredProduct) => string
  onCardClick: (p: ClusteredProduct) => void
  onImageError: (id: string, url: string) => void
}

export const CanvasGrid = forwardRef<CanvasGridHandle, CanvasGridProps>(function CanvasGrid(
  { products, activeSubCategory, sortOrder, getImageUrl, onCardClick, onImageError },
  ref,
) {
  const outerRef   = useRef<HTMLDivElement>(null)  // scroll container
  const innerRef   = useRef<HTMLDivElement>(null)  // scrollable content
  const [canvasHeight, setCanvasHeight] = useState(600)
  const [mounted, setMounted] = useState(false)

  // Horizontal Lenis — scoped to outerRef
  const { lenisRef, velocityRef } = useHorizontalLenis(outerRef, true)

  // Measure available height on mount and resize
  useEffect(() => {
    function measure() {
      if (!outerRef.current) return
      const rect = outerRef.current.getBoundingClientRect()
      setCanvasHeight(rect.height)
    }
    measure()
    setMounted(true)
    const ro = new ResizeObserver(measure)
    if (outerRef.current) ro.observe(outerRef.current)
    return () => ro.disconnect()
  }, [])

  const rows = useMemo(() => getRowCount(canvasHeight), [canvasHeight])

  const clusters = useMemo(
    () => buildClusters(products, sortOrder, canvasHeight),
    [products, sortOrder, canvasHeight],
  )

  const totalWidth = useMemo(() => getTotalCanvasWidth(clusters), [clusters])

  // Imperative handle — exposes scrollToCluster and resetScroll
  useImperativeHandle(ref, () => ({
    scrollToCluster(subCategory: string) {
      const cluster = clusters.find(c => c.subCategory === subCategory)
      if (!cluster || !outerRef.current) return

      // Use Lenis for smooth animated scroll if available
      if (lenisRef.current) {
        lenisRef.current.scrollTo(cluster.xOffset, { duration: 0.9 })
      } else {
        outerRef.current.scrollTo({ left: cluster.xOffset, behavior: 'smooth' })
      }
    },
    resetScroll() {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 0.7 })
      } else {
        outerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
      }
    },
  }), [clusters, lenisRef])

  // Keyboard navigation — left/right arrows scroll the canvas
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept if focus is in an input or the quick-view modal is open
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (document.querySelector('[role="dialog"]')) return

      const amount = 300
      if (e.key === 'ArrowRight') {
        lenisRef.current?.scrollTo(
          (outerRef.current?.scrollLeft ?? 0) + amount,
          { duration: 0.6 }
        )
      }
      if (e.key === 'ArrowLeft') {
        lenisRef.current?.scrollTo(
          (outerRef.current?.scrollLeft ?? 0) - amount,
          { duration: 0.6 }
        )
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lenisRef])

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <CanvasDistortionFilter />

      {/* Scroll container */}
      <div
        ref={outerRef}
        style={{
          width:    '100%',
          height:   '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          // Hide native scrollbar — Lenis provides momentum, no bar needed
          scrollbarWidth: 'none',
        }}
        className="scrollbar-hide"
      >
        {/* Inner content — sized to total canvas width */}
        <div
          ref={innerRef}
          style={{
            display:        'flex',
            flexDirection:  'row',
            alignItems:     'flex-start',
            width:           totalWidth,
            height:         '100%',
            paddingTop:     20,
            gap:            CANVAS_CONSTANTS.CLUSTER_GAP,
            paddingLeft:    CANVAS_CONSTANTS.CANVAS_PAD,
            paddingRight:   CANVAS_CONSTANTS.CANVAS_PAD,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={products.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', flexDirection: 'row', gap: CANVAS_CONSTANTS.CLUSTER_GAP }}
            >
              {clusters.map(cluster => (
                <ClusterBlock
                  key={cluster.subCategory}
                  cluster={cluster}
                  rows={rows}
                  getImageUrl={getImageUrl}
                  onCardClick={onCardClick}
                  velocityRef={velocityRef}
                  onImageError={onImageError}
                  isHighlighted={
                    activeSubCategory === 'All' ||
                    activeSubCategory === cluster.subCategory
                  }
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll position indicator — thin progress bar at bottom */}
      <ScrollProgress containerRef={outerRef} totalWidth={totalWidth} />

      {/* Edge fade gradients — hint that content continues */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(255,255,255,0.95), transparent)',
        }}
      />

      {/* Keyboard hint — shown briefly on first canvas visit */}
      {mounted && (
        <div className="absolute bottom-4 right-20 pointer-events-none">
          <p className="text-[9px] uppercase tracking-[0.18em] text-charcoal/25">
            ← → to navigate
          </p>
        </div>
      )}
    </div>
  )
})

// ─── Scroll Progress Indicator ────────────────────────────────────────────────

function ScrollProgress({
  containerRef,
  totalWidth,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  totalWidth: number
}) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !barRef.current) return

    function update() {
      if (!container || !barRef.current) return
      const scrollLeft   = container.scrollLeft
      const maxScroll    = container.scrollWidth - container.clientWidth
      const progress     = maxScroll > 0 ? scrollLeft / maxScroll : 0
      barRef.current.style.transform = `scaleX(${progress})`
    }

    container.addEventListener('scroll', update, { passive: true })
    return () => container.removeEventListener('scroll', update)
  }, [containerRef])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-px bg-charcoal/5">
      <div
        ref={barRef}
        className="h-full bg-charcoal/20 origin-left"
        style={{ transform: 'scaleX(0)', transition: 'transform 0.1s linear' }}
      />
    </div>
  )
}
