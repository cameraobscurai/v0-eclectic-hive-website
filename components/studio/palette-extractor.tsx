'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Wand2, RefreshCw } from 'lucide-react'

export interface PaletteColor {
  hex: string
  name: string
}

interface PaletteExtractorProps {
  imageUrls: string[]
  palette: PaletteColor[]
  onChange: (palette: PaletteColor[]) => void
}

// Convert RGB array to hex string
function rgbToHex([r, g, b]: number[]): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

// Name a color based on rough hue/lightness analysis
function nameColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lightness = (r + g + b) / (3 * 255)
  const max = Math.max(r, g, b)
  
  if (lightness > 0.85) return 'Light'
  if (lightness < 0.15) return 'Dark'
  if (max === r && r > g + 40 && r > b + 40) return 'Warm'
  if (max === g && g > r + 30 && g > b + 30) return 'Sage'
  if (max === b && b > r + 30 && b > g + 30) return 'Cool'
  if (r > 150 && g > 120 && b < 100) return 'Earth'
  if (lightness > 0.6) return 'Soft'
  if (lightness > 0.35) return 'Mid'
  return 'Deep'
}

export function PaletteExtractor({ imageUrls, palette, onChange }: PaletteExtractorProps) {
  const [extracting, setExtracting] = useState(false)
  const [hasExtracted, setHasExtracted] = useState(false)

  const extractPalette = useCallback(async () => {
    if (imageUrls.length === 0) return
    setExtracting(true)

    try {
      const { default: ColorThief } = await import('color-thief-browser')
      const colorThief = new ColorThief()
      
      // Load images and extract colors from first 3
      const colorCounts: Map<string, number> = new Map()
      
      const imagePromises = imageUrls.slice(0, 3).map(src => {
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            try {
              // getPalette(img, colorCount) — extract 4 colors per image
              const colors = colorThief.getPalette(img, 4)
              colors.forEach((rgb: number[]) => {
                const hex = rgbToHex(rgb)
                colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1)
              })
            } catch {
              // Some images can't be processed (CORS etc) — skip
            }
            resolve()
          }
          img.onerror = () => resolve()
          img.src = src
        })
      })

      await Promise.all(imagePromises)

      // Take top 6 unique colors by frequency, deduplicated
      const sorted = Array.from(colorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([hex]) => hex)
        .slice(0, 6)

      if (sorted.length >= 3) {
        const newPalette = sorted.map(hex => ({
          hex,
          name: nameColor(hex),
        }))
        onChange(newPalette)
        setHasExtracted(true)
      }
    } catch (err) {
      console.error('Color extraction failed:', err)
    } finally {
      setExtracting(false)
    }
  }, [imageUrls, onChange])

  // Auto-extract when images change
  useEffect(() => {
    if (imageUrls.length > 0 && !hasExtracted) {
      extractPalette()
    }
    if (imageUrls.length === 0) {
      setHasExtracted(false)
    }
  }, [imageUrls, hasExtracted, extractPalette])

  function updateColor(index: number, hex: string) {
    const updated = palette.map((c, i) =>
      i === index ? { hex, name: nameColor(hex) } : c
    )
    onChange(updated)
  }

  return (
    <div className="space-y-8">
      {/* Extracted palette */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40">
            {hasExtracted ? 'Extracted from your images' : 'Your palette'}
          </p>
          {imageUrls.length > 0 && (
            <button
              onClick={extractPalette}
              disabled={extracting}
              className="flex items-center gap-2 text-xs text-charcoal/50 hover:text-charcoal transition-colors disabled:opacity-50"
            >
              {extracting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>{extracting ? 'Extracting...' : 'Re-extract'}</span>
            </button>
          )}
        </div>

        {imageUrls.length === 0 && (
          <p className="text-charcoal/30 text-sm mb-6">
            Add images in the previous step to auto-extract your palette.
          </p>
        )}

        {/* Color swatches — click to open native color picker */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {palette.map((color, i) => (
            <div key={i} className="group text-center">
              <label className="block cursor-pointer">
                <div
                  className={cn(
                    'aspect-square mb-2.5 transition-all duration-200',
                    'ring-2 ring-transparent group-hover:ring-charcoal/20',
                    'relative overflow-hidden'
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {/* Invisible color input overlays the swatch */}
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(i, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    title="Click to change color"
                  />
                </div>
                <p className="text-[11px] text-charcoal/50 leading-tight">{color.name}</p>
                <p className="text-[10px] text-charcoal/25 font-mono mt-0.5">{color.hex}</p>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preset palettes — kept as quick-start option */}
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/40 mb-5">
          Or start from a preset
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Warm Neutrals', colors: ['#f5f2ed', '#d4cdc4', '#c9b99a', '#a08060', '#6b5344', '#3d2e24'] },
            { name: 'Cool & Calm',   colors: ['#f0f4f4', '#d4e0e0', '#9eb3b3', '#5a7070', '#3d4d4d', '#1a2424'] },
            { name: 'Earth & Sage',  colors: ['#f5f2ed', '#d4d4c4', '#b3c9a0', '#5a6b4a', '#4a5040', '#2a302a'] },
            { name: 'Moody & Rich',  colors: ['#e8e4df', '#c9b99a', '#8b6b4a', '#4a3728', '#2a1f18', '#1a1410'] },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                onChange(preset.colors.map(hex => ({ hex, name: nameColor(hex) })))
                setHasExtracted(false)
              }}
              className="text-left group"
            >
              <div className="flex h-10 mb-2 overflow-hidden">
                {preset.colors.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-xs text-charcoal/50 group-hover:text-charcoal transition-colors">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
