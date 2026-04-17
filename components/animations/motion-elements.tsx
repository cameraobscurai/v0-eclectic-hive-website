'use client'

import { 
  motion, 
  useInView, 
  useScroll, 
  useTransform, 
  useSpring,
  type MotionValue,
  type Variants,
} from 'framer-motion'
import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import {
  EASINGS,
  DURATIONS,
  STAGGER,
  fadeUpVariants,
  fadeInVariants,
  scaleUpVariants,
  slideLeftVariants,
  slideRightVariants,
  staggerContainerVariants,
  staggerItemVariants,
  hoverLiftVariants,
  buttonPressVariants,
  imageZoomVariants,
  prefersReducedMotion,
  viewportAnimationConfig,
} from '@/lib/animations'

// =============================================================================
// VIEWPORT-TRIGGERED ANIMATIONS
// =============================================================================

interface MotionFadeUpProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
  amount?: number
}

export function MotionFadeUp({ 
  children, 
  className, 
  delay = 0,
  once = true,
  amount = 0.2,
}: MotionFadeUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUpVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

interface MotionFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function MotionFadeIn({ 
  children, 
  className, 
  delay = 0,
  once = true,
}: MotionFadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.2 })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

interface MotionScaleUpProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function MotionScaleUp({ 
  children, 
  className, 
  delay = 0,
  once = true,
}: MotionScaleUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.3 })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scaleUpVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

interface MotionSlideProps {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right'
  delay?: number
  once?: boolean
}

export function MotionSlide({ 
  children, 
  className, 
  direction = 'left',
  delay = 0,
  once = true,
}: MotionSlideProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.2 })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={direction === 'left' ? slideLeftVariants : slideRightVariants}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

// =============================================================================
// STAGGERED ANIMATIONS
// =============================================================================

interface MotionStaggerProps {
  children: ReactNode
  className?: string
  stagger?: number
  once?: boolean
}

export function MotionStagger({ 
  children, 
  className,
  stagger = STAGGER.normal,
  once = true,
}: MotionStaggerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: 0.1 })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
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
            staggerChildren: stagger,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

interface MotionStaggerItemProps {
  children: ReactNode
  className?: string
}

export function MotionStaggerItem({ children, className }: MotionStaggerItemProps) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  )
}

// =============================================================================
// SCROLL-LINKED ANIMATIONS
// =============================================================================

interface ParallaxProps {
  children: ReactNode
  className?: string
  speed?: number // 0.5 = half speed, 2 = double speed
  direction?: 'up' | 'down'
}

export function Parallax({ 
  children, 
  className, 
  speed = 0.5,
  direction = 'up',
}: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  
  const multiplier = direction === 'up' ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 })
  
  if (prefersReducedMotion()) {
    return <div ref={ref} className={className}>{children}</div>
  }
  
  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  )
}

interface ScrollProgressProps {
  children: (progress: MotionValue<number>) => ReactNode
  className?: string
  offset?: ['start end' | 'start start' | 'center center' | 'end start' | 'end end', 'start end' | 'start start' | 'center center' | 'end start' | 'end end']
}

export function ScrollProgress({ 
  children, 
  className,
  offset = ['start end', 'end start'],
}: ScrollProgressProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })
  
  return (
    <div ref={ref} className={className}>
      {children(scrollYProgress)}
    </div>
  )
}

interface ScrollScaleProps {
  children: ReactNode
  className?: string
  scaleRange?: [number, number]
}

export function ScrollScale({ 
  children, 
  className,
  scaleRange = [0.8, 1],
}: ScrollScaleProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange)
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])
  
  if (prefersReducedMotion()) {
    return <div ref={ref} className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRotateProps {
  children: ReactNode
  className?: string
  rotateRange?: [number, number]
}

export function ScrollRotate({ 
  children, 
  className,
  rotateRange = [-5, 0],
}: ScrollRotateProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  
  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange)
  
  if (prefersReducedMotion()) {
    return <div ref={ref} className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotate }}
    >
      {children}
    </motion.div>
  )
}

// =============================================================================
// INTERACTION ANIMATIONS
// =============================================================================

interface HoverLiftProps {
  children: ReactNode
  className?: string
}

