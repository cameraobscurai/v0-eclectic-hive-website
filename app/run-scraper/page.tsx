'use client'

import { useState } from 'react'

interface ImportResult {
  success: boolean
  error?: string
  summary?: {
    imported: number
    skipped: number
    failed: number
    noMatch: number
    total: number
  }
  results?: Array<{
    inventoryName: string
    dbName: string
    status: 'imported' | 'skipped' | 'failed' | 'no_match'
    error?: string
  }>
}

interface PreviewData {
  count: number
  products: Array<{
    name: string
    category: string
    hasImage: boolean
    imageUrl: string
  }>
}

export default function ImportFromInventoryPage() {
  const [running, setRunning] = useState(false)
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [results, setResults] = useState<ImportResult[]>([])
  const [totalImported, setTotalImported] = useState(0)

  const loadPreview = async () => {
    const res = await fetch('/api/import-from-inventory')
    const data = await res.json()
    setPreview(data)
  }

  const runImport = async (limit: number) => {
    setRunning(true)
    
    try {
      const response = await fetch('/api/import-from-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit, skipExisting: true }),
      })
      
      const data: ImportResult = await response.json()
      setResults(prev => [...prev, data])
      
      if (data.summary?.imported) {
        setTotalImported(prev => prev + data.summary!.imported)
      }
    } catch (error) {
      setResults(prev => [...prev, { success: false, error: String(error) }])
    }
    
    setRunning(false)
  }

  const runAll = async () => {
    setRunning(true)
    setResults([])
    setTotalImported(0)
    
    // Run in batches of 20 until done
    let hasMore = true
    while (hasMore) {
      try {
        const response = await fetch('/api/import-from-inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: 20, skipExisting: true }),
        })
        
        const data: ImportResult = await response.json()
        setResults(prev => [...prev, data])
        
        if (data.summary?.imported) {
          setTotalImported(prev => prev + data.summary!.imported)
        }
        
        // Stop if no more imports possible
        if (!data.summary || data.summary.imported === 0) {
          hasMore = false
        }
        
        // Small delay between batches
        await new Promise(r => setTimeout(r, 500))
      } catch (error) {
        setResults(prev => [...prev, { success: false, error: String(error) }])
        hasMore = false
      }
    }
    
    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display text-charcoal mb-2">Import from Inventory Data</h1>
        <p className="text-charcoal/60 mb-6">
          Imports images from lib/inventory-data.ts (65 products with Squarespace CDN URLs)
        </p>
        
        <div className="bg-white p-6 border border-charcoal/10 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={loadPreview}
              className="px-4 py-2 border border-charcoal/20 text-charcoal text-sm uppercase tracking-wider hover:bg-charcoal/5"
            >
              Preview Data
            </button>
            
            <button
              onClick={() => runImport(10)}
              disabled={running}
              className="px-6 py-3 bg-charcoal text-cream text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {running ? 'Running...' : 'Import 10'}
            </button>
            
            <button
              onClick={runAll}
              disabled={running}
              className="px-6 py-3 bg-green-600 text-white text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {running ? 'Running...' : 'Import All'}
            </button>
          </div>
          
          {preview && (
            <div className="text-sm text-charcoal/70">
              <p className="font-medium mb-2">{preview.count} products in inventory-data.ts:</p>
              <div className="max-h-40 overflow-y-auto bg-charcoal/5 p-2">
                {preview.products.slice(0, 20).map((p, i) => (
                  <div key={i} className="py-0.5">
                    {p.name} ({p.category})
                  </div>
                ))}
                {preview.count > 20 && <div className="text-charcoal/50">...and {preview.count - 20} more</div>}
              </div>
            </div>
          )}
        </div>

        {totalImported > 0 && (
          <div className="bg-green-50 border border-green-200 p-4 mb-6">
            <p className="text-green-800 font-medium">
              Total Imported: {totalImported} images
            </p>
          </div>
        )}

        {results.map((result, i) => (
          <div key={i} className="bg-white p-4 border border-charcoal/10 mb-4">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-charcoal/50">Imported</p>
                    <p className="text-xl font-medium text-green-600">{result.summary?.imported}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Skipped (has image)</p>
                    <p className="text-xl font-medium text-charcoal/40">{result.summary?.skipped}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">No DB Match</p>
                    <p className="text-xl font-medium text-amber-600">{result.summary?.noMatch}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Failed</p>
                    <p className="text-xl font-medium text-red-600">{result.summary?.failed}</p>
                  </div>
                </div>
                
                {result.results && result.results.length > 0 && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-charcoal/60 hover:text-charcoal">
                      Show {result.results.length} results
                    </summary>
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {result.results.map((r, j) => (
                        <div 
                          key={j} 
                          className={`py-1 ${
                            r.status === 'imported' ? 'text-green-700' : 
                            r.status === 'skipped' ? 'text-charcoal/40' :
                            r.status === 'no_match' ? 'text-amber-600' :
                            'text-red-700'
                          }`}
                        >
                          {r.status === 'imported' ? '✓' : r.status === 'skipped' ? '○' : r.status === 'no_match' ? '?' : '✗'} 
                          {' '}{r.inventoryName}
                          {r.dbName && ` → ${r.dbName}`}
                          {r.error && <span className="text-red-500 text-xs ml-2">({r.error})</span>}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
