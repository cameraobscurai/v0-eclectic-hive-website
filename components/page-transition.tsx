'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, createContext, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/animations'

// =============================================================================
// PAGE TRANSITION CONTEXT
// Enables programmatic navigation with subtle content swap
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

// =============================================================================
// SUBTLE BREATH TRANSITION
// Quick opacity dip that smooths the swap without demanding attention
// =============================================================================

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  const navigateWithTransition = useCallback((href: string) => {
    if (href === pathname || isTransitioning) return
    
    setIsTransitioning(true)
    router.push(href)
    
    // Brief transition state
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }, [pathname, isTransitioning, router])

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
    const timer = setTimeout(() => setIsFirstLoad(false), 50)
    return () => clearTimeout(timer)
  }, [])

  // Ultra-subtle: just a quick opacity breath
  const pageVariants = {
    initial: { opacity: 0.92 },
    enter: { 
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0.92,
      transition: { duration: 0.12, ease: 'easeIn' }
    },
  }

  const reducedMotionVariants = {
    initial: { opacity: 1 },
    enter: { opacity: 1 },
    exit: { opacity: 1 },
  }

  const variants = reducedMotion ? reducedMotionVariants : pageVariants

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={isFirstLoad ? false : 'initial'}
        animate="enter"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Legacy export for backwards compatibility
export function PageOverlay() {
  return null
}

// =============================================================================
// TRANSITION LINK
// Drop-in link with subtle transition
// =============================================================================

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigateWithTransition, isTransitioning } = usePageTransition()
  const router = useRouter()
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return
    
    e.preventDefault()
    if (!isTransitioning) {
      onClick?.(e)
      navigateWithTransition(href)
    }
  }
  
  const handleMouseEnter = () => {
    router.prefetch(href)
  }
  
  return (
    <a 
      href={href} 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}

// Animation variants for components
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}
