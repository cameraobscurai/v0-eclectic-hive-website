/**
 * Animation System - Trimmed to only exports that are actually used
 * Performance-first, respects prefers-reduced-motion
 */

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

export const EASINGS = {
  cinematic: [0.22, 1, 0.36, 1] as const,
  smooth: [0.4, 0, 0.6, 1] as const,
} as const

export const CSS_EASINGS = {
  cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const

// =============================================================================
// TIMING
// =============================================================================

export const DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
} as const

export const STAGGER = {
  normal: 0.05,
} as const

// =============================================================================
// FRAMER MOTION VARIANTS - Only those actually imported
// =============================================================================

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slow, delay, ease: EASINGS.cinematic },
  }),
}

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: DURATIONS.normal, delay, ease: EASINGS.smooth },
  }),
}

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.slow, delay, ease: EASINGS.cinematic },
  }),
}

export const slideLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.slow, delay, ease: EASINGS.cinematic },
  }),
}

export const slideRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: DURATIONS.slow, delay, ease: EASINGS.cinematic },
  }),
}

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: STAGGER.normal, delayChildren: 0.1 },
  },
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.slow, ease: EASINGS.cinematic },
  },
}

export const hoverLiftVariants = {
  rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: DURATIONS.normal, ease: EASINGS.cinematic },
  },
}

export const buttonPressVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: DURATIONS.fast, ease: EASINGS.smooth } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
}

export const imageZoomVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: DURATIONS.slower, ease: EASINGS.cinematic } },
}

// =============================================================================
// UTILITIES
// =============================================================================

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const viewportAnimationConfig = {
  once: true,
  amount: 0.2,
  margin: '-100px 0px',
}
