import { put, list, del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient } from '@/lib/supabase/server'

// ============================================================================
// SECURITY: Category Allowlist
// ============================================================================
const ALLOWED_CATEGORIES = [
  'seating', 'tables', 'lighting', 'decor', 'bars', 
  'serveware', 'styling', 'storage', 'chandeliers', 'uncategorized'
] as const

function isValidCategory(category: string): boolean {
  return ALLOWED_CATEGORIES.includes(category.toLowerCase() as typeof ALLOWED_CATEGORIES[number])
}

// ============================================================================
// SECURITY: Filename Sanitization
// ============================================================================
function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '')
  // Keep only alphanumeric, dash, underscore, dot
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_')
  // Ensure it has a valid extension
  if (!safe.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
    safe = safe.replace(/\.[^.]+$/, '') + '.png'
  }
  // Limit length
  if (safe.length > 200) {
    safe = safe.substring(0, 200)
  }
  return safe || 'image.png'
}

// ============================================================================
// SECURITY: Escape SQL wildcards in ILIKE queries
// ============================================================================
function escapeIlike(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
}

// ============================================================================
// IMAGE PROCESSING CONFIG
// ============================================================================
const CANVAS_SIZE = 1200        // Output: 1200x1200 square
const CONTENT_FILL = 0.72       // Product fills ~72% of canvas
const OUTPUT_QUALITY = 90       // PNG compression quality
const WHITE = { r: 255, g: 255, b: 255 }

// ============================================================================
// CORE IMAGE PROCESSOR
// Simple, bulletproof: Remove background → Center on white → Output PNG
// ============================================================================
async function processImage(buffer: Buffer): Promise<Buffer> {
  // Step 1: Load image and get metadata
  const image = sharp(buffer)
  const metadata = await image.metadata()
  
  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image')
  }

  // Step 2: Flatten any transparency to white, ensure RGB
  const flattened = await sharp(buffer)
    .flatten({ background: WHITE })
    .toBuffer()

  // Step 3: Trim whitespace/background to get content bounds
  // This removes any existing background color
  let trimmed: Buffer
  let trimInfo: { width: number; height: number }
  
  try {
    const result = await sharp(flattened)
      .trim({ 
        background: WHITE,
        threshold: 40  // Tolerance for near-white pixels
      })
      .toBuffer({ resolveWithObject: true })
    
    trimmed = result.data
    trimInfo = { width: result.info.width, height: result.info.height }
  } catch {
    // If trim fails (e.g., image is all white), use original
    trimmed = flattened
    trimInfo = { width: metadata.width, height: metadata.height }
  }

  // Step 4: Calculate target size to fill canvas at CONTENT_FILL %
  const contentAspect = trimInfo.width / trimInfo.height
  const targetSize = Math.floor(CANVAS_SIZE * CONTENT_FILL)
  
  let resizeWidth: number
  let resizeHeight: number
  
  if (contentAspect > 1) {
    // Wide image - fit to width
    resizeWidth = targetSize
    resizeHeight = Math.floor(targetSize / contentAspect)
  } else {
    // Tall/square image - fit to height
    resizeHeight = targetSize
    resizeWidth = Math.floor(targetSize * contentAspect)
  }

  // Step 5: Resize content
  const resized = await sharp(trimmed)
    .resize(resizeWidth, resizeHeight, {
      fit: 'inside',
      background: WHITE,
    })
    .toBuffer()

  // Step 6: Get final dimensions after resize
  const resizedMeta = await sharp(resized).metadata()
  const finalW = resizedMeta.width || resizeWidth
  const finalH = resizedMeta.height || resizeHeight

  // Step 7: Center on white canvas
  const left = Math.floor((CANVAS_SIZE - finalW) / 2)
  const top = Math.floor((CANVAS_SIZE - finalH) / 2)

  // Step 8: Composite onto white canvas and output
  const final = await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 3,
      background: WHITE,
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ quality: OUTPUT_QUALITY, compressionLevel: 6 })
    .toBuffer()

  return final
}

