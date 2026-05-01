import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const { name, imageUrl, category } = await request.json()

    if (!name || !imageUrl) {
      return NextResponse.json({ status: 'failed', error: 'Missing name or imageUrl' })
    }

    const supabase = await createClient()

    // Get all products without images
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, slug, primary_image_url')
      .eq('is_active', true)

    if (dbError) {
      return NextResponse.json({ status: 'failed', error: dbError.message })
    }

    // Find matching product
    const invNorm = normalize(name)
    let match: typeof dbProducts[0] | null = null
    let bestScore = 0

    for (const db of dbProducts || []) {
      const dbNorm = normalize(db.name)
      let score = 0

      // Exact match
      if (invNorm === dbNorm) {
        score = 100
      }
      // Contains match
      else if (invNorm.includes(dbNorm) || dbNorm.includes(invNorm)) {
        score = 80
      }
      // Word overlap
      else {
        const invWords = invNorm.match(/[a-z]+/g) || []
        const dbWords = dbNorm.match(/[a-z]+/g) || []
        const overlap = invWords.filter(w => dbWords.includes(w)).length
        if (overlap > 0) {
          score = Math.min(70, overlap * 20)
        }
      }

      if (score > bestScore) {
        bestScore = score
        match = db
      }
    }

    if (!match || bestScore < 40) {
      return NextResponse.json({ status: 'failed', error: 'No matching product found' })
    }

    // Skip if already has image
    if (match.primary_image_url) {
      return NextResponse.json({ status: 'skipped', dbName: match.name, reason: 'Already has image' })
    }

    // Download image
    const imgRes = await fetch(imageUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*'
      },
    })

    if (!imgRes.ok) {
      return NextResponse.json({ status: 'failed', error: `Download failed: ${imgRes.status}`, dbName: match.name })
    }

    const buffer = await imgRes.arrayBuffer()
    const contentType = imgRes.headers.get('content-type') || 'image/png'
    const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png'
    const slug = match.slug || slugify(match.name)

    // Upload to Blob
    const blob = await put(
      `products/${slug}.${ext}`,
      buffer,
      { access: 'private', contentType }
    )

    // Update database
    const { error: updateError } = await supabase
      .from('products')
      .update({ primary_image_url: blob.pathname })
      .eq('id', match.id)

    if (updateError) {
      return NextResponse.json({ status: 'failed', error: updateError.message, dbName: match.name })
    }

    return NextResponse.json({ status: 'imported', dbName: match.name, blobPath: blob.pathname })

  } catch (e) {
    return NextResponse.json({ status: 'failed', error: e instanceof Error ? e.message : String(e) })
  }
}
