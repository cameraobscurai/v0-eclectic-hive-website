'use client'

import { useInquiryStore } from '@/lib/inquiry-store'
import { InquiryFlow } from '@/components/inquiry-flow'

/**
 * Client wrapper that connects the inquiry store to InquiryFlow.
 * Passes shortlisted items from collection browsing into the contact form.
 */
export function InquiryFlowWrapper({ onSuccess }: { onSuccess?: () => void }) {
  const { items, clear } = useInquiryStore()
  
  return (
    <InquiryFlow 
      onSuccess={() => {
        clear() // Clear shortlist after successful submission
        onSuccess?.()
      }}
      preselectedItems={items}
    />
  )
}
