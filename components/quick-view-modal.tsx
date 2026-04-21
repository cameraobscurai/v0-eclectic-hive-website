'use client'

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASINGS } from '@/lib/animations'

// =============================================================================
// QUICK VIEW MODAL
// Elegant slide-over panel with glassmorphism
// AAA-level polish with keyboard nav and swipe gestures
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

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: EASINGS.cinematic }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: EASINGS.cinematic }
  },
}

const panelVariants = {
  hidden: { 
    x: '100%',
    opacity: 0.5,
  },
  visible: { 
    x: '0%',
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: EASINGS.cinematic,
    }
  },
  exit: { 
    x: '100%',
    opacity: 0.5,
    transition: { 
      duration: 0.35, 
      ease: EASINGS.easeInExpo,
    }
  },
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      delay: 0.15,
      ease: EASINGS.cinematic,
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
  const [touchStart, setTouchStart] = useState<number | null>(null)

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

  // Touch swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return
    
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next
        onNext?.()
      } else {
        // Swipe right - close or previous
        if (onPrevious) {
          onPrevious()
        } else {
          onClose()
        }
      }
    }
    
    setTouchStart(null)
  }, [touchStart, onNext, onPrevious, onClose])

  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel - slides from right */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute right-0 top-0 bottom-0 w-full sm:w-[480px] md:w-[540px] lg:w-[600px]',
              'bg-cream/95 backdrop-blur-md shadow-2xl',
              'flex flex-col'
            )}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10">
              {/* Navigation arrows */}
              <div className="flex items-center gap-2">
                {onPrevious && (
                  <button
                    onClick={onPrevious}
                    className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
                    aria-label="Previous product"
                  >
                    <svg className="w-5 h-5 text-charcoal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                )}
                {onNext && (
                  <button
                    onClick={onNext}
                    className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
                    aria-label="Next product"
                  >
                    <svg className="w-5 h-5 text-charcoal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
                aria-label="Close quick view"
              >
                <svg className="w-5 h-5 text-charcoal/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <motion.div 
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 overflow-y-auto"
            >
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
                      'w-full h-full object-contain p-8 transition-opacity duration-300',
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>

              {/* Details */}
              <div className="p-6 space-y-6">
                {/* Category badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                    {product.category}
                  </span>
                  {product.sub_category && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-charcoal/20" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">
                        {product.sub_category}
                      </span>
                    </>
                  )}
                </div>

                {/* Name */}
                <h2 
                  id="quick-view-title"
                  className="font-display text-2xl md:text-3xl tracking-tight text-charcoal"
                >
                  {product.name}
                </h2>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-charcoal/60 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Specs */}
                <div className="space-y-3 pt-4 border-t border-charcoal/10">
                  {product.dimensions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal/40 uppercase tracking-wide text-[10px]">Dimensions</span>
                      <span className="text-charcoal">{product.dimensions}</span>
                    </div>
                  )}
                  {product.quantity_available !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal/40 uppercase tracking-wide text-[10px]">Available</span>
                      <span className="text-charcoal">{product.quantity_available}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-charcoal/10 bg-cream">
              <button
                className={cn(
                  'w-full py-3 px-6',
                  'bg-charcoal text-cream',
                  'text-xs uppercase tracking-[0.15em]',
                  'hover:bg-charcoal/90 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:ring-offset-2'
                )}
              >
                Add to Inquiry
              </button>
              <p className="text-[10px] text-charcoal/40 text-center mt-3 tracking-wide">
                Use arrow keys to browse • ESC to close
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
