'use client'

import { useState } from 'react'

type BatchResult = {
  processed: number
  failed: number
  processedNames: string[]
  errors: { id: string; name: string; error: string }[]
  nextOffset: number
  done: boolean
}

export default function ReprocessPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'running' | 'done'>('idle')
  const [totalImages, setTotalImages] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [failed, setFailed] = useState(0)
  const [errors, setErrors] = useState<{ id: string; name: string; error: string }[]>([])
  const [log, setLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const checkImages = async () => {
    setStatus('checking')
    addLog('Checking images...')
    
    try {
      const res = await fetch('/api/reprocess-images')
      const data = await res.json()
      
      if (data.error) {
        addLog(`Error: ${data.error}`)
        setStatus('idle')
        return
      }
      
      setTotalImages(data.totalImages)
      addLog(`Found ${data.totalImages} images to reprocess`)
      setStatus('idle')
    } catch (err) {
      addLog(`Error: ${err}`)
      setStatus('idle')
    }
  }

  const runBatch = async (offset: number = 0): Promise<void> => {
    try {
      const res = await fetch(`/api/reprocess-images?offset=${offset}&limit=5`, {
        method: 'POST',
      })
      const data: BatchResult = await res.json()
      
      if (data.error) {
        addLog(`Batch error: ${data.error}`)
        return
      }
      
      setProcessed(prev => prev + data.processed)
      setFailed(prev => prev + data.failed)
      
      if (data.processedNames?.length) {
        addLog(`Processed: ${data.processedNames.join(', ')}`)
      }
      
      if (data.errors?.length) {
        setErrors(prev => [...prev, ...data.errors])
        data.errors.forEach(e => addLog(`Failed: ${e.name} - ${e.error}`))
      }
      
      if (!data.done) {
        // Continue with next batch
        await runBatch(data.nextOffset)
      } else {
        addLog('All images processed!')
        setStatus('done')
      }
    } catch (err) {
      addLog(`Batch error: ${err}`)
      setStatus('done')
    }
  }

  const startReprocess = async () => {
    if (!confirm('This will reprocess all product images with white backgrounds. Continue?')) {
      return
    }
    
    setStatus('running')
    setProcessed(0)
    setFailed(0)
    setErrors([])
    addLog('Starting reprocess...')
    
    await runBatch(0)
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium mb-2">Reprocess Product Images</h1>
        <p className="text-sm text-neutral-500 mb-8">
          This will re-export all product images with white backgrounds instead of gray.
          URLs in the database will be updated automatically.
        </p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={checkImages}
            disabled={status === 'running'}
            className="px-4 py-2 text-sm border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
          >
            Check Images
          </button>
          <button
            onClick={startReprocess}
            disabled={status === 'running' || totalImages === 0}
            className="px-4 py-2 text-sm bg-charcoal text-white hover:bg-charcoal/90 disabled:opacity-50"
          >
            {status === 'running' ? 'Processing...' : 'Start Reprocess'}
          </button>
        </div>

        {totalImages > 0 && (
          <div className="mb-8 p-4 bg-neutral-50 rounded">
            <div className="text-sm mb-2">
              Progress: {processed} / {totalImages} ({failed} failed)
            </div>
            <div className="h-2 bg-neutral-200 rounded overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(processed / totalImages) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 rounded">
            <h3 className="text-sm font-medium text-red-800 mb-2">Errors ({errors.length})</h3>
            <ul className="text-xs text-red-600 space-y-1">
              {errors.map((e, i) => (
                <li key={i}>{e.name}: {e.error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="border border-neutral-200 rounded">
          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200">
            <span className="text-xs font-medium">Log</span>
          </div>
          <div className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
            {log.length === 0 ? (
              <p className="text-neutral-400">Click &quot;Check Images&quot; to start</p>
            ) : (
              log.map((line, i) => (
                <div key={i} className="text-neutral-600">{line}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
