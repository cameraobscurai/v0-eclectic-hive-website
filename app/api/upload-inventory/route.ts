import { put, list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

// Upload multiple images to Blob storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'uncategorized'
    
    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const results = []
    
    for (const file of files) {
      // Store in category folder: inventory/seating/item-name.png
      const pathname = `inventory/${category}/${file.name}`
      
      const blob = await put(pathname, file, {
        access: 'private',
        addRandomSuffix: false, // Keep clean names for mapping to CSV
      })
      
      results.push({
        name: file.name,
        url: blob.url,
        pathname: blob.pathname,
      })
    }

    return NextResponse.json({ 
      uploaded: results.length,
      files: results 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// List all uploaded inventory images
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'inventory/' })
    
    // Group by category
    const byCategory: Record<string, typeof blobs> = {}
    
    for (const blob of blobs) {
      const parts = blob.pathname.split('/')
      const category = parts[1] || 'uncategorized'
      
      if (!byCategory[category]) {
        byCategory[category] = []
      }
      byCategory[category].push(blob)
    }

    return NextResponse.json({
      total: blobs.length,
      byCategory,
    })
  } catch (error) {
    console.error('List error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
