'use client'

import { useEffect, useRef } from 'react'

/**
 * Reads horizontal scroll velocity from a scrollable element.
 * Returns a ref that updates every animation frame — no React re-renders on scroll.
 * Velocity is normalized to -1..1 range (capped at ±200px/frame).
 */
export function useScrollVelocity(containerRef: React.RefObject<HTMLElement | null>) {
  const velocityRef = useRef(0)
  const lastScrollLeft = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number

    function measure() {
      const now = performance.now()
      const dt = now - lastTime.current
      if (dt > 0) {
        const dx = container!.scrollLeft - lastScrollLeft.current
        // pixels/ms → normalize to a -1..1 range (cap at ±200px/frame)
        velocityRef.current = Math.max(-1, Math.min(1, dx / 200))
        lastScrollLeft.current = container!.scrollLeft
        lastTime.current = now
      }
      rafId = requestAnimationFrame(measure)
    }

    rafId = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(rafId)
  }, [containerRef])

  return velocityRef
}
