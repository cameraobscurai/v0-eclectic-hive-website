'use client'

import { useEffect } from 'react'

let injected = false

/**
 * Injects a shared SVG filter for gallery scroll distortion.
 * Uses feTurbulence + feDisplacementMap for a subtle wave effect.
 * The scale value is animated externally via setDistortionScale().
 */
export function DistortionFilter() {
  useEffect(() => {
    if (injected || typeof document === 'undefined') return
    injected = true

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML = `
      <defs>
        <filter id="gallery-distort" x="-5%" y="-5%" width="110%" height="110%"
                color-interpolation-filters="sRGB">
          <feTurbulence
            id="gallery-turbulence"
            type="fractalNoise"
            baseFrequency="0.015 0.035"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            id="gallery-displacement"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    `
    document.body.appendChild(svg)
  }, [])

  return null
}

/**
 * Animate the distortion scale — called by DistortedCard on each frame.
 */
export function setDistortionScale(scale: number) {
  const el = document.getElementById('gallery-displacement')
  if (el) el.setAttribute('scale', scale.toString())
}