// ============================================================================
// API: Upload images
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const categoryRaw = formData.get('category') as string || 'uncategorized'
    
    // Validate category against allowlist
    if (!isValidCategory(categoryRaw)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }
    const category = categoryRaw.toLowerCase()
    
    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const results = []
    
    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const processed = await processImage(buffer)
        
        // Sanitize filename to prevent path traversal and injection
        const safeFilename = sanitizeFilename(file.name)
        const pathname = `inventory/${category}/${safeFilename.replace(/\.[^.]+$/, '.png')}`
        
        const blob = await put(pathname, processed, {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'image/png',
        })
        
        // Match filename to product and update database
        // Filename format: "product-name.png" -> search for "product name"
        const searchName = file.name
          .replace(/\.[^.]+$/, '') // Remove extension
          .replace(/[-_]/g, ' ')   // Replace dashes/underscores with spaces
        
        const supabase = await createClient()
        const safeSearchName = escapeIlike(searchName)
        const { data: matchedProducts } = await supabase
          .from('products')
          .select('id, name')
          .ilike('name', `%${safeSearchName}%`)
          .limit(1)
        
        let dbUpdated = false
        if (matchedProducts && matchedProducts.length > 0) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              primary_image_url: blob.pathname,
              updated_at: new Date().toISOString()
            })
            .eq('id', matchedProducts[0].id)
          
          dbUpdated = !updateError
        }
        
        results.push({
          name: file.name,
          url: blob.url,
          pathname: blob.pathname,
          success: true,
          dbUpdated,
          matchedProduct: matchedProducts?.[0]?.name || null,
        })
      } catch (err) {
        console.error(`[v0] Failed: ${file.name}`, err)
        results.push({
          name: file.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({ uploaded: results.length, files: results })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// ============================================================================
// API: List images
// ============================================================================
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'inventory/' })
    
    const byCategory: Record<string, typeof blobs> = {}
    
    for (const blob of blobs) {
      const category = blob.pathname.split('/')[1] || 'uncategorized'
      if (!byCategory[category]) byCategory[category] = []
      byCategory[category].push(blob)
    }

    return NextResponse.json({ total: blobs.length, byCategory })
  } catch (error) {
    console.error('List error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// ============================================================================
// API: Sync Blob images to database (PATCH)
// ============================================================================
export async function PATCH() {
  try {
    const { blobs } = await list({ prefix: 'inventory/' })
    const supabase = await createClient()
    
    let synced = 0
    let failed = 0
    const results: { pathname: string; matched: string | null }[] = []
    
    for (const blob of blobs) {
      // Extract product name from pathname: inventory/category/product-name.png
      const filename = blob.pathname.split('/').pop() || ''
      const searchName = filename
        .replace(/\.[^.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ')   // Replace dashes/underscores with spaces
      
      // Find matching product (with escaped wildcards)
      const safeSearchName = escapeIlike(searchName)
      const { data: matchedProducts } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${safeSearchName}%`)
        .limit(1)
      
      if (matchedProducts && matchedProducts.length > 0) {
        const { error } = await supabase
          .from('products')
          .update({ 
            primary_image_url: blob.pathname,
            updated_at: new Date().toISOString()
          })
          .eq('id', matchedProducts[0].id)
        
        if (!error) {
          synced++
          results.push({ pathname: blob.pathname, matched: matchedProducts[0].name })
        } else {
          failed++
          results.push({ pathname: blob.pathname, matched: null })
        }
      } else {
        results.push({ pathname: blob.pathname, matched: null })
      }
    }
    
    return NextResponse.json({ 
      total: blobs.length, 
      synced, 
      failed,
      results 
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

// ============================================================================
// API: Delete images
// ============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const { category } = await request.json()
    const prefix = category ? `inventory/${category}/` : 'inventory/'
    const { blobs } = await list({ prefix })
    
    if (blobs.length === 0) {
      return NextResponse.json({ deleted: 0, message: 'No files to delete' })
    }
    
    await del(blobs.map(b => b.url))
    
    // Also clear database references for deleted images
    const supabase = await createClient()
    if (category) {
      await supabase
        .from('products')
        .update({ primary_image_url: null })
        .ilike('primary_image_url', `inventory/${category}/%`)
    } else {
      await supabase
        .from('products')
        .update({ primary_image_url: null })
        .ilike('primary_image_url', 'inventory/%')
    }
    
    return NextResponse.json({ 
      deleted: blobs.length,
      message: `Deleted ${blobs.length} files` 
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 })
  }
}
