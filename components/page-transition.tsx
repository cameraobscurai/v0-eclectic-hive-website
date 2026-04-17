'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { EASINGS, DURATIONS, prefersReducedMotion } from '@/lib/animations'

interface PageTransitionProps {
  children: ReactNode
}

// Cinematic page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(4px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.cinematic,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(2px)',
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.cinematic,
    },
  },
}

// Overlay transition for dramatic effect
const overlayVariants = {
  initial: { scaleY: 1 },
  enter: { 
    scaleY: 0,
    transition: {
      duration: DURATIONS.slower,
      ease: EASINGS.cinematic,
      delay: 0.1,
    }
  },
  exit: { 
    scaleY: 1,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.cinematic,
    }
  },
}

// Reduced motion variants - instant transition
const reducedMotionVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    setReducedMotion(prefersReducedMotion())
    
    // Skip dramatic transition on first load
    const timer = setTimeout(() => setIsFirstLoad(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Use instant transition for reduced motion
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

// Dramatic overlay transition (optional - for more cinematic effect)
export function PageOverlay() {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`overlay-${pathname}`}
        className="fixed inset-0 z-[60] bg-charcoal origin-top pointer-events-none"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={overlayVariants}
      />
    </AnimatePresence>
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
