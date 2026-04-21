'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASINGS } from '@/lib/animations'

// =============================================================================
// QUICK VIEW MODAL
// Centered glassmorphic modal with modern snap-back animation
// =============================================================================

interface Product {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  description?: string
  dimensions?: string
  quantity_available?: number
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

// Animation variants - centered scale + fade
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.35, ease: modalEasing }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.25, ease: modalEasing }
  },
}

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.92,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: modalEasing,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { 
      duration: 0.25, 
      ease: modalEasing,
    }
  },
}

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.3, 
      delay: 0.1,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="quick-view-title"
        >
          {/* Backdrop - click to close */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative w-full max-w-3xl max-h-[90vh]',
              'glass-card rounded-lg overflow-hidden',
              'bg-cream/95 backdrop-blur-xl',
              'shadow-2xl shadow-black/20',
              'flex flex-col'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-charcoal/15" />
            </div>

            {/* Header with nav arrows and close */}
            <div className="flex items-center justify-between px-4 sm:px-6 pb-3">
              {/* Navigation arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onPrevious}
                  disabled={!onPrevious}
                  className={cn(
                    'p-2 rounded-full transition-all duration-200',
                    onPrevious 
                      ? 'hover:bg-charcoal/5 text-charcoal/60 hover:text-charcoal' 
                      : 'text-charcoal/20 cursor-not-allowed'
                  )}
                  aria-label="Previous product"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={onNext}
                  disabled={!onNext}
                  className={cn(
                    'p-2 rounded-full transition-all duration-200',
                    onNext 
                      ? 'hover:bg-charcoal/5 text-charcoal/60 hover:text-charcoal' 
                      : 'text-charcoal/20 cursor-not-allowed'
                  )}
                  aria-label="Next product"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-all duration-200 text-charcoal/60 hover:text-charcoal"
                aria-label="Close quick view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - horizontal layout on larger screens */}
            <motion.div 
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="aspect-square bg-white relative">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
                  )}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className={cn(
                        'w-full h-full object-contain p-6 md:p-8 transition-opacity duration-300',
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      )}
                      onLoad={() => setImageLoaded(true)}
                    />
                  )}
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 flex flex-col justify-between bg-cream">
                  <div className="space-y-4">
                    {/* Category tag */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] bg-charcoal/5 text-charcoal/70 rounded-sm">
                        {product.category}
                      </span>
                      {product.sub_category && (
                        <span className="px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] bg-charcoal/5 text-charcoal/50 rounded-sm">
                          {product.sub_category}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h2 
                      id="quick-view-title"
                      className="font-display text-xl sm:text-2xl md:text-[1.75rem] tracking-tight text-charcoal leading-tight uppercase"
                      style={{ fontStyle: 'italic' }}
                    >
                      {product.name}
                    </h2>

                    {/* Description or specs */}
                    {product.description ? (
                      <p className="text-sm text-charcoal/60 leading-relaxed">
                        {product.description}
                      </p>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {product.dimensions && (
                          <p className="text-charcoal/50">
                            <span className="text-charcoal/30 uppercase text-[10px] tracking-wide">Size:</span>{' '}
                            {product.dimensions}
                          </p>
                        )}
                        {product.quantity_available !== undefined && product.quantity_available > 0 && (
                          <p className="text-charcoal/50">
                            <span className="text-charcoal/30 uppercase text-[10px] tracking-wide">Qty:</span>{' '}
                            {product.quantity_available} available
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 space-y-3">
                    <button
                      className={cn(
                        'w-full py-3.5 px-6',
                        'bg-charcoal text-cream',
                        'text-xs uppercase tracking-[0.15em]',
                        'hover:bg-charcoal/85 active:scale-[0.98] transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:ring-offset-2'
                      )}
                    >
                      Add to Inquiry
                    </button>
                    <p className="text-[9px] text-charcoal/35 text-center tracking-wide uppercase">
                      Use arrow keys to browse • ESC to close
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
