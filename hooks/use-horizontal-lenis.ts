'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export function useHorizontalLenis(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const lenisRef  = useRef<Lenis | null>(null)
  const velocityRef = useRef(0)

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Pause global vertical Lenis — prevents double-scroll fighting
    const globalLenis = (window as unknown as { lenis?: Lenis }).lenis
    globalLenis?.stop()

    const lenis = new Lenis({
      wrapper:           container,
      content:           container.firstElementChild as HTMLElement,
      orientation:       'horizontal',
      gestureOrientation:'both',    // mouse wheel AND touch both drive horizontal
      smoothWheel:       true,
      wheelMultiplier:   1.2,       // slightly faster than default — feels more spatial
      touchMultiplier:   1.5,
      duration:          1.0,
      easing:            (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      velocityRef.current = lenis.velocity
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      velocityRef.current = 0
      // Resume global vertical Lenis when canvas mode exits
      globalLenis?.start()
    }
  }, [enabled, containerRef])

  return { lenisRef, velocityRef }
}
