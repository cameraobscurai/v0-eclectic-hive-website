'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Upload, Trash2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface MoodboardCanvasProps {
  onImagesChange: (dataUrls: string[]) => void
  initialImages?: string[]
}

export function MoodboardCanvas({ onImagesChange, initialImages = [] }: MoodboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedObject, setSelectedObject] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)
  const [objectCount, setObjectCount] = useState(0)

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return

    // Dynamic import — Fabric is heavy and SSR-incompatible
    import('fabric').then(({ fabric }) => {
      const canvas = new fabric.Canvas(canvasRef.current!, {
        backgroundColor: '#f5f2ed',
        selection: true,
        preserveObjectStacking: true,
        width: canvasRef.current!.parentElement?.clientWidth || 800,
        height: 520,
      })

      fabricRef.current = canvas
      setCanvasReady(true)

      // Track selection for toolbar
      canvas.on('selection:created', () => setSelectedObject(true))
      canvas.on('selection:cleared', () => setSelectedObject(false))

      // Add any initial images
      initialImages.forEach(src => addImageToCanvas(canvas, fabric, src))

      // Notify parent when canvas changes
      canvas.on('object:modified', () => syncImages(canvas))
      canvas.on('object:added', () => {
        syncImages(canvas)
        setObjectCount(canvas.getObjects('image').length)
      })
      canvas.on('object:removed', () => {
        syncImages(canvas)
        setObjectCount(canvas.getObjects('image').length)
      })
    })

    return () => {
      fabricRef.current?.dispose()
      fabricRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Watch for new images added externally (vignette clicks)
  useEffect(() => {
    if (!fabricRef.current || !canvasReady) return
    
    const currentSrcs = fabricRef.current.getObjects('image').map((o: any) => o.getSrc())
    const newSrcs = initialImages.filter(src => !currentSrcs.includes(src))
    if (newSrcs.length === 0) return
    
    import('fabric').then(({ fabric }) => {
      newSrcs.forEach(src => addImageToCanvas(fabricRef.current, fabric, src))
    })
  }, [initialImages, canvasReady])

  // Resize canvas when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (!fabricRef.current || !canvasRef.current) return
      const width = canvasRef.current.parentElement?.clientWidth || 800
      fabricRef.current.setWidth(width)
      fabricRef.current.renderAll()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function addImageToCanvas(canvas: any, fabric: any, src: string) {
    fabric.Image.fromURL(src, (img: any) => {
      // Scale to reasonable size — max 280px wide
      const maxW = 280
      const scale = img.width > maxW ? maxW / img.width : 1
      
      img.set({
        left: 60 + Math.random() * 300,
        top: 60 + Math.random() * 200,
        scaleX: scale,
        scaleY: scale,
        cornerSize: 10,
        cornerColor: '#1a1a1a',
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#1a1a1a',
        borderScaleFactor: 1.5,
      })
      
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    }, { crossOrigin: 'anonymous' })
  }

  // Export all image srcs back to parent
  function syncImages(canvas: any) {
    const objects = canvas.getObjects('image')
    const srcs = objects.map((obj: any) => obj.getSrc()).filter(Boolean)
    onImagesChange(srcs)
  }

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !fabricRef.current || !canvasReady) return

    import('fabric').then(({ fabric }) => {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            addImageToCanvas(fabricRef.current, fabric, event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      })
    })

    // Reset input so same file can be re-uploaded
    e.target.value = ''
  }, [canvasReady])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!fabricRef.current || !canvasReady) return

    import('fabric').then(({ fabric }) => {
      Array.from(e.dataTransfer.files).forEach(file => {
        if (!file.type.startsWith('image/')) return
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            addImageToCanvas(fabricRef.current, fabric, event.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      })
    })
  }, [canvasReady])

  function deleteSelected() {
    if (!fabricRef.current) return
    const active = fabricRef.current.getActiveObjects()
    active.forEach((obj: any) => fabricRef.current.remove(obj))
    fabricRef.current.discardActiveObject()
    fabricRef.current.renderAll()
  }

  function clearCanvas() {
    if (!fabricRef.current) return
    fabricRef.current.getObjects('image').forEach((obj: any) => fabricRef.current.remove(obj))
    fabricRef.current.renderAll()
    onImagesChange([])
    setObjectCount(0)
  }

  function bringForward() {
    const obj = fabricRef.current?.getActiveObject()
    if (obj) fabricRef.current.bringForward(obj)
  }

  function sendBackward() {
    const obj = fabricRef.current?.getActiveObject()
    if (obj) fabricRef.current.sendBackwards(obj)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-cream text-xs uppercase tracking-[0.12em] hover:bg-charcoal/90 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Images</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {selectedObject && (
            <>
              <button
                onClick={bringForward}
                className="p-2 border border-charcoal/15 text-charcoal/50 hover:text-charcoal hover:border-charcoal/30 transition-colors"
                title="Bring forward"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={sendBackward}
                className="p-2 border border-charcoal/15 text-charcoal/50 hover:text-charcoal hover:border-charcoal/30 transition-colors"
                title="Send backward"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={deleteSelected}
                className="p-2 border border-charcoal/15 text-charcoal/50 hover:text-red-500 hover:border-red-200 transition-colors"
                title="Delete selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-3 py-2 border border-charcoal/15 text-charcoal/50 hover:text-charcoal hover:border-charcoal/30 text-xs uppercase tracking-[0.12em] transition-colors"
            title="Clear all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full border border-charcoal/10 overflow-hidden"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas ref={canvasRef} />
        
        {/* Empty state overlay */}
        {canvasReady && objectCount === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Upload className="w-8 h-8 text-charcoal/20 mb-3" />
            <p className="text-charcoal/30 text-sm">Drop images here or use Add Images above</p>
            <p className="text-charcoal/20 text-xs mt-1">Drag to reposition · Corners to resize</p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-charcoal/30">
        Click to select · Drag to move · Corner handles to resize · Delete key to remove
      </p>
    </div>
  )
}

export type { MoodboardCanvasProps }
