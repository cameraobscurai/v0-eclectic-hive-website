'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Plus, Check } from 'lucide-react'
import type { AffinityProduct } from '@/lib/affinity'
import type { ShortlistedItem } from '@/lib/inquiry-store'
import { ProductImage } from '@/components/ui/product-image'

// ─── Internal normalized shape ────────────────────────────────────────────────

interface GridItem {
  id: string
  name: string
  category: string
  imageUrl?: string
  primaryImageUrl?: string  // Raw path for ProductImage to resolve
  updatedAt?: string
  dims_display?: string
}

function normalize(item: ShortlistedItem | AffinityProduct): GridItem {
  // ShortlistedItem has imageUrl (already resolved); AffinityProduct has primary_image_url (raw)
  if ('imageUrl' in item) {
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      imageUrl: item.imageUrl,
      dims_display: item.dims_display,
    }
  }
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    primaryImageUrl: item.primary_image_url,
    updatedAt: item.updated_at,
    dims_display: item.dims_display,
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ShortlistGridProps {
  items: (ShortlistedItem | AffinityProduct)[]
  // Show remove button on hover (for owned items)
  onRemove?: (id: string) => void
  // Show add button on hover (for suggestion items)
  onAdd?: (item: GridItem) => void
  isAdded?: (id: string) => boolean
  // Clicking a card body calls this
  onSelect?: (item: GridItem) => void
  // Label above the grid
  label?: string
  // Clips grid, shows "+N more" overflow tile
  maxVisible?: number
  moreHref?: string
  // Tighter layout for space-constrained contexts
  compact?: boolean
  // Empty state
  emptyMessage?: string
  emptyAction?: { label: string; href: string }
  className?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ShortlistGrid({
  items,
  onRemove,
  onAdd,
  isAdded,
  onSelect,
  label,
  maxVisible,
  moreHref = '/collection',
  compact = false,
  emptyMessage,
  emptyAction,
  className,
}: ShortlistGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const normalized = items.map(normalize)
  const visible    = maxVisible ? normalized.slice(0, maxVisible) : normalized
  const overflow   = maxVisible ? Math.max(0, normalized.length - maxVisible) : 0

  // ── Empty state ────────────────────────────────────────────────────────────
  if (normalized.length === 0 && emptyMessage) {
    return (
      <div className={cn('space-y-3', className)}>
        {label && (
          <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/40">{label}</p>
        )}
        <p className="text-charcoal/30 text-sm">{emptyMessage}</p>
        {emptyAction && (
          <a
            href={emptyAction.href}
            className="text-xs uppercase tracking-[0.12em] text-charcoal/50 hover:text-charcoal underline underline-offset-4 transition-colors"
          >
            {emptyAction.label}
          </a>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/40">{label}</p>
      )}

      <div
        className={cn(
          'grid',
          compact
            ? 'grid-cols-3 gap-[2px]'
            : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[3px]',
        )}
      >
        {visible.map((item) => {
          const isHov  = hoveredId === item.id
          const added  = isAdded?.(item.id) ?? false

          return (
            <motion.div
              key={item.id}
              className="relative overflow-hidden cursor-pointer bg-charcoal/[0.03] aspect-square"
              onHoverStart={() => setHoveredId(item.id)}
              onHoverEnd={() => setHoveredId(null)}
              animate={{
                opacity: hoveredId && !isHov ? 0.5 : 1,
                filter:  hoveredId && !isHov ? 'saturate(0.6)' : 'saturate(1)',
              }}
              transition={{ duration: 0.15 }}
              onClick={() => onSelect?.(item)}
            >
              {/* Image - uses ProductImage for inventory/ path resolution and fallback */}
              <ProductImage
                src={item.imageUrl || item.primaryImageUrl}
                alt={item.name}
                updatedAt={item.updatedAt}
                className={cn(
                  'w-full h-full p-2 transition-transform duration-500',
                  isHov && 'scale-[1.04]',
                )}
                containerClassName="absolute inset-0"
                fit="contain"
                showShimmer={false}
              />

              {/* Hover overlay */}
              <AnimatePresence>
                {isHov && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex flex-col justify-between p-2"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(26,26,26,0.82) 0%, transparent 55%)',
                    }}
                  >
                    {/* Top-right action */}
                    <div className="flex justify-end">
                      {onRemove && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemove(item.id) }}
                          className="w-6 h-6 rounded-full bg-charcoal/70 backdrop-blur-sm flex items-center justify-center text-cream hover:bg-charcoal transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {onAdd && !onRemove && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onAdd(item) }}
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                            added
                              ? 'bg-cream text-charcoal'
                              : 'bg-charcoal/70 backdrop-blur-sm text-cream hover:bg-cream hover:text-charcoal',
                          )}
                          aria-label={added ? `Added: ${item.name}` : `Add ${item.name}`}
                        >
                          {added ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* Bottom name */}
                    <motion.p
                      initial={{ y: 4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.04 }}
                      className="text-[9px] uppercase tracking-[0.12em] text-cream leading-tight line-clamp-2"
                    >
                      {item.name}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {/* Overflow tile */}
        {overflow > 0 && (
          <a
            href={moreHref}
            className="aspect-square bg-charcoal/5 flex items-center justify-center hover:bg-charcoal/10 transition-colors"
          >
            <span className="text-[10px] uppercase tracking-[0.12em] text-charcoal/40">
              +{overflow}
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
