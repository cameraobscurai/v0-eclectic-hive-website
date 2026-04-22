import { type NextRequest, NextResponse } from 'next/server'
import { get } from '@vercel/blob'

// Edge runtime for fastest possible image delivery
export const runtime = 'edge'

// Allowed path prefixes - whitelist approach
const ALLOWED_PREFIXES = ['inventory/', 'fonts/']

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
      return new NextResponse('Not found', { status: 404 })
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
