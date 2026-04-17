/**
 * AAA-Level Animation System
 * 
 * Design Principles:
 * 1. Performance-first: GPU-accelerated transforms, will-change optimization
 * 2. Accessibility: Respects prefers-reduced-motion
 * 3. Mobile-first: Reduced complexity on touch devices
 * 4. Cinematic: Film-inspired easing and timing
 * 5. Conversion-focused: Subtle animations that guide attention
 */

// =============================================================================
// EASING FUNCTIONS - Film-inspired curves
// =============================================================================

export const EASINGS = {
  // Cinematic easing - smooth and elegant
  cinematic: [0.22, 1, 0.36, 1] as const,
  
  // Quick start, smooth landing - great for entrances
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  
  // Slow start, quick end - great for exits
  easeInExpo: [0.7, 0, 0.84, 0] as const,
  
  // Bounce effect - subtle physical feel
  easeOutBack: [0.34, 1.56, 0.64, 1] as const,
  
  // Spring-like - natural movement
  spring: [0.5, 1.5, 0.8, 1] as const,
  
  // Sharp and precise
  sharp: [0.4, 0, 0.2, 1] as const,
  
  // Smooth throughout
  smooth: [0.4, 0, 0.6, 1] as const,
} as const

// CSS versions for non-Framer Motion use
export const CSS_EASINGS = {
  cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeOutExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeInExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  spring: 'cubic-bezier(0.5, 1.5, 0.8, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const

// =============================================================================
// TIMING - Consistent duration scales
// =============================================================================

export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.0,
  cinematic: 1.2,
} as const

export const STAGGER = {
  tight: 0.03,
  normal: 0.05,
  relaxed: 0.08,
  dramatic: 0.12,
} as const

// =============================================================================
// FRAMER MOTION VARIANTS - Reusable animation configs
// =============================================================================

// Page transition variants
export const pageVariants = {
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
      staggerChildren: STAGGER.normal,
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

// Fade up - most common reveal animation
export const fadeUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
  },
  visible: (delay: number = 0) => ({
    opacity: 1, 
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      delay,
      ease: EASINGS.cinematic,
    },
  }),
}

// Fade in - simple opacity
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: DURATIONS.normal,
      delay,
      ease: EASINGS.smooth,
    },
  }),
}

// Scale up - for images and cards
export const scaleUpVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: (delay: number = 0) => ({
    opacity: 1, 
    scale: 1,
    transition: {
      duration: DURATIONS.slow,
      delay,
      ease: EASINGS.cinematic,
    },
  }),
}

// Slide from left
export const slideLeftVariants = {
  hidden: { 
    opacity: 0, 
    x: -60,
  },
  visible: (delay: number = 0) => ({
    opacity: 1, 
    x: 0,
    transition: {
      duration: DURATIONS.slow,
      delay,
      ease: EASINGS.cinematic,
    },
  }),
}

// Slide from right
export const slideRightVariants = {
  hidden: { 
    opacity: 0, 
    x: 60,
  },
  visible: (delay: number = 0) => ({
    opacity: 1, 
    x: 0,
    transition: {
      duration: DURATIONS.slow,
      delay,
      ease: EASINGS.cinematic,
    },
  }),
}

// Stagger container
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.1,
    },
  },
}

// Stagger item
export const staggerItemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: {
    opacity: 1, 
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      ease: EASINGS.cinematic,
    },
  },
}

// Reveal overlay (wipe effect)
export const revealOverlayVariants = {
  hidden: { scaleY: 1 },
  visible: {
    scaleY: 0,
    transition: {
      duration: DURATIONS.cinematic,
      ease: EASINGS.cinematic,
    },
  },
}

// Text character reveal
export const charRevealVariants = {
  hidden: { 
    y: '100%',
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.slow,
      delay: i * STAGGER.tight,
      ease: EASINGS.cinematic,
    },
  }),
}

// =============================================================================
// SCROLL ANIMATION CONFIGS
// =============================================================================

export const SCROLL_TRIGGERS = {
  // When element is 10% in view
  early: { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
  // When element is 30% in view (default)
  normal: { threshold: 0.1, rootMargin: '0px 0px -100px 0px' },
  // When element is centered
  center: { threshold: 0.5, rootMargin: '0px' },
  // Just before element enters
  anticipate: { threshold: 0.01, rootMargin: '0px 0px 100px 0px' },
}

// =============================================================================
// PERFORMANCE OPTIMIZATIONS
// =============================================================================

export const GPU_ACCELERATED_PROPERTIES = [
  'transform',
  'opacity',
  'filter',
] as const

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get optimized animation config based on device/preference
export function getAnimationConfig(baseConfig: {
  duration: number
  ease: readonly number[]
}) {
  if (prefersReducedMotion()) {
    return {
      duration: 0.01,
      ease: [0, 0, 1, 1] as const,
    }
  }
  return baseConfig
}

// Will-change helper - apply before animation, remove after
export function applyWillChange(element: HTMLElement, properties: string[]) {
  element.style.willChange = properties.join(', ')
  return () => {
    element.style.willChange = 'auto'
  }
}

// =============================================================================
// CONVERSION-FOCUSED ANIMATIONS
// =============================================================================

// Attention pulse - draws eye to CTA
export const attentionPulseVariants = {
  idle: { scale: 1 },
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: EASINGS.smooth,
    },
  },
}

// Hover lift - premium feel for cards
export const hoverLiftVariants = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: { 
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.cinematic,
    },
  },
}

// Button press feedback
export const buttonPressVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: DURATIONS.fast, ease: EASINGS.smooth },
  },
  tap: { 
    scale: 0.98,
    transition: { duration: DURATIONS.instant },
  },
}

// Image zoom on hover
export const imageZoomVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: DURATIONS.slower,
      ease: EASINGS.cinematic,
    },
  },
}

// =============================================================================
// VIEWPORT-AWARE ANIMATIONS
// =============================================================================

export const viewportAnimationConfig = {
  // Default: animate once when in view
  once: true,
  // Start animation when 20% of element is visible
  amount: 0.2,
  // Margin around viewport for triggering
  margin: '-100px 0px',
}

// =============================================================================
// DEVICE-SPECIFIC CONFIGS
// =============================================================================

export function getDeviceAnimationScale(): number {
  if (typeof window === 'undefined') return 1
  
  // Reduce animation intensity on mobile
  if (window.innerWidth < 768) return 0.6
  // Slightly reduce on tablets
  if (window.innerWidth < 1024) return 0.8
  // Full animations on desktop
  return 1
}

export function scaleAnimation(
  distance: number, 
  duration: number
): { distance: number; duration: number } {
  const scale = getDeviceAnimationScale()
  return {
    distance: distance * scale,
    duration: duration * (scale < 1 ? 0.8 : 1), // Faster on mobile
  }
}
