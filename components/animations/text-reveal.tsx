'use client'

import { useRef, useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

// Check for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

interface TextRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  splitBy?: 'word' | 'line' | 'char'
  stagger?: number
  once?: boolean
}

export function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  as: Component = 'div',
  splitBy = 'word',
  stagger = 0.04,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const text = typeof children === 'string' ? children : ''
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (reducedMotion) { setIsInView(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, reducedMotion])

  if (!text) {
    return (
      <Component
        ref={ref as React.RefObject<never>}
        className={cn('overflow-hidden', className)}
      >
        <span
          className="block transition-transform"
          style={{
            transform: isInView ? 'translateY(0)' : 'translateY(100%)',
            opacity: isInView ? 1 : 0,
            transitionDuration: `${duration}s`,
            transitionDelay: `${delay}s`,
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {children}
        </span>
      </Component>
    )
  }

  const elements = splitBy === 'word' 
    ? text.split(' ') 
    : splitBy === 'char' 
      ? text.split('') 
      : text.split('\n')

  return (
    <Component
      ref={ref as React.RefObject<never>}
      className={cn('', className)}
      aria-label={text}
    >
      {elements.map((element, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className="inline-block transition-all"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(110%)',
              opacity: isInView ? 1 : 0,
              transitionDuration: `${duration}s`,
              transitionDelay: `${delay + i * stagger}s`,
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            aria-hidden="true"
          >
            {element}{splitBy === 'word' ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Component>
  )
}

interface HighlightTextProps {
  children: string
  className?: string
  highlightClassName?: string
  delay?: number
  duration?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
}

export function HighlightText({
  children,
  className,
  highlightClassName = 'bg-terracotta/20',
  delay = 0,
  duration = 0.8,
  as: Component = 'span',
}: HighlightTextProps) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (reducedMotion) { setIsInView(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <Component
      ref={ref as React.RefObject<never>}
      className={cn('relative inline', className)}
    >
      <span
        className={cn(
          'absolute inset-0 origin-left transition-transform',
          highlightClassName
        )}
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transitionDuration: `${duration}s`,
          transitionDelay: `${delay}s`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        aria-hidden="true"
      />
      <span className="relative">{children}</span>
    </Component>
  )
}

interface FadeUpProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
  as?: 'div' | 'section' | 'article' | 'aside' | 'span'
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
  as: Component = 'div',
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (reducedMotion) { setIsInView(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, reducedMotion])

  const style: CSSProperties = {
    transform: isInView ? 'translateY(0)' : `translateY(${distance}px)`,
    opacity: isInView ? 1 : 0,
    transitionProperty: 'transform, opacity',
    transitionDuration: `${duration}s`,
    transitionDelay: `${delay}s`,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
  }

  return (
    <Component
      ref={ref as React.RefObject<never>}
      className={className}
      style={style}
    >
      {children}
    </Component>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (reducedMotion) { setIsInView(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ['--stagger' as string]: stagger,
        ['--delay' as string]: delay,
        ['--in-view' as string]: isInView ? 1 : 0,
      } as CSSProperties}
    >
      {children}
    </div>
  )
}

interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'left' | 'right' | 'center'
}

export function LineReveal({
  children,
  className,
  delay = 0,
  direction = 'left',
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (reducedMotion) { setIsInView(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  const originClass = direction === 'left' 
    ? 'origin-left' 
    : direction === 'right' 
      ? 'origin-right' 
      : 'origin-center'

  return (
    <div ref={ref} className={cn('relative', className)}>
      {children}
      <span
        className={cn(
          'absolute bottom-0 left-0 w-full h-px bg-current transition-transform',
          originClass
        )}
        style={{
          transform: isInView ? 'scaleX(1)' : 'scaleX(0)',
          transitionDuration: '1s',
          transitionDelay: `${delay}s`,
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  )
}
