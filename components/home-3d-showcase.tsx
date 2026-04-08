'use client'

import { Suspense, useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  useGLTF, 
  Center
} from '@react-three/drei'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// LINDT Sofa model URL
const MODEL_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb'

// Clean, warm background that matches the cream aesthetic
const BG_COLOR = '#E8E0D4'

function Model({ 
  isRotating, 
  onLoaded 
}: { 
  isRotating: boolean
  onLoaded: () => void 
}) {
  const { scene } = useGLTF(MODEL_URL)
  const modelRef = useRef<THREE.Group>(null)
  const rotationSpeed = useRef(0.06)
  const targetSpeed = isRotating ? 0.06 : 0
  
  useEffect(() => {
    onLoaded()
  }, [scene, onLoaded])
  
  const clonedScene = scene.clone()
  
  // Smooth auto-rotation
  useFrame((state, delta) => {
    rotationSpeed.current += (targetSpeed - rotationSpeed.current) * 0.05
    if (modelRef.current && rotationSpeed.current > 0.001) {
      modelRef.current.rotation.y += delta * rotationSpeed.current
    }
  })
  
  return (
    <Center>
      <group ref={modelRef}>
        <primitive object={clonedScene} scale={1.3} />
      </group>
    </Center>
  )
}

function LoadingOverlay() {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border border-charcoal/10 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-charcoal/30 rounded-full animate-spin" />
      </div>
    </div>
  )
}

function Scene({ isRotating, onModelLoaded }: { isRotating: boolean; onModelLoaded: () => void }) {
  return (
    <>
      {/* Bright, warm lighting to properly illuminate the model */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 4]} intensity={2} color="#fff8f0" />
      <directionalLight position={[-5, 4, -2]} intensity={1} color="#f5f5ff" />
      <directionalLight position={[0, 5, 8]} intensity={0.8} color="#ffffff" />
      
      <Suspense fallback={null}>
        <Model isRotating={isRotating} onLoaded={onModelLoaded} />
      </Suspense>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  )
}

export function Home3DShowcase() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isRotating, setIsRotating] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hasWebGLError, setHasWebGLError] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  
  // Only render canvas on client side and preload model
  useEffect(() => {
    setIsMounted(true)
    // Preload model after mount (client-side only)
    useGLTF.preload(MODEL_URL)
  }, [])
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])
  
  const handleModelLoaded = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section ref={containerRef} className="relative bg-cream">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-16 py-16 lg:py-24">
        
        {/* Header - minimal, confident */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p 
              className={cn(
                "text-[10px] uppercase tracking-[0.3em] text-charcoal/40 mb-2 transition-all duration-700",
                isInView ? "opacity-100" : "opacity-0"
              )}
            >
              Hive Signature Collection
            </p>
            <h2 
              className={cn(
                "font-display text-3xl md:text-4xl tracking-tight font-light italic text-charcoal transition-all duration-700 delay-100",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              LINDT Sofa
            </h2>
          </div>
          
          <Link
            href="/collection"
            className={cn(
              "text-xs uppercase tracking-[0.15em] text-charcoal/50 hover:text-charcoal transition-all duration-700 delay-200 group flex items-center gap-2",
              isInView ? "opacity-100" : "opacity-0"
            )}
          >
            View Collection
            <span className="w-4 h-px bg-charcoal/30 group-hover:w-8 transition-all duration-300" />
          </Link>
        </div>
        
        {/* 3D Viewer - clean, no gimmicks */}
        <div 
          className={cn(
            "relative rounded-2xl overflow-hidden transition-all duration-1000 delay-200",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ 
            backgroundColor: BG_COLOR,
            aspectRatio: '21 / 9',
            maxHeight: '65vh',
            boxShadow: '0 20px 60px -15px rgba(0,0,0,0.12), 0 8px 20px -8px rgba(0,0,0,0.08)'
          }}
        >
          {!showContent && !hasWebGLError && <LoadingOverlay />}
          
          {/* Fallback when WebGL fails */}
          {hasWebGLError && (
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: BG_COLOR }}
            >
              <div className="text-center">
                <p className="text-charcoal/40 text-sm mb-4">3D preview unavailable</p>
                <Link
                  href="/collection"
                  className="text-xs uppercase tracking-[0.15em] text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  View Collection Instead
                </Link>
              </div>
            </div>
          )}
          
          {isMounted && !hasWebGLError && (
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500",
              showContent ? "opacity-100" : "opacity-0"
            )}>
              <Canvas
                camera={{ position: [4, 2, 4], fov: 30 }}
                gl={{ 
                  antialias: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.2,
                  powerPreference: 'default',
                  failIfMajorPerformanceCaveat: false,
                }}
                dpr={[1, 2]}
                onCreated={({ gl }) => {
                  gl.domElement.addEventListener('webglcontextlost', (e) => {
                    e.preventDefault()
                    setHasWebGLError(true)
                  }, false)
                }}
              >
                <color attach="background" args={[BG_COLOR]} />
                <Scene isRotating={isRotating} onModelLoaded={handleModelLoaded} />
              </Canvas>
            </div>
          )}
          
          {/* Minimal controls */}
          <div className={cn(
            "absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none transition-all duration-500 delay-300",
            showContent ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.1em]">
              Drag to explore · Scroll to zoom
            </p>
            
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all shadow-sm"
              aria-label={isRotating ? "Pause" : "Play"}
            >
              {isRotating ? (
                <svg className="w-3 h-3 text-charcoal/60" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-charcoal/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className={cn(
          "mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-700 delay-400",
          isInView ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-sm text-charcoal/40 max-w-md">
            Channel-tufted velvet with solid oak frame. Part of our curated rental collection.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-charcoal/60 hover:text-charcoal transition-colors group"
          >
            Inquire for your event
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
