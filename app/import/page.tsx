'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalProducts: number
  withImages: number
  withoutImages: number
}

interface ImportResult {
  success: boolean
  error?: string
  summary?: {
    processed: number
    created: number
    updated: number
    imagesLinked: number
    errors: number
  }
  results?: Array<{
    name: string
    status: 'created' | 'updated' | 'skipped' | 'error'
    imageLinked: boolean
    error?: string
  }>
  hasMore?: boolean
  nextOffset?: number
}

export default function ImportPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [csvData, setCsvData] = useState<string>('')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])
  const [totals, setTotals] = useState({ created: 0, updated: 0, imagesLinked: 0, errors: 0 })

  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/import-inventory-csv')
      .then(async r => {
        const text = await r.text()
        console.log('[v0] Stats response:', r.status, text.slice(0, 200))
        if (!r.ok) {
          setLoadError(`${r.status}: ${text}`)
          return null
        }
        return JSON.parse(text)
      })
      .then(data => data && setStats(data))
      .catch(err => {
        console.error('[v0] Stats error:', err)
        setLoadError(String(err))
      })
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setCsvData(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  const runImport = async () => {
    if (!csvData) {
      alert('Please upload a CSV file first')
      return
    }

    setRunning(true)
    setResults([])
    setTotals({ created: 0, updated: 0, imagesLinked: 0, errors: 0 })

    let offset = 0
    let hasMore = true
    const batchSize = 50

    while (hasMore) {
      try {
        const response = await fetch('/api/import-inventory-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvData, limit: batchSize, offset }),
        })

        const data: ImportResult = await response.json()
        
        if (!data.success) {
          setResults(prev => [...prev, data])
          break
        }

        setResults(prev => [...prev, data])
        setTotals(prev => ({
          created: prev.created + (data.summary?.created || 0),
          updated: prev.updated + (data.summary?.updated || 0),
          imagesLinked: prev.imagesLinked + (data.summary?.imagesLinked || 0),
          errors: prev.errors + (data.summary?.errors || 0),
        }))

        hasMore = data.hasMore || false
        offset = data.nextOffset || offset + batchSize

        // Refresh stats
        const statsRes = await fetch('/api/import-inventory-csv')
        const newStats = await statsRes.json()
        setStats(newStats)

      } catch (error) {
        setResults(prev => [...prev, { success: false, error: String(error) }])
        break
      }
    }

    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl text-charcoal mb-8">Inventory Import</h1>

        {/* Load Error */}
        {loadError && (
          <div className="bg-red-50 border border-red-200 p-4 mb-8 text-red-700 text-sm">
            <strong>Load Error:</strong> {loadError}
          </div>
        )}

        {/* Current Stats */}
        {stats && (
          <div className="bg-white p-6 mb-8 border border-charcoal/10">
            <h2 className="text-sm uppercase tracking-widest text-charcoal/60 mb-4">Current Database</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-light text-charcoal">{stats.totalProducts}</div>
                <div className="text-sm text-charcoal/60">Total Products</div>
              </div>
              <div>
                <div className="text-3xl font-light text-green-600">{stats.withImages}</div>
                <div className="text-sm text-charcoal/60">With Images</div>
              </div>
              <div>
                <div className="text-3xl font-light text-amber-600">{stats.withoutImages}</div>
                <div className="text-sm text-charcoal/60">Need Images</div>
              </div>
            </div>
          </div>
        )}

        {/* Upload CSV */}
        <div className="bg-white p-6 mb-8 border border-charcoal/10">
          <h2 className="text-sm uppercase tracking-widest text-charcoal/60 mb-4">1. Upload CSV</h2>
          <p className="text-sm text-charcoal/70 mb-4">
            Upload the inventory CSV with columns: Id, Name, Current Stock, Product Group, Dims, Image Filename
          </p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-charcoal/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-charcoal file:text-cream hover:file:bg-charcoal/80"
          />
          {csvData && (
            <p className="mt-2 text-sm text-green-600">
              CSV loaded: {csvData.split('\n').length - 1} rows
            </p>
          )}
        </div>

        {/* Run Import */}
        <div className="bg-white p-6 mb-8 border border-charcoal/10">
          <h2 className="text-sm uppercase tracking-widest text-charcoal/60 mb-4">2. Run Import</h2>
          <p className="text-sm text-charcoal/70 mb-4">
            This will create/update products and link images from Supabase storage.
            Image filenames in CSV will be matched to files in the inventory bucket.
          </p>
          <button
            onClick={runImport}
            disabled={running || !csvData}
            className="px-6 py-3 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? 'Importing...' : 'Run Import'}
          </button>
        </div>

        {/* Results */}
        {(results.length > 0 || running) && (
          <div className="bg-white p-6 border border-charcoal/10">
            <h2 className="text-sm uppercase tracking-widest text-charcoal/60 mb-4">Results</h2>
            
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-charcoal/5">
              <div>
                <div className="text-2xl font-light text-green-600">{totals.created}</div>
                <div className="text-xs text-charcoal/60">Created</div>
              </div>
              <div>
                <div className="text-2xl font-light text-blue-600">{totals.updated}</div>
                <div className="text-xs text-charcoal/60">Updated</div>
              </div>
              <div>
                <div className="text-2xl font-light text-purple-600">{totals.imagesLinked}</div>
                <div className="text-xs text-charcoal/60">Images Linked</div>
              </div>
              <div>
                <div className="text-2xl font-light text-red-600">{totals.errors}</div>
                <div className="text-xs text-charcoal/60">Errors</div>
              </div>
            </div>

            {/* Batch Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((batch, i) => (
                <div key={i} className="text-sm">
                  {batch.error ? (
                    <div className="text-red-600">Error: {batch.error}</div>
                  ) : (
                    <div className="text-charcoal/70">
                      Batch {i + 1}: {batch.summary?.processed} processed, {batch.summary?.imagesLinked} images linked
                    </div>
                  )}
                </div>
              ))}
              {running && (
                <div className="text-charcoal/50 animate-pulse">Processing...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
