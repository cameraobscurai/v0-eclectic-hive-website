'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BlobPreview {
  totalImages: number
  byCategory: Record<string, number>
  preview: Record<string, string[]>
}

interface SyncResult {
  success: boolean
  categories: string[]
  productsCreated: number
  variantsCreated: number
  errors: string[]
}

export default function SyncPage() {
  const [preview, setPreview] = useState<BlobPreview | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)

  useEffect(() => {
    fetch('/api/sync-images-to-db')
      .then(res => res.json())
      .then(data => {
        setPreview(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    setResult(null)
    
    try {
      const res = await fetch('/api/sync-images-to-db', { method: 'POST' })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({
        success: false,
        categories: [],
        productsCreated: 0,
        variantsCreated: 0,
        errors: [err instanceof Error ? err.message : 'Unknown error']
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-[#3D3D3D] tracking-wide">
            SYNC IMAGES TO DATABASE
          </h1>
          <Link href="/admin/upload" className="text-sm text-[#3D3D3D]/60 hover:text-[#3D3D3D]">
            Back to Upload
          </Link>
        </div>

        {loading ? (
          <div className="bg-white/50 rounded-lg p-8 text-center">
            <p className="text-[#3D3D3D]/60">Loading image inventory...</p>
          </div>
        ) : preview ? (
          <div className="space-y-6">
            <div className="bg-white/50 rounded-lg p-6">
              <h2 className="font-serif text-xl text-[#3D3D3D] mb-4">
                IMAGES IN BLOB STORAGE
              </h2>
              <p className="text-2xl font-light text-[#3D3D3D] mb-4">
                {preview.totalImages} total images
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(preview.byCategory).map(([category, count]) => (
                  <div key={category} className="bg-[#F5F1EB] rounded-lg p-4">
                    <p className="text-sm text-[#3D3D3D]/60 uppercase tracking-wider">{category}</p>
                    <p className="text-xl font-light text-[#3D3D3D]">{count}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm text-[#3D3D3D]/60 uppercase tracking-wider mb-2">
                  Sample filenames
                </h3>
                {Object.entries(preview.preview).map(([category, files]) => (
                  <div key={category} className="mb-2">
                    <span className="font-medium text-[#3D3D3D]">{category}:</span>
                    <span className="ml-2 text-sm text-[#3D3D3D]/60">
                      {files.slice(0, 3).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-6">
              <h2 className="font-serif text-xl text-[#3D3D3D] mb-4">
                SYNC TO SUPABASE
              </h2>
              <p className="text-[#3D3D3D]/70 mb-4">
                This will create products in the database for each image, using the filename as the product name.
              </p>
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="bg-[#3D3D3D] text-white hover:bg-[#2D2D2D]"
              >
                {syncing ? 'Syncing...' : 'Sync Images to Database'}
              </Button>
            </div>

            {result && (
              <div className={`rounded-lg p-6 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <h2 className="font-serif text-xl text-[#3D3D3D] mb-4">
                  {result.success ? 'SYNC COMPLETE' : 'SYNC FAILED'}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">Products Created</p>
                    <p className="text-2xl font-light text-[#3D3D3D]">{result.productsCreated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#3D3D3D]/60">Variants Created</p>
                    <p className="text-2xl font-light text-[#3D3D3D]">{result.variantsCreated}</p>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-red-600 font-medium mb-2">
                      Errors ({result.errors.length}):
                    </p>
                    <ul className="text-sm text-red-600 space-y-1 max-h-40 overflow-y-auto">
                      {result.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 rounded-lg p-8 text-center">
            <p className="text-red-600">Failed to load image inventory</p>
          </div>
        )}
      </div>
    </div>
  )
}
