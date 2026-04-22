'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true } = options
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isInView }
}

interface ScrollProgressOptions {
  offset?: [string, string]
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const { offset = ['start end', 'end start'] } = options
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const ticking = useRef(false) // B7: RAF throttle flag

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateProgress = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height
      
      // Calculate progress from 0 (element just entering) to 1 (element fully passed)
      const start = windowHeight
      const end = -elementHeight
      const current = rect.top
      
      const rawProgress = (start - current) / (start - end)
      setProgress(Math.max(0, Math.min(1, rawProgress)))
    }

    // B7: RAF-throttled scroll handler prevents forced layout at scroll speed
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          updateProgress()
          ticking.current = false
        })
        ticking.current = true
      }
    }

    updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateProgress)
    }
  }, [offset])

  return { ref, progress }
}

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)
  const ticking = useRef(false) // B7: RAF throttle flag

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateParallax = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const centerY = rect.top + rect.height / 2
      const distanceFromCenter = centerY - windowHeight / 2
      setOffset(distanceFromCenter * speed * -0.1)
    }

    // B7: RAF-throttled scroll handler
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
  }, [speed])

  return { ref, offset }
}

export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | HTMLElement, offset: number = 0) => {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target
    
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  return { scrollTo }
}
