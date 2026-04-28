'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/get-image-url'

interface ProductImageProps {
  /** Raw primary_image_url from API or pre-resolved URL from store */
  src: string | null | undefined
  alt: string
  updatedAt?: string | null
  className?: string
  containerClassName?: string
  /** Called when image fails — lets parent track broken URLs */
  onError?: (src: string) => void
  /** Show shimmer while loading (default: true) */
  showShimmer?: boolean
  /** object-fit (default: contain) */
  fit?: 'contain' | 'cover'
}

export function ProductImage({
  src,
  alt,
  updatedAt,
  className,
  containerClassName,
  onError,
  showShimmer = true,
  fit = 'contain',
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const [retried, setRetried] = useState(false)

  // Resolve the URL once — handles inventory/ paths
  const resolvedSrc = getProductImageUrl(src, updatedAt)
  const placeholderSrc = '/placeholder-product.jpg'

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget

    if (!retried && resolvedSrc !== placeholderSrc) {
      // First failure: try the placeholder
      setRetried(true)
      target.src = placeholderSrc
      onError?.(resolvedSrc)
    } else {
      // Placeholder also failed (unlikely) — hide the image entirely
      setErrored(true)
    }
  }

  if (errored) {
    // Render a branded empty state instead of a broken image
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-charcoal/[0.02]',
          containerClassName,
        )}
      >
        <svg
          className="w-8 h-8 text-charcoal/10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Shimmer shown until loaded */}
      {showShimmer && !loaded && (
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-100/60 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      <img
        src={resolvedSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          fit === 'contain' ? 'object-contain' : 'object-cover',
          className,
        )}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        // Prevent right-click save on inventory images
        onContextMenu={(e) => {
          if (resolvedSrc.includes('/api/inventory-image')) e.preventDefault()
        }}
      />
    </div>
  )
}
