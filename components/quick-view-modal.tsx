'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useInquiryStore } from '@/lib/inquiry-store'

// =============================================================================
// LIQUID GLASS QUICK VIEW MODAL
// True liquid glass with:
// 1. Dynamic specular highlights (mouse tracking)
// 2. Backdrop refraction/blur
// 3. Gel-like fluid animations (springy morphing)
// =============================================================================

interface Product {
  id: string
  slug: string
  name: string
  category: string
  sub_category?: string
  primary_image_url?: string
  description?: string
  display_type?: 'single' | 'variants' | 'custom_inquiry'
  // Variant data (if joined)
  stock_count?: number
  dims_display?: string
  width_inches?: number
  depth_inches?: number
  height_inches?: number
}

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  imageUrl?: string
}

// Springy, gel-like easing for liquid feel
const liquidSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
  mass: 1,
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
    transition: liquidSpring,
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { 
      duration: 0.2, 
      ease: [0.32, 0, 0.67, 0] as const,
    }
  },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
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
  const modalRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [qty, setQty] = useState(1)
  
  // Inquiry store
  const { add, remove, has, getQuantity } = useInquiryStore()
  const isAdded = product ? has(product.id) : false

  // Reset state when product changes
  useEffect(() => {
    setImageLoaded(false)
    setQty(product ? getQuantity(product.id) || 1 : 1)
  }, [product?.id, getQuantity])

  // Mouse tracking for specular highlight
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return
    const rect = modalRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }, [])

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

  // Build dimensions string
  const getDimensions = () => {
    if (product.dims_display) return product.dims_display
    if (product.width_inches || product.depth_inches || product.height_inches) {
      const parts = []
      if (product.width_inches) parts.push(`${product.width_inches}"W`)
      if (product.depth_inches) parts.push(`${product.depth_inches}"D`)
      if (product.height_inches) parts.push(`${product.height_inches}"H`)
      return parts.join(' x ')
    }
    return null
  }

  const dimensions = getDimensions()
  const stockCount = product.stock_count

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="quick-view-title"
        >
          {/* Backdrop - heavy blur for refraction effect */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal - LIQUID GLASS */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseMove={handleMouseMove}
            className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              // Liquid glass base
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.12),
                0 2px 8px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.5)
              `,
            }}
          >
            {/* Dynamic Specular Highlight - follows mouse */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(
                  600px circle at ${mousePos.x}% ${mousePos.y}%,
                  rgba(255, 255, 255, 0.4) 0%,
                  rgba(255, 255, 255, 0.1) 25%,
                  transparent 50%
                )`,
              }}
            />

            {/* Inner glow edge */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
              }}
            />

            {/* Drag handle */}
            <div className="flex justify-center pt-3 relative z-10">
              <div className="w-10 h-1 rounded-full bg-charcoal/10" />
            </div>

            {/* Header - nav + close */}
            <div className="flex items-center justify-between px-4 py-2 relative z-10">
              <div className="flex items-center gap-1">
                <button
                  onClick={onPrevious}
                  disabled={!onPrevious}
                  className={cn(
                    'w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all touch-manipulation',
                    onPrevious 
                      ? 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal active:bg-charcoal/10' 
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
                    'w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all touch-manipulation',
                    onNext 
                      ? 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal active:bg-charcoal/10' 
                      : 'text-charcoal/20 cursor-not-allowed'
                  )}
                  aria-label="Next product"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal active:bg-charcoal/10 transition-all touch-manipulation"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - image left, details right */}
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] relative z-10">
              {/* Image - subtle inner shadow for depth */}
              <div 
                className="aspect-square md:aspect-auto md:min-h-[350px] relative mx-4 mb-4 md:mb-0 md:mx-0 md:ml-4 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-white/50 animate-pulse" />
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
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Category tag */}
                  <span 
                    className="inline-block px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-charcoal/60 rounded-full"
                    style={{
                      background: 'rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {product.category}
                  </span>

                  {/* Name */}
                  <h2 
                    id="quick-view-title"
                    className="font-display text-xl md:text-2xl tracking-wide text-charcoal"
                    style={{ fontStyle: 'italic' }}
                  >
                    {product.name}
                  </h2>

                  {/* Inventory details - matching their current site format */}
                  <div className="space-y-1 pt-3 text-sm text-charcoal/70">
                    {stockCount !== undefined && stockCount > 0 && (
                      <p>Stocked Quantity: {stockCount}</p>
                    )}
                    {dimensions && (
                      <p>{dimensions}</p>
                    )}
                    {!stockCount && !dimensions && product.description && (
                      <p className="text-charcoal/50 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity selector - only for standard items with stock */}
                {product.display_type !== 'custom_inquiry' && stockCount !== undefined && stockCount > 0 && (
                  <div className="flex items-center gap-4 py-4 border-y border-charcoal/8">
                    <span className="text-xs uppercase tracking-[0.15em] text-charcoal/50">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-8 h-8 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/60 hover:border-charcoal/40 transition-colors"
                      >
                        <span className="text-lg leading-none">−</span>
                      </motion.button>
                      <span className="text-charcoal font-display text-xl w-8 text-center tabular-nums">
                        {qty}
                      </span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setQty(Math.min(stockCount, qty + 1))}
                        className="w-8 h-8 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/60 hover:border-charcoal/40 transition-colors"
                      >
                        <span className="text-lg leading-none">+</span>
                      </motion.button>
                    </div>
                    <span className="text-[10px] text-charcoal/30 uppercase tracking-wider">
                      {stockCount} available
                    </span>
                  </div>
                )}
                
                {/* Custom inquiry notice for bespoke items */}
                {product.display_type === 'custom_inquiry' && (
                  <div className="py-4 border-y border-charcoal/8">
                    <p className="text-xs text-charcoal/50 leading-relaxed">
                      This piece is custom-built in our Denver workshop. Add to inquiry for pricing and availability.
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 space-y-3">
                  <motion.button
                    onClick={() => {
                      if (!product) return
                      if (isAdded) {
                        remove(product.id)
                      } else {
                        add({
                          id: product.id,
                          name: product.name,
                          category: product.category,
                          imageUrl,
                          dims_display: product.dims_display,
                        }, product.display_type === 'custom_inquiry' ? 1 : qty)
                      }
                    }}
                    className={cn(
                      'w-full py-4 px-6 min-h-[48px] rounded-lg',
                      'text-xs uppercase tracking-[0.12em] font-medium',
                      'transition-all duration-200 touch-manipulation',
                      isAdded
                        ? 'bg-cream text-charcoal border border-charcoal/20 hover:bg-sand/30'
                        : 'bg-charcoal text-white hover:bg-charcoal/90'
                    )}
                    whileTap={{ scale: 0.97 }}
                    layoutId={`add-btn-${product?.id}`}
                  >
                    {product.display_type === 'custom_inquiry' 
                      ? (isAdded ? 'Added to Inquiry' : 'Request Custom Pricing')
                      : (isAdded ? `Added (${getQuantity(product?.id ?? '')})` : `Add ${qty > 1 ? `${qty}× ` : ''}to Inquiry`)
                    }
                  </motion.button>
                  <p className="text-[9px] text-charcoal/30 text-center tracking-wider uppercase hidden sm:block">
                    Use arrow keys to browse • ESC to close
                  </p>
                  <p className="text-[9px] text-charcoal/30 text-center tracking-wider uppercase sm:hidden">
                    Swipe to browse
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom padding */}
            <div className="h-4" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
