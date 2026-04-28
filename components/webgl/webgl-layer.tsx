'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled - must be in a Client Component
const WebGLCanvas = dynamic(
  () => import('./canvas-provider').then(m => m.WebGLCanvas),
  { ssr: false }
)

/**
 * Client-side wrapper for the WebGL canvas layer.
 * This component handles the dynamic import with ssr: false,
 * which must be done in a Client Component in Next.js 16+.
 */
export function WebGLLayer() {
  return <WebGLCanvas />
}
