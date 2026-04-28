'use client'

import { Canvas } from '@react-three/fiber'
import { View, Preload } from '@react-three/drei'
import { useEffect, useState } from 'react'

/**
 * WebGL support detection with progressive enhancement.
 * If WebGL isn't available, children simply don't render — no errors, no fallback UI.
 */
function WebGLSupported({ children }: { children: React.ReactNode }) {
  const [supported, setSupported] = useState<boolean | null>(null)
  
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      setSupported(!!gl)
    } catch {
      setSupported(false)
    }
  }, [])

  // During SSR or while checking, render nothing
  if (supported === null || !supported) return null
  return <>{children}</>
}

/**
 * Global R3F canvas that sits behind the entire page.
 * Uses the View system so individual components can inject their 3D content
 * at any scroll position without needing their own canvases.
 * 
 * Place this as the first child of <body>, before any providers.
 */
export function WebGLCanvas() {
  return (
    <WebGLSupported>
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]} // Limit DPR for performance
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <View.Port />
        <Preload all />
      </Canvas>
    </WebGLSupported>
  )
}
