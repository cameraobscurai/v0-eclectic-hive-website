import { put, del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

// Update (overwrite) an existing inventory image
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const pathname = formData.get('pathname') as string
    
    if (!file || !pathname) {
      return NextResponse.json(
        { error: 'File and pathname are required' }, 
        { status: 400 }
      )
    }

    // Verify pathname is within inventory folder
    if (!pathname.startsWith('inventory/')) {
      return NextResponse.json(
        { error: 'Invalid pathname' }, 
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload new version (overwrites existing due to same pathname + no random suffix)
    const blob = await put(pathname, buffer, {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'image/png',
    })

    return NextResponse.json({
      success: true,
      pathname: blob.pathname,
      url: blob.url,
    })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update image' }, 
      { status: 500 }
    )
  }
}
