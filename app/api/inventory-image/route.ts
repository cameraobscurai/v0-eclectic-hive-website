import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'
import { readFileSync } from 'fs'
import { join } from 'path'

// Note: Using Node.js runtime as @vercel/blob's get() may have edge runtime issues
// Images are still served fast via CDN caching headers

// Allowed path prefixes - whitelist approach
const ALLOWED_PREFIXES = ['inventory/', 'fonts/']

// Read placeholder once at module level — not on every request
let placeholderBuffer: Buffer | null = null
function getPlaceholder(): Buffer {
  if (!placeholderBuffer) {
    try {
      placeholderBuffer = readFileSync(join(process.cwd(), 'public/placeholder-product.jpg'))
    } catch {
      placeholderBuffer = Buffer.alloc(0)
    }
  }
  return placeholderBuffer
}

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname')

    if (!pathname) {
      return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
    }

    // Security: Strict path validation to prevent path traversal attacks
    // 1. Reject any path containing .. (even encoded)
    if (pathname.includes('..') || decodeURIComponent(pathname).includes('..')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
    }
    
    // 2. Normalize the path (collapse multiple slashes)
    const normalizedPath = pathname.replace(/\/+/g, '/')
    
    // 3. Must start with an allowed prefix (whitelist)
    const isAllowed = ALLOWED_PREFIXES.some(prefix => normalizedPath.startsWith(prefix))
    if (!isAllowed) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
    }

    const result = await get(normalizedPath, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    })

    if (!result) {
      // Return the placeholder image instead of a 404 text response
      // This means the browser gets a valid image even if the blob is missing
      const placeholder = getPlaceholder()
      return new NextResponse(placeholder, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=60', // Short cache — the real image may appear
        },
      })
    }

    // Blob hasn't changed — tell the browser to use its cached copy
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'private, no-cache',
        },
      })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        ETag: result.blob.etag,
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800', // CDN cache 1 day, stale 7 days
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 })
  }
}
