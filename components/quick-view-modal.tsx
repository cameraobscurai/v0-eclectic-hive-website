'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// =============================================================================
// QUICK VIEW MODAL
// Centered glassmorphic modal - single frosted glass panel
// Matches Eclectic Hive's minimal product info style
// =============================================================================

interface Product {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  // Inventory fields
  quantity?: number
  stocked_quantity?: number
  dimensions?: string
  width?: string
  depth?: string
  height?: string
}

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  imageUrl?: string
}

// Smooth, cinematic easing
const modalEasing = [0.32, 0.72, 0, 1]

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: modalEasing }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: modalEasing }
  },
}

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.94,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.35, 
      ease: modalEasing,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.96,
    transition: { 
      duration: 0.2, 
      ease: modalEasing,
    }
  },
}

export function QuickViewModal({ 
  product, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious,
  imageUrl 
}: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset image loaded state when product changes
  useEffect(() => {
    setImageLoaded(false)
  }, [product?.id])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowRight':
          onNext?.()
          break
        case 'ArrowLeft':
          onPrevious?.()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrevious])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!product) return null

  // Build dimensions string from individual fields or use dimensions field
  const getDimensions = () => {
    if (product.dimensions) return product.dimensions
    if (product.width || product.depth || product.height) {
      const parts = []
      if (product.width) parts.push(`${product.width}"W`)
      if (product.depth) parts.push(`${product.depth}"D`)
      if (product.height) parts.push(`${product.height}"H`)
      return parts.join(' x ')
    }
    return null
  }

  const dimensions = getDimensions()
  const stockedQty = product.stocked_quantity ?? product.quantity

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="quick-view-title"
        >
          {/* Backdrop - frosted blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal - single glassmorphic panel */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative w-full max-w-[720px]',
              // TRUE GLASSMORPHIC - single color, frosted glass
              'bg-cream backdrop-blur-xl',
              'border border-cream/20',
              'shadow-2xl shadow-charcoal/30',
              'overflow-hidden'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3">
              <div className="w-8 h-0.5 rounded-full bg-charcoal/10" />
            </div>

            {/* Header - nav + close */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={onPrevious}
                  disabled={!onPrevious}
                  className={cn(
                    'p-2 transition-colors',
                    onPrevious 
                      ? 'text-charcoal/50 hover:text-charcoal' 
                      : 'text-charcoal/15 cursor-not-allowed'
                  )}
                  aria-label="Previous product"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={onNext}
                  disabled={!onNext}
                  className={cn(
                    'p-2 transition-colors',
                    onNext 
                      ? 'text-charcoal/50 hover:text-charcoal' 
                      : 'text-charcoal/15 cursor-not-allowed'
                  )}
                  aria-label="Next product"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-charcoal/50 hover:text-charcoal transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - image left, details right */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
              {/* Image - clean white background */}
              <div className="aspect-square md:aspect-auto md:min-h-[350px] bg-white relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-neutral-50 animate-pulse" />
                )}
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className={cn(
                      'w-full h-full object-contain p-8 md:p-10 transition-opacity duration-300',
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>

              {/* Details - minimal like their current site */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Category */}
                  <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                    {product.category}
                  </span>

                  {/* Name */}
                  <h2 
                    id="quick-view-title"
                    className="font-display text-xl md:text-2xl tracking-wide text-charcoal uppercase"
                    style={{ fontStyle: 'italic' }}
                  >
                    {product.name}
                  </h2>

                  {/* Inventory details - matches their current site */}
                  <div className="space-y-1.5 pt-2">
                    {stockedQty !== undefined && stockedQty > 0 && (
                      <p className="text-sm text-charcoal/70">
                        Stocked Quantity: {stockedQty}
                      </p>
                    )}
                    {dimensions && (
                      <p className="text-sm text-charcoal/70">
                        {dimensions}
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 space-y-3">
                  <button
                    className={cn(
                      'w-full py-3 px-6',
                      'bg-charcoal text-cream',
                      'text-xs uppercase tracking-[0.15em]',
                      'hover:bg-charcoal/90 active:scale-[0.99] transition-all duration-150'
                    )}
                  >
                    Add to Inquiry
                  </button>
                  <p className="text-[9px] text-charcoal/30 text-center tracking-wider uppercase">
                    Use arrow keys to browse • ESC to close
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
