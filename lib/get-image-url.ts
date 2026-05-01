// Cache buster version - increment to force all images to reload
const CACHE_VERSION = '20260501'

/**
 * Resolves a product image path to a usable URL.
 * Handles three cases:
 *   1. inventory/ paths → proxied through /api/inventory-image
 *   2. Full URLs (https://...) → returned with cache buster
 *   3. null/undefined → returns placeholder
 */
export function getProductImageUrl(
  primaryImageUrl: string | null | undefined,
  updatedAt?: string | null,
): string {
  if (!primaryImageUrl) return '/placeholder-product.jpg'

  // Cache buster based on version + optional updatedAt
  const cacheBuster = updatedAt
    ? `${CACHE_VERSION}-${new Date(updatedAt).getTime()}`
    : CACHE_VERSION

  if (primaryImageUrl.startsWith('inventory/')) {
    return `/api/inventory-image?pathname=${encodeURIComponent(primaryImageUrl)}&v=${cacheBuster}`
  }

  // For full URLs (Supabase, Squarespace, etc), add cache buster as query param
  if (primaryImageUrl.startsWith('https://')) {
    const separator = primaryImageUrl.includes('?') ? '&' : '?'
    return `${primaryImageUrl}${separator}v=${cacheBuster}`
  }

  return primaryImageUrl
}
