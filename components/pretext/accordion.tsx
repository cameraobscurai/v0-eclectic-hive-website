'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { prepareWithSegments, layoutWithLines, waitForFonts, createFontString } from '@/lib/pretext'

interface AccordionItem {
  id: string
  question: string
  answer: string
}

interface PretextAccordionProps {
  items: AccordionItem[]
  className?: string
}

interface ItemHeights {
  [id: string]: number
}

export function PretextAccordion({ items, className }: PretextAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [heights, setHeights] = useState<ItemHeights>({})
  const [fontsReady, setFontsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Pre-calculate all answer heights using Pretext
  const calculateHeights = useCallback(async () => {
    await waitForFonts()
    setFontsReady(true)
    
    if (!containerRef.current) return

    // Get the container width for text measurement
    const containerWidth = containerRef.current.offsetWidth
    // Account for padding (px-6 = 24px each side on mobile, more on desktop)
    const textWidth = Math.min(containerWidth - 48, 800) // max-width safety
    
    const font = createFontString(16, 'Inter', 400)
    const lineHeight = 26 // leading-relaxed ~ 1.625
    
    const newHeights: ItemHeights = {}
    
    for (const item of items) {
      const prepared = prepareWithSegments(item.answer, font)
      const result = layoutWithLines(prepared, textWidth, lineHeight)
      // Add padding (py-6 = 24px top + 24px bottom)
      newHeights[item.id] = result.height + 48
    }
    
    setHeights(newHeights)
  }, [items])

  useEffect(() => {
    calculateHeights()
    
    // Recalculate on resize
    const handleResize = () => {
      calculateHeights()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateHeights])

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div ref={containerRef} className={cn('divide-y divide-border', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const calculatedHeight = heights[item.id] || 0
        
        return (
          <div key={item.id} className="group">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full py-8 flex items-start justify-between gap-8 text-left"
              aria-expanded={isOpen}
            >
              <h3 className="font-serif text-xl lg:text-2xl tracking-tight pr-8">
                {item.question}
              </h3>
              <div 
                className={cn(
                  'flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-500',
                  isOpen && 'rotate-45'
                )}
              >
                <svg 
                  className="w-5 h-5 text-muted-foreground" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 4v16m8-8H4" 
                  />
                </svg>
              </div>
            </button>
            
            {/* Answer container with Pretext-calculated height */}
            <div 
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{ 
                height: isOpen ? calculatedHeight : 0,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="pb-8 pr-16">
                <p 
                  className={cn(
                    'text-muted-foreground leading-relaxed transition-transform duration-500',
                    isOpen ? 'translate-y-0' : '-translate-y-2'
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* Loading state indicator */}
      {!fontsReady && (
        <div className="sr-only" aria-live="polite">
          Loading content measurements...
        </div>
      )}
    </div>
  )
}
