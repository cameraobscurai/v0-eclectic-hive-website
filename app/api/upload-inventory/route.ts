import { put, list, del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Padding percentage to add around content (12% on each side = 24% total)
const PADDING_PERCENT = 0.12
// Target canvas size (square)
const CANVAS_SIZE = 1200
// Alpha threshold to detect content (0-255)
const ALPHA_THRESHOLD = 10

/**
 * Normalizes an image by:
 * 1. Detecting the content bounding box (non-transparent pixels)
 * 2. Adding uniform padding around the content
 * 3. Centering on a square canvas
 */
async function normalizeImage(buffer: Buffer): Promise<Buffer> {
  // Get image metadata and raw pixels
  const image = sharp(buffer)
  const metadata = await image.metadata()
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions')
  }

  // Extract raw pixel data with alpha channel
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Find bounding box of non-transparent content
  let minX = info.width
  let minY = info.height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4
      const alpha = data[idx + 3]
      
      if (alpha > ALPHA_THRESHOLD) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  // If no content found, return original
  if (maxX <= minX || maxY <= minY) {
    return buffer
  }

  // Calculate content dimensions
  const contentWidth = maxX - minX + 1
  const contentHeight = maxY - minY + 1
  const contentSize = Math.max(contentWidth, contentHeight)

  // Calculate target content size with padding
  const targetContentSize = Math.floor(CANVAS_SIZE * (1 - PADDING_PERCENT * 2))
  
  // Calculate scale to fit content in target area
  const scale = targetContentSize / contentSize

  // Extract and resize the content area
  const extracted = await sharp(buffer)
    .extract({
      left: minX,
      top: minY,
      width: contentWidth,
      height: contentHeight,
    })
    .resize({
      width: Math.round(contentWidth * scale),
      height: Math.round(contentHeight * scale),
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer()

  // Get resized dimensions
  const resizedMeta = await sharp(extracted).metadata()
  const resizedWidth = resizedMeta.width || Math.round(contentWidth * scale)
  const resizedHeight = resizedMeta.height || Math.round(contentHeight * scale)

  // Calculate position to center on canvas
  const left = Math.floor((CANVAS_SIZE - resizedWidth) / 2)
  const top = Math.floor((CANVAS_SIZE - resizedHeight) / 2)

  // Create final canvas with centered content
  // Use the taupe background color #D4D0CB
  const normalized = await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: { r: 212, g: 208, b: 203, alpha: 255 }, // #D4D0CB
    },
  })
    .composite([
      {
        input: extracted,
        left,
        top,
      },
    ])
    .png()
    .toBuffer()

  return normalized
}

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
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Normalize the image
      let processedBuffer: Buffer
      try {
        processedBuffer = await normalizeImage(buffer)
      } catch (err) {
        console.error(`Failed to normalize ${file.name}:`, err)
        // Fall back to original if normalization fails
        processedBuffer = buffer
      }
      
      // Store in category folder: inventory/seating/item-name.png
      const pathname = `inventory/${category}/${file.name}`
      
      const blob = await put(pathname, processedBuffer, {
        access: 'private',
        addRandomSuffix: false, // Keep clean names for mapping to CSV
        contentType: 'image/png',
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

// Delete inventory images
export async function DELETE(request: NextRequest) {
  try {
    const { category } = await request.json()
    
    // Get all blobs to delete
    const prefix = category ? `inventory/${category}/` : 'inventory/'
    const { blobs } = await list({ prefix })
    
    if (blobs.length === 0) {
      return NextResponse.json({ deleted: 0, message: 'No files to delete' })
    }
    
    // Delete all matching blobs
    const urls = blobs.map(blob => blob.url)
    await del(urls)
    
    return NextResponse.json({ 
      deleted: blobs.length,
      message: `Deleted ${blobs.length} files${category ? ` from ${category}` : ''}` 
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 })
  }
}
