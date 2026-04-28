/**
 * Resolves a product image path to a usable URL.
 * Handles three cases:
 *   1. inventory/ paths → proxied through /api/inventory-image
 *   2. Full URLs (https://...) → returned as-is
 *   3. null/undefined → returns placeholder
 */
export function getProductImageUrl(
  primaryImageUrl: string | null | undefined,
  updatedAt?: string | null,
): string {
  if (!primaryImageUrl) return '/placeholder-product.jpg'

  if (primaryImageUrl.startsWith('inventory/')) {
    const cacheBuster = updatedAt
      ? `&v=${new Date(updatedAt).getTime()}`
      : ''
    return `/api/inventory-image?pathname=${encodeURIComponent(primaryImageUrl)}${cacheBuster}`
  }

  return primaryImageUrl
}
