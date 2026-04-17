'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { prefersReducedMotion } from '@/lib/animations'

/**
 * Optimized scroll hook using requestAnimationFrame
 * Prevents scroll event flooding and ensures smooth 60fps updates
 */
export function useOptimizedScroll(callback: (scrollY: number) => void) {
  const ticking = useRef(false)
  const lastKnownScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      lastKnownScrollY.current = window.scrollY

      if (!ticking.current) {
        requestAnimationFrame(() => {
          callback(lastKnownScrollY.current)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [callback])
}

/**
 * Enhanced viewport observer with performance optimizations
 * Uses IntersectionObserver for efficient element tracking
 */
interface ViewportObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  once?: boolean
  freezeOnceVisible?: boolean
}

export function useViewportObserver(
  ref: React.RefObject<Element>,
  options: ViewportObserverOptions = {}
): { isInView: boolean; hasBeenInView: boolean } {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
    freezeOnceVisible = true,
  } = options

  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const frozen = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Skip observation if already frozen and visible
    if (frozen.current && freezeOnceVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting

        if (inView && !hasBeenInView) {
          setHasBeenInView(true)
        }

        if (inView && once && freezeOnceVisible) {
          frozen.current = true
        }

        if (!frozen.current || !freezeOnceVisible) {
          setIsInView(inView)
        }

        if (inView && once) {
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin, once, freezeOnceVisible, hasBeenInView])

  return { isInView, hasBeenInView }
}

/**
 * Scroll progress tracking with RAF optimization
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement>,
  offset: { start: number; end: number } = { start: 0, end: 1 }
) {
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateProgress = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height

      // Calculate how far through the viewport the element is
      const start = windowHeight * (1 - offset.start)
      const end = -elementHeight * offset.end
      const current = rect.top

      const rawProgress = (start - current) / (start - end)
      setProgress(Math.max(0, Math.min(1, rawProgress)))
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          updateProgress()
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // Initial update
    updateProgress()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [ref, offset.start, offset.end])

  return progress
}

/**
 * Parallax offset calculation optimized for performance
 */
export function useParallaxOffset(
  ref: React.RefObject<HTMLElement>,
  speed: number = 0.5
) {
  const [offset, setOffset] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    // Skip parallax on reduced motion
    if (prefersReducedMotion()) return

    const element = ref.current
    if (!element) return

    const updateParallax = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const centerY = rect.top + rect.height / 2
      const distanceFromCenter = centerY - windowHeight / 2

      // Apply GPU-friendly transform value
      setOffset(Math.round(distanceFromCenter * speed * -0.1 * 10) / 10)
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          updateParallax()
          ticking.current = false
        })
        ticking.current = true
      }
    }

    updateParallax()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, speed])

  return offset
}

/**
 * Smooth scroll to element
 */
export function useSmoothScroll() {
  const scrollTo = useCallback(
    (target: string | HTMLElement, options: { offset?: number; duration?: number } = {}) => {
      const { offset = 0, duration = 800 } = options
      const element = typeof target === 'string' ? document.querySelector(target) : target

      if (!element) return

      const targetPosition = element.getBoundingClientRect().top + window.scrollY + offset
      const startPosition = window.scrollY
      const distance = targetPosition - startPosition
      let startTime: number | null = null

      // Use CSS scroll-behavior if available and user hasn't specified duration
      if (duration === 800 && 'scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
        return
      }

      // Custom smooth scroll with easing
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        window.scrollTo(0, startPosition + distance * easeOutCubic(progress))

        if (progress < 1) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    },
    []
  )

  return { scrollTo }
}

/**
 * Detect scroll direction
 */
export function useScrollDirection(threshold: number = 10) {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY.current ? 'down' : 'up'

      if (Math.abs(scrollY - lastScrollY.current) > threshold) {
        setScrollDirection(direction)
        lastScrollY.current = scrollY
      }
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          updateScrollDirection()
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrollDirection
}

/**
 * Check if device prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}

/**
 * Detects if user is on a touch device
 */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}
