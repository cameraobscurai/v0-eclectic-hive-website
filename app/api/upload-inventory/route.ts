import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeFilename, escapeIlike } from '@/lib/utils'

// ============================================================================
// SECURITY: Category Allowlist
// ============================================================================
const ALLOWED_CATEGORIES = [
  'seating', 'tables', 'lighting', 'decor', 'bars',
  'serveware', 'styling', 'storage', 'chandeliers', 'uncategorized',
  'pillows', 'rugs', 'tableware', 'throws', 'candlelight', 'furs',
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
// POST — Upload images to Supabase Storage
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

    const supabaseAdmin = createAdminClient()
    const supabase = await createClient()
    const results = []

    for (const file of files) {
      try {
        const buffer    = Buffer.from(await file.arrayBuffer())
        const processed = await processImage(buffer)

        const safeFilename = sanitizeFilename(file.name).replace(/\.[^.]+$/, '.png')
        const storagePath  = `${category}/${safeFilename}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('inventory')
          .upload(storagePath, processed, {
            contentType: 'image/png',
            upsert: true,
          })

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('inventory')
          .getPublicUrl(storagePath)

        const searchName = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]/g, ' ')

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
              primary_image_url: publicUrl,
              updated_at:        new Date().toISOString(),
            })
            .eq('id', matchedProducts[0].id)
          dbUpdated = !updateError
        }

        results.push({
          name:           file.name,
          url:            publicUrl,
          pathname:       uploadData.path,
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
// GET — List images from Supabase Storage
// ============================================================================
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient()
    
    // List all folders in inventory bucket
    const { data: folders, error: foldersError } = await supabaseAdmin.storage
      .from('inventory')
      .list('', { limit: 100 })

    if (foldersError) {
      throw new Error(foldersError.message)
    }

    const byCategory: Record<string, { name: string; url: string }[]> = {}
    let total = 0

    for (const folder of folders || []) {
      if (folder.id) continue // Skip files at root, only process folders
      
      const { data: files } = await supabaseAdmin.storage
        .from('inventory')
        .list(folder.name, { limit: 1000 })

      if (files && files.length > 0) {
        byCategory[folder.name] = files
          .filter(f => f.name.endsWith('.png'))
          .map(f => {
            const { data: { publicUrl } } = supabaseAdmin.storage
              .from('inventory')
              .getPublicUrl(`${folder.name}/${f.name}`)
            return { name: f.name, url: publicUrl }
          })
        total += byCategory[folder.name].length
      }
    }

    return NextResponse.json({ total, byCategory })
  } catch (error) {
    console.error('[upload-inventory] GET error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// ============================================================================
// DELETE — Delete images from Supabase Storage
// ============================================================================
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { category } = body

    if (category !== undefined && category !== null) {
      if (typeof category !== 'string' || !isValidCategory(category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }

    const supabaseAdmin = createAdminClient()
    const supabase = await createClient()
    const folderPath = category ? category.toLowerCase() : ''

    // List files to delete
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('inventory')
      .list(folderPath, { limit: 1000 })

    if (listError) {
      throw new Error(listError.message)
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ deleted: 0, message: 'No files to delete' })
    }

    // Delete files
    const filePaths = files
      .filter(f => f.name.endsWith('.png'))
      .map(f => folderPath ? `${folderPath}/${f.name}` : f.name)

    const { error: deleteError } = await supabaseAdmin.storage
      .from('inventory')
      .remove(filePaths)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    // Clear database references
    if (category) {
      await supabase
        .from('products')
        .update({ primary_image_url: null })
        .ilike('primary_image_url', `%inventory/${category.toLowerCase()}%`)
    }

    return NextResponse.json({
      deleted: filePaths.length,
      message: `Deleted ${filePaths.length} files`,
    })
  } catch (error) {
    console.error('[upload-inventory] DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 })
  }
}
