import { list } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Map Blob category folders to database categories
const CATEGORY_MAP: Record<string, string> = {
  'seating': 'Seating',
  'tables': 'Tables',
  'lighting': 'Lighting',
  'decor': 'Large Decor & Dividers',
  'large-decor': 'Large Decor & Dividers',
  'small-decor': 'Small Decor',
  'bars': 'Bars',
  'rugs': 'Rugs',
  'pillows': 'Pillows',
  'linens': 'Linens',
  'tableware': 'Tableware',
  'candlelight': 'Candlelight',
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatDisplayName(filename: string): string {
  // Remove extension
  const name = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '')
  // Convert kebab-case to Title Case
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function POST() {
  const supabase = await createClient()
  
  const results = {
    categories: [] as string[],
    productsCreated: 0,
    variantsCreated: 0,
    errors: [] as string[],
  }

  try {
    // List all blobs in inventory folder
    const { blobs } = await list({ prefix: 'inventory/' })
    
    // Group by category
    const byCategory: Record<string, typeof blobs> = {}
    
    for (const blob of blobs) {
      // Parse path: inventory/seating/item-name.png
      const parts = blob.pathname.split('/')
      if (parts.length >= 3) {
        const category = parts[1]
        if (!byCategory[category]) {
          byCategory[category] = []
        }
        byCategory[category].push(blob)
      }
    }

    results.categories = Object.keys(byCategory)

    // Process each category
    for (const [folderName, categoryBlobs] of Object.entries(byCategory)) {
      const dbCategory = CATEGORY_MAP[folderName] || folderName

      for (const blob of categoryBlobs) {
        const filename = blob.pathname.split('/').pop() || ''
        const displayName = formatDisplayName(filename)
        const slug = slugify(displayName)

        try {
          // Check if product already exists
          const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single()

          let productId: string

          if (existing) {
            // Update existing product with image
            await supabase
              .from('products')
              .update({ 
                primary_image_url: blob.pathname,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)
            
            productId = existing.id
          } else {
            // Create new product
            const { data: newProduct, error: productError } = await supabase
              .from('products')
              .insert({
                slug,
                name: displayName,
                category: dbCategory,
                display_type: 'single',
                primary_image_url: blob.pathname,
                is_active: true,
              })
              .select('id')
              .single()

            if (productError) {
              results.errors.push(`Product ${displayName}: ${productError.message}`)
              continue
            }

            productId = newProduct.id
            results.productsCreated++
          }

          // Check if variant exists
          const { data: existingVariant } = await supabase
            .from('product_variants')
            .select('id')
            .eq('product_id', productId)
            .single()

          if (!existingVariant) {
            // Create variant
            const { error: variantError } = await supabase
              .from('product_variants')
              .insert({
                product_id: productId,
                name: displayName,
                image_url: blob.pathname,
                stock_status: 'available',
                is_active: true,
              })

            if (variantError) {
              results.errors.push(`Variant ${displayName}: ${variantError.message}`)
            } else {
              results.variantsCreated++
            }
          }

        } catch (err) {
          results.errors.push(`${filename}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...results
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...results
    }, { status: 500 })
  }
}

export async function GET() {
  // List what's in Blob for preview
  const { blobs } = await list({ prefix: 'inventory/' })
  
  const byCategory: Record<string, string[]> = {}
  
  for (const blob of blobs) {
    const parts = blob.pathname.split('/')
    if (parts.length >= 3) {
      const category = parts[1]
      if (!byCategory[category]) {
        byCategory[category] = []
      }
      byCategory[category].push(parts[2])
    }
  }

  return NextResponse.json({
    totalImages: blobs.length,
    byCategory: Object.fromEntries(
      Object.entries(byCategory).map(([cat, files]) => [cat, files.length])
    ),
    preview: Object.fromEntries(
      Object.entries(byCategory).map(([cat, files]) => [cat, files.slice(0, 5)])
    )
  })
}
