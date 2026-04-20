import { put, list, del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Target canvas size (square)
const CANVAS_SIZE = 1200
// Alpha threshold to detect content (0-255)
const ALPHA_THRESHOLD = 10
// Color difference threshold to detect background vs content
const COLOR_DIFF_THRESHOLD = 30

/**
 * Smart sizing based on aspect ratio detection
 * 
 * Aspect Ratio Tiers:
 * > 1.5  (very wide)   → 80%   Sofas, long benches
 * 1.2-1.5 (wide)       → 75%   Loveseats, settees  
 * 0.85-1.2 (square)    → 70%   Accent chairs, club chairs
 * 0.65-0.85 (tall)     → 68%   Dining chairs, side chairs
 * < 0.65 (very tall)   → 65%   Bar stools, tall items
 * 
 * Minimum fill: 58%
 */
function getTargetFillPercent(contentWidth: number, contentHeight: number): number {
  const aspectRatio = contentWidth / contentHeight
  
  // Very wide (sofas, long benches)
  if (aspectRatio > 1.5) {
    return 0.80
  }
  
  // Wide (loveseats, settees)
  if (aspectRatio > 1.2) {
    return 0.75
  }
  
  // Square-ish (accent chairs, club chairs, poufs)
  if (aspectRatio > 0.85) {
    return 0.70
  }
  
  // Tall (dining chairs, side chairs)
  if (aspectRatio > 0.65) {
    return 0.68
  }
  
  // Very tall (bar stools, floor items)
  return 0.65
}

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
  
  // Determine optimal fill percentage based on aspect ratio
  const aspectRatio = contentWidth / contentHeight
  const fillPercent = getTargetFillPercent(contentWidth, contentHeight)
  
  console.log('[v0] Content analysis:', { 
    contentWidth, 
    contentHeight, 
    aspectRatio: aspectRatio.toFixed(2),
    fillPercent: `${(fillPercent * 100).toFixed(0)}%`
  })

  // Calculate target dimensions based on fill percentage
  // For wide items, we size by width; for tall items, by height
  let targetWidth: number
  let targetHeight: number
  
  if (aspectRatio > 1) {
    // Wide item - fit to width
    targetWidth = Math.floor(CANVAS_SIZE * fillPercent)
    targetHeight = Math.floor(targetWidth / aspectRatio)
  } else {
    // Tall or square item - fit to height
    targetHeight = Math.floor(CANVAS_SIZE * fillPercent)
    targetWidth = Math.floor(targetHeight * aspectRatio)
  }
  
  // Ensure minimum size (58% of canvas)
  const minSize = Math.floor(CANVAS_SIZE * 0.58)
  if (targetWidth < minSize && targetHeight < minSize) {
    const smallScale = minSize / Math.max(contentWidth, contentHeight)
    targetWidth = Math.floor(contentWidth * smallScale)
    targetHeight = Math.floor(contentHeight * smallScale)
  }
  
  console.log('[v0] Target size:', { targetWidth, targetHeight })
  
  // Extract just the content area and resize
  const extracted = await sharp(buffer)
    .extract({
      left: minX,
      top: minY,
      width: contentWidth,
      height: contentHeight,
    })
    .resize({
      width: targetWidth,
      height: targetHeight,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    })
    .toBuffer()

  // Get actual resized dimensions
  const extractedMeta = await sharp(extracted).metadata()
  const finalWidth = extractedMeta.width || targetWidth
  const finalHeight = extractedMeta.height || targetHeight
  
  // Calculate position to center on canvas
  const left = Math.floor((CANVAS_SIZE - finalWidth) / 2)
  const top = Math.floor((CANVAS_SIZE - finalHeight) / 2)
  
  console.log('[v0] Centering at:', { left, top, finalWidth, finalHeight })

  // Create final canvas with centered content
  // Use white background
  const normalized = await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 255 }, // #FFFFFF
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
  
  console.log('[v0] Normalized image created, size:', normalized.length)

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
      try {
        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Normalize the image
        let processedBuffer: Buffer
        try {
          processedBuffer = await normalizeImage(buffer)
        } catch (err) {
          console.error(`[v0] Failed to normalize ${file.name}:`, err)
          // Fall back to original if normalization fails
          processedBuffer = buffer
        }
        
        // Store in category folder: inventory/seating/item-name.png
        const pathname = `inventory/${category}/${file.name}`
        
        const blob = await put(pathname, processedBuffer, {
          access: 'private',
          addRandomSuffix: false, // Keep clean names for mapping to CSV
          allowOverwrite: true,
          contentType: 'image/png',
        })
        
        results.push({
          name: file.name,
          url: blob.url,
          pathname: blob.pathname,
          success: true,
        })
      } catch (err) {
        console.error(`[v0] Failed to upload ${file.name}:`, err)
        results.push({
          name: file.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
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
