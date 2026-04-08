'use client'

import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  ContactShadows,
  Center,
  Float
} from '@react-three/drei'
import * as THREE from 'three'

interface InlineProductViewerProps {
  modelUrl: string
  className?: string
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  
  // Clone the scene to avoid issues with reusing the same scene
  const clonedScene = scene.clone()
  
  return (
    <Center>
      <Float 
        speed={1.5} 
        rotationIntensity={0.1} 
        floatIntensity={0.3}
        floatingRange={[-0.05, 0.05]}
      >
        <primitive 
          ref={modelRef}
          object={clonedScene} 
          scale={1}
        />
      </Float>
    </Center>
  )
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-charcoal/10 border-t-charcoal/60 rounded-full animate-spin" />
        <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">Loading</p>
      </div>
    </div>
  )
}

function Scene({ modelUrl }: { modelUrl: string }) {
  return (
    <>
      {/* Soft, even lighting matching the product photography style */}
      <ambientLight intensity={0.6} />
      
      {/* Key light - main illumination from upper right */}
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - soften shadows from left */}
      <directionalLight 
        position={[-5, 3, -2]} 
        intensity={0.3} 
      />
      
      {/* Rim light - subtle edge definition */}
      <directionalLight 
        position={[0, 5, -8]} 
        intensity={0.2} 
      />
      
      {/* Environment for realistic material rendering */}
      <Environment preset="studio" environmentIntensity={0.4} />
      
      {/* The 3D model */}
      <Suspense fallback={null}>
        <Model url={modelUrl} />
      </Suspense>
      
      {/* Subtle contact shadow */}
      <ContactShadows 
        position={[0, -0.8, 0]} 
        opacity={0.25} 
        scale={8} 
        blur={2} 
        far={3}
        color="#2c2c2c"
      />
      
      {/* Camera controls - constrained for product viewing */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate={true}
        autoRotateSpeed={0.8}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

export function InlineProductViewer({ modelUrl, className = '' }: InlineProductViewerProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          shadows
          camera={{ position: [2.5, 1.5, 2.5], fov: 40 }}
          className="w-full h-full"
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#ffffff']} />
          <fog attach="fog" args={['#ffffff', 8, 20]} />
          <Scene modelUrl={modelUrl} />
        </Canvas>
      </Suspense>
      
      {/* Interaction hint - subtle overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center pointer-events-none">
        <div className="px-3 py-1.5 bg-charcoal/5 backdrop-blur-sm rounded-full">
          <p className="text-[9px] text-charcoal/40 uppercase tracking-wider">
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
      className="fixed inset-0 z-50 bg-cream/98 backdrop-blur-sm"
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

// Preload the LINDT sofa model
useGLTF.preload('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb')
