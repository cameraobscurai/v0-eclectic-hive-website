'use client'

import { View } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

function SpinningBox() {
  const mesh = useRef<Mesh>(null)
  
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5
    }
  })
  
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#c4a962" />
    </mesh>
  )
}

/**
 * Test component to verify R3F scaffold is working.
 * Drop this anywhere on a page — if a spinning brass cube appears, 
 * the WebGL system is functioning correctly.
 * 
 * Remove after verification.
 */
export function SceneTest() {
  return (
    <div 
      style={{ 
        width: 200, 
        height: 200, 
        position: 'relative',
        border: '1px solid rgba(196, 169, 98, 0.3)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <View style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <SpinningBox />
      </View>
    </div>
  )
}
