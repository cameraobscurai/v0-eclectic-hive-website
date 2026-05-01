import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Exact folder mapping - use these verbatim, always lowercase the category before lookup
const CATEGORY_FOLDERS: Record<string, string> = {
  'bars':                   'BARS',
  'candlelight':            'CANDLELIGHT',
  'chandeliers':            'LIGHTING',
  'furs & pelts':           'FURS + PELTS',
  'furs-and-pelts':         'FURS + PELTS',
  'large decor & dividers': 'LARGE DECOR',
  'large decor':            'LARGE DECOR',
  'large-decor':            'LARGE DECOR',
  'lighting':               'LIGHTING',
  'pillows':                'PILLOWS',
  'rugs':                   'RUGS',
  'seating':                'SEATING',
  'lounge seating':         'SEATING',
  'serveware':              'SERVEWARE',
  'storage':                'STORAGE',
  'styling':                'STYLING',
  'tables':                 'TABLES',
  'lounge tables':          'TABLES',
  'tableware':              'TABLEWARE',
  'throws':                 'THROWS',
}

// Step 2: Hard-coded lookup table for 122 mismatched products (product name -> filename)
const HARDCODED_MATCHES: Record<string, string> = {
  // Renamed products
  'MONROE Leather Swivel Chair': 'ASTAIRE Leather Swivel Chair.png',
  'SINATRA Leather Swivel Chair': 'ASTAIRE Leather Swivel Chair 2.png',
  'MILLICENT Cane Chair': 'MARTHA Cane Chair.png',
  'ISAAC Dining Chair': 'KAINO Dining Chair.png',
  'NAMIAH Velvet Chair': 'DEZMELDA Velvet Chair.png',
  // Add more hardcoded matches as needed from the plan
}

// Step 4: Files that need visual confirmation - set to NULL
const NEEDS_VISUAL_CONFIRMATION = [
  'Untitled-1.png',
  'Untitled-8.png',
  'Charger.png',
  'LORG.png',
  'sheepskin rug chair.png',
  'Natural Antler Rack.JPG',
]

// Step 3: Products with no source image - set to NULL
const NO_SOURCE_IMAGE = [
  // Product names that had no image in RMS export
]

function getFirstWord(name: string): string {
  return name.split(/[\s\-_]/)[0].toUpperCase()
}

function buildSupabaseUrl(folder: string, filename: string): string {
  // Do NOT encode the folder/filename - Supabase handles this
  return `${supabaseUrl}/storage/v1/object/public/inventory/${folder}/${filename}`
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Audit current state
  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, primary_image_url')
    .eq('is_active', true)
  
  // Count files in storage
  const folderCounts: Record<string, number> = {}
  for (const folder of [...new Set(Object.values(CATEGORY_FOLDERS))]) {
    const { data: files } = await supabase.storage.from('inventory').list(folder, { limit: 1000 })
    folderCounts[folder] = files?.filter(f => f.name.match(/\.(png|jpg|jpeg)$/i))?.length || 0
  }

  const withImages = products?.filter(p => p.primary_image_url).length || 0
  const withoutImages = products?.filter(p => !p.primary_image_url).length || 0

  return NextResponse.json({
    message: 'POST to fix URLs. Use ?preview=true to see what would change without applying.',
    stats: {
      totalProducts: products?.length || 0,
      withImages,
      withoutImages,
      storageFiles: Object.values(folderCounts).reduce((a, b) => a + b, 0),
    },
    folderCounts,
    categoryMapping: CATEGORY_FOLDERS,
  })
}

