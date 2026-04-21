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
// CINEMATIC WIPE TRANSITION
// Theatrical bars that slide across screen
// =============================================================================

const WIPE_BAR_COUNT = 5

// Wipe bar animation - staggered entrance/exit
const wipeBarVariants = {
  hidden: (i: number) => ({
    y: '100%',
    transition: {
      duration: 0.6,
      ease: EASINGS.cinematic,
      delay: i * 0.06,
    },
  }),
  visible: (i: number) => ({
    y: '0%',
    transition: {
      duration: 0.6,
      ease: EASINGS.cinematic,
      delay: i * 0.06,
    },
  }),
  exit: (i: number) => ({
    y: '-100%',
    transition: {
      duration: 0.5,
      ease: EASINGS.cinematic,
      delay: (WIPE_BAR_COUNT - 1 - i) * 0.04, // Reverse stagger
    },
  }),
}

// Page content variants
const pageVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: EASINGS.cinematic,
      delay: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
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
  const [showWipe, setShowWipe] = useState(false)
  const [wipePhase, setWipePhase] = useState<'idle' | 'enter' | 'exit'>('idle')
  const [pendingHref, setPendingHref] = useState<string | null>(null)
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
    setShowWipe(true)
    setWipePhase('enter')
    setPendingHref(href)
  }, [pathname, isTransitioning, reducedMotion, router])

  // Handle wipe phases
  useEffect(() => {
    if (wipePhase === 'enter' && pendingHref) {
      const timer = setTimeout(() => {
        router.push(pendingHref)
      }, 450) // Wait for bars to cover screen
      return () => clearTimeout(timer)
    }
  }, [wipePhase, pendingHref, router])

  // When pathname changes after navigation
  useEffect(() => {
    if (isTransitioning && pendingHref === pathname) {
      // Small delay then exit
      const timer = setTimeout(() => {
        setWipePhase('exit')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname, isTransitioning, pendingHref])

  // Cleanup after exit
  useEffect(() => {
    if (wipePhase === 'exit') {
      const timer = setTimeout(() => {
        setShowWipe(false)
        setWipePhase('idle')
        setIsTransitioning(false)
        setPendingHref(null)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [wipePhase])

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      {/* Cinematic Wipe Overlay */}
      <AnimatePresence>
        {showWipe && (
          <div className="fixed inset-0 z-[9999] pointer-events-none flex" aria-hidden="true">
            {Array.from({ length: WIPE_BAR_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate={wipePhase === 'exit' ? 'exit' : 'visible'}
                variants={wipeBarVariants}
                className="flex-1 h-full"
                style={{
                  backgroundColor: `hsl(30, 8%, ${8 + i * 1.5}%)`, // Subtle charcoal variations
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
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
