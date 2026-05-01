'use client'

import { useState, useEffect, useCallback } from 'react'
import { INVENTORY } from '@/lib/inventory-data'

interface ImportStatus {
  name: string
  status: 'pending' | 'importing' | 'done' | 'failed' | 'skipped'
  error?: string
  dbMatch?: string
}

export default function ImportPage() {
  const [statuses, setStatuses] = useState<ImportStatus[]>([])
  const [running, setRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stats, setStats] = useState({ done: 0, failed: 0, skipped: 0 })

  // Initialize statuses from inventory data
  useEffect(() => {
    setStatuses(INVENTORY.map(p => ({ name: p.name, status: 'pending' as const })))
  }, [])

  const importSingle = useCallback(async (index: number): Promise<'done' | 'failed' | 'skipped'> => {
    const item = INVENTORY[index]
    if (!item?.image) return 'skipped'

    setStatuses(prev => {
      const next = [...prev]
      next[index] = { ...next[index], status: 'importing' }
      return next
    })

    try {
      const res = await fetch('/api/import-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: item.name, 
          imageUrl: item.image,
          category: item.category 
        }),
      })

      const data = await res.json()

      if (data.status === 'imported') {
        setStatuses(prev => {
          const next = [...prev]
          next[index] = { name: item.name, status: 'done', dbMatch: data.dbName }
          return next
        })
        return 'done'
      } else if (data.status === 'skipped') {
        setStatuses(prev => {
          const next = [...prev]
          next[index] = { name: item.name, status: 'skipped', dbMatch: data.dbName }
          return next
        })
        return 'skipped'
      } else {
        setStatuses(prev => {
          const next = [...prev]
          next[index] = { name: item.name, status: 'failed', error: data.error || 'Unknown error' }
          return next
        })
        return 'failed'
      }
    } catch (e) {
      setStatuses(prev => {
        const next = [...prev]
        next[index] = { name: item.name, status: 'failed', error: String(e) }
        return next
      })
      return 'failed'
    }
  }, [])

  const runAll = async () => {
    setRunning(true)
    setStats({ done: 0, failed: 0, skipped: 0 })
    
    for (let i = 0; i < INVENTORY.length; i++) {
      setCurrentIndex(i)
      const result = await importSingle(i)
      setStats(prev => ({
        ...prev,
        [result]: prev[result as keyof typeof prev] + 1
      }))
      // Small delay to not hammer the server
      await new Promise(r => setTimeout(r, 100))
    }
    
    setRunning(false)
  }

  const doneCount = statuses.filter(s => s.status === 'done').length
  const failedCount = statuses.filter(s => s.status === 'failed').length
  const skippedCount = statuses.filter(s => s.status === 'skipped').length
  const pendingCount = statuses.filter(s => s.status === 'pending').length

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display text-charcoal mb-2">Import Images</h1>
        <p className="text-charcoal/60 mb-6">
          {INVENTORY.length} products in inventory-data.ts with Squarespace CDN images
        </p>

        {/* Controls */}
        <div className="bg-white border border-charcoal/10 p-6 mb-6">
          <button
            onClick={runAll}
            disabled={running}
            className="px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-wider disabled:opacity-50 hover:bg-charcoal/90 transition-colors"
          >
            {running ? `Importing ${currentIndex + 1} of ${INVENTORY.length}...` : 'Start Import'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-charcoal/10 p-4 text-center">
            <p className="text-3xl font-medium text-green-600">{doneCount}</p>
            <p className="text-xs uppercase tracking-wider text-charcoal/50">Imported</p>
          </div>
          <div className="bg-white border border-charcoal/10 p-4 text-center">
            <p className="text-3xl font-medium text-charcoal/40">{skippedCount}</p>
            <p className="text-xs uppercase tracking-wider text-charcoal/50">Skipped</p>
          </div>
          <div className="bg-white border border-charcoal/10 p-4 text-center">
            <p className="text-3xl font-medium text-red-600">{failedCount}</p>
            <p className="text-xs uppercase tracking-wider text-charcoal/50">Failed</p>
          </div>
          <div className="bg-white border border-charcoal/10 p-4 text-center">
            <p className="text-3xl font-medium text-charcoal">{pendingCount}</p>
            <p className="text-xs uppercase tracking-wider text-charcoal/50">Pending</p>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white border border-charcoal/10">
          <div className="max-h-[500px] overflow-y-auto">
            {statuses.map((s, i) => (
              <div 
                key={i}
                className={`flex items-center justify-between px-4 py-3 border-b border-charcoal/5 ${
                  s.status === 'importing' ? 'bg-amber-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    s.status === 'done' ? 'bg-green-100 text-green-700' :
                    s.status === 'failed' ? 'bg-red-100 text-red-700' :
                    s.status === 'skipped' ? 'bg-charcoal/10 text-charcoal/40' :
                    s.status === 'importing' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                    'bg-charcoal/5 text-charcoal/30'
                  }`}>
                    {s.status === 'done' ? '✓' : 
                     s.status === 'failed' ? '✗' : 
                     s.status === 'skipped' ? '○' :
                     s.status === 'importing' ? '...' : 
                     i + 1}
                  </span>
                  <span className={`text-sm ${
                    s.status === 'done' ? 'text-green-700' :
                    s.status === 'failed' ? 'text-red-700' :
                    s.status === 'skipped' ? 'text-charcoal/40' :
                    'text-charcoal'
                  }`}>
                    {s.name}
                  </span>
                </div>
                <div className="text-xs text-charcoal/50">
                  {s.dbMatch && <span className="text-green-600">→ {s.dbMatch}</span>}
                  {s.error && <span className="text-red-500">{s.error}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
