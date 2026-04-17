'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva'
import Konva from 'konva'
import { cn } from '@/lib/utils'

// Canvas settings
const CANVAS_SIZE = 600
const EXPORT_SIZE = 1200
const BG_COLOR = '#D4D0CB'

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

  useEffect(() => {
    if (image && imageRef.current) {
      const maxDim = Math.max(image.width, image.height)
      const fitScale = (CANVAS_SIZE * 0.7) / maxDim
      
      setImageScale({ x: fitScale, y: fitScale })
      setPosition({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 })
      setHistory([{ position: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 }, scale: { x: fitScale, y: fitScale } }])
      setHistoryIndex(0)
    }
  }, [image])

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
    <div className="fixed inset-0 z-[100] bg-[#1a1a1a] overflow-hidden">
      {/* Minimal floating header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all"
        >
          <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <p className="text-white/40 text-sm font-light tracking-wide capitalize">{filename}</p>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all",
            saving 
              ? "bg-white/10 text-white/30"
              : "bg-white text-[#1a1a1a] hover:bg-white/90 hover:scale-105"
          )}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Canvas - centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {loading ? (
            <div 
              className="flex items-center justify-center rounded-lg"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, backgroundColor: BG_COLOR }}
            >
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden shadow-2xl shadow-black/50">
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
                      if (newBox.width < 50 || newBox.height < 50) return oldBox
                      return newBox
                    }}
                    anchorSize={10}
                    anchorCornerRadius={5}
                    anchorFill="#fff"
                    anchorStroke="transparent"
                    anchorStrokeWidth={0}
                    borderStroke="rgba(255,255,255,0.4)"
                    borderStrokeWidth={1}
                    borderDash={[]}
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

      {/* Floating bottom toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
          {/* Fit presets */}
          {[
            { label: '90', padding: 0.05 },
            { label: '80', padding: 0.10 },
            { label: '70', padding: 0.15 },
            { label: '60', padding: 0.20 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => fitToCanvas(preset.padding)}
              className="px-4 py-2 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              {preset.label}%
            </button>
          ))}
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-full transition-all",
              historyIndex <= 0 ? "text-white/20" : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-full transition-all",
              historyIndex >= history.length - 1 ? "text-white/20" : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Keyboard hints - subtle, bottom right */}
      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4 text-[10px] text-white/20">
        <span>⌘S save</span>
        <span>⌘Z undo</span>
        <span>esc close</span>
      </div>
    </div>
  )
}
