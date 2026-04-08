'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  ContactShadows,
  Center
} from '@react-three/drei'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

interface InlineProductViewerProps {
  modelUrl: string
  className?: string
}

// Warm beige background matching the product photography style
const BG_COLOR = '#d5cdc5'

function Model({ url, onLoaded }: { url: string; onLoaded: () => void }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    // Signal that model has loaded
    onLoaded()
  }, [scene, onLoaded])
  
  // Clone the scene to avoid issues with reusing the same scene
  const clonedScene = scene.clone()
  
  // Auto-rotation via useFrame for smoother control
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3 // Smooth auto-rotate
    }
  })
  
  return (
    <Center>
      <group ref={modelRef}>
        <primitive 
          object={clonedScene} 
          scale={1}
        />
      </group>
    </Center>
  )
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: BG_COLOR }}>
      <div className="flex flex-col items-center gap-3">
        {/* Elegant pulsing loader */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border border-charcoal/20 rounded-full" />
          <div className="absolute inset-0 border border-transparent border-t-charcoal/60 rounded-full animate-spin" />
          <div className="absolute inset-2 border border-charcoal/10 rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] text-charcoal/50 uppercase tracking-[0.15em] font-light">Loading 3D</p>
      </div>
    </div>
  )
}

function Scene({ modelUrl, onModelLoaded }: { modelUrl: string; onModelLoaded: () => void }) {
  return (
    <>
      {/* Soft, even lighting matching the product photography style */}
      <ambientLight intensity={0.7} />
      
      {/* Key light - main illumination from upper right */}
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={0.9} 
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - soften shadows from left */}
      <directionalLight 
        position={[-5, 3, -2]} 
        intensity={0.4} 
      />
      
      {/* Rim light - subtle edge definition from behind */}
      <directionalLight 
        position={[0, 5, -8]} 
        intensity={0.25} 
      />
      
      {/* Environment for realistic material rendering - warm tones */}
      <Environment preset="apartment" environmentIntensity={0.3} />
      
      {/* The 3D model with auto-rotation */}
      <Suspense fallback={null}>
        <Model url={modelUrl} onLoaded={onModelLoaded} />
      </Suspense>
      
      {/* Subtle contact shadow matching the warm bg */}
      <ContactShadows 
        position={[0, -0.8, 0]} 
        opacity={0.2} 
        scale={10} 
        blur={2.5} 
        far={3}
        color="#8a8078"
      />
      
      {/* Camera controls - no auto-rotate here since we do it in useFrame */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={1.8}
        maxDistance={4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

export function InlineProductViewer({ modelUrl, className = '' }: InlineProductViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  
  // Fade in after model loads
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])
  
  const handleModelLoaded = () => {
    setIsLoaded(true)
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)} style={{ backgroundColor: BG_COLOR }}>
      {/* Loading state */}
      {!isLoaded && <LoadingSpinner />}
      
      {/* Canvas with fade-in animation */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-out",
          showContent ? "opacity-100" : "opacity-0"
        )}
      >
        <Canvas
          shadows
          camera={{ position: [2.5, 1.5, 2.5], fov: 40 }}
          className="w-full h-full"
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[BG_COLOR]} />
          <fog attach="fog" args={[BG_COLOR, 10, 25]} />
          <Scene modelUrl={modelUrl} onModelLoaded={handleModelLoaded} />
        </Canvas>
      </div>
      
      {/* Interaction hint - only show after loaded */}
      <div 
        className={cn(
          "absolute bottom-3 left-3 right-3 flex items-center justify-center pointer-events-none transition-all duration-500 delay-300",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        <div className="px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-charcoal/5">
          <p className="text-[9px] text-charcoal/50 uppercase tracking-[0.1em] font-light">
            Drag to rotate · Scroll to zoom
          </p>
        </div>
      </div>
    </div>
  )
}

// Legacy modal viewer for backwards compatibility
export function ProductViewer3D({ 
  modelUrl, 
  productName, 
  isOpen, 
  onClose 
}: { 
  modelUrl: string
  productName: string
  isOpen: boolean
  onClose: () => void 
}) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 backdrop-blur-sm"
      style={{ backgroundColor: `${BG_COLOR}f8` }}
      role="dialog"
      aria-modal="true"
      aria-label={`3D view of ${productName}`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40 mb-1">3D Preview</p>
          <h2 className="font-display text-xl tracking-tight font-light italic text-charcoal">
            {productName}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-charcoal/10 hover:bg-charcoal/5 transition-colors"
          aria-label="Close 3D viewer"
        >
          <svg className="w-4 h-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <InlineProductViewer modelUrl={modelUrl} />
    </div>
  )
}

// Preload the LINDT sofa model for instant viewing
useGLTF.preload('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb')