export function HoverLift({ children, className }: HoverLiftProps) {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="hover"
      variants={hoverLiftVariants}
    >
      {children}
    </motion.div>
  )
}

interface MotionButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function MotionButton({ 
  children, 
  className, 
  onClick,
  type = 'button',
  disabled = false,
}: MotionButtonProps) {
  if (prefersReducedMotion()) {
    return (
      <button 
        type={type} 
        className={className} 
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
  
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={buttonPressVariants}
    >
      {children}
    </motion.button>
  )
}

interface ImageHoverZoomProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

export function ImageHoverZoom({ 
  src, 
  alt, 
  className,
  containerClassName,
}: ImageHoverZoomProps) {
  if (prefersReducedMotion()) {
    return (
      <div className={cn('overflow-hidden', containerClassName)}>
        <img src={src} alt={alt} className={className} />
      </div>
    )
  }
  
  return (
    <motion.div 
      className={cn('overflow-hidden', containerClassName)}
      initial="rest"
      whileHover="hover"
    >
      <motion.img 
        src={src} 
        alt={alt} 
        className={className}
        variants={imageZoomVariants}
      />
    </motion.div>
  )
}

// =============================================================================
// TEXT ANIMATIONS
// =============================================================================

interface SplitTextProps {
  children: string
  className?: string
  charClassName?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

export function SplitText({ 
  children, 
  className,
  charClassName,
  delay = 0,
  stagger = STAGGER.tight,
  as: Component = 'span',
}: SplitTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  if (prefersReducedMotion()) {
    return <Component className={className}>{children}</Component>
  }
  
  const chars = children.split('')
  
  return (
    <Component ref={ref} className={className} aria-label={children}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className={cn('inline-block', charClassName)}
          initial={{ y: '100%', opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={{
            duration: DURATIONS.slow,
            delay: delay + i * stagger,
            ease: EASINGS.cinematic,
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Component>
  )
}

interface WordRevealProps {
  children: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
}

export function WordReveal({ 
  children, 
  className,
  wordClassName,
  delay = 0,
  stagger = STAGGER.normal,
  as: Component = 'div',
}: WordRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  if (prefersReducedMotion()) {
    return <Component className={className}>{children}</Component>
  }
  
  const words = children.split(' ')
  
  return (
    <Component ref={ref} className={className} aria-label={children}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className={cn('inline-block', wordClassName)}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: DURATIONS.slow,
              delay: delay + i * stagger,
              ease: EASINGS.cinematic,
            }}
            aria-hidden="true"
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Component>
  )
}

// =============================================================================
// REVEAL ANIMATIONS
// =============================================================================

interface RevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  overlayColor?: string
}

export function Reveal({ 
  children, 
  className,
  direction = 'up',
  delay = 0,
  overlayColor = 'bg-background',
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  const isVertical = direction === 'up' || direction === 'down'
  const origin = {
    up: 'origin-bottom',
    down: 'origin-top',
    left: 'origin-right',
    right: 'origin-left',
  }[direction]
  
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className={cn('absolute inset-0 z-10', overlayColor, origin)}
        initial={{ [isVertical ? 'scaleY' : 'scaleX']: 1 }}
        animate={{ 
          [isVertical ? 'scaleY' : 'scaleX']: isInView ? 0 : 1 
        }}
        transition={{
          duration: DURATIONS.cinematic,
          delay,
          ease: EASINGS.cinematic,
        }}
      />
    </div>
  )
}

// =============================================================================
// MARQUEE
// =============================================================================

interface MarqueeProps {
  children: ReactNode
  className?: string
  speed?: number // seconds for one complete loop
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export function Marquee({ 
  children, 
  className,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false)
  
  if (prefersReducedMotion()) {
    return <div className={cn('flex', className)}>{children}</div>
  }
  
  return (
    <div 
      className={cn('overflow-hidden', className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? [0, '-50%'] : ['-50%', 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

// =============================================================================
// MAGNETIC EFFECT
// =============================================================================

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ 
  children, 
  className,
  strength = 0.3,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>
  }
  
  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    })
  }
  
  const handleLeave = () => {
    setPosition({ x: 0, y: 0 })
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}
