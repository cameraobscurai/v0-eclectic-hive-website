'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { MATERIAL_SHADERS, VERTEX_SHADER, type MaterialType } from './shaders'

interface MaterialSwatchProps {
  material: MaterialType
  baseColor: string
  className?: string
  isActive?: boolean
  onActivate?: () => void
}

// Convert hex color to RGB array [0-1]
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0.5, 0.5, 0.5]
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ]
}

// Check if device has hover capability (desktop)
function hasHoverCapability(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: hover)').matches
}

export function MaterialSwatch({ 
  material, 
  baseColor, 
  className,
  isActive = false,
  onActivate
}: MaterialSwatchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animationRef = useRef<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const startTimeRef = useRef<number>(Date.now())

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    try {
      const gl = canvas.getContext('webgl', { 
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true 
      })
      if (!gl) {
        setWebglSupported(false)
        return false
      }

      // Compile vertex shader
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)
      if (!vertexShader) return false
      gl.shaderSource(vertexShader, VERTEX_SHADER)
      gl.compileShader(vertexShader)

      // Compile fragment shader
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
      if (!fragmentShader) return false
      gl.shaderSource(fragmentShader, MATERIAL_SHADERS[material])
      gl.compileShader(fragmentShader)

      // Create program
      const program = gl.createProgram()
      if (!program) return false
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      gl.useProgram(program)

      // Set up geometry (full-screen quad)
      const positions = new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
      ])
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

      const positionLocation = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      glRef.current = gl
      programRef.current = program

      return true
    } catch {
      setWebglSupported(false)
      return false
    }
  }, [material])

  // Render a single frame
  const render = useCallback((time: number) => {
    const gl = glRef.current
    const program = programRef.current
    const canvas = canvasRef.current
    if (!gl || !program || !canvas) return

    gl.viewport(0, 0, canvas.width, canvas.height)

    // Set uniforms
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const baseColorLoc = gl.getUniformLocation(program, 'u_baseColor')
    const lightPosLoc = gl.getUniformLocation(program, 'u_lightPos')

    gl.uniform2f(resolutionLoc, canvas.width, canvas.height)
    gl.uniform1f(timeLoc, time)
    
    const rgb = hexToRgb(baseColor)
    gl.uniform3f(baseColorLoc, rgb[0], rgb[1], rgb[2])
    
    // Light position follows time for subtle movement
    const lightX = 0.3 + Math.sin(time * 0.5) * 0.2
    const lightY = 0.3 + Math.cos(time * 0.7) * 0.2
    gl.uniform3f(lightPosLoc, lightX, lightY, 1.0)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }, [baseColor])

  // Animation loop
  const animate = useCallback(() => {
    const time = (Date.now() - startTimeRef.current) / 1000
    render(time)
    animationRef.current = requestAnimationFrame(animate)
  }, [render])

  // Start/stop animation based on hover state
  useEffect(() => {
    if (!webglSupported) return

    const shouldAnimate = isHovered || isActive || isTouchDevice

    if (shouldAnimate) {
      if (!glRef.current) {
        initWebGL()
      }
      if (glRef.current && !animationRef.current) {
        animate()
      }
    } else {
      // Render one frame then stop
      if (glRef.current) {
        const time = (Date.now() - startTimeRef.current) / 1000
        render(time)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isHovered, isActive, isTouchDevice, webglSupported, initWebGL, animate, render])

  // Initialize on mount
  useEffect(() => {
    setIsTouchDevice(!hasHoverCapability())
    
    if (initWebGL()) {
      // Render initial frame
      const time = (Date.now() - startTimeRef.current) / 1000
      render(time)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initWebGL, render])

  // Fallback for no WebGL
  if (!webglSupported) {
    return (
      <div 
        className={cn("w-full h-full rounded-sm cursor-pointer", className)}
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${baseColor}, ${baseColor}dd)`
        }}
        onClick={onActivate}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={120}
      className={cn(
        "w-full h-full rounded-sm cursor-pointer transition-transform duration-300",
        isActive && "ring-2 ring-charcoal ring-offset-2 ring-offset-cream",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onActivate}
    />
  )
}
