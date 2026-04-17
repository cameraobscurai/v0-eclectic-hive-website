'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva'
import Konva from 'konva'
import { cn } from '@/lib/utils'

// Canvas settings
const CANVAS_SIZE = 600 // Display size
const EXPORT_SIZE = 1200 // Export resolution
const BG_COLOR = '#D4D0CB' // Taupe background

interface ImageEditorProps {
  imageUrl: string
  pathname: string
  onSave: (pathname: string) => void
  onClose: () => void
}

// Custom hook to load image for Konva
function useKonvaImage(url: string): [HTMLImageElement | null, boolean] {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
      setLoading(false)
    }
    img.onerror = () => {
      setLoading(false)
    }
    img.src = url
  }, [url])

  return [image, loading]
}

export function ImageEditor({ imageUrl, pathname, onSave, onClose }: ImageEditorProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  
  const [image, loading] = useKonvaImage(imageUrl)
  const [saving, setSaving] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
  const [imageScale, setImageScale] = useState({ x: 1, y: 1 })
  
  // History for undo/redo
  const [history, setHistory] = useState<Array<{ position: typeof position; scale: typeof imageScale }>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize image position and scale when loaded
  useEffect(() => {
    if (image && imageRef.current) {
      const imgWidth = image.width
      const imgHeight = image.height
      const maxDim = Math.max(imgWidth, imgHeight)
      
      // Scale to fit 70% of canvas initially (leaves room for adjustments)
      const fitScale = (CANVAS_SIZE * 0.7) / maxDim
      
      setImageScale({ x: fitScale, y: fitScale })
      setPosition({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
      
      // Save initial state to history
      setHistory([{ position: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }, scale: { x: fitScale, y: fitScale } }])
      setHistoryIndex(0)
    }
  }, [image])

  // Attach transformer when image is ready
  useEffect(() => {
    if (imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [image])

  // Save current state to history
  const saveToHistory = useCallback(() => {
    if (!imageRef.current) return
    
    const node = imageRef.current
    const newState = {
      position: { x: node.x(), y: node.y() },
      scale: { x: node.scaleX(), y: node.scaleY() }
    }
    
    // Remove any future states if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    
    // Keep only last 20 states
    if (newHistory.length > 20) newHistory.shift()
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0 && imageRef.current) {
      const prevState = history[historyIndex - 1]
      imageRef.current.position(prevState.position)
      imageRef.current.scale(prevState.scale)
      setPosition(prevState.position)
      setImageScale(prevState.scale)
      setHistoryIndex(historyIndex - 1)
    }
  }, [history, historyIndex])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && imageRef.current) {
      const nextState = history[historyIndex + 1]
      imageRef.current.position(nextState.position)
      imageRef.current.scale(nextState.scale)
      setPosition(nextState.position)
      setImageScale(nextState.scale)
      setHistoryIndex(historyIndex + 1)
    }
  }, [history, historyIndex])

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' ? scale * 1.2 : scale / 1.2
    setScale(Math.max(0.5, Math.min(3, newScale)))
  }

  // Fit to canvas with specific padding
  const fitToCanvas = (padding: number) => {
    if (!image || !imageRef.current) return
    
    const targetSize = CANVAS_SIZE * (1 - padding * 2)
    const maxDim = Math.max(image.width, image.height)
    const newScale = targetSize / maxDim
    
    imageRef.current.scale({ x: newScale, y: newScale })
    imageRef.current.position({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
    
    setImageScale({ x: newScale, y: newScale })
    setPosition({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
    saveToHistory()
  }

  // Reset to center
  const resetPosition = () => {
    if (!imageRef.current) return
    imageRef.current.position({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
    setPosition({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
    saveToHistory()
  }

  // Export and save
  const handleSave = async () => {
    if (!stageRef.current) return
    
    setSaving(true)
    
    try {
      // Hide transformer for export
      if (transformerRef.current) {
        transformerRef.current.visible(false)
      }
      
      // Export at higher resolution
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: EXPORT_SIZE / CANVAS_SIZE,
        mimeType: 'image/png',
      })
      
      // Show transformer again
      if (transformerRef.current) {
        transformerRef.current.visible(true)
      }
      
      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      // Upload to Blob storage (overwrite)
      const formData = new FormData()
      formData.append('file', blob, pathname.split('/').pop() || 'image.png')
      formData.append('pathname', pathname)
      
      const uploadRes = await fetch('/api/inventory-image/update', {
        method: 'PUT',
        body: formData,
      })
      
      if (!uploadRes.ok) throw new Error('Save failed')
      
      onSave(pathname)
    } catch (err) {
      console.error('Save error:', err)
      alert('Failed to save image')
    }
    
    setSaving(false)
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (!imageRef.current) return
    setPosition({ x: imageRef.current.x(), y: imageRef.current.y() })
    saveToHistory()
  }

  // Handle transform end
  const handleTransformEnd = () => {
    if (!imageRef.current) return
    setImageScale({ x: imageRef.current.scaleX(), y: imageRef.current.scaleY() })
    setPosition({ x: imageRef.current.x(), y: imageRef.current.y() })
    saveToHistory()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
        e.preventDefault()
      } else if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSave()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, undo, redo])

  const filename = pathname.split('/').pop()?.replace('.png', '').replace(/-/g, ' ') || 'Image'

  return (
    <div className="fixed inset-0 z-[100] bg-charcoal overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-cream/60 hover:text-cream transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="font-display text-lg text-cream tracking-wide capitalize">
            {filename}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
              saving 
                ? "bg-cream/20 text-cream/40 cursor-wait"
                : "bg-cream text-charcoal hover:bg-cream/90"
            )}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex min-h-0">
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden min-w-0">
          <div 
            className="relative shadow-2xl"
            style={{ 
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            {loading ? (
              <div 
                className="flex items-center justify-center"
                style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, backgroundColor: BG_COLOR }}
              >
                <p className="text-charcoal/40 text-sm">Loading...</p>
              </div>
            ) : (
              <Stage
                ref={stageRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{ backgroundColor: BG_COLOR }}
              >
                <Layer>
                  {/* Background */}
                  <Rect
                    x={0}
                    y={0}
                    width={CANVAS_SIZE}
                    height={CANVAS_SIZE}
                    fill={BG_COLOR}
                  />
                  
                  {/* Image */}
                  {image && (
                    <KonvaImage
                      ref={imageRef}
                      image={image}
                      x={position.x}
                      y={position.y}
                      offsetX={image.width / 2}
                      offsetY={image.height / 2}
                      scaleX={imageScale.x}
                      scaleY={imageScale.y}
                      draggable
                      onDragEnd={handleDragEnd}
                      onTransformEnd={handleTransformEnd}
                    />
                  )}
                  
                  {/* Transformer */}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit minimum size
                      if (newBox.width < 50 || newBox.height < 50) {
                        return oldBox
                      }
                      return newBox
                    }}
                    anchorSize={12}
                    anchorCornerRadius={2}
                    anchorFill="#fff"
                    anchorStroke="#333"
                    anchorStrokeWidth={1}
                    borderStroke="#333"
                    borderStrokeWidth={1}
                    borderDash={[4, 4]}
                    rotateEnabled={false}
                    keepRatio={true}
                  />
                </Layer>
              </Stage>
            )}
          </div>
        </div>

        {/* Controls sidebar */}
        <div className="w-64 shrink-0 bg-charcoal border-l border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Zoom */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">
              Canvas Zoom
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-cream/60 hover:text-cream hover:border-white/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <div className="flex-1 text-center text-sm text-cream/60">
                {Math.round(scale * 100)}%
              </div>
              <button
                onClick={() => handleZoom('in')}
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-cream/60 hover:text-cream hover:border-white/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick fit presets */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">
              Fit Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fitToCanvas(0.05)}
                className="px-3 py-2 border border-white/20 text-cream/60 text-xs hover:text-cream hover:border-white/40 transition-colors"
              >
                90%
              </button>
              <button
                onClick={() => fitToCanvas(0.10)}
                className="px-3 py-2 border border-white/20 text-cream/60 text-xs hover:text-cream hover:border-white/40 transition-colors"
              >
                80%
              </button>
              <button
                onClick={() => fitToCanvas(0.15)}
                className="px-3 py-2 border border-white/20 text-cream/60 text-xs hover:text-cream hover:border-white/40 transition-colors"
              >
                70%
              </button>
              <button
                onClick={() => fitToCanvas(0.20)}
                className="px-3 py-2 border border-white/20 text-cream/60 text-xs hover:text-cream hover:border-white/40 transition-colors"
              >
                60%
              </button>
            </div>
          </div>

          {/* Position controls */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">
              Position
            </label>
            <button
              onClick={resetPosition}
              className="w-full px-3 py-2 border border-white/20 text-cream/60 text-xs hover:text-cream hover:border-white/40 transition-colors"
            >
              Center
            </button>
          </div>

          {/* History */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">
              History
            </label>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={cn(
                  "flex-1 px-3 py-2 border text-xs transition-colors",
                  historyIndex <= 0
                    ? "border-white/10 text-cream/20 cursor-not-allowed"
                    : "border-white/20 text-cream/60 hover:text-cream hover:border-white/40"
                )}
              >
                Undo
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={cn(
                  "flex-1 px-3 py-2 border text-xs transition-colors",
                  historyIndex >= history.length - 1
                    ? "border-white/10 text-cream/20 cursor-not-allowed"
                    : "border-white/20 text-cream/60 hover:text-cream hover:border-white/40"
                )}
              >
                Redo
              </button>
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-3">
              Shortcuts
            </label>
            <div className="space-y-2 text-xs text-cream/40">
              <div className="flex justify-between">
                <span>Save</span>
                <span className="text-cream/60">Cmd+S</span>
              </div>
              <div className="flex justify-between">
                <span>Undo</span>
                <span className="text-cream/60">Cmd+Z</span>
              </div>
              <div className="flex justify-between">
                <span>Redo</span>
                <span className="text-cream/60">Cmd+Shift+Z</span>
              </div>
              <div className="flex justify-between">
                <span>Close</span>
                <span className="text-cream/60">Esc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
