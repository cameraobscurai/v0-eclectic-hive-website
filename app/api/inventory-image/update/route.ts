import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

// Matches: inventory/<category>/<filename>
// Category and filename segments allow alphanumeric, dash, underscore, dot.
// This pattern cannot match .. or any path separator, making traversal impossible.
const SAFE_INVENTORY_PATH = /^inventory\/[a-z0-9_-]+\/[a-zA-Z0-9._-]+$/

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File
    const pathname = formData.get('pathname') as string

    if (!file || !pathname) {
      return NextResponse.json(
        { error: 'File and pathname are required' },
        { status: 400 }
      )
    }

    // Reject path traversal in both raw and URL-decoded forms
    if (
      pathname.includes('..') ||
      decodeURIComponent(pathname).includes('..')
    ) {
      return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 })
    }

    // Enforce strict structure — no arbitrary paths accepted
    if (!SAFE_INVENTORY_PATH.test(pathname)) {
      return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const blob = await put(pathname, buffer, {
      access:          'private',
      addRandomSuffix: false,
      allowOverwrite:  true,
      contentType:     'image/png',
    })

    return NextResponse.json({
      success:  true,
      pathname: blob.pathname,
      url:      blob.url,
    })
  } catch (error) {
    console.error('[inventory-image/update] PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}
