'use client'

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface ScrollSectionProps {
  children: ReactNode
  className?: string
  fadeIn?: boolean
  parallax?: boolean
  parallaxSpeed?: number
}

export function ScrollSection({
  children,
  className,
  fadeIn = true,
  parallax = false,
  parallaxSpeed = 0.1,
}: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -100px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!parallax) return
    const element = ref.current
    if (!element) return

    const updateParallax = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const centerY = rect.top + rect.height / 2
      const distanceFromCenter = centerY - windowHeight / 2
      setOffset(distanceFromCenter * parallaxSpeed * -1)
    }

    updateParallax()
    window.addEventListener('scroll', updateParallax, { passive: true })
    return () => window.removeEventListener('scroll', updateParallax)
  }, [parallax, parallaxSpeed])

  const style: CSSProperties = fadeIn
    ? {
        opacity: isInView ? 1 : 0,
        transform: parallax 
          ? `translateY(${offset}px)` 
          : isInView 
            ? 'translateY(0)' 
            : 'translateY(30px)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '1s',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }
    : parallax
      ? { transform: `translateY(${offset}px)` }
      : {}

  return (
    <section ref={ref} className={className} style={style}>
      {children}
    </section>
  )
}

interface ImageRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ImageReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const overlayOrigin = {
    up: 'origin-bottom',
    down: 'origin-top',
    left: 'origin-right',
    right: 'origin-left',
  }[direction]

  const overlayTransform = {
    up: isInView ? 'scaleY(0)' : 'scaleY(1)',
    down: isInView ? 'scaleY(0)' : 'scaleY(1)',
    left: isInView ? 'scaleX(0)' : 'scaleX(1)',
    right: isInView ? 'scaleX(0)' : 'scaleX(1)',
  }[direction]

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {children}
      <div
        className={cn(
          'absolute inset-0 bg-background z-10 transition-transform',
          overlayOrigin
        )}
        style={{
          transform: overlayTransform,
          transitionDuration: '1.2s',
          transitionDelay: `${delay}s`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  )
}

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function Counter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [hasStarted, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}

interface SplitImageProps {
  leftSrc: string
  rightSrc: string
  leftAlt: string
  rightAlt: string
  className?: string
}

export function SplitImage({
  leftSrc,
  rightSrc,
  leftAlt,
  rightAlt,
  className,
}: SplitImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <div className="grid grid-cols-2 gap-1">
        <div 
          className="overflow-hidden"
          style={{
            transform: isInView ? 'translateX(0)' : 'translateX(-100%)',
            opacity: isInView ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img src={leftSrc} alt={leftAlt} className="w-full h-full object-cover" />
        </div>
        <div 
          className="overflow-hidden"
          style={{
            transform: isInView ? 'translateX(0)' : 'translateX(100%)',
            opacity: isInView ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
          }}
        >
          <img src={rightSrc} alt={rightAlt} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
