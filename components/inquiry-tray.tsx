'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInquiryStore } from '@/lib/inquiry-store'
import { useRouter } from 'next/navigation'
import { X, ChevronUp, ChevronDown } from 'lucide-react'
import { ShortlistGrid } from '@/components/shortlist/shortlist-grid'
import { getAggregateSuggestions, type AffinityProduct } from '@/lib/affinity'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function InquiryTray() {
  const { items, remove, add, has, totalCount, clear } = useInquiryStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const count = totalCount()
  const router = useRouter()

  const handleSubmitInquiry = () => {
    const ids = items.map(i => i.id).join(',')
    router.push(`/contact?items=${encodeURIComponent(ids)}#inquiry`)
  }

  // Only fetch when expanded AND there are enough items to score against
  // null key = SWR does not fetch — zero cost when tray is just the pill
  const { data: poolData } = useSWR(
    isExpanded && items.length >= 2
      ? `/api/products?imagesOnly=true&limit=100`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  const suggestions = useMemo(() => {
    if (!poolData?.products?.length || items.length < 2) return []
    return getAggregateSuggestions(
      items as unknown as AffinityProduct[],
      poolData.products as AffinityProduct[],
      6,
    )
  }, [items, poolData?.products])

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          style={{ width: isExpanded ? 'min(480px, calc(100vw - 32px))' : 'auto' }}
        >
          <AnimatePresence mode="wait">

            {isExpanded ? (
              // ── Expanded panel ────────────────────────────────────────────
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="bg-charcoal text-cream rounded-2xl shadow-2xl shadow-charcoal/40 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-cream/10">
                  <span className="text-xs uppercase tracking-[0.15em] text-cream/60">
                    {count} {count === 1 ? 'piece' : 'pieces'} selected
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clear}
                      className="text-[10px] uppercase tracking-[0.12em] text-cream/30 hover:text-cream/60 transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-cream/50 hover:bg-cream/10 transition-colors"
                      aria-label="Collapse"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Your edit grid */}
                <div className="px-5 pt-4 pb-3">
                  <ShortlistGrid
                    items={items}
                    onRemove={remove}
                    compact
                    label="Your edit"
                  />
                </div>

                {/* Aggregate suggestions */}
                {suggestions.length > 0 && (
                  <div className="px-5 pb-4 border-t border-cream/8 pt-4">
                    <ShortlistGrid
                      items={suggestions}
                      onAdd={(item) =>
                        add({
                          id: item.id,
                          name: item.name,
                          category: item.category,
                          imageUrl: item.imageUrl,
                          dims_display: item.dims_display,
                        })
                      }
                      isAdded={has}
                      compact
                      label="Consider adding"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="px-5 pb-5 pt-3 flex gap-3">
                  <a
                    href="/studio"
                    className="flex-1 py-3 text-center text-[10px] uppercase tracking-[0.15em] text-cream/60 border border-cream/15 hover:border-cream/30 hover:text-cream transition-colors rounded-lg"
                  >
                    Build Proposal
                  </a>
                  <button
                    onClick={handleSubmitInquiry}
                    className="flex-1 py-3 text-[10px] uppercase tracking-[0.15em] bg-cream text-charcoal hover:bg-cream/90 transition-colors rounded-lg"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </motion.div>

            ) : (
              // ── Pill ──────────────────────────────────────────────────────
              <motion.div
                key="pill"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="bg-charcoal text-cream rounded-full pl-5 pr-3 py-3 flex items-center gap-4 shadow-2xl shadow-charcoal/30"
              >
                {/* Count — tapping expands */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs uppercase tracking-[0.12em] text-cream/70 hover:text-cream transition-colors"
                >
                  {count} {count === 1 ? 'piece' : 'pieces'}
                </button>

                {/* Thumbnails — tapping expands */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="flex -space-x-2"
                  aria-label="View your shortlist"
                >
                  {items.slice(0, 4).map((item) => (
                    <motion.div
                      key={item.id}
                      layoutId={`tray-thumb-${item.id}`}
                      className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-charcoal bg-sand/20"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            // Fall back to initial letter on broken tray thumbnail
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement
                            if (fallback) fallback.hidden = false
                          }}
                        />
                      ) : null}
                      <div
                        hidden={!!item.imageUrl}
                        className="absolute inset-0 flex items-center justify-center text-[8px] text-cream/40 uppercase"
                      >
                        {item.name.charAt(0)}
                      </div>
                      {item.quantity > 1 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-sand text-charcoal text-[8px] flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      )}
                    </motion.div>
                  ))}
                  {items.length > 4 && (
                    <div className="w-9 h-9 rounded-full bg-cream/10 border-2 border-charcoal flex items-center justify-center text-[10px] text-cream/60">
                      +{items.length - 4}
                    </div>
                  )}
                </button>

                {/* Expand chevron */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-8 h-8 rounded-full hover:bg-cream/10 flex items-center justify-center transition-colors"
                  aria-label="Expand shortlist"
                >
                  <ChevronUp className="w-4 h-4 text-cream/50" />
                </button>

                {/* Direct submit still works from pill */}
                <button
                  onClick={handleSubmitInquiry}
                  className="text-cream/70 hover:text-cream px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors"
                >
                  Submit
                </button>

                {/* Clear */}
                <button
                  onClick={clear}
                  className="w-8 h-8 rounded-full hover:bg-cream/10 flex items-center justify-center transition-colors"
                  aria-label="Clear all items"
                >
                  <X className="w-4 h-4 text-cream/50" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