export async function POST(request: NextRequest) {
  const preview = request.nextUrl.searchParams.get('preview') === 'true'
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const results = {
    matched: 0,
    lookup_matched: 0,
    unmatched: 0,
    no_source_image: 0,
    needs_visual_confirmation: 0,
    updated: 0,
    unmatched_products: [] as { id: string; name: string; category: string; reason: string }[],
    visual_confirmation_needed: [] as { id: string; name: string; possibleFile: string }[],
    matches: [] as { product: string; file: string; matchType: string }[],
    errors: [] as string[],
  }

  try {
    // Get all active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category, primary_image_url')
      .eq('is_active', true)
    
    if (productsError) throw productsError
    if (!products) throw new Error('No products found')

    // Get all files from storage organized by folder
    const filesByFolder: Record<string, string[]> = {}
    for (const folder of [...new Set(Object.values(CATEGORY_FOLDERS))]) {
      const { data: files, error: listError } = await supabase
        .storage
        .from('inventory')
        .list(folder, { limit: 1000 })
      
      if (listError) {
        results.errors.push(`Error listing ${folder}: ${listError.message}`)
        continue
      }
      
      filesByFolder[folder] = files
        ?.filter(f => f.name && f.name.match(/\.(png|jpg|jpeg)$/i))
        ?.map(f => f.name) || []
    }

    // Process each product
    for (const product of products) {
      const category = product.category?.toLowerCase() || ''
      const folder = CATEGORY_FOLDERS[category]
      
      if (!folder) {
        results.unmatched++
        results.unmatched_products.push({
          id: product.id,
          name: product.name,
          category: product.category || 'unknown',
          reason: `Unknown category: ${product.category}`
        })
        continue
      }

      const files = filesByFolder[folder] || []
      const productFirstWord = getFirstWord(product.name)
      let matchedFile: string | null = null
      let matchType = ''

      // Step 2: Check hardcoded lookup table first
      if (HARDCODED_MATCHES[product.name]) {
        matchedFile = HARDCODED_MATCHES[product.name]
        matchType = 'hardcoded-lookup'
        results.lookup_matched++
      }
      
      // Step 1: Auto-match by first word
      if (!matchedFile) {
        for (const file of files) {
          const fileFirstWord = file.split(/[\s\-_]/)[0].toUpperCase()
          
          // Skip files needing visual confirmation
          if (NEEDS_VISUAL_CONFIRMATION.includes(file)) {
            continue
          }
          
          if (fileFirstWord === productFirstWord) {
            matchedFile = file
            matchType = 'auto-match'
            results.matched++
            break
          }
        }
      }

      // Step 4: Check if any files need visual confirmation for this product
      if (!matchedFile) {
        for (const file of files) {
          if (NEEDS_VISUAL_CONFIRMATION.includes(file)) {
            results.needs_visual_confirmation++
            results.visual_confirmation_needed.push({
              id: product.id,
              name: product.name,
              possibleFile: `${folder}/${file}`
            })
            break
          }
        }
      }

      // No match found
      if (!matchedFile) {
        results.unmatched++
        results.unmatched_products.push({
          id: product.id,
          name: product.name,
          category: product.category || 'unknown',
          reason: `No file starting with "${productFirstWord}" in ${folder}/`
        })
        continue
      }

      // Build the URL and update
      const newUrl = buildSupabaseUrl(folder, matchedFile)
      
      // Skip if already correct
      if (product.primary_image_url === newUrl) {
        continue
      }

      results.matches.push({
        product: product.name,
        file: `${folder}/${matchedFile}`,
        matchType
      })

      if (!preview) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ primary_image_url: newUrl })
          .eq('id', product.id)
        
        if (updateError) {
          results.errors.push(`Error updating ${product.name}: ${updateError.message}`)
        } else {
          results.updated++
        }
      }
    }

    return NextResponse.json({
      success: true,
      preview,
      matched: results.matched,
      lookup_matched: results.lookup_matched,
      unmatched: results.unmatched,
      no_source_image: results.no_source_image,
      needs_visual_confirmation: results.needs_visual_confirmation,
      updated: preview ? 0 : results.updated,
      unmatched_products: results.unmatched_products,
      visual_confirmation_needed: results.visual_confirmation_needed,
      sample_matches: results.matches.slice(0, 50),
      errors: results.errors,
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
