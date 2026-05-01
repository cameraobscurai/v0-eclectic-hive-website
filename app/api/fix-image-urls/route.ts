import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Category folder mapping
const CATEGORY_FOLDERS: Record<string, string> = {
  'bars': '68 BARS',
  'candlelight': '68 CANDELIGHT',
  'furs-and-pelts': '68 FURS  + PELTS',
  'furs & pelts': '68 FURS  + PELTS',
  'large decor': '68 LARGE DECOR',
  'large decor & dividers': '68 LARGE DECOR',
  'lighting': '68 LIGHTING',
  'chandeliers': '68 LIGHTING',
  'pillows': '68 PILLOWS',
  'rugs': '68 RUGS',
  'seating': '68 SEATING',
  'serveware': '68 SERVEWARE',
  'storage': '68 STORAGE',
  'styling': '68 STYLING',
  'tables': '68 TABLES',
  'tableware': '68 TABLEWARE',
  'throws': '68 THROWS',
}

// Normalize a name for matching (remove special chars, lowercase)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[_\-\s]+/g, ' ')  // Replace underscores, hyphens, spaces with single space
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ')        // Collapse spaces
    .trim()
}

// Calculate similarity between two strings
function similarity(a: string, b: string): number {
  const aNorm = normalizeName(a)
  const bNorm = normalizeName(b)
  
  if (aNorm === bNorm) return 1
  
  // Check if one contains the other
  if (aNorm.includes(bNorm) || bNorm.includes(aNorm)) {
    const shorter = Math.min(aNorm.length, bNorm.length)
    const longer = Math.max(aNorm.length, bNorm.length)
    return shorter / longer
  }
  
  // Word overlap
  const aWords = new Set(aNorm.split(' ').filter(w => w.length > 1))
  const bWords = new Set(bNorm.split(' ').filter(w => w.length > 1))
  
  let matches = 0
  for (const word of aWords) {
    if (bWords.has(word)) matches++
  }
  
  const total = Math.max(aWords.size, bWords.size)
  return total > 0 ? matches / total : 0
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST to this endpoint to fix image URLs',
    categories: Object.keys(CATEGORY_FOLDERS)
  })
}

export async function POST() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const results = {
    matched: 0,
    unmatched: 0,
    errors: [] as string[],
    matches: [] as { product: string, file: string, score: number }[],
  }

  try {
    // Get all products that need images fixed
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category, primary_image_url')
      .eq('is_active', true)
    
    if (productsError) throw productsError
    
    // Get all files from storage
    const allFiles: { name: string, folder: string }[] = []
    
    for (const [category, folder] of Object.entries(CATEGORY_FOLDERS)) {
      const { data: files, error: listError } = await supabase
        .storage
        .from('inventory')
        .list(folder, { limit: 500 })
      
      if (listError) {
        results.errors.push(`Error listing ${folder}: ${listError.message}`)
        continue
      }
      
      if (files) {
        for (const file of files) {
          if (file.name && !file.name.startsWith('.')) {
            allFiles.push({ name: file.name, folder })
          }
        }
      }
    }
    
    // Match products to files
    for (const product of products || []) {
      const category = product.category?.toLowerCase() || ''
      const folder = CATEGORY_FOLDERS[category]
      
      if (!folder) {
        results.unmatched++
        continue
      }
      
      // Get files in this category folder
      const categoryFiles = allFiles.filter(f => f.folder === folder)
      
      // Find best match
      let bestMatch: { file: typeof categoryFiles[0], score: number } | null = null
      
      for (const file of categoryFiles) {
        const fileNameWithoutExt = file.name.replace(/\.[^.]+$/, '')
        const score = similarity(product.name, fileNameWithoutExt)
        
        if (score > (bestMatch?.score || 0.3)) { // Minimum 30% match
          bestMatch = { file, score }
        }
      }
      
      if (bestMatch) {
        const newUrl = `${supabaseUrl}/storage/v1/object/public/inventory/${encodeURIComponent(bestMatch.file.folder)}/${encodeURIComponent(bestMatch.file.name)}`
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ primary_image_url: newUrl })
          .eq('id', product.id)
        
        if (updateError) {
          results.errors.push(`Error updating ${product.name}: ${updateError.message}`)
        } else {
          results.matched++
          results.matches.push({
            product: product.name,
            file: `${bestMatch.file.folder}/${bestMatch.file.name}`,
            score: Math.round(bestMatch.score * 100),
          })
        }
      } else {
        results.unmatched++
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        matched: results.matched,
        unmatched: results.unmatched,
        totalProducts: products?.length || 0,
        totalFiles: allFiles.length,
      },
      sampleMatches: results.matches.slice(0, 20),
      errors: results.errors.slice(0, 10),
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
