'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva'
import Konva from 'konva'
import { cn } from '@/lib/utils'

// Canvas settings
const CANVAS_SIZE = 540
const EXPORT_SIZE = 1200
const BG_COLOR = '#FFFFFF'

interface ImageEditorProps {
  imageUrl: string
  pathname: string
  onSave: (pathname: string) => void
  onClose: () => void
}

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
    img.onerror = () => setLoading(false)
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
  const [position, setPosition] = useState({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
  const [imageScale, setImageScale] = useState({ x: 1, y: 1 })
  
  const [history, setHistory] = useState<Array<{ position: typeof position; scale: typeof imageScale }>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize image position and scale
  useEffect(() => {
    if (image && imageRef.current) {
      const maxDim = Math.max(image.width, image.height)
      const fitScale = (CANVAS_SIZE * 0.75) / maxDim
      
      setImageScale({ x: fitScale, y: fitScale })
      setPosition({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
      setHistory([{ position: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }, scale: { x: fitScale, y: fitScale } }])
      setHistoryIndex(0)
    }
  }, [image])

  // Attach transformer to image
  useEffect(() => {
    if (imageRef.current && transformerRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [image])

  const saveToHistory = useCallback(() => {
    if (!imageRef.current) return
    const node = imageRef.current
    const newState = {
      position: { x: node.x(), y: node.y() },
      scale: { x: node.scaleX(), y: node.scaleY() }
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    if (newHistory.length > 20) newHistory.shift()
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

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

  const centerImage = () => {
    if (!imageRef.current) return
    imageRef.current.position({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
    setPosition({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
    saveToHistory()
  }

  const handleSave = async () => {
    if (!stageRef.current) return
    setSaving(true)
    
    try {
      if (transformerRef.current) transformerRef.current.visible(false)
      
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: EXPORT_SIZE / CANVAS_SIZE,
        mimeType: 'image/png',
      })
      
      if (transformerRef.current) transformerRef.current.visible(true)
      
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
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

  const handleDragEnd = () => {
    if (!imageRef.current) return
    setPosition({ x: imageRef.current.x(), y: imageRef.current.y() })
    saveToHistory()
  }

  const handleTransformEnd = () => {
    if (!imageRef.current) return
    setImageScale({ x: imageRef.current.scaleX(), y: imageRef.current.scaleY() })
    setPosition({ x: imageRef.current.x(), y: imageRef.current.y() })
    saveToHistory()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        e.shiftKey ? redo() : undo()
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
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal container */}
      <div className="bg-cream rounded-2xl shadow-2xl overflow-hidden max-w-[640px] w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/5">
          <h3 className="text-sm font-medium text-charcoal capitalize tracking-wide">
            {filename}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-charcoal/5 transition-colors"
          >
            <svg className="w-4 h-4 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Canvas area */}
        <div className="p-6 bg-[#F5F4F2]">
          <div className="flex justify-center">
            {loading ? (
              <div 
                className="flex items-center justify-center rounded-lg"
                style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, backgroundColor: BG_COLOR }}
              >
                <div className="w-6 h-6 border-2 border-charcoal/20 border-t-charcoal/60 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Stage
                  ref={stageRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  style={{ backgroundColor: BG_COLOR }}
                >
                  <Layer>
                    <Rect x={0} y={0} width={CANVAS_SIZE} height={CANVAS_SIZE} fill={BG_COLOR} />
                    
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
                    
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 30 || newBox.height < 30) return oldBox
                        return newBox
                      }}
                      anchorSize={8}
                      anchorCornerRadius={4}
                      anchorFill="#2C2C2C"
                      anchorStroke="#fff"
                      anchorStrokeWidth={1}
                      borderStroke="#2C2C2C"
                      borderStrokeWidth={1}
                      borderDash={[4, 4]}
                      rotateEnabled={false}
                      keepRatio={true}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    />
                  </Layer>
                </Stage>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-t border-charcoal/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Fit presets */}
            {[
              { label: '90%', padding: 0.05 },
              { label: '80%', padding: 0.10 },
              { label: '70%', padding: 0.15 },
              { label: '60%', padding: 0.20 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => fitToCanvas(preset.padding)}
                className="px-3 py-1.5 text-[11px] text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 rounded transition-colors"
              >
                {preset.label}
              </button>
            ))}
            
            <div className="w-px h-5 bg-charcoal/10 mx-2" />
            
            {/* Center */}
            <button
              onClick={centerImage}
              className="px-3 py-1.5 text-[11px] text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 rounded transition-colors"
            >
              Center
            </button>
            
            <div className="w-px h-5 bg-charcoal/10 mx-2" />
            
            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded transition-colors",
                historyIndex <= 0 ? "text-charcoal/20" : "text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5"
              )}
              title="Undo"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded transition-colors",
                historyIndex >= history.length - 1 ? "text-charcoal/20" : "text-charcoal/50 hover:text-charcoal hover:bg-charcoal/5"
              )}
              title="Redo"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
            </button>
          </div>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "px-5 py-2 text-xs font-medium tracking-wide uppercase rounded transition-all",
              saving 
                ? "bg-charcoal/20 text-charcoal/40"
                : "bg-charcoal text-cream hover:bg-charcoal/90"
            )}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
