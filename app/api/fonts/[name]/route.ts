import { get } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

// B8: Edge runtime for zero cold-start latency on font loading
export const runtime = 'edge'

// Only these exact filenames are served — anything else 404s.
// This prevents directory traversal or probing for other Blob assets.
const ALLOWED_FONTS: Record<string, string> = {
  'SaolDisplay-LightItalic.otf': 'SaolDisplay-LightItalic.otf',
  'SaolDisplay-Regular.otf': 'SaolDisplay-Regular.otf',
  'SaolDisplay-Semibold.otf': 'SaolDisplay-Semibold.otf',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

  const pathname = ALLOWED_FONTS[name]
  if (!pathname) {
    return new NextResponse('Not found', { status: 404 })
  }

  try {
    const result = await get(pathname, { access: 'private' })

    if (!result) {
      return new NextResponse('Not found', { status: 404 })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': 'font/otf',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[fonts] Error serving font:', name, error)
    return new NextResponse('Failed to serve font', { status: 500 })
  }
}
