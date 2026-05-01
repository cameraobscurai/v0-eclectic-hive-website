'use client'

import { useState, useEffect } from 'react'

interface ScrapeResult {
  success: boolean
  summary?: {
    scrapedProducts: number
    dbProductsWithoutImages: number
    processed: number
    imported: number
    failed: number
  }
  results?: Array<{
    productId: string
    productName: string
    matchedTo: string
    status: 'imported' | 'failed' | 'skipped'
    error?: string
  }>
  scrapeErrors?: string[]
  error?: string
}

const INVENTORY_URLS = [
  'https://www.eclectichive.com/inventory',
  'https://www.eclectichive.com/inventory?category=Tables',
  'https://www.eclectichive.com/inventory?category=Lighting',
  'https://www.eclectichive.com/inventory?category=Large+Decor',
  'https://www.eclectichive.com/inventory?category=Bars',
  'https://www.eclectichive.com/inventory?category=Rugs',
  'https://www.eclectichive.com/inventory?category=Pillows',
  'https://www.eclectichive.com/inventory?category=Styling',
  'https://www.eclectichive.com/inventory?category=Tableware',
  'https://www.eclectichive.com/inventory?category=Serveware',
  'https://www.eclectichive.com/inventory?category=Candlelight',
  'https://www.eclectichive.com/inventory?category=Chandeliers',
]

export default function RunScraperPage() {
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<ScrapeResult[]>([])
  const [currentBatch, setCurrentBatch] = useState(0)
  const [totalImported, setTotalImported] = useState(0)
  const [autoRun, setAutoRun] = useState(false)

  const runBatch = async (urlIndex: number) => {
    if (urlIndex >= INVENTORY_URLS.length) {
      setRunning(false)
      return
    }

    setCurrentBatch(urlIndex + 1)
    
    try {
      const response = await fetch('/api/auto-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: [INVENTORY_URLS[urlIndex]],
          limit: 30,
        }),
      })
      
      const data: ScrapeResult = await response.json()
      setResults(prev => [...prev, data])
      
      if (data.summary?.imported) {
        setTotalImported(prev => prev + data.summary!.imported)
      }
      
      // Continue to next batch after a delay
      if (autoRun && urlIndex + 1 < INVENTORY_URLS.length) {
        setTimeout(() => runBatch(urlIndex + 1), 2000)
      } else {
        setRunning(false)
      }
    } catch (error) {
      setResults(prev => [...prev, { success: false, error: String(error) }])
      setRunning(false)
    }
  }

  const startScraping = () => {
    setRunning(true)
    setResults([])
    setTotalImported(0)
    setAutoRun(true)
    runBatch(0)
  }

  const runSingleBatch = async () => {
    setRunning(true)
    setAutoRun(false)
    
    try {
      const response = await fetch('/api/auto-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: INVENTORY_URLS,
          limit: 50,
        }),
      })
      
      const data: ScrapeResult = await response.json()
      setResults([data])
      
      if (data.summary?.imported) {
        setTotalImported(data.summary.imported)
      }
    } catch (error) {
      setResults([{ success: false, error: String(error) }])
    }
    
    setRunning(false)
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display text-charcoal mb-6">Image Scraper</h1>
        
        <div className="bg-white p-6 border border-charcoal/10 mb-6">
          <p className="text-charcoal/70 mb-4">
            This will scrape images from eclectichive.com and import them into the database.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={runSingleBatch}
              disabled={running}
              className="px-6 py-3 bg-charcoal text-cream text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {running ? 'Running...' : 'Run Single Batch (50 images)'}
            </button>
            
            <button
              onClick={startScraping}
              disabled={running}
              className="px-6 py-3 bg-green-600 text-white text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {running ? `Batch ${currentBatch}/${INVENTORY_URLS.length}` : 'Run All Categories'}
            </button>
          </div>
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
                <div className="grid grid-cols-5 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-charcoal/50">Scraped</p>
                    <p className="text-xl font-medium">{result.summary?.scrapedProducts}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Need Images</p>
                    <p className="text-xl font-medium">{result.summary?.dbProductsWithoutImages}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Processed</p>
                    <p className="text-xl font-medium">{result.summary?.processed}</p>
                  </div>
                  <div>
                    <p className="text-charcoal/50">Imported</p>
                    <p className="text-xl font-medium text-green-600">{result.summary?.imported}</p>
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
                        <div key={j} className={`py-1 ${r.status === 'imported' ? 'text-green-700' : 'text-red-700'}`}>
                          {r.status === 'imported' ? '✓' : '✗'} {r.productName} → {r.matchedTo}
                          {r.error && <span className="text-red-500 text-xs ml-2">({r.error})</span>}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                
                {result.scrapeErrors && result.scrapeErrors.length > 0 && (
                  <div className="text-red-600 text-sm mt-2">
                    Scrape errors: {result.scrapeErrors.join(', ')}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
