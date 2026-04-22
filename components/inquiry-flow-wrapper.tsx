'use client'

import { useEffect, useRef } from 'react'
import { useInquiryStore } from '@/lib/inquiry-store'
import { InquiryFlow } from '@/components/inquiry-flow'

/**
 * Client wrapper that connects the inquiry store to InquiryFlow.
 * Passes shortlisted items from collection browsing into the contact form.
 * Auto-scrolls to form when arriving via #inquiry hash or with items in tray.
 */
export function InquiryFlowWrapper({ onSuccess }: { onSuccess?: () => void }) {
  const { items, clear } = useInquiryStore()
  const formRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to form when arriving from "Start Inquiry" CTA or with items in tray
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
