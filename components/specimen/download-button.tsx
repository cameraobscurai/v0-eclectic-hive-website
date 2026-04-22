'use client'

import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'

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
      const canvas = await html2canvas(element, {
        scale: 2, // 2x resolution for retina quality
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [targetId, filename])

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className="fixed top-6 right-6 z-50 px-4 py-2 bg-charcoal text-cream text-xs uppercase tracking-[0.15em] hover:bg-charcoal/80 transition-colors disabled:opacity-50 disabled:cursor-wait"
    >
      {isExporting ? 'Exporting...' : 'Download PNG'}
    </button>
  )
}
