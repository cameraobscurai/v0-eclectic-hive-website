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
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default
      
      // Clone the element and convert oklab colors to rgb for html2canvas compatibility
      const clone = element.cloneNode(true) as HTMLElement
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.width = `${element.offsetWidth}px`
      clone.style.height = `${element.offsetHeight}px`
      document.body.appendChild(clone)
      
      // Process all elements to convert oklab to fallback colors
      const allElements = clone.querySelectorAll('*')
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        const computed = window.getComputedStyle(htmlEl)
        
        // Force color values to computed RGB
        if (computed.backgroundColor && computed.backgroundColor.includes('oklab')) {
          htmlEl.style.backgroundColor = computed.backgroundColor
        }
        if (computed.color && computed.color.includes('oklab')) {
          htmlEl.style.color = computed.color
        }
      })
      
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        // Ignore the fixed controls
        ignoreElements: (el) => {
          return el.classList?.contains('fixed') || false
        }
      })
      
      // Cleanup
      document.body.removeChild(clone)
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
      // Fallback: show instructions for manual screenshot
      alert('Export failed. Use your browser\'s screenshot tool:\n\nMac: Cmd + Shift + 4\nWindows: Win + Shift + S')
    } finally {
      setIsExporting(false)
    }
  }, [targetId, filename])

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className="fixed top-6 right-6 z-50 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-wait rounded"
      style={{
        backgroundColor: '#1a1a1a',
        color: '#f5f2ed',
      }}
    >
      {isExporting ? 'Exporting...' : 'Download PNG'}
    </button>
  )
}
