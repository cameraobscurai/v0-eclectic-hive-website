'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

// Types
interface InspirationImage {
  id: string
  src: string
  name: string
}

interface ExtractedColor {
  hex: string
  name: string
}

interface InventoryItem {
  id: string
  name: string
  image: string
  category: string
}

// Sample inventory items (would come from collection)
const SAMPLE_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'LINDT Sofa', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/1712174636489-IBJC8QYVZ26G4NI9KQVT/Lindt-Velvet-Olive-1.png', category: 'Sofas' },
  { id: '2', name: 'BROOKLYN Plush', image: 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066/e5c5b65c-2bb6-417e-8d99-f25ce8881498/Brooklyn+Plush+Charcoal.png', category: 'Sofas' },
  { id: '3', name: 'GEORGIA Sconce', image: 'https://blob.v0.app/Us442.webp', category: 'Lighting' },
  { id: '4', name: 'CRESSIDA Lamp', image: 'https://blob.v0.app/T3jOQ.webp', category: 'Lighting' },
  { id: '5', name: 'JINA Duo', image: 'https://blob.v0.app/SjVug.webp', category: 'Decor' },
  { id: '6', name: 'AGATHA Duo', image: 'https://blob.v0.app/PQP0Z.webp', category: 'Decor' },
]

// Color extraction from images (simplified - in production use canvas API)
function extractColorsFromImage(imageSrc: string): ExtractedColor[] {
  // Simulated extraction - in production, use canvas to sample pixels
  const palettes = [
    [
      { hex: '#2C3E50', name: 'Midnight' },
      { hex: '#8B7355', name: 'Walnut' },
      { hex: '#D4C5B5', name: 'Sand' },
      { hex: '#F5F2ED', name: 'Cream' },
      { hex: '#1A1A1A', name: 'Charcoal' },
    ],
    [
      { hex: '#4A6741', name: 'Forest' },
      { hex: '#C9B896', name: 'Wheat' },
      { hex: '#8B4513', name: 'Saddle' },
      { hex: '#E8E0D4', name: 'Linen' },
      { hex: '#2F2F2F', name: 'Slate' },
    ],
    [
      { hex: '#6B5B4F', name: 'Mocha' },
      { hex: '#B8A590', name: 'Taupe' },
      { hex: '#E5DDD3', name: 'Bone' },
      { hex: '#3D3D3D', name: 'Graphite' },
      { hex: '#A67B5B', name: 'Camel' },
    ],
  ]
  return palettes[Math.floor(Math.random() * palettes.length)]
}

