'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, createContext, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { EASINGS, prefersReducedMotion } from '@/lib/animations'

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
// Single panel sweep with motion blur effect
// =============================================================================

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showWipe, setShowWipe] = useState(false)
  const [wipePhase, setWipePhase] = useState<'idle' | 'enter' | 'hold' | 'exit'>('idle')
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
    
    // Fire navigation immediately
    router.push(href)
  }, [pathname, isTransitioning, reducedMotion, router])

  // When pathname changes after navigation
  useEffect(() => {
    if (isTransitioning && pendingHref === pathname) {
      // Brief hold at full coverage
      setWipePhase('hold')
      const timer = setTimeout(() => {
        setWipePhase('exit')
      }, 80)
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
      }, 450)
      return () => clearTimeout(timer)
    }
  }, [wipePhase])

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      {/* Cinematic Wipe Overlay - single panel with motion blur */}
      <AnimatePresence>
        {showWipe && (
          <motion.div 
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            {/* Main wipe panel */}
            <motion.div
              className="absolute inset-0 bg-charcoal"
              initial={{ x: '-100%' }}
              animate={
                wipePhase === 'exit' 
                  ? { x: '100%' }
                  : { x: '0%' }
              }
              transition={{
                duration: wipePhase === 'exit' ? 0.4 : 0.35,
                ease: EASINGS.cinematic,
              }}
            >
              {/* Motion blur trailing edge effect */}
              <div 
                className="absolute inset-y-0 -right-32 w-32"
                style={{
                  background: 'linear-gradient(to right, rgba(26,26,26,1) 0%, rgba(26,26,26,0.6) 30%, rgba(26,26,26,0) 100%)',
                  filter: 'blur(8px)',
                }}
              />
              
              {/* Subtle grain texture */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />
            </motion.div>
            
            {/* Leading edge highlight */}
            <motion.div
              className="absolute inset-y-0 w-px bg-cream/10"
              initial={{ x: '-1px' }}
              animate={
                wipePhase === 'exit'
                  ? { x: 'calc(100vw + 1px)' }
                  : { x: 'calc(100vw - 1px)' }
              }
              transition={{
                duration: wipePhase === 'exit' ? 0.4 : 0.35,
                ease: EASINGS.cinematic,
              }}
            />
          </motion.div>
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

  // Page content variants - subtle fade only, wipe handles the drama
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut', delay: 0.1 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.15, ease: 'easeIn' }
    },
  }

  const reducedMotionVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
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
// Drop-in link with cinematic wipe transition
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
