import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Matches: inventory/<category>/<filename>
// Category and filename segments allow alphanumeric, dash, underscore, dot.
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

    // Reject path traversal
    if (
      pathname.includes('..') ||
      decodeURIComponent(pathname).includes('..')
    ) {
      return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 })
    }

    // Enforce strict structure
    if (!SAFE_INVENTORY_PATH.test(pathname)) {
      return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const supabaseAdmin = createAdminClient()

    // Remove "inventory/" prefix for storage path
    const storagePath = pathname.replace(/^inventory\//, '')

    const { data, error } = await supabaseAdmin.storage
      .from('inventory')
      .upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('inventory')
      .getPublicUrl(storagePath)

    return NextResponse.json({
      success:  true,
      pathname: data.path,
      url:      publicUrl,
    })
  } catch (error) {
    console.error('[inventory-image/update] PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}
