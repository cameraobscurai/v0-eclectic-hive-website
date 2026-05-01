import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Map Product Group to CANONICAL category keys (lowercase, stable)
// Frontend maps these to display labels - never store display labels in DB
function mapCategory(productGroup: string): string {
  const raw = (productGroup || '').toLowerCase().trim()
  const map: Record<string, string> = {
    'bars': 'bars',
    'seating': 'seating',
    'tables': 'tables',
    'large-decor': 'large-decor',
    'large decor': 'large-decor',
    'large decor & dividers': 'large-decor',
    'small-decor': 'styling',
    'small decor': 'styling',
    'lighting': 'lighting',
    'rugs': 'rugs',
    'pillows': 'pillows',
    'linens': 'linens',
    'tableware': 'tableware',
    'candlelight': 'candlelight',
    'serveware': 'serveware',
    'storage': 'storage',
    'styling': 'styling',
    'throws': 'throws',
    'furs-and-pelts': 'furs-pelts',
    'furs and pelts': 'furs-pelts',
    'furs & pelts': 'furs-pelts',
    'chandeliers': 'chandeliers',
    'subrentals': 'subrentals',
  }
  return map[raw] || 'styling'
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  
  try {
    const body = await request.json().catch(() => ({}))
    const { csvData, limit = 50, offset = 0 } = body as { csvData?: string; limit?: number; offset?: number }
    
    if (!csvData) {
      return NextResponse.json({ error: 'CSV data required' }, { status: 400 })
    }
    
    // Parse CSV
    const lines = csvData.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
    
    const records = lines.slice(1 + offset, 1 + offset + limit).map(line => {
      // Handle CSV parsing with quoted fields
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      const record: Record<string, string> = {}
      headers.forEach((h, i) => {
        record[h] = values[i] || ''
      })
      return record
    })
    
    const results: Array<{
      name: string
      status: 'created' | 'updated' | 'skipped' | 'error'
      imageLinked: boolean
      error?: string
    }> = []
    
    let created = 0
    let updated = 0
    let imagesLinked = 0
    
    for (const row of records) {
      const rmsId = parseInt(row['Id'])
      const name = row['Name']?.trim()
      const stock = parseInt(row['Current Stock']) || 0
      const productGroup = row['Product Group']?.trim()
      const dims = row['Dims']?.trim()
      const imageFilename = row['Image Filename']?.trim()
      
      if (!name) {
        results.push({ name: 'Unknown', status: 'skipped', imageLinked: false, error: 'Missing name' })
        continue
      }
      
      const category = mapCategory(productGroup)
      const slug = slugify(name)
      // DO NOT write primary_image_url directly - store CSV filename for manifest-based matching
      // The image-manifest endpoint will resolve and apply images after audit
      
      try {
        // Check if product exists
        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
          .single()
        
        let productId: string
        
        if (existing) {
          productId = existing.id
          
          // Update category only, NOT image
          await supabase
            .from('products')
            .update({ category })
            .eq('id', productId)
          
          updated++
          results.push({ name, status: 'updated', imageLinked: false })
        } else {
          // Create new product WITHOUT image - manifest will handle images
          const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
              slug,
              name,
              category,
              display_type: 'single',
              is_active: true,
              // primary_image_url intentionally NOT set - manifest handles this
            })
            .select()
            .single()
          
          if (productError) {
            results.push({ name, status: 'error', imageLinked: false, error: productError.message })
            continue
          }
          
          productId = product.id
          created++
          results.push({ name, status: 'created', imageLinked: false })
        }
        
        // Create/update variant with source_image_filename for manifest matching
        if (rmsId) {
          await supabase
            .from('product_variants')
            .upsert({
              product_id: productId,
              rms_id: rmsId,
              name,
              stock_count: stock,
              stock_status: stock > 0 ? 'available' : 'out',
              dims_display: dims,
              original_name: name,
              is_active: true,
              source_image_filename: imageFilename || null, // Store CSV filename for manifest
            }, { onConflict: 'rms_id' })
        }
      } catch (err) {
        results.push({ name, status: 'error', imageLinked: false, error: String(err) })
      }
    }
    
    return NextResponse.json({
      success: true,
      summary: {
        processed: records.length,
        created,
        updated,
        imagesLinked,
        errors: results.filter(r => r.status === 'error').length,
      },
      results,
      hasMore: offset + limit < lines.length - 1,
      nextOffset: offset + limit,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Import failed' 
    }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createAdminClient()
  
  // Get current stats
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  
  const { count: withImages } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .not('primary_image_url', 'is', null)
  
  return NextResponse.json({
    totalProducts: totalProducts || 0,
    withImages: withImages || 0,
    withoutImages: (totalProducts || 0) - (withImages || 0),
  })
}
