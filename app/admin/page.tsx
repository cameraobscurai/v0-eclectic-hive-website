'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ScraperTab } from '@/components/admin/scraper-tab'

// Lazy load Konva editor (it's heavy)
const ImageEditor = dynamic(
  () => import('@/components/studio/konva-editor/image-editor').then(mod => ({ default: mod.ImageEditor })),
  { ssr: false, loading: () => null }
)

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
const CATEGORIES = ['seating', 'tables', 'lighting', 'decor', 'bars', 'serveware', 'styling', 'storage', 'chandeliers'] as const
type Category = typeof CATEGORIES[number]
type UploadedFile = { name: string; url: string; pathname: string }
type BlobInfo = { pathname: string; url: string; uploadedAt: string }

interface ImportResult {
  success: boolean
  stats?: {
    totalRows: number
    productsCreated: number
    productsUpdated: number
    variantsCreated: number
    variantsUpdated: number
    errors: number
  }
  error?: string
  details?: string
}

interface UploadedFont {
  filename: string
  url: string
  purpose: string
}

type Tab = 'images' | 'import' | 'fonts' | 'inquiries' | 'scraper'

// Inquiry types
interface Inquiry {
  id: string
  name: string | null
  email: string
  phone: string | null
  company: string | null
  event_type: string | null
  event_date: string | null
  location: string | null
  budget: string | null
  message: string
  referral_source: string | null
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'archived'
  notes: string | null
  email_sent: boolean
  created_at: string
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('images')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-charcoal/10 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-display text-xl tracking-[0.05em] text-charcoal">
                Eclectic Hive
              </Link>
              <span className="text-charcoal/30">|</span>
              <h1 className="text-sm uppercase tracking-[0.15em] text-charcoal/60">Admin</h1>
            </div>
            <Link 
              href="/collection" 
              className="text-xs uppercase tracking-[0.1em] text-charcoal/50 hover:text-charcoal transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            {[
              { id: 'images' as Tab, label: 'Inventory Images' },
              { id: 'import' as Tab, label: 'CSV Import' },
              { id: 'scraper' as Tab, label: 'Scraper' },
              { id: 'fonts' as Tab, label: 'Fonts' },
              { id: 'inquiries' as Tab, label: 'Inquiries' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-xs uppercase tracking-[0.12em] border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-charcoal text-charcoal"
                    : "border-transparent text-charcoal/40 hover:text-charcoal/70"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'images' && <ImagesTab />}
        {activeTab === 'import' && <ImportTab />}
        {activeTab === 'scraper' && <ScraperTab />}
        {activeTab === 'fonts' && <FontsTab />}
        {activeTab === 'inquiries' && <InquiriesTab />}
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Images Tab (from /admin/upload)
// ─────────────────────────────────────────────────────────────
function ImagesTab() {
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

  // Load existing files
  useEffect(() => {
    fetch('/api/upload-inventory')
      .then(res => res.json())
      .then(data => {
        setExistingFiles(data.byCategory || {})
        setLoadingExisting(false)
      })
      .catch(() => setLoadingExisting(false))
  }, [results])

  const [syncing, setSyncing] = useState(false)
  
  const syncToDatabase = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/upload-inventory', { method: 'PATCH' })
      const data = await res.json()
      alert(`Synced ${data.synced} images to database (${data.total} total in Blob)`)
    } catch {
      alert('Sync failed')
    }
    setSyncing(false)
  }

  const deleteAll = async () => {
    if (!confirm('Delete ALL inventory images? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch('/api/upload-inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      alert(data.message || `Deleted ${data.deleted} files`)
      setExistingFiles({})
      setSelectedFiles(new Set())
    } catch {
      alert('Failed to delete files')
    }
    setDeleting(false)
  }

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
    } catch {
      alert('Failed to delete files')
    }
    setDeleting(false)
  }

  const openEditor = (pathname: string) => {
    const imageUrl = `/api/inventory-image?pathname=${encodeURIComponent(pathname)}`
    setEditingImage({ url: imageUrl, pathname })
  }

  const handleEditorSave = () => {
    setCacheBuster(Date.now())
    fetch('/api/upload-inventory')
      .then(res => res.json())
      .then(data => setExistingFiles(data.byCategory || {}))
    setEditingImage(null)
  }

  const toggleFileSelection = (pathname: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev)
      next.has(pathname) ? next.delete(pathname) : next.add(pathname)
      return next
    })
  }

  const selectAllInCategory = (cat: string) => {
    const catFiles = existingFiles[cat] || []
    setSelectedFiles(prev => {
      const next = new Set(prev)
      const allSelected = catFiles.every(f => prev.has(f.pathname))
      catFiles.forEach(f => allSelected ? next.delete(f.pathname) : next.add(f.pathname))
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
        await new Promise(r => setTimeout(r, 200))
      } catch (err) {
        console.error('Download failed:', err)
      }
    }
    setDownloading(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...dropped])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
      setFiles(prev => [...prev, ...selected])
    }
  }

  const uploadFiles = async () => {
    if (!files.length) return
    setUploading(true)
    setProgress(0)
    setError(null)
    setResults([])

    const batchSize = 10
    const allResults: UploadedFile[] = []

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)
      const formData = new FormData()
      formData.append('category', category)
      batch.forEach(f => formData.append('files', f))

      try {
        const res = await fetch('/api/upload-inventory', { method: 'POST', body: formData })
        if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`)
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
    if (allResults.length === files.length) setFiles([])
  }

  const totalImages = Object.values(existingFiles).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-50 border border-charcoal/5">
          <p className="text-2xl font-light text-charcoal">{totalImages}</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-charcoal/50">Total Images</p>
        </div>
        <div className="p-4 bg-neutral-50 border border-charcoal/5">
          <p className="text-2xl font-light text-charcoal">{Object.keys(existingFiles).length}</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-charcoal/50">Categories</p>
        </div>
        <div className="p-4 bg-neutral-50 border border-charcoal/5">
          <p className="text-2xl font-light text-charcoal">{selectedFiles.size}</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-charcoal/50">Selected</p>
        </div>
        <div className="p-4 bg-neutral-50 border border-charcoal/5">
          <p className="text-2xl font-light text-green-600">{results.length > 0 ? `+${results.length}` : '—'}</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-charcoal/50">Just Uploaded</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="border border-charcoal/10 p-6">
        <h2 className="text-sm uppercase tracking-[0.12em] text-charcoal mb-4">Upload Images</h2>
        
        {/* Category Selection */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] border transition-colors",
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
          className="border-2 border-dashed border-charcoal/20 hover:border-charcoal/40 transition-colors p-8 text-center"
        >
          <p className="text-charcoal/60 text-sm mb-3">Drag and drop images, or</p>
          <label className="inline-block px-4 py-2 bg-charcoal text-cream text-xs uppercase tracking-[0.1em] cursor-pointer hover:bg-charcoal/90">
            Browse Files
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-charcoal/60">{files.length} files selected</span>
              <button onClick={() => setFiles([])} className="text-xs text-charcoal/40 hover:text-charcoal underline">
                Clear
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto border border-charcoal/10 divide-y divide-charcoal/5 text-sm">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-white">
                  <span className="truncate flex-1 mr-2">{file.name}</span>
                  <span className="text-xs text-charcoal/40">{(file.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {files.length > 0 && !uploading && (
          <button onClick={uploadFiles} className="mt-4 w-full py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.12em] hover:bg-charcoal/90">
            Upload {files.length} Images to {category}
          </button>
        )}

        {/* Progress */}
        {uploading && (
          <div className="mt-4">
            <div className="h-1 bg-charcoal/10 overflow-hidden">
              <div className="h-full bg-charcoal transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-charcoal/60 mt-2 text-center">Uploading... {progress}%</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
            Successfully uploaded {results.length} images
          </div>
        )}
      </div>

      {/* Existing Files */}
      <div className="border border-charcoal/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-[0.12em] text-charcoal">Stored Images</h2>
          <div className="flex items-center gap-3">
            {selectedFiles.size > 0 && (
              <>
                <button onClick={() => setSelectedFiles(new Set())} className="text-xs text-charcoal/40 hover:text-charcoal underline">
                  Clear Selection
                </button>
                <button
                  onClick={downloadSelected}
                  disabled={downloading}
                  className="px-3 py-1.5 bg-charcoal text-cream text-[10px] uppercase tracking-[0.1em] disabled:opacity-50"
                >
                  {downloading ? 'Downloading...' : `Download (${selectedFiles.size})`}
                </button>
              </>
            )}
            <button
              onClick={syncToDatabase}
              disabled={syncing}
              className="px-3 py-1.5 bg-blue-600 text-white text-[10px] uppercase tracking-[0.1em] hover:bg-blue-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync to Database'}
            </button>
            <button
              onClick={deleteAll}
              disabled={deleting}
              className="px-3 py-1.5 bg-red-600 text-white text-[10px] uppercase tracking-[0.1em] hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete All'}
            </button>
          </div>
        </div>

        {loadingExisting ? (
          <p className="text-sm text-charcoal/40">Loading...</p>
        ) : Object.keys(existingFiles).length === 0 ? (
          <p className="text-sm text-charcoal/40">No images uploaded yet.</p>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map(cat => {
              const catFiles = existingFiles[cat] || []
              if (catFiles.length === 0) return null
              const allSelected = catFiles.every(f => selectedFiles.has(f.pathname))
              const someSelected = catFiles.some(f => selectedFiles.has(f.pathname))

              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => selectAllInCategory(cat)}
                        className={cn(
                          "w-4 h-4 border flex items-center justify-center",
                          allSelected ? "bg-charcoal border-charcoal" : someSelected ? "bg-charcoal/30 border-charcoal/30" : "border-charcoal/30"
                        )}
                      >
                        {(allSelected || someSelected) && (
                          <svg className="w-2.5 h-2.5 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className="text-xs uppercase tracking-[0.1em] text-charcoal/60">{cat} ({catFiles.length})</span>
                    </div>
                    <button onClick={() => deleteCategory(cat)} disabled={deleting} className="text-[10px] text-red-600 hover:underline disabled:opacity-50">
                      Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-8 lg:grid-cols-10 gap-1">
                    {catFiles.map((blob, i) => {
                      const isSelected = selectedFiles.has(blob.pathname)
                      return (
                        <div
                          key={i}
                          className={cn(
                            "group relative aspect-square bg-white border overflow-hidden cursor-pointer",
                            isSelected ? "ring-2 ring-charcoal ring-offset-1 border-charcoal" : "border-charcoal/10"
                          )}
                          onClick={() => toggleFileSelection(blob.pathname)}
                        >
                          <img
                            src={`/api/inventory-image?pathname=${encodeURIComponent(blob.pathname)}&t=${cacheBuster}`}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditor(blob.pathname) }}
                            className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-charcoal/80 text-cream rounded opacity-0 group-hover:opacity-100 flex items-center justify-center"
                            title="Edit"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
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

// ─────────────────────────────────────────────────────────────
// Import Tab (from /admin/import)
// ─────────────────────────────────────────────────────────────
function ImportTab() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]?.name.endsWith('.csv')) {
      setFile(e.dataTransfer.files[0])
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/import-inventory', { method: 'POST', body: formData })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Instructions */}
      <div className="border border-charcoal/10 p-6">
        <h2 className="text-sm uppercase tracking-[0.12em] text-charcoal mb-3">CSV Format</h2>
        <p className="text-sm text-charcoal/70 mb-3">Upload a CSV export from Current RMS with columns:</p>
        <ul className="text-sm text-charcoal/60 list-disc list-inside space-y-1">
          <li><strong>Id</strong> - RMS product ID</li>
          <li><strong>Name</strong> - Product name</li>
          <li><strong>Current Stock</strong> - Available quantity</li>
          <li><strong>Product Group</strong> - Category</li>
          <li><strong>Dims</strong> - Dimensions (optional)</li>
          <li><strong>Image Url</strong> - Product image (optional)</li>
        </ul>
      </div>

      {/* Upload */}
      <div
        className={cn(
          "border-2 border-dashed p-12 text-center transition-colors",
          dragActive ? "border-charcoal bg-charcoal/5" : file ? "border-charcoal/40 bg-charcoal/5" : "border-charcoal/20"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setResult(null) } }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ position: 'absolute' }}
        />
        {file ? (
          <div>
            <p className="text-charcoal font-medium">{file.name}</p>
            <p className="text-sm text-charcoal/50">{(file.size / 1024).toFixed(1)} KB</p>
            <button onClick={() => { setFile(null); setResult(null) }} className="mt-2 text-xs text-charcoal/50 underline">
              Remove
            </button>
          </div>
        ) : (
          <div>
            <p className="text-charcoal">Drop CSV file here or click to browse</p>
            <p className="text-sm text-charcoal/50">.csv files only</p>
          </div>
        )}
      </div>

      {/* Import Button */}
      {file && !result && (
        <button
          onClick={handleImport}
          disabled={importing}
          className="w-full py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.12em] hover:bg-charcoal/90 disabled:opacity-50"
        >
          {importing ? 'Importing...' : 'Start Import'}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className={cn("p-6 border", result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
          <h3 className={cn("font-medium mb-2", result.success ? "text-green-800" : "text-red-800")}>
            {result.success ? 'Import Completed' : 'Import Failed'}
          </h3>
          {result.success && result.stats && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white p-3 text-center">
                <p className="text-xl font-light">{result.stats.totalRows}</p>
                <p className="text-[10px] uppercase text-charcoal/50">Total Rows</p>
              </div>
              <div className="bg-white p-3 text-center">
                <p className="text-xl font-light">{result.stats.productsCreated}</p>
                <p className="text-[10px] uppercase text-charcoal/50">Created</p>
              </div>
              <div className="bg-white p-3 text-center">
                <p className="text-xl font-light">{result.stats.productsUpdated}</p>
                <p className="text-[10px] uppercase text-charcoal/50">Updated</p>
              </div>
              <div className="bg-white p-3 text-center">
                <p className="text-xl font-light">{result.stats.errors}</p>
                <p className="text-[10px] uppercase text-charcoal/50">Errors</p>
              </div>
            </div>
          )}
          {result.error && <p className="text-sm text-red-700">{result.error}</p>}
          {result.success && (
            <button onClick={() => { setFile(null); setResult(null) }} className="mt-4 text-xs underline">
              Import Another
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Fonts Tab (from /upload-fonts)
// ─────────────────────────────────────────────────────────────
function FontsTab() {
  const [fonts, setFonts] = useState<UploadedFont[]>([])
  const [uploading, setUploading] = useState(false)
  const [currentPurpose, setCurrentPurpose] = useState('headlines')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-font', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setFonts(prev => [...prev, { filename: data.filename, url: data.url, purpose: currentPurpose }])
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const copyConfig = () => {
    const config = fonts.map(f => `${f.purpose}: ${f.url}`).join('\n')
    navigator.clipboard.writeText(config)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Upload */}
      <div className="border border-charcoal/10 p-6">
        <h2 className="text-sm uppercase tracking-[0.12em] text-charcoal mb-4">Upload Font</h2>
        
        <div className="mb-4">
          <label className="block text-xs text-charcoal/60 mb-2">Font Purpose</label>
          <select
            value={currentPurpose}
            onChange={(e) => setCurrentPurpose(e.target.value)}
            className="w-full p-2 border border-charcoal/20 bg-white text-sm"
          >
            <option value="headlines">Headlines (Display)</option>
            <option value="body">Body Text</option>
            <option value="accent">Accent / Navigation</option>
          </select>
        </div>

        <label className="block">
          <input
            type="file"
            accept=".woff,.woff2,.ttf,.otf"
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full text-sm text-charcoal/70
              file:mr-4 file:py-2 file:px-4
              file:border-0 file:text-sm
              file:bg-charcoal file:text-cream
              hover:file:bg-charcoal/90
              file:cursor-pointer cursor-pointer
              disabled:opacity-50"
          />
        </label>
        {uploading && <p className="mt-2 text-sm text-charcoal/60">Uploading...</p>}
      </div>

      {/* Uploaded Fonts */}
      {fonts.length > 0 && (
        <div className="border border-charcoal/10 p-6">
          <h2 className="text-sm uppercase tracking-[0.12em] text-charcoal mb-4">Uploaded Fonts</h2>
          <div className="space-y-2 mb-4">
            {fonts.map((font, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-neutral-50">
                <div>
                  <p className="text-sm font-medium">{font.filename}</p>
                  <p className="text-xs text-charcoal/50">{font.purpose}</p>
                </div>
                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1">Uploaded</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-charcoal/5 text-xs font-mono overflow-auto">
            {fonts.map((f, i) => (
              <p key={i} className="break-all">{f.purpose}: {f.url}</p>
            ))}
          </div>
          <button onClick={copyConfig} className="mt-4 w-full py-2 bg-charcoal text-cream text-xs uppercase">
            Copy Font URLs
          </button>
        </div>
      )}

      <p className="text-xs text-charcoal/50">
        Upload .woff2 files (preferred). Share the URLs after uploading to configure them on the site.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Inquiries Tab
// ─────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<Inquiry['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
}

const STATUS_COLORS: Record<Inquiry['status'], string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal: 'bg-indigo-100 text-indigo-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  archived: 'bg-neutral-100 text-neutral-600',
}

const BUDGET_LABELS: Record<string, string> = {
  'under-10k': 'Under $10K',
  '10-25k': '$10K–$25K',
  '25-50k': '$25K–$50K',
  '50-100k': '$50K–$100K',
  'over-100k': '$100K+',
}

const EVENT_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  corporate: 'Corporate',
  social: 'Social',
  nonprofit: 'Non-Profit',
}

function InquiriesTab() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [filterStatus, setFilterStatus] = useState<Inquiry['status'] | 'all'>('all')
  const [updating, setUpdating] = useState(false)

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/inquiries')
      if (!res.ok) throw new Error('Failed to fetch inquiries')
      const data = await res.json()
      setInquiries(data.inquiries || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  // Update inquiry status
  const updateStatus = async (id: string, status: Inquiry['status']) => {
    setUpdating(true)
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      
      setInquiries(prev => prev.map(inq => 
        inq.id === id ? { ...inq, status } : inq
      ))
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status } : null)
      }
    } catch (e) {
      console.error('Update failed:', e)
    } finally {
      setUpdating(false)
    }
  }

  // Update notes
  const updateNotes = async (id: string, notes: string) => {
    try {
      await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes }),
      })
      setInquiries(prev => prev.map(inq => 
        inq.id === id ? { ...inq, notes } : inq
      ))
    } catch (e) {
      console.error('Notes update failed:', e)
    }
  }

  const filteredInquiries = filterStatus === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === filterStatus)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-charcoal/50 text-sm">Loading inquiries...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchInquiries}
          className="text-xs uppercase tracking-[0.1em] text-charcoal underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display">Inquiries</h2>
          <p className="text-xs text-charcoal/50 mt-1">
            {inquiries.length} total, {inquiries.filter(i => i.status === 'new').length} new
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Inquiry['status'] | 'all')}
            className="text-xs border border-charcoal/20 px-3 py-2 bg-white"
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={fetchInquiries}
            className="text-xs uppercase tracking-[0.1em] px-3 py-2 border border-charcoal/20 hover:bg-charcoal/5"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {filteredInquiries.length === 0 ? (
            <p className="text-center text-charcoal/50 py-8 text-sm">No inquiries found</p>
          ) : (
            filteredInquiries.map((inquiry) => (
              <button
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={cn(
                  "w-full text-left p-4 border transition-all",
                  selectedInquiry?.id === inquiry.id
                    ? "border-charcoal bg-charcoal/5"
                    : "border-charcoal/10 hover:border-charcoal/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{inquiry.name || 'No name'}</p>
                    <p className="text-xs text-charcoal/50 truncate">{inquiry.email}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase px-2 py-0.5 shrink-0",
                    STATUS_COLORS[inquiry.status]
                  )}>
                    {STATUS_LABELS[inquiry.status]}
                  </span>
                </div>
                <p className="text-xs text-charcoal/40 mt-2">{formatDate(inquiry.created_at)}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="border border-charcoal/10 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-display">{selectedInquiry.name || 'No name'}</h3>
                  <p className="text-sm text-charcoal/60">{selectedInquiry.email}</p>
                  {selectedInquiry.phone && (
                    <p className="text-sm text-charcoal/60">{selectedInquiry.phone}</p>
                  )}
                </div>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => updateStatus(selectedInquiry.id, e.target.value as Inquiry['status'])}
                  disabled={updating}
                  className={cn(
                    "text-xs uppercase px-3 py-1.5 border-0",
                    STATUS_COLORS[selectedInquiry.status]
                  )}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selectedInquiry.company && (
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-wider">Company</p>
                    <p>{selectedInquiry.company}</p>
                  </div>
                )}
                {selectedInquiry.event_type && (
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-wider">Event Type</p>
                    <p>{EVENT_LABELS[selectedInquiry.event_type] || selectedInquiry.event_type}</p>
                  </div>
                )}
                {selectedInquiry.event_date && (
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-wider">Event Date</p>
                    <p>{selectedInquiry.event_date}</p>
                  </div>
                )}
                {selectedInquiry.location && (
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-wider">Location</p>
                    <p>{selectedInquiry.location}</p>
                  </div>
                )}
                {selectedInquiry.budget && (
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-wider">Budget</p>
                    <p>{BUDGET_LABELS[selectedInquiry.budget] || selectedInquiry.budget}</p>
                  </div>
                )}
                {selectedInquiry.referral_source && (
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-wider">Source</p>
                    <p className="capitalize">{selectedInquiry.referral_source}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <p className="text-xs text-charcoal/40 uppercase tracking-wider mb-2">Message</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-charcoal/5 p-4">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs text-charcoal/40 uppercase tracking-wider mb-2">Internal Notes</p>
                <textarea
                  defaultValue={selectedInquiry.notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== selectedInquiry.notes) {
                      updateNotes(selectedInquiry.id, e.target.value)
                    }
                  }}
                  placeholder="Add internal notes..."
                  className="w-full h-24 text-sm p-3 border border-charcoal/10 resize-none focus:outline-none focus:border-charcoal/30"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-charcoal/40 pt-4 border-t border-charcoal/10">
                <span>Submitted {formatDate(selectedInquiry.created_at)}</span>
                <span className={selectedInquiry.email_sent ? 'text-green-600' : 'text-amber-600'}>
                  {selectedInquiry.email_sent ? 'Email notification sent' : 'Email not sent'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your Eclectic Hive Inquiry`}
                  className="flex-1 text-center py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors"
                >
                  Reply via Email
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="px-6 py-3 border border-charcoal text-xs uppercase tracking-[0.1em] hover:bg-charcoal/5 transition-colors"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-charcoal/20 h-full min-h-[400px] flex items-center justify-center">
              <p className="text-charcoal/40 text-sm">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
