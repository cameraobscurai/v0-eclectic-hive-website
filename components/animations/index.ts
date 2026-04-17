/**
 * Animation Components - AAA Level Animation System
 * 
 * Usage:
 * import { MotionFadeUp, Parallax, WordReveal } from '@/components/animations'
 * 
 * Components:
 * - Viewport Triggered: MotionFadeUp, MotionFadeIn, MotionScaleUp, MotionSlide
 * - Staggered: MotionStagger, MotionStaggerItem
 * - Scroll-Linked: Parallax, ScrollProgress, ScrollScale, ScrollRotate
 * - Interaction: HoverLift, MotionButton, ImageHoverZoom, Magnetic
 * - Text: SplitText, WordReveal
 * - Reveal: Reveal (wipe effect)
 * - Marquee: Marquee (infinite scroll)
 * 
 * Legacy (still available):
 * - ScrollSection, ImageReveal, Counter, SplitImage (from scroll-section.tsx)
 * - TextReveal, HighlightText, FadeUp, LineReveal (from text-reveal.tsx)
 */

// New Framer Motion components
export {
  // Viewport-triggered
  MotionFadeUp,
  MotionFadeIn,
  MotionScaleUp,
  MotionSlide,
  
  // Staggered animations
  MotionStagger,
  MotionStaggerItem,
  
  // Scroll-linked
  Parallax,
  ScrollProgress,
  ScrollScale,
  ScrollRotate,
  
  // Interaction
  HoverLift,
  MotionButton,
  ImageHoverZoom,
  Magnetic,
  
  // Text animations
  SplitText,
  WordReveal,
  
  // Reveal effects
  Reveal,
  
  // Marquee
  Marquee,
} from './motion-elements'

// Legacy CSS-based components (still performant, no JS bundle increase)
export {
  ScrollSection,
  ImageReveal,
  Counter,
  SplitImage,
} from './scroll-section'

export {
  TextReveal,
  HighlightText,
  FadeUp,
  StaggerContainer,
  LineReveal,
} from './text-reveal'
