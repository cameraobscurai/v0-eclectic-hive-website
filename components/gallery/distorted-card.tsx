'use client'

import { useEffect, useRef } from 'react'

interface DistortedCardProps {
  children: React.ReactNode
  velocityRef: React.MutableRefObject<number>
  className?: string
}

/**
 * Wraps a card with scroll-velocity-driven SVG distortion.
 * Uses RAF for smooth lerp animation — no React re-renders during scroll.
 * At rest: sharp images. During fast scroll: subtle wave distortion.
 */
export function DistortedCard({ children, velocityRef, className }: DistortedCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const currentScale = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    function animate() {
      const el = wrapperRef.current
      if (!el) {
        rafId.current = requestAnimationFrame(animate)
        return
      }

      // Target scale: velocity magnitude → distortion amount
      const targetScale = Math.abs(velocityRef.current) * 22

      // Lerp toward target: fast to distort (0.25), slow to settle (0.06)
      const lerpSpeed = targetScale > currentScale.current ? 0.25 : 0.06
      currentScale.current += (targetScale - currentScale.current) * lerpSpeed

      // Apply filter only when distortion is visible
      if (currentScale.current > 0.1) {
        el.style.filter = `url(#gallery-distort)`
        // Update the shared SVG displacement scale
        const displacementEl = document.getElementById('gallery-displacement')
        if (displacementEl) {
          displacementEl.setAttribute('scale', currentScale.current.toFixed(2))
        }
      } else {
        el.style.filter = 'none'
        currentScale.current = 0
      }

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  // velocityRef is a stable ref, doesn't need to be a dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  )
}
