'use client'

import {
  useEffect, useRef, useState,
  useImperativeHandle, forwardRef, useMemo, useCallback,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buildClusters } from '@/lib/cluster-layout'
import type { ClusteredProduct, Cluster } from '@/lib/cluster-layout'

// Grid constants - responsive columns based on container width
const CARD_SIZE = 160
const CARD_GAP = 20
const SECTION_GAP = 48  // Gap between category sections
const GRID_PAD = 32

// ─── Product Card ─────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: ClusteredProduct
  imageUrl: string
  onClick: () => void
  index: number
  onImageError: (id: string, url: string) => void
}

function ProductCard({ product, imageUrl, onClick, index, onImageError }: ProductCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  if (error) return null

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative aspect-square cursor-pointer text-left',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/20 focus-visible:ring-offset-2',
        'transition-transform duration-300 ease-out',
        isHovered && 'scale-[1.02] z-10'
      )}
      style={{ background: 'transparent' }}
    >
      {/* Loading shimmer */}
      {!loaded && (
        <div className="absolute inset-0 rounded-sm overflow-hidden bg-charcoal/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-charcoal/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}
      
      {/* Product image */}
      <img
        src={imageUrl}
        alt={product.name}
        className={cn(
          'w-full h-full object-contain transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
        loading={index < 24 ? 'eager' : 'lazy'}
        decoding={index < 12 ? 'sync' : 'async'}
        fetchPriority={index < 12 ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); onImageError(product.id, imageUrl) }}
        draggable={false}
        style={{
          filter: isHovered 
            ? 'drop-shadow(0 8px 20px rgba(0,0,0,0.1))' 
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.03))',
          transition: 'filter 0.3s ease',
        }}
      />

      {/* Hover label */}
      <div
        className="absolute inset-x-0 -bottom-6 flex justify-center pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(-2px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        <span className="text-[10px] tracking-wide text-charcoal/60 truncate max-w-full px-1">
          {product.name}
        </span>
      </div>
    </button>
  )
}

// ─── Category Section ─────────────────────────────────────────────────────────

interface CategorySectionProps {
  cluster: Cluster
  getImageUrl: (p: ClusteredProduct) => string
  onCardClick: (p: ClusteredProduct) => void
  onImageError: (id: string, url: string) => void
  isHighlighted: boolean
  columns: number
  startIndex: number
}

function CategorySection({
  cluster, getImageUrl, onCardClick, onImageError, isHighlighted, columns, startIndex
}: CategorySectionProps) {
  return (
    <div
      data-cluster={cluster.subCategory}
      className="transition-opacity duration-300"
      style={{ opacity: isHighlighted ? 1 : 0.35 }}
    >
      {/* Category header */}
      <div className="flex items-baseline gap-3 mb-4 px-1">
        <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal/70 font-medium">
          {cluster.subCategory === 'Other' ? cluster.products[0]?.category : cluster.subCategory}
        </h3>
        <span className="text-[10px] text-charcoal/30">
          {cluster.products.length}
        </span>
      </div>

      {/* Products grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${CARD_SIZE}px)`,
          gap: CARD_GAP,
        }}
      >
        {cluster.products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            imageUrl={getImageUrl(product)}
            onClick={() => onCardClick(product)}
            index={startIndex + i}
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
  const [columns, setColumns] = useState(6)

  // Build clusters from products
  const clusters = useMemo(
    () => buildClusters(products, sortOrder, 600),
    [products, sortOrder],
  )

  // Calculate columns based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth - (GRID_PAD * 2)
      const cols = Math.max(3, Math.floor((width + CARD_GAP) / (CARD_SIZE + CARD_GAP)))
      setColumns(cols)
    }

    updateColumns()
    const observer = new ResizeObserver(updateColumns)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Imperative handle for scrolling to clusters
  useImperativeHandle(ref, () => ({
    scrollToCluster(subCategory: string) {
      const el = containerRef.current?.querySelector(`[data-cluster="${subCategory}"]`) as HTMLElement
      if (!el || !containerRef.current) return

      const containerTop = containerRef.current.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = elTop - containerTop + containerRef.current.scrollTop - 20

      containerRef.current.scrollTo({
        top: offset,
        behavior: 'smooth',
      })
    },
    resetScroll() {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    },
  }), [])

  // Track product indices for lazy loading priority
  let runningIndex = 0

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
      style={{
        background: 'linear-gradient(180deg, #faf9f7 0%, #f7f6f4 100%)',
      }}
    >
      <div 
        className="flex flex-col"
        style={{ 
          padding: GRID_PAD,
          gap: SECTION_GAP,
          paddingBottom: GRID_PAD + 40, // Extra bottom padding for last section labels
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
            style={{ gap: SECTION_GAP }}
          >
            {clusters.map((cluster) => {
              const startIdx = runningIndex
              runningIndex += cluster.products.length
              return (
                <CategorySection
                  key={cluster.subCategory}
                  cluster={cluster}
                  getImageUrl={getImageUrl}
                  onCardClick={onCardClick}
                  onImageError={onImageError}
                  isHighlighted={
                    activeSubCategory === 'All' ||
                    activeSubCategory === cluster.subCategory
                  }
                  columns={columns}
                  startIndex={startIdx}
                />
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
})
