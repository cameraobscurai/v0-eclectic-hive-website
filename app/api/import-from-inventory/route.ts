import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { INVENTORY } from '@/lib/inventory-data'

// Normalize name for matching
function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// GET: Preview what will be imported
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name, slug, primary_image_url')
      .eq('is_active', true)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Pre-match
    const matches: Array<{inv: string, db: string, hasImage: boolean}> = []
    const noMatch: string[] = []
    
    for (const inv of INVENTORY) {
      const invNorm = normalize(inv.name)
      let found = false
      
      for (const db of dbProducts || []) {
        const dbNorm = normalize(db.name)
        if (invNorm === dbNorm || invNorm.includes(dbNorm) || dbNorm.includes(invNorm)) {
          matches.push({ inv: inv.name, db: db.name, hasImage: !!db.primary_image_url })
          found = true
          break
        }
      }
      
      if (!found) noMatch.push(inv.name)
    }
    
    return NextResponse.json({
      inventoryCount: INVENTORY.length,
      dbCount: dbProducts?.length || 0,
      matchedCount: matches.length,
      needingImages: matches.filter(m => !m.hasImage).length,
      noMatchCount: noMatch.length,
      matches: matches.slice(0, 15),
      noMatch,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// POST: Run the import
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const limit = Math.min(body.limit || 10, 20) // Cap at 20 to avoid timeout
    const skipExisting = body.skipExisting !== false
    
    const supabase = await createClient()
    
    // Get all products
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, slug, primary_image_url')
      .eq('is_active', true)
    
    if (dbError) {
      return NextResponse.json({ 
        success: false, 
        error: `Database error: ${dbError.message}` 
      }, { status: 500 })
    }
    
    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No products found in database' 
      }, { status: 404 })
    }
    
    const results: Array<{
      inventoryName: string
      dbName: string
      status: 'imported' | 'skipped' | 'failed' | 'no_match'
      error?: string
    }> = []
    
    let processed = 0
    
    for (const inv of INVENTORY) {
      if (processed >= limit) break
      if (!inv.image) continue
      
      // Find matching DB product
      const invNorm = normalize(inv.name)
      let match: typeof dbProducts[0] | null = null
      
      for (const db of dbProducts) {
        const dbNorm = normalize(db.name)
        // Exact or contains match
        if (invNorm === dbNorm || invNorm.includes(dbNorm) || dbNorm.includes(invNorm)) {
          match = db
          break
        }
      }
      
      if (!match) {
        results.push({ inventoryName: inv.name, dbName: '', status: 'no_match' })
        continue
      }
      
      // Skip if already has image
      if (skipExisting && match.primary_image_url) {
        results.push({ inventoryName: inv.name, dbName: match.name, status: 'skipped' })
        continue
      }
      
      processed++
      
      // Download image
      try {
        const imgRes = await fetch(inv.image, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        
        if (!imgRes.ok) {
          results.push({ 
            inventoryName: inv.name, 
            dbName: match.name, 
            status: 'failed',
            error: `Download ${imgRes.status}` 
          })
          continue
        }
        
        const buffer = await imgRes.arrayBuffer()
        const contentType = imgRes.headers.get('content-type') || 'image/png'
        const ext = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png'
        
        // Upload to Blob
        const blob = await put(
          `products/${match.slug || match.id}.${ext}`,
          buffer,
          { access: 'private', contentType }
        )
        
        // Update DB
        const { error: updateError } = await supabase
          .from('products')
          .update({ primary_image_url: blob.pathname })
          .eq('id', match.id)
        
        if (updateError) {
          results.push({ 
            inventoryName: inv.name, 
            dbName: match.name, 
            status: 'failed',
            error: updateError.message 
          })
          continue
        }
        
        results.push({ inventoryName: inv.name, dbName: match.name, status: 'imported' })
        
        // Small delay
        await new Promise(r => setTimeout(r, 50))
        
      } catch (e) {
        results.push({ 
          inventoryName: inv.name, 
          dbName: match.name, 
          status: 'failed',
          error: e instanceof Error ? e.message : 'Unknown' 
        })
      }
    }
    
    const summary = {
      imported: results.filter(r => r.status === 'imported').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      failed: results.filter(r => r.status === 'failed').length,
      noMatch: results.filter(r => r.status === 'no_match').length,
      total: results.length,
    }
    
    return NextResponse.json({ success: true, summary, results })
    
  } catch (e) {
    return NextResponse.json({ 
      success: false, 
      error: `Server error: ${e instanceof Error ? e.message : String(e)}` 
    }, { status: 500 })
  }
}
