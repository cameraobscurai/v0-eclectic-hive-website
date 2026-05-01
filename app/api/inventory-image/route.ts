import { type NextRequest, NextResponse } from 'next/server'

// Images are stored in Supabase Storage (public bucket)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txmgpxvbtljfgswizhoz.supabase.co'

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

    // Construct Supabase Storage URL
    // Path format: inventory/filename.png -> storage bucket is "inventory", file is "filename.png"
    const [bucket, ...filePathParts] = normalizedPath.split('/')
    // Encode each path segment separately to preserve folder structure (slashes)
    const encodedFilePath = filePathParts.map(segment => encodeURIComponent(segment)).join('/')
    const supabaseStorageUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodedFilePath}`

    // Fetch from Supabase Storage
    const response = await fetch(supabaseStorageUrl, {
      headers: {
        'If-None-Match': request.headers.get('if-none-match') || '',
      },
    })

    if (response.status === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    if (!response.ok) {
      // Redirect to placeholder on 404
      return NextResponse.redirect(new URL('/placeholder-product.jpg', request.url), 302)
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const etag = response.headers.get('etag')

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        ...(etag && { ETag: etag }),
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache forever (images don't change)
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 })
  }
}
