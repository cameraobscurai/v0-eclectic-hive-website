import { get } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

const FONT_MAP: Record<string, string> = {
  'SaolDisplay-LightItalic.otf': 'SaolDisplay-LightItalic.otf',
  'SaolDisplay-Regular.otf': 'SaolDisplay-Regular.otf',
  'SaolDisplay-Semibold.otf': 'SaolDisplay-Semibold.otf',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  
  const pathname = FONT_MAP[name]
  if (!pathname) {
    return new NextResponse('Font not found', { status: 404 })
  }

  try {
    const result = await get(pathname, {
      access: 'private',
    })

    if (!result) {
      return new NextResponse('Font not found', { status: 404 })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': 'font/otf',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error serving font:', error)
    return new NextResponse('Failed to serve font', { status: 500 })
  }
}
