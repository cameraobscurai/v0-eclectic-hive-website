'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

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

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile)
        setResult(null)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
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
      
      const response = await fetch('/api/import-inventory', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Import failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-charcoal/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link 
            href="/admin/upload" 
            className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </Link>
          <h1 className="text-lg font-light tracking-wide text-charcoal">Import Inventory</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-widest text-charcoal/60 mb-4">Instructions</h2>
          <div className="bg-white rounded-xl border border-charcoal/10 p-6 space-y-3">
            <p className="text-sm text-charcoal/70">
              Upload a CSV export from Current RMS with the following columns:
            </p>
            <ul className="text-sm text-charcoal/60 list-disc list-inside space-y-1">
              <li><span className="text-charcoal">Id</span> - RMS product ID</li>
              <li><span className="text-charcoal">Name</span> - Product name</li>
              <li><span className="text-charcoal">Current Stock</span> - Available quantity</li>
              <li><span className="text-charcoal">Product Group</span> - Category (Seating, Tables, etc.)</li>
              <li><span className="text-charcoal">Dims</span> - Dimensions (optional)</li>
              <li><span className="text-charcoal">Image Url</span> - Product image URL (optional)</li>
            </ul>
            <p className="text-xs text-charcoal/50 pt-2 border-t border-charcoal/10">
              Tableware items will be automatically grouped by collection. Sinatra/Monroe bars will be marked for inquiry only.
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-widest text-charcoal/60 mb-4">Upload CSV</h2>
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-colors
              ${dragActive ? 'border-charcoal bg-charcoal/5' : 'border-charcoal/20 hover:border-charcoal/40'}
              ${file ? 'bg-charcoal/5' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <FileSpreadsheet className="w-12 h-12 text-charcoal/60" />
                <div>
                  <p className="text-charcoal font-medium">{file.name}</p>
                  <p className="text-sm text-charcoal/50">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setResult(null)
                  }}
                  className="text-xs text-charcoal/50 underline hover:text-charcoal"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-12 h-12 text-charcoal/30" />
                <div>
                  <p className="text-charcoal">Drop CSV file here or click to browse</p>
                  <p className="text-sm text-charcoal/50">Only .csv files accepted</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Import Button */}
        {file && !result && (
          <div className="mb-8">
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full py-4 bg-charcoal text-cream rounded-xl font-light tracking-wide hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {importing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Start Import
                </>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`rounded-xl border p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Import Completed' : 'Import Failed'}
                </h3>
                
                {result.success && result.stats && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-2xl font-light text-charcoal">{result.stats.totalRows}</p>
                      <p className="text-xs text-charcoal/50 uppercase tracking-wide">Total Rows</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-2xl font-light text-charcoal">{result.stats.productsCreated}</p>
                      <p className="text-xs text-charcoal/50 uppercase tracking-wide">Products Created</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-2xl font-light text-charcoal">{result.stats.productsUpdated}</p>
                      <p className="text-xs text-charcoal/50 uppercase tracking-wide">Products Updated</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-2xl font-light text-charcoal">{result.stats.variantsCreated + result.stats.variantsUpdated}</p>
                      <p className="text-xs text-charcoal/50 uppercase tracking-wide">Variants Processed</p>
                    </div>
                  </div>
                )}
                
                {result.error && (
                  <p className="mt-2 text-sm text-red-700">{result.error}</p>
                )}
                {result.details && (
                  <p className="mt-1 text-xs text-red-600">{result.details}</p>
                )}
                
                {result.success && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setFile(null)
                        setResult(null)
                      }}
                      className="px-4 py-2 text-sm text-charcoal border border-charcoal/20 rounded-lg hover:bg-charcoal/5"
                    >
                      Import Another
                    </button>
                    <Link
                      href="/collection"
                      className="px-4 py-2 text-sm text-cream bg-charcoal rounded-lg hover:bg-charcoal/90"
                    >
                      View Collection
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
