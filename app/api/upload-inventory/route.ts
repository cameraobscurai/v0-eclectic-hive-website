import { put, list, del } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient } from '@/lib/supabase/server'
import { sanitizeFilename, escapeIlike } from '@/lib/utils'

// ============================================================================
// SECURITY: Category Allowlist
// ============================================================================
const ALLOWED_CATEGORIES = [
  'seating', 'tables', 'lighting', 'decor', 'bars',
  'serveware', 'styling', 'storage', 'chandeliers', 'uncategorized',
] as const

type AllowedCategory = typeof ALLOWED_CATEGORIES[number]

function isValidCategory(cat: string): cat is AllowedCategory {
  return ALLOWED_CATEGORIES.includes(cat.toLowerCase() as AllowedCategory)
}

// ============================================================================
// IMAGE PROCESSING CONFIG
// ============================================================================
const CANVAS_SIZE    = 1200
const CONTENT_FILL   = 0.72
const OUTPUT_QUALITY = 90
const WHITE          = { r: 255, g: 255, b: 255 }

// ============================================================================
// CORE IMAGE PROCESSOR
// ============================================================================
async function processImage(buffer: Buffer): Promise<Buffer> {
  const image    = sharp(buffer)
  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image')
  }

  const flattened = await sharp(buffer)
    .flatten({ background: WHITE })
    .toBuffer()

  let trimmed: Buffer
  let trimInfo: { width: number; height: number }

  try {
    const result = await sharp(flattened)
      .trim({ background: WHITE, threshold: 40 })
      .toBuffer({ resolveWithObject: true })
    trimmed  = result.data
    trimInfo = { width: result.info.width, height: result.info.height }
  } catch {
    trimmed  = flattened
    trimInfo = { width: metadata.width, height: metadata.height }
  }

  const contentAspect = trimInfo.width / trimInfo.height
  const targetSize    = Math.floor(CANVAS_SIZE * CONTENT_FILL)

  let resizeWidth: number
  let resizeHeight: number

  if (contentAspect > 1) {
    resizeWidth  = targetSize
    resizeHeight = Math.floor(targetSize / contentAspect)
  } else {
    resizeHeight = targetSize
    resizeWidth  = Math.floor(targetSize * contentAspect)
  }

  const resized = await sharp(trimmed)
    .resize(resizeWidth, resizeHeight, { fit: 'inside', background: WHITE })
    .toBuffer()

  const resizedMeta = await sharp(resized).metadata()
  const finalW      = resizedMeta.width  || resizeWidth
  const finalH      = resizedMeta.height || resizeHeight
  const left        = Math.floor((CANVAS_SIZE - finalW) / 2)
  const top         = Math.floor((CANVAS_SIZE - finalH) / 2)

  return sharp({
    create: {
      width:      CANVAS_SIZE,
      height:     CANVAS_SIZE,
      channels:   3,
      background: WHITE,
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ quality: OUTPUT_QUALITY, compressionLevel: 6 })
    .toBuffer()
}

// ============================================================================
// POST — Upload images
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const formData   = await request.formData()
    const files      = formData.getAll('files') as File[]
    const categoryRaw = (formData.get('category') as string) || 'uncategorized'

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
        const buffer    = Buffer.from(await file.arrayBuffer())
        const processed = await processImage(buffer)

        const safeFilename = sanitizeFilename(file.name).replace(/\.[^.]+$/, '.png')
        const pathname     = `inventory/${category}/${safeFilename}`

        const blob = await put(pathname, processed, {
          access:          'private',
          addRandomSuffix: false,
          allowOverwrite:  true,
          contentType:     'image/png',
        })

        const searchName = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]/g, ' ')

        const supabase        = await createClient()
        const safeSearchName  = escapeIlike(searchName)
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
              updated_at:        new Date().toISOString(),
            })
            .eq('id', matchedProducts[0].id)
          dbUpdated = !updateError
        }

        results.push({
          name:           file.name,
          url:            blob.url,
          pathname:       blob.pathname,
          success:        true,
          dbUpdated,
          matchedProduct: matchedProducts?.[0]?.name || null,
        })
      } catch (err) {
        console.error(`[upload-inventory] Failed: ${file.name}`, err)
        results.push({
          name:    file.name,
          success: false,
          error:   err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({ uploaded: results.length, files: results })
  } catch (error) {
    console.error('[upload-inventory] POST error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// ============================================================================
// GET — List images
// ============================================================================
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'inventory/' })

    const byCategory: Record<string, typeof blobs> = {}
    for (const blob of blobs) {
      const cat = blob.pathname.split('/')[1] || 'uncategorized'
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push(blob)
    }

    return NextResponse.json({ total: blobs.length, byCategory })
  } catch (error) {
    console.error('[upload-inventory] GET error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// ============================================================================
// PATCH — Sync Blob images to database
// ============================================================================
export async function PATCH() {
  try {
    const { blobs } = await list({ prefix: 'inventory/' })
    const supabase  = await createClient()

    let synced = 0
    let failed = 0
    const results: { pathname: string; matched: string | null }[] = []

    for (const blob of blobs) {
      const filename   = blob.pathname.split('/').pop() || ''
      const searchName = filename
        .replace(/\.[^.]+$/, '')
        .replace(/[-_]/g, ' ')

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
            updated_at:        new Date().toISOString(),
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

    return NextResponse.json({ total: blobs.length, synced, failed, results })
  } catch (error) {
    console.error('[upload-inventory] PATCH error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

// ============================================================================
// DELETE — Delete images
// ============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { category } = body

    // Validate category if provided — prevents path manipulation
    if (category !== undefined && category !== null) {
      if (typeof category !== 'string' || !isValidCategory(category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }

    const prefix    = category ? `inventory/${category.toLowerCase()}/` : 'inventory/'
    const { blobs } = await list({ prefix })

    if (blobs.length === 0) {
      return NextResponse.json({ deleted: 0, message: 'No files to delete' })
    }

    await del(blobs.map(b => b.url))

    // Clear database references for deleted images
    const supabase = await createClient()
    if (category) {
      await supabase
        .from('products')
        .update({ primary_image_url: null })
        .ilike('primary_image_url', `inventory/${category.toLowerCase()}/%`)
    } else {
      await supabase
        .from('products')
        .update({ primary_image_url: null })
        .ilike('primary_image_url', 'inventory/%')
    }

    return NextResponse.json({
      deleted: blobs.length,
      message: `Deleted ${blobs.length} files`,
    })
  } catch (error) {
    console.error('[upload-inventory] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 })
  }
}
