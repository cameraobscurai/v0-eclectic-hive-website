'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * ScrollReset - Guarantees scroll works after route change
 * 
 * Root cause of scroll bugs: Race conditions where modals/menus
 * set overflow:hidden but unmount before cleanup runs.
 * 
 * Fix: Aggressively clear ALL scroll-blocking styles on every
 * route change using removeProperty (not empty string assignment).
 */
export function ScrollReset() {
  const pathname = usePathname()
  const isFirstRender = useRef(true)
  
  useEffect(() => {
    // Skip the very first render (page load)
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    
    // Force clear all scroll-blocking styles
    const resetScroll = () => {
      // Use removeProperty - empty string assignment doesn't fully clear on all browsers
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('overflow-y')
      document.body.style.removeProperty('overflow-x')
      document.body.style.removeProperty('position')
      document.body.style.removeProperty('top')
      document.body.style.removeProperty('left')
      document.body.style.removeProperty('right')
      document.body.style.removeProperty('width')
      document.body.style.removeProperty('height')
      document.body.style.removeProperty('touch-action')
      
      // Clear html element too
      document.documentElement.style.removeProperty('overflow')
      document.documentElement.style.removeProperty('overflow-y')
      document.documentElement.style.removeProperty('overflow-x')
      document.documentElement.style.removeProperty('position')
      document.documentElement.style.removeProperty('touch-action')
      
      // Reset the scroll lock module counter
      if (typeof window !== 'undefined') {
        (window as any).__scrollLockCount = 0
      }
      
      // Force scroll to be enabled via direct style (belt and suspenders)
      document.body.style.overflowY = 'auto'
      document.documentElement.style.overflowY = 'auto'
      
      // Then remove it after a tick so CSS classes can take over
      requestAnimationFrame(() => {
        document.body.style.removeProperty('overflow-y')
        document.documentElement.style.removeProperty('overflow-y')
      })
    }
    
    // Run immediately
    resetScroll()
    
    // Run again after hydration completes (catches async style applications)
    const t1 = setTimeout(resetScroll, 50)
    const t2 = setTimeout(resetScroll, 150)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname])
  
  return null
}
