'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, createContext, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { EASINGS, DURATIONS, prefersReducedMotion } from '@/lib/animations'

// =============================================================================
// PAGE TRANSITION CONTEXT
// Enables programmatic navigation with cinematic wipe
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
// FOCUS PULL TRANSITION
// Cinematic blur-to-sharp crossfade - like a camera focus pull
// =============================================================================

// Page content variants with blur effect
const pageVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(12px)',
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASINGS.cinematic,
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 1.01,
    transition: {
      duration: 0.3,
      ease: EASINGS.cinematic,
    },
  },
}

// Reduced motion variants
const reducedMotionVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

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
    
    if (reducedMotion) {
      router.push(href)
      return
    }

    setIsTransitioning(true)
    // Navigate immediately - the blur transition handles the visual smoothness
    router.push(href)
    
    // Reset transitioning state after animation completes
    setTimeout(() => setIsTransitioning(false), 600)
  }, [pathname, isTransitioning, reducedMotion, router])

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
    const timer = setTimeout(() => setIsFirstLoad(false), 100)
    return () => clearTimeout(timer)
  }, [])

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
  return null // Replaced by wipe bars in PageTransitionProvider
}

// =============================================================================
// TRANSITION LINK
// Drop-in link with cinematic wipe transition
// =============================================================================

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigateWithTransition, isTransitioning } = usePageTransition()
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow cmd/ctrl click for new tab
    if (e.metaKey || e.ctrlKey) return
    
    e.preventDefault()
    if (!isTransitioning) {
      onClick?.(e)
      navigateWithTransition(href)
    }
  }
  
  return (
    <a 
      href={href} 
      onClick={handleClick} 
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}

// Stagger container for child animations
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

// Fade up animation for individual elements
export const fadeUp = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: 'blur(4px)',
  },
  show: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Scale up animation
export const scaleUp = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Slide in from left
export const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -40,
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Slide in from right
export const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 40,
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}
