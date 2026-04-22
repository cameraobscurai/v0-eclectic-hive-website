'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useCallback } from 'react'

// =============================================================================
// SIMPLIFIED PAGE TRANSITIONS
// 
// After multiple iterations, the cleanest approach is:
// - Use native browser navigation (no overlays that can flash)
// - Prefetch on hover for speed
// - Let Next.js handle the actual transition
// =============================================================================

interface TransitionContextType {
  navigateWithTransition: (href: string) => void
  isTransitioning: boolean
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
})

export const usePageTransition = () => useContext(TransitionContext)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const navigateWithTransition = useCallback((href: string) => {
    if (href === pathname) return
    router.push(href)
  }, [pathname, router])

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning: false }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function PageOverlay() {
  return null
}

// =============================================================================
// TRANSITION LINK - just prefetches on hover for speed
// =============================================================================

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigateWithTransition } = usePageTransition()
  const router = useRouter()
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow cmd/ctrl+click for new tab
    if (e.metaKey || e.ctrlKey) return
    e.preventDefault()
    onClick?.(e)
    navigateWithTransition(href)
  }
  
  return (
    <a 
      href={href} 
      onClick={handleClick}
      onMouseEnter={() => router.prefetch(href)}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}

// =============================================================================
// ANIMATION VARIANTS (for components that want motion)
// =============================================================================

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -24 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 24 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}
