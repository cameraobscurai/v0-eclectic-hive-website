import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { INVENTORY } from '@/lib/inventory-data'

// This imports images from the existing inventory-data.ts file
// which already has correct Squarespace CDN URLs

function normalizeForMatch(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export async function GET() {
  // Return the inventory data for preview
  return NextResponse.json({
    count: INVENTORY.length,
    products: INVENTORY.map(p => ({
      name: p.name,
      category: p.category,
      hasImage: !!p.image,
      imageUrl: p.image,
    })),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const limit = body.limit || 20
  const skipExisting = body.skipExisting !== false

  const supabase = await createClient()

  // Get all products from database that need images
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, slug, primary_image_url')
    .eq('is_active', true)

  if (dbError || !dbProducts) {
    return NextResponse.json({ error: 'Failed to fetch products from database' }, { status: 500 })
  }

  const results: Array<{
    inventoryName: string
    dbName: string
    status: 'imported' | 'skipped' | 'failed' | 'no_match'
    error?: string
  }> = []

  let processed = 0

  for (const invProduct of INVENTORY) {
    if (processed >= limit) break
    if (!invProduct.image) continue

    // Find matching database product by normalized name
    const invNorm = normalizeForMatch(invProduct.name)
    
    let bestMatch: typeof dbProducts[0] | null = null
    let bestScore = 0

    for (const dbProduct of dbProducts) {
      const dbNorm = normalizeForMatch(dbProduct.name)
      
      // Exact match
      if (invNorm === dbNorm) {
        bestMatch = dbProduct
        bestScore = 100
        break
      }
      
      // Contains match
      if (invNorm.includes(dbNorm) || dbNorm.includes(invNorm)) {
        const score = 80
        if (score > bestScore) {
          bestScore = score
          bestMatch = dbProduct
        }
      }
      
      // Word overlap
      const invWords = invNorm.match(/.{3,}/g) || []
      const dbWords = dbNorm.match(/.{3,}/g) || []
      let overlap = 0
      for (const w of invWords) {
        if (dbNorm.includes(w)) overlap++
      }
      const score = (overlap / Math.max(invWords.length, 1)) * 60
      if (score > bestScore) {
        bestScore = score
        bestMatch = dbProduct
      }
    }

    if (!bestMatch) {
      results.push({
        inventoryName: invProduct.name,
        dbName: '',
        status: 'no_match',
      })
      continue
    }

    // Skip if already has image
    if (skipExisting && bestMatch.primary_image_url) {
      results.push({
        inventoryName: invProduct.name,
        dbName: bestMatch.name,
        status: 'skipped',
      })
      continue
    }

    processed++

    try {
      // Download image from Squarespace CDN
      const imgResponse = await fetch(invProduct.image, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      })

      if (!imgResponse.ok) {
        results.push({
          inventoryName: invProduct.name,
          dbName: bestMatch.name,
          status: 'failed',
          error: `Download failed: ${imgResponse.status}`,
        })
        continue
      }

      const imageData = await imgResponse.arrayBuffer()
      const contentType = imgResponse.headers.get('content-type') || 'image/png'
      const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png'

      // Upload to Vercel Blob
      const blob = await put(
        `products/${bestMatch.slug || bestMatch.id}.${ext}`,
        imageData,
        {
          access: 'private',
          contentType,
        }
      )

      // Update database
      const { error: updateError } = await supabase
        .from('products')
        .update({ primary_image_url: blob.pathname })
        .eq('id', bestMatch.id)

      if (updateError) {
        results.push({
          inventoryName: invProduct.name,
          dbName: bestMatch.name,
          status: 'failed',
          error: `DB update failed: ${updateError.message}`,
        })
        continue
      }

      results.push({
        inventoryName: invProduct.name,
        dbName: bestMatch.name,
        status: 'imported',
      })

      // Small delay to be nice to Squarespace
      await new Promise(r => setTimeout(r, 100))

    } catch (e) {
      results.push({
        inventoryName: invProduct.name,
        dbName: bestMatch.name,
        status: 'failed',
        error: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }

  const imported = results.filter(r => r.status === 'imported').length
  const skipped = results.filter(r => r.status === 'skipped').length
  const failed = results.filter(r => r.status === 'failed').length
  const noMatch = results.filter(r => r.status === 'no_match').length

  return NextResponse.json({
    success: true,
    summary: { imported, skipped, failed, noMatch, total: results.length },
    results,
  })
}
