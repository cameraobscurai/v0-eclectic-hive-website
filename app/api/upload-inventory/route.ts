import { put, list, del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Padding percentage to add around content (12% on each side = 24% total)
const PADDING_PERCENT = 0.12
// Target canvas size (square)
const CANVAS_SIZE = 1200
// Alpha threshold to detect content (0-255)
const ALPHA_THRESHOLD = 10
// Color difference threshold to detect background vs content
const COLOR_DIFF_THRESHOLD = 30

/**
 * Check if a pixel color is similar to the background color
 */
function isBackgroundColor(r: number, g: number, b: number, bgR: number, bgG: number, bgB: number): boolean {
  const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB)
  return diff < COLOR_DIFF_THRESHOLD
}

/**
 * Sample corner pixels to detect background color
 */
function detectBackgroundColor(data: Buffer, width: number, height: number): { r: number; g: number; b: number } | null {
  // Sample corners
  const corners = [
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 },
  ]
  
  const colors: Array<{ r: number; g: number; b: number }> = []
  
  for (const corner of corners) {
    const idx = (corner.y * width + corner.x) * 4
    colors.push({
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
    })
  }
  
  // Check if corners are similar (likely background)
  const [c1, c2, c3, c4] = colors
  const similar = (a: typeof c1, b: typeof c1) => 
    Math.abs(a.r - b.r) < 20 && Math.abs(a.g - b.g) < 20 && Math.abs(a.b - b.b) < 20
  
  if (similar(c1, c2) && similar(c2, c3) && similar(c3, c4)) {
    // Average the corner colors
    return {
      r: Math.round((c1.r + c2.r + c3.r + c4.r) / 4),
      g: Math.round((c1.g + c2.g + c3.g + c4.g) / 4),
      b: Math.round((c1.b + c2.b + c3.b + c4.b) / 4),
    }
  }
  
  return null
}

/**
 * Normalizes an image by:
 * 1. Detecting the content bounding box (non-transparent OR non-background pixels)
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

  // Detect background color from corners
  const bgColor = detectBackgroundColor(data, info.width, info.height)
  console.log('[v0] Detected background color:', bgColor)

  // Find bounding box of content (non-transparent AND non-background pixels)
  let minX = info.width
  let minY = info.height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const alpha = data[idx + 3]
      
      // Skip transparent pixels
      if (alpha <= ALPHA_THRESHOLD) continue
      
      // Skip background-colored pixels if we detected a background
      if (bgColor && isBackgroundColor(r, g, b, bgColor.r, bgColor.g, bgColor.b)) continue
      
      // This is content
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  
  console.log('[v0] Content bounds:', { minX, minY, maxX, maxY, width: info.width, height: info.height })

  // If no content found or content fills entire image, return original
  if (maxX <= minX || maxY <= minY) {
    console.log('[v0] No content bounds found, returning original')
    return buffer
  }
  
  // If content already fills most of the image with good margins, skip processing
  const contentWidth = maxX - minX + 1
  const contentHeight = maxY - minY + 1
  const marginX = minX + (info.width - maxX)
  const marginY = minY + (info.height - maxY)
  const marginRatioX = marginX / info.width
  const marginRatioY = marginY / info.height
  
  console.log('[v0] Content size:', { contentWidth, contentHeight, marginRatioX, marginRatioY })

  // Calculate content size (max dimension)
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
