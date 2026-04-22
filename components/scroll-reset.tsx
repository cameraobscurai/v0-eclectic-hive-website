'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * ScrollReset - Clears any stuck scroll locks on route change
 * 
 * This is a safety net for race conditions where:
 * - A modal/menu sets overflow:hidden on body
 * - User navigates away before the cleanup runs
 * - The new page inherits the locked scroll state
 */
export function ScrollReset() {
  const pathname = usePathname()
  
  useEffect(() => {
    // On every route change, ensure body is scrollable
    // This runs AFTER the new page renders
    const resetScroll = () => {
      // Clear any inline styles that might be blocking scroll
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.height = ''
      
      // Also clear on html element just in case
      document.documentElement.style.overflow = ''
      document.documentElement.style.position = ''
      
      // Reset the scroll lock counter (imported module state)
      // This prevents stale lock counts from previous pages
      if (typeof window !== 'undefined') {
        (window as any).__scrollLockCount = 0
      }
    }
    
    // Run immediately on route change
    resetScroll()
    
    // Also run after a short delay to catch any async style applications
    const timeoutId = setTimeout(resetScroll, 100)
    
    return () => clearTimeout(timeoutId)
  }, [pathname])
  
  return null
}
