'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/animations'

// =============================================================================
// TEXT MASK REVEAL - Vogue-style headline animation
// Text slides up from behind a mask, character by character or word by word
// =============================================================================

interface TextRevealProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  delay?: number
  staggerDelay?: number
  splitBy?: 'char' | 'word'
}

export function TextReveal({ 
  children, 
  className, 
  as: Tag = 'h2',
  delay = 0,
  staggerDelay = 0.03,
  splitBy = 'word'
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px 0px' })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  const items = splitBy === 'char' 
    ? children.split('') 
    : children.split(' ')

  if (reducedMotion) {
    return <Tag ref={ref as any} className={className}>{children}</Tag>
  }

  return (
    <Tag ref={ref as any} className={cn('overflow-hidden', className)}>
      {items.map((item, i) => (
        <span 
          key={i} 
          className="inline-block overflow-hidden"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.6,
              delay: delay + (i * staggerDelay),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {item}
            {splitBy === 'word' && i < items.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// =============================================================================
// MUSEUM PLINTH - Image reveals from behind a solid color block
// Perfect for furniture/product reveals
// =============================================================================

interface MuseumPlinthProps {
  children: ReactNode
  className?: string
  overlayColor?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}

export function MuseumPlinth({
  children,
  className,
  overlayColor = 'bg-charcoal',
  direction = 'up',
  delay = 0,
}: MuseumPlinthProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px 0px' })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  // Determine transform origin and animation based on direction
  const getTransform = () => {
    switch (direction) {
      case 'up': return { scaleY: 1, originY: 0 }
      case 'down': return { scaleY: 1, originY: 1 }
      case 'left': return { scaleX: 1, originX: 0 }
      case 'right': return { scaleX: 1, originX: 1 }
    }
  }

  const getExitTransform = () => {
    switch (direction) {
      case 'up': return { scaleY: 0 }
      case 'down': return { scaleY: 0 }
      case 'left': return { scaleX: 0 }
      case 'right': return { scaleX: 0 }
    }
  }

  const transform = getTransform()
  const exitTransform = getExitTransform()
  const isVertical = direction === 'up' || direction === 'down'

  if (reducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0, x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 }}
        animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
        transition={{
          duration: 0.8,
          delay: delay + 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
      
      {/* Overlay that wipes away */}
      <motion.div
        className={cn('absolute inset-0 z-10', overlayColor)}
        initial={transform}
        animate={isInView ? exitTransform : transform}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          transformOrigin: isVertical 
            ? (direction === 'up' ? 'top' : 'bottom')
            : (direction === 'left' ? 'left' : 'right'),
        }}
      />
    </div>
  )
}

// =============================================================================
// ASYMMETRICAL DRIFT - Subtle parallax at 0.8x speed
// Creates depth without motion sickness
// =============================================================================

interface ParallaxDriftProps {
  children: ReactNode
  className?: string
  speed?: number // 0.8 = slower than scroll (default), 1.2 = faster
  direction?: 'vertical' | 'horizontal'
}

export function ParallaxDrift({
  children,
  className,
  speed = 0.8,
  direction = 'vertical',
}: ParallaxDriftProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Calculate parallax offset based on speed
  // speed < 1 = element moves slower than scroll (falls behind)
  // speed > 1 = element moves faster than scroll (pulls ahead)
  const offset = (1 - speed) * 100

  const y = useTransform(scrollYProgress, [0, 1], [`${offset}px`, `${-offset}px`])
  const x = useTransform(scrollYProgress, [0, 1], [`${offset}px`, `${-offset}px`])
  
  // Smooth spring physics for natural feel
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })

  if (reducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        style={direction === 'vertical' ? { y: smoothY } : { x: smoothX }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// =============================================================================
// KEN BURNS HERO - Slow zoom out as you scroll
// Cinematic opening effect for hero sections
// =============================================================================

interface KenBurnsProps {
  children: ReactNode
  className?: string
  initialScale?: number
  finalScale?: number
}

export function KenBurns({
  children,
  className,
  initialScale = 1.15,
  finalScale = 1,
}: KenBurnsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [initialScale, finalScale])
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  if (reducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ scale: smoothScale }} className="origin-center">
        {children}
      </motion.div>
    </div>
  )
}

// =============================================================================
// FADE IN VIEW - Simple scroll-triggered fade with optional direction
// =============================================================================

interface FadeInViewProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  distance?: number
  duration?: number
}

export function FadeInView({
  children,
  className,
  direction = 'up',
  delay = 0,
  distance = 40,
  duration = 0.6,
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(prefersReducedMotion())
  }, [])

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance }
      case 'down': return { y: -distance }
      case 'left': return { x: distance }
      case 'right': return { x: -distance }
      default: return {}
    }
  }

  if (reducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// =============================================================================
// STAGGER CONTAINER - Staggers children animations
// =============================================================================

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger item to use inside StaggerContainer
export function StaggerItem({ 
  children, 
  className,
  direction = 'up',
}: { 
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const getInitial = () => {
    switch (direction) {
      case 'up': return { y: 30 }
      case 'down': return { y: -30 }
      case 'left': return { x: 30 }
      case 'right': return { x: -30 }
    }
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...getInitial() },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