export default function StudioPage() {
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'inspiration' | 'palette' | 'inventory' | 'preview'>('inspiration')
  
  // Project state
  const [projectName, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [designDescription, setDesignDescription] = useState('')
  const [inspirationImages, setInspirationImages] = useState<InspirationImage[]>([])
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([])
  const [selectedInventory, setSelectedInventory] = useState<string[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setLoaded(true) }, [])

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        const newImage: InspirationImage = {
          id: crypto.randomUUID(),
          src,
          name: file.name,
        }
        setInspirationImages(prev => [...prev, newImage])
        
        // Extract colors from the new image
        const colors = extractColorsFromImage(src)
        setExtractedColors(prev => {
          const existing = new Set(prev.map(c => c.hex))
          const newColors = colors.filter(c => !existing.has(c.hex))
          return [...prev, ...newColors].slice(0, 8)
        })
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const removeImage = (id: string) => {
    setInspirationImages(prev => prev.filter(img => img.id !== id))
  }

  const toggleInventory = (id: string) => {
    setSelectedInventory(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const removeColor = (hex: string) => {
    setExtractedColors(prev => prev.filter(c => c.hex !== hex))
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
  }

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className={cn(
            'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4 transition-all duration-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            Design Studio
          </p>
          <h1 className={cn(
            'font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] font-semibold uppercase text-charcoal transition-all duration-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )} style={{ transitionDelay: '100ms' }}>
            Style Guide Builder
          </h1>
          <p className={cn(
            'text-charcoal/60 mt-4 max-w-xl transition-all duration-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )} style={{ transitionDelay: '200ms' }}>
            Create beautiful client presentations with inspiration imagery, color palettes, and curated inventory selections.
          </p>
        </div>
      </section>

      {/* Project Info Bar */}
      <section className="px-6 lg:px-12 pb-8 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-white border border-charcoal/10 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-charcoal/30 transition-colors"
            />
            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-white border border-charcoal/10 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-charcoal/30 transition-colors"
            />
            <input
              type="text"
              placeholder="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-white border border-charcoal/10 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-charcoal/30 transition-colors"
            />
            <button className="bg-charcoal text-cream px-4 py-3 text-sm uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 lg:px-12 py-6 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {[
              { id: 'inspiration', label: 'Inspiration' },
              { id: 'palette', label: 'Color Palette' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'preview', label: 'Preview' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'text-sm uppercase tracking-[0.15em] pb-2 border-b-2 transition-all',
                  activeTab === tab.id 
                    ? 'text-charcoal border-charcoal' 
                    : 'text-charcoal/40 border-transparent hover:text-charcoal/70'
                )}
              >
                {tab.label}
                {tab.id === 'inspiration' && inspirationImages.length > 0 && (
                  <span className="ml-2 text-[10px] bg-charcoal/10 px-1.5 py-0.5 rounded">{inspirationImages.length}</span>
                )}
                {tab.id === 'inventory' && selectedInventory.length > 0 && (
                  <span className="ml-2 text-[10px] bg-charcoal/10 px-1.5 py-0.5 rounded">{selectedInventory.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Inspiration Tab */}
          {activeTab === 'inspiration' && (
            <div className="space-y-8">
              {/* Upload Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-charcoal/20 hover:border-charcoal/40 transition-colors cursor-pointer p-12 text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg className="w-12 h-12 mx-auto text-charcoal/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-charcoal/60 text-sm">Drop inspiration images here or click to upload</p>
                <p className="text-charcoal/40 text-xs mt-2">PNG, JPG up to 10MB each</p>
              </div>

              {/* Image Grid */}
              {inspirationImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {inspirationImages.map((img) => (
                    <div key={img.id} className="relative group aspect-[4/3] bg-white">
                      <Image
                        src={img.src}
                        alt={img.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-charcoal/80 text-cream rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Design Description */}
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/60 mb-3">Design Direction</label>
                <textarea
                  placeholder="Describe the design vision, mood, and key elements..."
                  value={designDescription}
                  onChange={(e) => setDesignDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-charcoal/10 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-charcoal/30 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Palette Tab */}
          {activeTab === 'palette' && (
            <div className="space-y-8">
              {extractedColors.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-charcoal/40">Upload inspiration images to extract colors</p>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.15em] text-charcoal/60">Extracted Palette</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {extractedColors.map((color) => (
                      <div key={color.hex} className="group">
                        <div 
                          className="aspect-square relative cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyColor(color.hex)}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); removeColor(color.hex); }}
                            className="absolute top-2 right-2 w-6 h-6 bg-white/80 text-charcoal rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-mono bg-white/90 px-2 py-1 rounded">{color.hex}</span>
                          </div>
                        </div>
                        <p className="text-xs text-charcoal/60 mt-2 text-center">{color.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-[0.15em] text-charcoal/60">Select pieces for this project</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {SAMPLE_INVENTORY.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleInventory(item.id)}
                    className={cn(
                      'cursor-pointer transition-all',
                      selectedInventory.includes(item.id) && 'ring-2 ring-charcoal'
                    )}
                  >
                    <div className="relative aspect-square bg-white">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-4"
                      />
                      {selectedInventory.includes(item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-charcoal text-cream rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-charcoal mt-2">{item.name}</p>
                    <p className="text-xs text-charcoal/50">{item.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Tab - Landscape oriented deck preview */}
          {activeTab === 'preview' && (
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-[0.15em] text-charcoal/60">Presentation Preview</p>
              
              {/* Deck Container - Landscape 16:9 */}
              <div className="space-y-6">
                
                {/* Slide 1: Cover */}
                <div className="aspect-[16/9] bg-charcoal p-8 lg:p-16 flex flex-col justify-between">
                  <div>
                    <p className="text-cream/50 text-xs uppercase tracking-[0.3em]">Eclectic Hive</p>
                  </div>
                  <div>
                    <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-4">Style Guide</p>
                    <h2 className="font-display text-cream text-3xl md:text-5xl lg:text-6xl font-light italic">
                      {projectName || 'Project Name'}
                    </h2>
                    <p className="text-cream/60 mt-4">{clientName || 'Client Name'} {eventDate ? `· ${eventDate}` : ''}</p>
                  </div>
                </div>

                {/* Slide 2: Inspiration */}
                {inspirationImages.length > 0 && (
                  <div className="aspect-[16/9] bg-white p-8 lg:p-16">
                    <p className="text-charcoal/50 text-xs uppercase tracking-[0.3em] mb-8">Inspiration</p>
                    <div className="grid grid-cols-3 gap-4 h-[calc(100%-4rem)]">
                      {inspirationImages.slice(0, 3).map((img) => (
                        <div key={img.id} className="relative h-full">
                          <Image src={img.src} alt={img.name} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slide 3: Design Direction + Palette */}
                <div className="aspect-[16/9] bg-cream p-8 lg:p-16 grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-charcoal/50 text-xs uppercase tracking-[0.3em] mb-8">Design Direction</p>
                    <p className="text-charcoal text-lg leading-relaxed">
                      {designDescription || 'Add a design description to see it here...'}
                    </p>
                  </div>
                  <div>
                    <p className="text-charcoal/50 text-xs uppercase tracking-[0.3em] mb-8">Color Palette</p>
                    <div className="grid grid-cols-4 gap-3">
                      {extractedColors.slice(0, 8).map((color) => (
                        <div key={color.hex}>
                          <div className="aspect-square" style={{ backgroundColor: color.hex }} />
                          <p className="text-[10px] text-charcoal/50 mt-1">{color.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slide 4: Selected Inventory */}
                {selectedInventory.length > 0 && (
                  <div className="aspect-[16/9] bg-white p-8 lg:p-16">
                    <p className="text-charcoal/50 text-xs uppercase tracking-[0.3em] mb-8">Curated Pieces</p>
                    <div className="grid grid-cols-4 gap-6 h-[calc(100%-4rem)]">
                      {SAMPLE_INVENTORY.filter(i => selectedInventory.includes(i.id)).map((item) => (
                        <div key={item.id} className="flex flex-col">
                          <div className="relative flex-1 bg-[#F8F6F3]">
                            <Image src={item.image} alt={item.name} fill className="object-contain p-4" />
                          </div>
                          <p className="text-sm text-charcoal mt-2">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slide 5: Contact */}
                <div className="aspect-[16/9] bg-charcoal p-8 lg:p-16 flex flex-col justify-between">
                  <div />
                  <div className="text-center">
                    <p className="font-display text-cream text-4xl lg:text-5xl font-light italic mb-8">
                      Let&apos;s create something unforgettable
                    </p>
                    <p className="text-cream/60">info@eclectichive.com</p>
                    <p className="text-cream/40 text-sm mt-2">Denver, Colorado</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cream/30 text-xs">eclectichive.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
