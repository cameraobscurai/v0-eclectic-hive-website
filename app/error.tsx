'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error('[ECLECTIC HIVE] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-cream/40 text-xs uppercase tracking-[0.3em] mb-6">
          Something went wrong
        </p>
        
        <h1 className="font-display text-3xl md:text-4xl text-cream font-light tracking-wide mb-8">
          We&apos;re on it.
        </h1>
        
        <p className="text-cream/50 text-sm leading-relaxed mb-12">
          An unexpected error occurred. Our team has been notified. 
          Please try again or return home.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-cream text-charcoal text-xs uppercase tracking-[0.2em] hover:bg-cream/90 transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="px-8 py-3 border border-cream/30 text-cream text-xs uppercase tracking-[0.2em] hover:border-cream/60 transition-colors"
          >
            Return Home
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-12 text-cream/20 text-xs">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
