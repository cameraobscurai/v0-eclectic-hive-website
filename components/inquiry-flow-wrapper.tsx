'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useInquiryStore } from '@/lib/inquiry-store'
import { InquiryFlow } from '@/components/inquiry-flow'

/**
 * Client wrapper that connects the inquiry store to InquiryFlow.
 * Passes shortlisted items from collection browsing into the contact form.
 * 
 * Cart handoff: When arriving from /collection with items:
 * - URL contains only item IDs (e.g., ?items=abc,def,ghi) to avoid URL length limits
 * - Full item data is hydrated from Zustand store (persisted in sessionStorage)
 * - This keeps URLs clean while maintaining full cart data
 */
export function InquiryFlowWrapper({ onSuccess }: { onSuccess?: () => void }) {
  const { items: storeItems, clear } = useInquiryStore()
  const searchParams = useSearchParams()
  const formRef = useRef<HTMLDivElement>(null)
  
  // Hydrate items from URL param IDs using Zustand store data
  // URL contains comma-separated IDs; full data stays in sessionStorage
  const items = useMemo(() => {
    const urlItemIds = searchParams.get('items')
    if (urlItemIds) {
      const ids = decodeURIComponent(urlItemIds).split(',').filter(Boolean)
      // Filter store items to only those in URL (handles stale IDs gracefully)
      return storeItems.filter(item => ids.includes(item.id))
    }
    // No URL param = use all store items (direct navigation to /contact)
    return storeItems
  }, [searchParams, storeItems])
  
  // Auto-scroll to form when arriving from "Submit Inquiry" CTA or with items
  useEffect(() => {
    const shouldScroll = 
      window.location.hash === '#inquiry' || 
      items.length > 0
    
    if (shouldScroll && formRef.current) {
      // Small delay to let page render
      const timer = setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [items.length])
  
  return (
    <div ref={formRef} id="inquiry" className="scroll-mt-24">
      <InquiryFlow 
        onSuccess={() => {
          clear() // Clear shortlist after successful submission
          onSuccess?.()
        }}
        preselectedItems={items}
        autoFocus={items.length > 0 || (typeof window !== 'undefined' && window.location.hash === '#inquiry')}
      />
    </div>
  )
}
