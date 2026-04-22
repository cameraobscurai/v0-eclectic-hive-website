'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, createContext, useContext, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { prefersReducedMotion } from '@/lib/animations'

// =============================================================================
// SIMPLIFIED PAGE TRANSITION SYSTEM
// 
// 1. HOME & CONTACT: Dramatic vertical bars
// 2. MIDDLE PAGES: Quick wipe
// 3. DEFAULT: Instant (no animation)
// =============================================================================

type TransitionTier = 'dramatic' | 'wipe' | 'subtle'

function getTransitionTier(pathname: string): TransitionTier {
  if (pathname === '/' || pathname === '/contact') {
    return 'dramatic'
  }
  if (['/collection', '/gallery', '/process', '/atelier'].includes(pathname)) {
    return 'wipe'
  }
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
// PROVIDER
// =============================================================================

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [overlay, setOverlay] = useState<{ tier: TransitionTier; phase: 'in' | 'out' } | null>(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion()
  }, [])

  const navigateWithTransition = useCallback((href: string) => {
    if (href === pathname || isTransitioning) return
    
    const tier = getTransitionTier(href)
    
    // Subtle = instant navigation, no animation
    if (reducedMotion.current || tier === 'subtle') {
      router.push(href)
      return
    }
    
    setIsTransitioning(true)
    setOverlay({ tier, phase: 'in' })
    
    // Timing: overlay animates in, then we navigate
    const inDuration = tier === 'dramatic' ? 400 : 250
    
    setTimeout(() => {
      router.push(href)
      // Start exit animation immediately after navigation
      setOverlay({ tier, phase: 'out' })
      
      const outDuration = tier === 'dramatic' ? 400 : 250
      setTimeout(() => {
        setOverlay(null)
        setIsTransitioning(false)
      }, outDuration)
    }, inDuration)
  }, [pathname, isTransitioning, router])

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      <AnimatePresence>
        {overlay?.tier === 'dramatic' && (
          <DramaticBars phase={overlay.phase} key="dramatic" />
        )}
        {overlay?.tier === 'wipe' && (
          <Wipe phase={overlay.phase} key="wipe" />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}

// =============================================================================
// DRAMATIC BARS
// =============================================================================

function DramaticBars({ phase }: { phase: 'in' | 'out' }) {
  const barCount = 5
  
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-charcoal origin-top"
          initial={{ scaleY: phase === 'in' ? 0 : 1 }}
          animate={{ scaleY: phase === 'in' ? 1 : 0 }}
          style={{ 
            transformOrigin: phase === 'in' ? 'top' : 'bottom'
          }}
          transition={{
            duration: 0.3,
            delay: phase === 'in' ? i * 0.03 : (barCount - 1 - i) * 0.03,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}
    </div>
  )
}

// =============================================================================
// WIPE - single panel slides across
// =============================================================================

function Wipe({ phase }: { phase: 'in' | 'out' }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none bg-cream"
      initial={{ x: phase === 'in' ? '-100%' : '0%' }}
      animate={{ x: phase === 'in' ? '0%' : '100%' }}
      transition={{
        duration: 0.25,
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  )
}

// =============================================================================
// PAGE TRANSITION WRAPPER - minimal
// =============================================================================

export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function PageOverlay() {
  return null
}

// =============================================================================
// TRANSITION LINK
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
// ANIMATION VARIANTS
// =============================================================================

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
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
