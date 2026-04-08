'use client'

import { Suspense, useState, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  useGLTF, 
  ContactShadows,
  Html,
  PresentationControls
} from '@react-three/drei'
import { X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as THREE from 'three'

interface ProductViewer3DProps {
  modelUrl: string
  productName: string
  isOpen: boolean
  onClose: () => void
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)
  
  // Center and scale the model
  useFrame(() => {
    if (modelRef.current) {
      // Subtle idle animation - very slow rotation
      modelRef.current.rotation.y += 0.001
    }
  })

  // Calculate bounding box to center and scale
  const box = new THREE.Box3().setFromObject(scene)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = 2 / maxDim // Normalize to fit in view

  return (
    <group ref={modelRef} scale={scale}>
      <primitive 
        object={scene} 
        position={[-center.x, -center.y, -center.z]}
      />
    </group>
  )
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="text-sm text-charcoal/60 uppercase tracking-wider">Loading 3D Model</p>
      </div>
    </Html>
  )
}

function Scene({ modelUrl }: { modelUrl: string }) {
  return (
    <>
      {/* Lighting setup for product visualization */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-10, 5, -5]} 
        intensity={0.5} 
      />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />
      
      {/* Environment for realistic reflections */}
      <Environment preset="studio" />
      
      {/* The 3D model */}
      <Suspense fallback={<LoadingSpinner />}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Model url={modelUrl} />
        </PresentationControls>
      </Suspense>
      
      {/* Contact shadow for grounding */}
      <ContactShadows 
        position={[0, -1.2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2.5} 
        far={4}
      />
      
      {/* Camera controls */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export function ProductViewer3D({ modelUrl, productName, isOpen, onClose }: ProductViewer3DProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(false)

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-cream"
      role="dialog"
      aria-modal="true"
      aria-label={`3D view of ${productName}`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-cream via-cream/80 to-transparent">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-1">3D Preview</p>
          <h2 className="font-display text-2xl tracking-tight font-light italic text-charcoal">
            {productName}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-charcoal/5 rounded-full transition-colors"
          aria-label="Close 3D viewer"
        >
          <X className="w-6 h-6 text-charcoal" />
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [4, 2, 4], fov: 45 }}
        className="w-full h-full"
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#FAF9F6']} />
        <Scene modelUrl={modelUrl} />
      </Canvas>

      {/* Controls hint */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-6 bg-gradient-to-t from-cream via-cream/80 to-transparent">
        <div className="flex items-center justify-center gap-8 text-charcoal/50">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Drag to rotate</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Scroll to zoom</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Preload the model
useGLTF.preload('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/04c9d9d2b5314e5a-8y7OUV6nPxO85ZCzkdZjwpAlALyBeF.glb')
