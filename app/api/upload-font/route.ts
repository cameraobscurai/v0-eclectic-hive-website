import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { sanitizeFilename } from '@/lib/utils'

const ALLOWED_FONT_EXTENSIONS = /\.(otf|ttf|woff|woff2)$/i
const MAX_FONT_SIZE_BYTES      = 5 * 1024 * 1024  // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Enforce size limit before reading into memory
    if (file.size > MAX_FONT_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large (max 5 MB)' },
        { status: 413 }
      )
    }

    // Sanitize filename and enforce extension allowlist
    const safeName = sanitizeFilename(file.name)
    if (!ALLOWED_FONT_EXTENSIONS.test(safeName)) {
      return NextResponse.json(
        { error: 'Unsupported font type. Allowed: otf, ttf, woff, woff2' },
        { status: 400 }
      )
    }

    const blob = await put(`fonts/${safeName}`, file, {
      access: 'public',
    })

    return NextResponse.json({
      url:      blob.url,
      filename: safeName,
    })
  } catch (error) {
    console.error('[upload-font] POST error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
