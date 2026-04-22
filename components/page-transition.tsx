'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, createContext, useContext, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/animations'

// =============================================================================
// TIERED PAGE TRANSITION SYSTEM
// 
// 1. HOME & CONTACT: Dramatic vertical bars (cinematic entrance/exit)
// 2. MIDDLE PAGES (Collection, Gallery, Process): Monochromatic wipe (visible but quick)
// 3. DEFAULT: Subtle opacity breath (barely noticeable)
// =============================================================================

type TransitionTier = 'dramatic' | 'wipe' | 'subtle'

function getTransitionTier(pathname: string): TransitionTier {
  // Home and Contact get dramatic bar animation
  if (pathname === '/' || pathname === '/contact') {
    return 'dramatic'
  }
  // Middle pages get visible wipe
  if (['/collection', '/gallery', '/process'].includes(pathname)) {
    return 'wipe'
  }
  // Everything else (admin, etc) gets subtle
  return 'subtle'
}

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
// PROVIDER - orchestrates transition timing based on destination tier
// =============================================================================

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayPhase, setOverlayPhase] = useState<'cover' | 'reveal' | null>(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion()
  }, [])

  const navigateWithTransition = useCallback((href: string) => {
    if (href === pathname || isTransitioning) return
    
    const tier = getTransitionTier(href)
    setIsTransitioning(true)
    setTargetPath(href)
    
    if (reducedMotion.current || tier === 'subtle') {
      // Subtle: just navigate with minimal fade
      router.push(href)
      setTimeout(() => setIsTransitioning(false), 200)
    } else {
      // Dramatic or Wipe: 
      // 1. Cover screen with overlay
      // 2. Navigate while covered
      // 3. Reveal new page
      setShowOverlay(true)
      setOverlayPhase('cover')
      
      const coverDuration = tier === 'dramatic' ? 450 : 300
      const revealDuration = tier === 'dramatic' ? 450 : 300
      
      // Wait for cover animation to complete
      setTimeout(() => {
        // Navigate while fully covered
        router.push(href)
        
        // Small delay to let new page start rendering
        setTimeout(() => {
          setOverlayPhase('reveal')
          
          // Wait for reveal animation to complete
          setTimeout(() => {
            setShowOverlay(false)
            setOverlayPhase(null)
            setIsTransitioning(false)
            setTargetPath(null)
          }, revealDuration)
        }, 50)
      }, coverDuration)
    }
  }, [pathname, isTransitioning, router])

  const tier = targetPath ? getTransitionTier(targetPath) : 'subtle'

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      {/* Transition Overlays */}
      <AnimatePresence>
        {showOverlay && tier === 'dramatic' && (
          <DramaticBarsOverlay phase={overlayPhase} />
        )}
        {showOverlay && tier === 'wipe' && (
          <WipeOverlay phase={overlayPhase} />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}

// =============================================================================
// DRAMATIC BARS - vertical bars sweep for Home/Contact
// =============================================================================

function DramaticBarsOverlay({ phase }: { phase: 'cover' | 'reveal' | null }) {
  const barCount = 5
  
  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none flex"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.3 } }}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-charcoal"
          style={{ 
            transformOrigin: phase === 'cover' ? 'top' : 'bottom'
          }}
          initial={{ scaleY: 0 }}
          animate={{ 
            scaleY: phase === 'cover' ? 1 : 0,
          }}
          transition={{
            duration: 0.35,
            delay: phase === 'cover' 
              ? i * 0.04 // Stagger in from left
              : (barCount - 1 - i) * 0.04, // Stagger out from right
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}
    </motion.div>
  )
}

// =============================================================================
// WIPE OVERLAY - covers then reveals (same direction, no flash)
// =============================================================================

function WipeOverlay({ phase }: { phase: 'cover' | 'reveal' | null }) {
  // Key insight: wipe goes LEFT-TO-RIGHT to cover, then CONTINUES LEFT-TO-RIGHT to reveal
  // This way old page is never visible - overlay fully covers before navigation
  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none bg-cream"
      initial={{ x: '-100%' }}
      animate={{ 
        x: phase === 'cover' ? '0%' : '100%',
      }}
      transition={{
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  )
}

// =============================================================================
// PAGE TRANSITION WRAPPER - subtle opacity for content
// =============================================================================

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion()
    const timer = setTimeout(() => setIsFirstLoad(false), 50)
    return () => clearTimeout(timer)
  }, [])

  const pageVariants = {
    initial: { opacity: 0.96 },
    enter: { 
      opacity: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0.96,
      transition: { duration: 0.1, ease: 'easeIn' }
    },
  }

  const reducedMotionVariants = {
    initial: { opacity: 1 },
    enter: { opacity: 1 },
    exit: { opacity: 1 },
  }

  const variants = reducedMotion.current ? reducedMotionVariants : pageVariants

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
// TRANSITION LINK - drop-in replacement for <a> with transitions
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

// =============================================================================
// ANIMATION VARIANTS - for component-level animations
// =============================================================================

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
