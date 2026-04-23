'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
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

interface Product {
  id: string
  name: string
  primary_image_url: string | null
  category: string
  dims_display?: string
  stock_count?: number
}

// SWR fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

// Color extraction from images (simplified - in production use canvas API)
function extractColorsFromImage(): ExtractedColor[] {
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

// Lifestyle imagery for visual appeal
const LIFESTYLE_IMAGES = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%282%29-jSp5dUwC7qE6Az74tbTrhyPsS9Hp3N.png', alt: 'Boucle chair vignette with lamp and accessories' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_33_39%20AM-i3tVPuiTbhTLfdzp2THZmBRDfyaKBD.png', alt: 'Elegant tablescape with linen and ceramics' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_41%20AM%20%284%29-d9QCIVvJ0A0HwHkvgomCLIsSZpTltS.png', alt: 'Textiles and pillows collection' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%281%29-ysnOsz5FYFEPQzufogthldORvQWG5F.png', alt: 'Tableware vignette with pottery' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%2023%2C%202026%2C%2006_36_40%20AM%20%283%29-AJLa39oz4oGazs06HWIawRq61cYiuT.png', alt: 'Ceramics and decor still life' },
]

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
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  
  // Inventory state
  const [activeCategory, setActiveCategory] = useState('Seating')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setLoaded(true) }, [])
  
  // Fetch categories
  const { data: categoriesData } = useSWR('/api/categories', fetcher, {
    revalidateOnFocus: false,
  })
  const categories: string[] = categoriesData?.categories || []
  
  // Fetch products by category
  const { data: productsData, isValidating } = useSWR(
    activeCategory 
      ? `/api/products?imagesOnly=true&category=${encodeURIComponent(activeCategory)}&limit=50`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )
  const products: Product[] = productsData?.products || []

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
        const colors = extractColorsFromImage()
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

  const toggleProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.filter(p => p.id !== product.id)
      }
      return [...prev, product]
    })
  }
  
  const isProductSelected = (id: string) => selectedProducts.some(p => p.id === id)

  const removeColor = (hex: string) => {
    setExtractedColors(prev => prev.filter(c => c.hex !== hex))
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
  }

  // Group selected products by category for preview
  const selectedByCategory = useMemo(() => {
    return selectedProducts.reduce((acc, product) => {
      const cat = product.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(product)
      return acc
    }, {} as Record<string, Product[]>)
  }, [selectedProducts])

  return (
    <main className="bg-cream min-h-screen">
      <Navigation />
      
      {/* Hero with Lifestyle Imagery */}
      <section className="relative pt-24 pb-12 lg:pb-0 min-h-[70vh] flex items-end">
        {/* Background Image Grid */}
        <div className="absolute inset-0 grid grid-cols-3 lg:grid-cols-5 gap-1 opacity-[0.08]">
          {LIFESTYLE_IMAGES.map((img, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover scale-110"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full px-6 lg:px-12 pb-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-end">
            {/* Left: Text */}
            <div>
              <p className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-4 transition-all duration-700',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}>
                Design Studio
              </p>
              <h1 className={cn(
                'font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-display font-light text-charcoal transition-all duration-700',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )} style={{ transitionDelay: '100ms' }}>
                <span className="block">Build Your</span>
                <span className="block italic">Vision</span>
              </h1>
              <p className={cn(
                'text-charcoal/60 mt-6 max-w-md text-lg leading-relaxed transition-all duration-700',
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )} style={{ transitionDelay: '200ms' }}>
                Curate inspiration, define your palette, and select from our signature collection to bring your event to life.
              </p>
            </div>
            
            {/* Right: Featured Lifestyle Image */}
            <div className={cn(
              'relative aspect-[4/3] transition-all duration-1000',
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            )} style={{ transitionDelay: '300ms' }}>
              <Image
                src={LIFESTYLE_IMAGES[1].src}
                alt={LIFESTYLE_IMAGES[1].alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/5" />
            </div>
          </div>
        </div>
      </section>

      {/* Project Info Bar - Floating Card Style */}
      <section className="px-6 lg:px-12 -mt-6 relative z-20 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-xl shadow-charcoal/5 border border-charcoal/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-charcoal/20 rounded-full" />
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal/40">Project Details</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Canyon Point Wedding"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-cream/50 border-0 border-b border-charcoal/10 px-0 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">Client</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah & James"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-cream/50 border-0 border-b border-charcoal/10 px-0 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal/40 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.15em] text-charcoal/40">Event Date</label>
                <input
                  type="text"
                  placeholder="e.g. October 2026"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-cream/50 border-0 border-b border-charcoal/10 px-0 py-2 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-charcoal/40 transition-colors"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-charcoal text-cream px-6 py-3 text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors">
                  Submit Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs - Step Indicators */}
      <section className="px-6 lg:px-12 py-8 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'inspiration', label: 'Inspiration', step: '01', desc: 'Upload mood imagery' },
              { id: 'palette', label: 'Palette', step: '02', desc: 'Define your colors' },
              { id: 'inventory', label: 'Inventory', step: '03', desc: 'Select pieces' },
              { id: 'preview', label: 'Preview', step: '04', desc: 'Review your deck' },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              const hasContent = 
                (tab.id === 'inspiration' && inspirationImages.length > 0) ||
                (tab.id === 'palette' && extractedColors.length > 0) ||
                (tab.id === 'inventory' && selectedProducts.length > 0)
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    'relative p-4 text-left transition-all border',
                    isActive 
                      ? 'bg-charcoal text-cream border-charcoal' 
                      : 'bg-white text-charcoal border-charcoal/10 hover:border-charcoal/30'
                  )}
                >
                  <span className={cn(
                    'text-[10px] uppercase tracking-[0.2em]',
                    isActive ? 'text-cream/50' : 'text-charcoal/30'
                  )}>
                    {tab.step}
                  </span>
                  <p className={cn(
                    'text-sm uppercase tracking-[0.1em] mt-1',
                    isActive ? 'text-cream' : 'text-charcoal'
                  )}>
                    {tab.label}
                  </p>
                  <p className={cn(
                    'text-[10px] mt-1 hidden md:block',
                    isActive ? 'text-cream/60' : 'text-charcoal/40'
                  )}>
                    {tab.desc}
                  </p>
                  {hasContent && (
                    <div className={cn(
                      'absolute top-2 right-2 w-2 h-2 rounded-full',
                      isActive ? 'bg-cream/60' : 'bg-charcoal/30'
                    )} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Area with Lifestyle Accent */}
      <section className="px-6 lg:px-12 py-12 relative">
        {/* Decorative Side Images - Only on large screens */}
        <div className="hidden xl:block absolute right-0 top-12 w-48 space-y-4 opacity-30">
          <div className="relative aspect-square">
            <Image src={LIFESTYLE_IMAGES[0].src} alt="" fill className="object-cover" />
          </div>
          <div className="relative aspect-[4/3]">
            <Image src={LIFESTYLE_IMAGES[3].src} alt="" fill className="object-cover" />
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          
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

          {/* Inventory Tab - Connected to real products API */}
          {activeTab === 'inventory' && (
            <div className="space-y-8">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-4 py-2 text-xs uppercase tracking-[0.1em] transition-all border',
                      activeCategory === cat 
                        ? 'bg-charcoal text-cream border-charcoal' 
                        : 'bg-white text-charcoal/60 border-charcoal/10 hover:border-charcoal/30'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Selected Items Summary */}
              {selectedProducts.length > 0 && (
                <div className="bg-charcoal/5 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.1em] text-charcoal/60">
                    {selectedProducts.length} items selected
                  </span>
                  <button 
                    onClick={() => setSelectedProducts([])}
                    className="text-xs uppercase tracking-[0.1em] text-charcoal/40 hover:text-charcoal"
                  >
                    Clear All
                  </button>
                </div>
              )}
              
              {/* Product Grid */}
              <div className={cn(
                "grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 transition-opacity duration-200",
                isValidating ? "opacity-60" : "opacity-100"
              )}>
                {products.map((product) => {
                  const isSelected = isProductSelected(product.id)
                  return (
                    <button
                      key={product.id}
                      onClick={() => toggleProduct(product)}
                      className={cn(
                        "group relative aspect-square bg-white overflow-hidden cursor-pointer transition-all border text-left",
                        isSelected 
                          ? "ring-2 ring-charcoal ring-offset-2 border-charcoal" 
                          : "border-charcoal/5 hover:border-charcoal/20"
                      )}
                    >
                      {product.primary_image_url && (
                        <img
                          src={product.primary_image_url}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                        />
                      )}
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-charcoal text-cream rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-colors flex items-end opacity-0 group-hover:opacity-100 p-2">
                        <p className="text-cream text-[10px] uppercase tracking-wide truncate w-full">
                          {product.name}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {products.length === 0 && !isValidating && (
                <div className="text-center py-16">
                  <p className="text-charcoal/40">No products found in this category</p>
                </div>
              )}
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-[0.15em] text-charcoal/60">Inquiry Preview</p>
              
              {/* Deck Container */}
              <div className="space-y-6">
                
                {/* Slide 1: Cover */}
                <div className="aspect-[16/9] bg-charcoal p-8 lg:p-16 flex flex-col justify-between">
                  <div>
                    <p className="text-cream/50 text-xs uppercase tracking-[0.3em]">Eclectic Hive</p>
                  </div>
                  <div>
                    <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-4">Project Inquiry</p>
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

                {/* Slide 4+: Selected Inventory by Category */}
                {Object.entries(selectedByCategory).map(([category, items]) => (
                  <div key={category} className="aspect-[16/9] bg-white p-8 lg:p-16">
                    <p className="text-charcoal/50 text-xs uppercase tracking-[0.3em] mb-8">{category}</p>
                    <div className="grid grid-cols-4 gap-6 h-[calc(100%-4rem)]">
                      {items.slice(0, 8).map((product) => (
                        <div key={product.id} className="flex flex-col">
                          <div className="relative flex-1 bg-[#F8F6F3]">
                            {product.primary_image_url && (
                              <Image 
                                src={product.primary_image_url} 
                                alt={product.name} 
                                fill 
                                className="object-contain p-4" 
                              />
                            )}
                          </div>
                          <p className="text-sm text-charcoal mt-2 truncate">{product.name}</p>
                          {product.dims_display && (
                            <p className="text-xs text-charcoal/40">{product.dims_display}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Final Slide: Contact */}
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
