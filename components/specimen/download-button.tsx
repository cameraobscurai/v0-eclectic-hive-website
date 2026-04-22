'use client'

import { useState, useCallback } from 'react'

interface DownloadButtonProps {
  targetId: string
  filename: string
}

export function DownloadButton({ targetId, filename }: DownloadButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = useCallback(async () => {
    const element = document.getElementById(targetId)
    if (!element) return

    setIsExporting(true)
    
    try {
      // Use dom-to-image-more which has better CSS support
      const domtoimage = await import('dom-to-image-more')
      
      // Get the element dimensions
      const rect = element.getBoundingClientRect()
      
      const dataUrl = await domtoimage.toPng(element, {
        width: rect.width * 2,
        height: rect.height * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
        },
        filter: (node: Node) => {
          // Filter out fixed position elements (controls/buttons)
          if (node instanceof HTMLElement) {
            const style = window.getComputedStyle(node)
            if (style.position === 'fixed') return false
          }
          return true
        }
      })
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('[v0] Export failed:', error)
      // Fallback to native screenshot instructions
      alert(`Export failed. Please use your browser's screenshot tool:\n\nMac: Cmd + Shift + 4\nWindows: Win + Shift + S\n\nOr right-click the page and select "Save as image" if available.`)
    } finally {
      setIsExporting(false)
    }
  }, [targetId, filename])

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className="fixed top-6 right-6 z-50 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-wait rounded border"
      style={{
        backgroundColor: '#1a1a1a',
        color: '#f5f2ed',
        borderColor: 'rgba(245, 242, 237, 0.2)',
      }}
    >
      {isExporting ? 'Exporting...' : 'Download PNG'}
    </button>
  )
}
