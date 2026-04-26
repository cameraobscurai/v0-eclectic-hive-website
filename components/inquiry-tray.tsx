'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInquiryStore } from '@/lib/inquiry-store'
import { TransitionLink } from '@/components/page-transition'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function InquiryTray() {
  const { items, remove, totalCount, clear } = useInquiryStore()
  const count = totalCount()
  const router = useRouter()
  
  // Build URL with only item IDs (not full JSON) to avoid URL length limits
  // Full item data stays in Zustand store and is read on the contact page
  const handleSubmitInquiry = () => {
    const ids = items.map(i => i.id).join(',')
    router.push(`/contact?items=${encodeURIComponent(ids)}#inquiry`)
  }

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
                     bg-charcoal text-cream rounded-full
                     pl-5 pr-3 py-3 flex items-center gap-4
                     shadow-2xl shadow-charcoal/30"
        >
          {/* Item count */}
          <span className="text-xs uppercase tracking-[0.12em] text-cream/70">
            {count} {count === 1 ? 'piece' : 'pieces'}
          </span>

          {/* Mini thumbnails */}
          <div className="flex -space-x-2">
            {items.slice(0, 4).map((item) => (
              <motion.div
                key={item.id}
                layoutId={`tray-thumb-${item.id}`}
                className="relative w-9 h-9 rounded-full overflow-hidden
                           border-2 border-charcoal bg-sand/20 group"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] text-cream/40 uppercase">
                    {item.name.charAt(0)}
                  </div>
                )}
                {/* Remove on hover */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    remove(item.id)
                  }}
                  className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 
                             flex items-center justify-center transition-opacity"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3 h-3 text-cream" />
                </button>
                {/* Quantity badge */}
                {item.quantity > 1 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-sand text-charcoal 
                                   text-[8px] flex items-center justify-center font-medium">
                    {item.quantity}
                  </span>
                )}
              </motion.div>
            ))}
            {items.length > 4 && (
              <div className="w-9 h-9 rounded-full bg-cream/10
                              border-2 border-charcoal
                              flex items-center justify-center
                              text-[10px] text-cream/60">
                +{items.length - 4}
              </div>
            )}
          </div>

          {/* Submit inquiry button */}
          <button
            onClick={handleSubmitInquiry}
            className="text-cream/70 hover:text-cream
                       px-3 py-2 text-[10px] uppercase tracking-[0.12em]
                       transition-colors"
          >
            Submit Inquiry
          </button>

          {/* Clear all button */}
          <button
            onClick={clear}
            className="w-8 h-8 rounded-full hover:bg-cream/10 
                       flex items-center justify-center transition-colors"
            aria-label="Clear all items"
          >
            <X className="w-4 h-4 text-cream/50" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
