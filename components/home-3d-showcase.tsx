'use client'

import { Suspense, useRef, useState, useEffect, useCallback, lazy } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  ContactShadows,
  Center,
  useProgress
} from '@react-three/drei'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// LINDT Sofa model URL
const MODEL_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb'

// Background matching the cream/warm aesthetic - darker for more drama
const BG_COLOR = '#E8E2D9'
const BG_GRADIENT_FROM = '#F0EBE3'
const BG_GRADIENT_TO = '#DED7CC'

interface Home3DShowcaseProps {
  className?: string
}

function Model({ 
  isRotating, 
  onLoaded 
}: { 
  isRotating: boolean
  onLoaded: () => void 
}) {
  const { scene } = useGLTF(MODEL_URL)
  const modelRef = useRef<THREE.Group>(null)
  const rotationSpeed = useRef(0.08)
  const targetSpeed = isRotating ? 0.08 : 0
  
  useEffect(() => {
    onLoaded()
  }, [scene, onLoaded])
  
  // Clone the scene
  const clonedScene = scene.clone()
  
  // Smooth auto-rotation with easing when pausing/resuming
  useFrame((state, delta) => {
    // Ease the rotation speed
    rotationSpeed.current += (targetSpeed - rotationSpeed.current) * 0.05
    
    if (modelRef.current && rotationSpeed.current > 0.001) {
      modelRef.current.rotation.y += delta * rotationSpeed.current
    }
  })
  
  return (
    <Center>
      <group ref={modelRef}>
        <primitive 
          object={clonedScene} 
          scale={1.2}
        />
      </group>
    </Center>
  )
}

function LoadingOverlay() {
  const { progress } = useProgress()
  
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* Elegant loading animation */}
      <div className="relative w-16 h-16 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 border border-charcoal/10 rounded-full" />
        {/* Spinning ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-charcoal/40 rounded-full animate-spin" />
        {/* Inner pulse */}
        <div className="absolute inset-3 bg-charcoal/5 rounded-full animate-pulse" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-charcoal/30 rounded-full" />
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="w-32 h-px bg-charcoal/10 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-charcoal/40 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.2em]">
        Loading Experience
      </p>
    </div>
  )
}

function Scene({ isRotating, onModelLoaded }: { isRotating: boolean; onModelLoaded: () => void }) {
  return (
    <>
      {/* Ambient base lighting - subtle */}
      <ambientLight intensity={0.5} />
      
      {/* Key light - warm, dramatic from upper right with strong shadows */}
      <directionalLight 
        position={[6, 12, 4]} 
        intensity={1.8} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
        color="#fff5e6"
      />
      
      {/* Fill light - cooler, softer from left */}
      <directionalLight 
        position={[-8, 6, -2]} 
        intensity={0.35} 
        color="#e8f0ff"
      />
      
      {/* Rim light - creates edge definition */}
      <directionalLight 
        position={[-2, 4, -8]} 
        intensity={0.5} 
        color="#ffeedd"
      />
      
      {/* Top accent light */}
      <pointLight
        position={[0, 8, 0]}
        intensity={0.3}
        color="#ffffff"
        decay={2}
        distance={20}
      />
      
      {/* Environment for realistic material reflections */}
      <Environment preset="city" environmentIntensity={0.2} />
      
      {/* The 3D model */}
      <Suspense fallback={null}>
        <Model isRotating={isRotating} onLoaded={onModelLoaded} />
      </Suspense>
      
      {/* Primary ground shadow - soft and expansive */}
      <ContactShadows 
        position={[0, -0.9, 0]} 
        opacity={0.25} 
        scale={16} 
        blur={2.5} 
        far={5}
        color="#6b6358"
      />
      
      {/* Secondary shadow layer - sharper for definition */}
      <ContactShadows 
        position={[0, -0.88, 0]} 
        opacity={0.1} 
        scale={8} 
        blur={1} 
        far={3}
        color="#4a453e"
      />
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={2.2}
        maxDistance={4.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.03}
        rotateSpeed={0.4}
      />
    </>
  )
}

