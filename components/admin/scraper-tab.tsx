'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrapedProduct {
  name: string
  imageUrl: string
  category?: string
}

interface MatchedProduct {
  scraped: ScrapedProduct
  matched: {
    id: string
    name: string
    slug: string
    category: string
    primary_image_url: string | null
  } | null
  confidence: 'exact' | 'high' | 'low' | 'none'
}

interface ImportResult {
  productId: string
  success: boolean
  error?: string
}

// ─── ScraperTab Component ─────────────────────────────────────────────────────

export function ScraperTab() {
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<MatchedProduct[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [importResults, setImportResults] = useState<{ imported: number; failed: number } | null>(null)

  // ─── Scrape Page ────────────────────────────────────────────────────────────

  const handleScrape = async () => {
    if (!url.trim()) return

    setScraping(true)
    setError(null)
    setProducts([])
    setSelected(new Set())
    setImportResults(null)

    try {
      const res = await fetch(`/api/scrape-inventory?url=${encodeURIComponent(url)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Scrape failed')
      }

      setProducts(data.products || [])
      
      // Auto-select products with high confidence matches that don't already have images
      const autoSelect = new Set<number>()
      data.products?.forEach((p: MatchedProduct, i: number) => {
        if (p.matched && !p.matched.primary_image_url && (p.confidence === 'exact' || p.confidence === 'high')) {
          autoSelect.add(i)
        }
      })
      setSelected(autoSelect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scrape failed')
    } finally {
      setScraping(false)
    }
  }

  // ─── Import Selected ────────────────────────────────────────────────────────

  const handleImport = async () => {
    const selectedProducts = Array.from(selected)
      .map(i => products[i])
      .filter(p => p.matched) // Only import matched products

    if (selectedProducts.length === 0) {
      setError('No matched products selected')
      return
    }

    setImporting(true)
    setProgress(0)
    setError(null)
    setImportResults(null)

    const items = selectedProducts.map(p => ({
      productId: p.matched!.id,
      imageUrl: p.scraped.imageUrl,
      slug: p.matched!.slug,
      category: p.matched!.category,
    }))

    try {
      const res = await fetch('/api/scrape-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setImportResults({ imported: data.imported, failed: data.failed })
      
      // Update product states to reflect imported images
      if (data.results) {
        const successIds = new Set(
          data.results.filter((r: ImportResult) => r.success).map((r: ImportResult) => r.productId)
        )
        setProducts(prev =>
          prev.map(p => {
            if (p.matched && successIds.has(p.matched.id)) {
              return {
                ...p,
                matched: { ...p.matched, primary_image_url: 'imported' },
              }
            }
            return p
          })
        )
      }

      setSelected(new Set())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
      setProgress(100)
    }
  }

  // ─── Selection Helpers ──────────────────────────────────────────────────────

  const toggleSelect = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  const selectAll = () => {
    const matchedIndices = products
      .map((p, i) => (p.matched ? i : -1))
      .filter(i => i >= 0)
    setSelected(new Set(matchedIndices))
  }

  const selectNone = () => setSelected(new Set())

  const selectMissingImages = () => {
    const indices = products
      .map((p, i) => (p.matched && !p.matched.primary_image_url ? i : -1))
      .filter(i => i >= 0)
    setSelected(new Set(indices))
  }

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const stats = {
    total: products.length,
    matched: products.filter(p => p.matched).length,
    exact: products.filter(p => p.confidence === 'exact').length,
    high: products.filter(p => p.confidence === 'high').length,
    low: products.filter(p => p.confidence === 'low').length,
    unmatched: products.filter(p => !p.matched).length,
    missingImages: products.filter(p => p.matched && !p.matched.primary_image_url).length,
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <p className="font-medium mb-1">Image Scraper</p>
        <p className="text-amber-700">
          Paste a URL from eclectichive.com/inventory to scrape product images. 
          The tool will attempt to match scraped products to your database and let you import images.
        </p>
      </div>

      {/* URL Input */}
      <div className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://www.eclectichive.com/inventory"
          className="flex-1 px-4 py-3 border border-charcoal/20 text-sm focus:outline-none focus:border-charcoal/40"
        />
        <button
          onClick={handleScrape}
          disabled={scraping || !url.trim()}
          className="px-6 py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.12em] hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scraping ? 'Scraping...' : 'Fetch Products'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {products.length > 0 && (
        <>
          {/* Stats Bar */}
          <div className="grid grid-cols-6 gap-3">
            <div className="p-3 bg-neutral-50 border border-charcoal/5">
              <p className="text-xl font-light text-charcoal">{stats.total}</p>
              <p className="text-[9px] uppercase tracking-[0.1em] text-charcoal/50">Scraped</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-100">
              <p className="text-xl font-light text-green-700">{stats.exact}</p>
              <p className="text-[9px] uppercase tracking-[0.1em] text-green-600">Exact Match</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100">
              <p className="text-xl font-light text-blue-700">{stats.high}</p>
              <p className="text-[9px] uppercase tracking-[0.1em] text-blue-600">High Match</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100">
              <p className="text-xl font-light text-amber-700">{stats.low}</p>
              <p className="text-[9px] uppercase tracking-[0.1em] text-amber-600">Low Match</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-100">
              <p className="text-xl font-light text-red-700">{stats.unmatched}</p>
              <p className="text-[9px] uppercase tracking-[0.1em] text-red-600">Unmatched</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-100">
              <p className="text-xl font-light text-purple-700">{stats.missingImages}</p>
              <p className="text-[9px] uppercase tracking-[0.1em] text-purple-600">Need Images</p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between p-3 bg-neutral-50 border border-charcoal/10">
            <div className="flex items-center gap-4">
              <span className="text-xs text-charcoal/60">{selected.size} selected</span>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-charcoal/60 hover:text-charcoal underline"
                >
                  Select all matched
                </button>
                <button
                  onClick={selectMissingImages}
                  className="text-xs text-charcoal/60 hover:text-charcoal underline"
                >
                  Select missing images only
                </button>
                <button
                  onClick={selectNone}
                  className="text-xs text-charcoal/60 hover:text-charcoal underline"
                >
                  Clear
                </button>
              </div>
            </div>
            <button
              onClick={handleImport}
              disabled={importing || selected.size === 0}
              className="px-4 py-2 bg-green-600 text-white text-xs uppercase tracking-[0.1em] hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? 'Importing...' : `Import ${selected.size} Images`}
            </button>
          </div>

          {/* Import Results */}
          {importResults && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
              Successfully imported {importResults.imported} images
              {importResults.failed > 0 && ` (${importResults.failed} failed)`}
            </div>
          )}

          {/* Product Grid */}
          <div className="border border-charcoal/10 divide-y divide-charcoal/5 max-h-[600px] overflow-y-auto">
            {products.map((product, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-4 p-3 hover:bg-neutral-50 cursor-pointer transition-colors',
                  selected.has(i) && 'bg-blue-50 hover:bg-blue-50'
                )}
                onClick={() => product.matched && toggleSelect(i)}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'w-5 h-5 border flex-shrink-0 flex items-center justify-center',
                    !product.matched && 'opacity-30',
                    selected.has(i) ? 'bg-charcoal border-charcoal' : 'border-charcoal/30'
                  )}
                >
                  {selected.has(i) && (
                    <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Scraped Image */}
                <div className="w-16 h-16 bg-white border border-charcoal/10 flex-shrink-0 overflow-hidden">
                  <img
                    src={product.scraped.imageUrl}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>

                {/* Scraped Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal truncate">{product.scraped.name}</p>
                  <p className="text-[10px] text-charcoal/40 truncate">{product.scraped.imageUrl}</p>
                </div>

                {/* Arrow */}
                <div className="text-charcoal/20 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Match Info */}
                <div className="w-64 flex-shrink-0">
                  {product.matched ? (
                    <div>
                      <p className="text-sm text-charcoal truncate">{product.matched.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={cn(
                            'text-[9px] uppercase tracking-[0.08em] px-1.5 py-0.5',
                            product.confidence === 'exact' && 'bg-green-100 text-green-700',
                            product.confidence === 'high' && 'bg-blue-100 text-blue-700',
                            product.confidence === 'low' && 'bg-amber-100 text-amber-700'
                          )}
                        >
                          {product.confidence}
                        </span>
                        <span className="text-[10px] text-charcoal/40">{product.matched.category}</span>
                        {product.matched.primary_image_url && (
                          <span className="text-[9px] text-green-600">has image</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">No match found</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {!scraping && products.length === 0 && !error && (
        <div className="py-16 text-center">
          <p className="text-charcoal/40 text-sm">Enter a URL above to scrape product images</p>
        </div>
      )}
    </div>
  )
}
