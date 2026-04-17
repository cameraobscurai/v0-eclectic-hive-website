'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// Lazy load Konva editor (it's heavy)
const ImageEditor = dynamic(
  () => import('@/components/studio/konva-editor/image-editor').then(mod => ({ default: mod.ImageEditor })),
  { ssr: false, loading: () => null }
)

const CATEGORIES = ['seating', 'tables', 'lighting', 'decor'] as const
type Category = typeof CATEGORIES[number]

type UploadedFile = { name: string; url: string; pathname: string }
type BlobInfo = { pathname: string; url: string; uploadedAt: string }

export default function UploadPage() {
  const [category, setCategory] = useState<Category>('seating')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<UploadedFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [existingFiles, setExistingFiles] = useState<Record<string, BlobInfo[]>>({})
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingImage, setEditingImage] = useState<{ url: string; pathname: string } | null>(null)
  const [cacheBuster, setCacheBuster] = useState(Date.now())

  // Delete all files (clean slate)
  const deleteAll = async () => {
    if (!confirm('Delete ALL inventory images? This cannot be undone.')) return
    
    setDeleting(true)
    try {
      const res = await fetch('/api/upload-inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Empty = delete all
      })
      const data = await res.json()
      alert(data.message || `Deleted ${data.deleted} files`)
      setExistingFiles({})
      setSelectedFiles(new Set())
    } catch (err) {
      alert('Failed to delete files')
    }
    setDeleting(false)
  }

  // Delete files in a specific category
  const deleteCategory = async (cat: string) => {
    if (!confirm(`Delete all ${cat} images? This cannot be undone.`)) return
    
    setDeleting(true)
    try {
      const res = await fetch('/api/upload-inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat }),
      })
      const data = await res.json()
      alert(data.message || `Deleted ${data.deleted} files`)
      setExistingFiles(prev => {
        const next = { ...prev }
        delete next[cat]
        return next
      })
    } catch (err) {
      alert('Failed to delete files')
    }
    setDeleting(false)
  }

  // Load existing files on mount
  useEffect(() => {
    fetch('/api/upload-inventory')
      .then(res => res.json())
      .then(async data => {
        // Filter out ghost files that don't actually exist
        const validated: typeof data.byCategory = {}
        for (const [cat, files] of Object.entries(data.byCategory || {})) {
          validated[cat] = files as any[]
        }
        setExistingFiles(validated)
        setLoadingExisting(false)
      })
      .catch(() => setLoadingExisting(false))
  }, [results])

  // Open image in editor
  const openEditor = (pathname: string) => {
    const imageUrl = `/api/inventory-image?pathname=${encodeURIComponent(pathname)}`
    setEditingImage({ url: imageUrl, pathname })
  }

  // Handle save from editor
  const handleEditorSave = (pathname: string) => {
    // Bust cache to force reload of updated images
    setCacheBuster(Date.now())
    // Refresh the file list to show updated image
    fetch('/api/upload-inventory')
      .then(res => res.json())
      .then(data => {
        setExistingFiles(data.byCategory || {})
      })
    setEditingImage(null)
  }

  const toggleFileSelection = (pathname: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev)
      if (next.has(pathname)) {
        next.delete(pathname)
      } else {
        next.add(pathname)
      }
      return next
    })
  }

  const selectAllInCategory = (cat: string) => {
    const catFiles = existingFiles[cat] || []
    setSelectedFiles(prev => {
      const next = new Set(prev)
      const allSelected = catFiles.every(f => prev.has(f.pathname))
      if (allSelected) {
        catFiles.forEach(f => next.delete(f.pathname))
      } else {
        catFiles.forEach(f => next.add(f.pathname))
      }
      return next
    })
  }

  const downloadSelected = async () => {
    if (selectedFiles.size === 0) return
    setDownloading(true)
    
    for (const pathname of selectedFiles) {
      try {
        const response = await fetch(`/api/inventory-image?pathname=${encodeURIComponent(pathname)}`)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = pathname.split('/').pop() || 'image.png'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        console.error('Download failed:', err)
      }
    }
    
    setDownloading(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/')
    )
    setFiles(prev => [...prev, ...dropped])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => 
        f.type.startsWith('image/')
      )
      setFiles(prev => [...prev, ...selected])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (!files.length) return
    
    setUploading(true)
    setProgress(0)
    setError(null)
    setResults([])

    // Upload in batches of 10
    const batchSize = 10
    const allResults: { name: string; url: string }[] = []

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)
      const formData = new FormData()
      formData.append('category', category)
      batch.forEach(f => formData.append('files', f))

      try {
        const res = await fetch('/api/upload-inventory', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`)
        }

        const data = await res.json()
        allResults.push(...data.files)
        setProgress(Math.round(((i + batch.length) / files.length) * 100))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
        break
      }
    }

    setResults(allResults)
    setUploading(false)
    if (allResults.length === files.length) {
      setFiles([])
    }
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl tracking-[0.1em] text-charcoal mb-2">
          Inventory Upload
        </h1>
        <p className="text-sm text-charcoal/60 mb-8">
          Upload product images to Vercel Blob storage
        </p>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-[0.15em] text-charcoal/60 mb-2">
            Category
          </label>
          <div className="flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 text-xs uppercase tracking-[0.1em] border transition-colors",
                  category === cat
                    ? "bg-charcoal text-cream border-charcoal"
                    : "bg-white text-charcoal border-charcoal/20 hover:border-charcoal/40"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-charcoal/20 hover:border-charcoal/40 transition-colors p-12 text-center mb-6"
        >
          <p className="text-charcoal/60 mb-4">
            Drag and drop images here, or
          </p>
          <label className="inline-block px-6 py-2 bg-charcoal text-cream text-xs uppercase tracking-[0.1em] cursor-pointer hover:bg-charcoal/90 transition-colors">
            Browse Files
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-[0.1em] text-charcoal/60">
                {files.length} files selected
              </span>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-charcoal/40 hover:text-charcoal underline"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-charcoal/10 divide-y divide-charcoal/10">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2 bg-white">
                  <span className="text-sm text-charcoal truncate flex-1 mr-4">
                    {file.name}
                  </span>
                  <span className="text-xs text-charcoal/40 mr-4">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-charcoal/40 hover:text-charcoal"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && !uploading && (
          <button
            onClick={uploadFiles}
            className="w-full py-3 bg-charcoal text-cream text-sm uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors"
          >
            Upload {files.length} Images to {category}
          </button>
        )}

        {/* Progress */}
        {uploading && (
          <div className="mb-6">
            <div className="h-2 bg-charcoal/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-charcoal transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-charcoal/60 mt-2 text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-[0.15em] text-charcoal/60 mb-3">
              Uploaded {results.length} images
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {results.slice(0, 20).map((r, i) => (
                <div key={i} className="aspect-square bg-[#D4D0CB] overflow-hidden">
                  <img 
                    src={`/api/inventory-image?pathname=${encodeURIComponent(r.pathname)}&t=${cacheBuster}`} 
                    alt={r.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))}
            </div>
            {results.length > 20 && (
              <p className="text-xs text-charcoal/40 mt-2">
                + {results.length - 20} more
              </p>
            )}
          </div>
        )}

        {/* Existing Files in Blob */}
        <div className="mt-12 pt-8 border-t border-charcoal/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl tracking-[0.1em] text-charcoal">
              Stored in Blob
            </h2>
            <div className="flex items-center gap-4">
              {selectedFiles.size > 0 && (
                <>
                  <span className="text-xs text-charcoal/60">
                    {selectedFiles.size} selected
                  </span>
                  <button
                    onClick={() => setSelectedFiles(new Set())}
                    className="text-xs text-charcoal/40 hover:text-charcoal underline"
                  >
                    Clear
                  </button>
                  <button
                    onClick={downloadSelected}
                    disabled={downloading}
                    className="px-4 py-2 bg-charcoal text-cream text-xs uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                  >
                    {downloading ? 'Downloading...' : 'Download Selected'}
                  </button>
                </>
              )}
              <button
                onClick={deleteAll}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white text-xs uppercase tracking-[0.1em] hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
          
          {loadingExisting ? (
            <p className="text-sm text-charcoal/40">Loading...</p>
          ) : (
            <div className="space-y-8">
              {CATEGORIES.map(cat => {
                const catFiles = existingFiles[cat] || []
                if (catFiles.length === 0) return null
                
                const allSelected = catFiles.every(f => selectedFiles.has(f.pathname))
                const someSelected = catFiles.some(f => selectedFiles.has(f.pathname))
                
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => selectAllInCategory(cat)}
                          className={cn(
                            "w-5 h-5 border flex items-center justify-center transition-colors",
                            allSelected 
                              ? "bg-charcoal border-charcoal" 
                              : someSelected 
                                ? "bg-charcoal/30 border-charcoal/30" 
                                : "border-charcoal/30 hover:border-charcoal/50"
                          )}
                        >
                          {(allSelected || someSelected) && (
                            <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <h3 className="text-xs uppercase tracking-[0.15em] text-charcoal/60">
                          {cat} ({catFiles.length} images)
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat)}
                        disabled={deleting}
                        className="text-xs text-red-600 hover:text-red-700 underline disabled:opacity-50"
                      >
                        Delete {cat}
                      </button>
                    </div>
                    <div className="grid grid-cols-6 lg:grid-cols-8 gap-2">
                      {catFiles.map((blob, i) => {
                        const isSelected = selectedFiles.has(blob.pathname)
                        const filename = blob.pathname.split('/').pop() || ''
                        return (
                          <div 
                            key={i} 
                            className={cn(
                              "group relative aspect-square bg-[#D4D0CB] overflow-hidden transition-all",
                              isSelected && "ring-2 ring-charcoal ring-offset-2"
                            )}
                            title={filename}
                          >
                            <img 
                              src={`/api/inventory-image?pathname=${encodeURIComponent(blob.pathname)}&t=${cacheBuster}`} 
                              alt={filename} 
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() => toggleFileSelection(blob.pathname)}
                            />
                            {/* Edit button - appears on hover */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openEditor(blob.pathname)
                              }}
                              className="absolute bottom-1 right-1 w-7 h-7 bg-charcoal/80 hover:bg-charcoal text-cream rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Edit image"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {isSelected && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-charcoal rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              
              {Object.keys(existingFiles).length === 0 && (
                <p className="text-sm text-charcoal/40">No images uploaded yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Editor Modal */}
      {editingImage && (
        <ImageEditor
          imageUrl={editingImage.url}
          pathname={editingImage.pathname}
          onSave={handleEditorSave}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  )
}
