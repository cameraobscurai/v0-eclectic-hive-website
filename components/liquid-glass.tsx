'use client'

/**
 * LiquidGlass — real refraction-based glass effect
 *
 * Drop-in replacement for the .glass-interactive cards on the homepage.
 *
 * What makes this different from backdrop-filter blur:
 *  - SVG feTurbulence + feDisplacementMap = actual content distortion/refraction
 *  - Specular highlight via ::before pseudo (shifts on hover)
 *  - Caustic edge via ::after pseudo (bright inner rim, simulates light bending)
 *  - The blur is deeper and layered, not flat
 *
 * Usage in app/page.tsx:
 *   import { LiquidGlass } from '@/components/liquid-glass'
 *
 *   // Replace the existing <div className={cn('relative h-full glass-interactive', ...)}>
 *   // wrapping each card with:
 *
 *   <LiquidGlass
 *     className="py-8 px-6 md:py-10 md:px-8"
 *     hovered={hoveredIndex === i}
 *   >
 *     {card content}
 *   </LiquidGlass>
 *
 * The SVG filter is injected once into the DOM via a hidden <svg>.
 * All three cards share it — no duplication.
 */

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// ─── SVG filter injector ──────────────────────────────────────────────────────
// Injects the refraction filter into the DOM once, shared by all instances.

let filterInjected = false

function injectGlassFilter() {
  if (filterInjected || typeof document === 'undefined') return
  filterInjected = true

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.style.cssText =
    'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
  svg.setAttribute('aria-hidden', 'true')

  svg.innerHTML = `
    <defs>
      <!-- Base refraction: subtle turbulence that distorts content behind the glass -->
      <filter id="liquid-glass-refract" x="-10%" y="-10%" width="120%" height="120%"
              color-interpolation-filters="sRGBLinear">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.018 0.025"
          numOctaves="3"
          seed="4"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="6"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
        <feComposite in="blurred" in2="SourceGraphic" operator="in" />
      </filter>

      <!-- Hover refraction: slightly stronger displacement -->
      <filter id="liquid-glass-refract-hover" x="-10%" y="-10%" width="120%" height="120%"
              color-interpolation-filters="sRGBLinear">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.018 0.025"
          numOctaves="3"
          seed="4"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="10"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feGaussianBlur in="displaced" stdDeviation="0.3" result="blurred" />
        <feComposite in="blurred" in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
  `

  document.body.appendChild(svg)
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  hovered?: boolean
  rounded?: string  // tailwind class e.g. 'rounded-lg' — defaults to 'rounded-[14px]'
}

export function LiquidGlass({
  children,
  className,
  hovered = false,
  rounded = 'rounded-[14px]',
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 })

  useEffect(() => {
    injectGlassFilter()
  }, [])

  // Track mouse within the card to shift the specular highlight
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  function handleMouseLeave() {
    // Drift back to default position
    setMousePos({ x: 0.5, y: 0.3 })
  }

  // Specular highlight position — follows cursor, clamped to card bounds
  const specX = Math.round(mousePos.x * 100)
  const specY = Math.round(mousePos.y * 100)

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden touch-target',
        rounded,
        className
      )}
      style={{
        // The refraction filter goes on the container itself so it
        // distorts the *content behind* this element, not the content inside.
        // We achieve this by applying the filter to a pseudo-layer (::before).
        isolation: 'isolate',
      }}
    >
      {/*
        Layer 1 — refraction + deep blur (the actual glass body)
        This is a positioned element that sits *behind* the children
        and applies the SVG displacement filter to whatever is visible
        through the glass.
      */}
      <div
        aria-hidden="true"
        className={cn('absolute inset-0', rounded)}
        style={{
          backdropFilter: hovered
            ? 'blur(20px) saturate(1.2) brightness(1.15)'
            : 'blur(12px) saturate(1.1) brightness(1.1)',
          WebkitBackdropFilter: hovered
            ? 'blur(20px) saturate(1.2) brightness(1.15)'
            : 'blur(12px) saturate(1.1) brightness(1.1)',
          filter: hovered
            ? 'url(#liquid-glass-refract-hover)'
            : 'url(#liquid-glass-refract)',
          background: hovered
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(255, 255, 255, 0.015)',
          transition: 'backdrop-filter 0.4s ease, background 0.4s ease',
          zIndex: 0,
        }}
      />

      {/*
        Layer 2 — specular highlight
        A radial gradient that simulates a light source reflecting off the
        glass surface. Shifts with mouse position.
      */}
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 pointer-events-none', rounded)}
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at ${specX}% ${specY}%,
            rgba(255, 255, 255, ${hovered ? '0.10' : '0.04'}) 0%,
            rgba(255, 255, 255, 0.015) 60%,
            transparent 90%
          )`,
          transition: hovered
            ? 'background 0.15s ease'
            : 'background 0.6s ease',
          zIndex: 1,
        }}
      />

      {/*
        Layer 3 — inner rim / caustic edge
        A thin inset border that simulates light bending at the glass edge.
        Top and left edges are brighter (simulating overhead light source).
      */}
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 pointer-events-none', rounded)}
        style={{
          boxShadow: hovered
            ? `
              inset 0 1px 0 0 rgba(255,255,255,0.18),
              inset 1px 0 0 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 0 rgba(255,255,255,0.03),
              inset -1px 0 0 0 rgba(255,255,255,0.03)
            `
            : `
              inset 0 1px 0 0 rgba(255,255,255,0.08),
              inset 1px 0 0 0 rgba(255,255,255,0.03),
              inset 0 -1px 0 0 rgba(255,255,255,0.015),
              inset -1px 0 0 0 rgba(255,255,255,0.015)
            `,
          transition: 'box-shadow 0.35s ease',
          zIndex: 2,
        }}
      />

      {/*
        Layer 4 — bottom edge shadow (depth)
        Simulates the glass sitting on a surface, casting a subtle shadow.
      */}
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 pointer-events-none', rounded)}
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 70%,
            rgba(0, 0, 0, ${hovered ? '0.12' : '0.18'}) 100%
          )`,
          transition: 'background 0.35s ease',
          zIndex: 3,
        }}
      />

      {/* Layer 5 — actual content, above all effects */}
      <div className="relative" style={{ zIndex: 4 }}>
        {children}
      </div>
    </div>
  )
}