export function Home3DShowcase({ className = '' }: Home3DShowcaseProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [isRotating, setIsRotating] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  
  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
  
  // Fade in content after model loads
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowContent(true), 150)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])
  
  const handleModelLoaded = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section 
      ref={containerRef}
      className={cn(
        "relative bg-cream overflow-hidden",
        className
      )}
    >
      {/* Section container with generous padding */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 lg:mb-12">
          <div>
            <div className="overflow-hidden">
              <p 
                className={cn(
                  "text-[10px] uppercase tracking-[0.3em] text-charcoal/40 mb-3 transition-all duration-700",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                )}
              >
                Hive Signature Collection
              </p>
            </div>
            <div className="overflow-hidden">
              <h2 
                className={cn(
                  "font-display text-3xl md:text-4xl lg:text-5xl tracking-tight font-light italic text-charcoal transition-all duration-700 delay-100",
                  isInView ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                )}
              >
                LINDT Sofa
              </h2>
            </div>
          </div>
          
          <div 
            className={cn(
              "flex items-center gap-6 transition-all duration-700 delay-300",
              isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <Link
              href="/collection"
              className="text-xs uppercase tracking-[0.15em] text-charcoal/60 hover:text-charcoal transition-colors group flex items-center gap-2"
            >
              View Collection
              <span className="w-4 h-px bg-charcoal/30 group-hover:w-6 transition-all duration-300" />
            </Link>
          </div>
        </div>
        
        {/* 3D Viewer Container - Glassmorphic design */}
        <div 
          className={cn(
            "relative rounded-3xl overflow-hidden transition-all duration-1000 delay-200",
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ 
            aspectRatio: '16 / 9',
            maxHeight: '70vh'
          }}
        >
          {/* Glassmorphic border frame */}
          <div 
            className="absolute inset-0 rounded-3xl pointer-events-none z-20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)',
              padding: '1px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          
          {/* Outer glow effect */}
          <div 
            className="absolute -inset-1 rounded-3xl pointer-events-none z-10 opacity-60"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Inner container with gradient background */}
          <div 
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${BG_GRADIENT_FROM} 0%, ${BG_COLOR} 50%, ${BG_GRADIENT_TO} 100%)`,
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.4),
                inset 0 -1px 1px rgba(0,0,0,0.05),
                0 25px 50px -12px rgba(0,0,0,0.15),
                0 12px 24px -8px rgba(0,0,0,0.1),
                0 4px 8px -2px rgba(0,0,0,0.05)
              `,
            }}
          />
          {/* Loading state */}
          {!showContent && <LoadingOverlay />}
          
          {/* Canvas - positioned within the glassmorphic container */}
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-700 z-0",
              showContent ? "opacity-100" : "opacity-0"
            )}
          >
            <Canvas
              shadows
              camera={{ position: [3.5, 2, 3.5], fov: 32 }}
              className="w-full h-full"
              gl={{ 
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.25,
                powerPreference: 'high-performance',
                alpha: false,
              }}
              dpr={[1, 2]}
            >
              {/* Gradient background via shader-like layers */}
              <color attach="background" args={[BG_COLOR]} />
              <fog attach="fog" args={[BG_GRADIENT_TO, 15, 35]} />
              <Scene isRotating={isRotating} onModelLoaded={handleModelLoaded} />
            </Canvas>
          </div>
          
          {/* Controls overlay - glassmorphic style */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 p-5 lg:p-8 flex items-end justify-between pointer-events-none z-30 transition-all duration-500 delay-500",
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Left: Interaction hint - glassmorphic pill */}
            <div className="pointer-events-none">
              <div 
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
                }}
              >
                <svg className="w-4 h-4 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
                <span className="text-[10px] text-charcoal/60 uppercase tracking-[0.12em] font-medium">
                  Drag to explore · Scroll to zoom
                </span>
              </div>
            </div>
            
            {/* Right: Play/Pause control - glassmorphic */}
            <div className="pointer-events-auto">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
                aria-label={isRotating ? "Pause rotation" : "Resume rotation"}
              >
                {isRotating ? (
                  // Pause icon
                  <svg className="w-4 h-4 text-charcoal/70" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  // Play icon
                  <svg className="w-4 h-4 text-charcoal/70 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5.14v14l11-7-11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Corner badge - glassmorphic style */}
          <div 
            className={cn(
              "absolute top-5 right-5 lg:top-7 lg:right-7 z-30 transition-all duration-500 delay-700",
              showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
          >
            <div 
              className="px-4 py-2 text-[9px] uppercase tracking-[0.15em] rounded-full font-medium"
              style={{
                background: 'rgba(45, 42, 38, 0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#F5F0E8',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              Interactive 3D
            </div>
          </div>
        </div>
        
        {/* Footer text */}
        <div 
          className={cn(
            "mt-6 lg:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-700 delay-500",
            isInView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <p className="text-sm text-charcoal/50 max-w-md">
            Channel-tufted velvet with solid oak frame. Part of our curated rental collection for luxury events.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-charcoal hover:text-charcoal/70 transition-colors group"
          >
            Inquire for your event
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Preload the model
useGLTF.preload(MODEL_URL)
