import { NextRequest, NextResponse } from 'next/server'
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
  'lounge seating': '68 SEATING',
  'serveware': '68 SERVEWARE',
  'storage': '68 STORAGE',
  'styling': '68 STYLING',
  'tables': '68 TABLES',
  'tableware': '68 TABLEWARE',
  'throws': '68 THROWS',
}

// Known product renames - map current product name prefix to old filename prefix
const RENAMED_PRODUCTS: Record<string, string> = {
  'MONROE': 'ASTAIRE',
  'SINATRA': 'ASTAIRE',
  'MILLICENT': 'MARTHA',
  'ISAAC': 'KAINO',
  'NAMIAH': 'DEZMELDA',
}

// Known generic filenames that need manual assignment
const GENERIC_FILENAMES = ['CANOPY', 'MEDIUM', 'SMALL', 'LARGE', 'LORG', 'UNTITLED']

function getFirstWord(name: string): string {
  return name.split(/[\s\-_]/)[0].toUpperCase()
}

function normalizeFileName(name: string): string {
  return name
    .toUpperCase()
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/[_\-\s]+/g, ' ')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim()
}

function findBestMatch(
  productName: string,
  categoryFiles: { name: string; folder: string }[]
): { file: typeof categoryFiles[0]; score: number; matchType: string } | null {
  const productFirstWord = getFirstWord(productName)
  const productWords = productName.toUpperCase().split(/[\s\-_]/).filter(w => w.length > 2)
  
  // Check for renamed products first
  const renamedPrefix = RENAMED_PRODUCTS[productFirstWord]
  const searchPrefixes = renamedPrefix ? [productFirstWord, renamedPrefix] : [productFirstWord]
  
  let bestMatch: { file: typeof categoryFiles[0]; score: number; matchType: string } | null = null

  for (const file of categoryFiles) {
    const fileNameNorm = normalizeFileName(file.name)
    const fileFirstWord = fileNameNorm.split(' ')[0]
    const fileWords = fileNameNorm.split(' ').filter(w => w.length > 2)
    
    // Skip generic filenames unless exact match
    if (GENERIC_FILENAMES.includes(fileFirstWord) && fileFirstWord !== productFirstWord) {
      continue
    }

    // Strategy 1: Exact first word match (highest confidence)
    for (const prefix of searchPrefixes) {
      if (fileFirstWord === prefix || fileNameNorm.startsWith(prefix + ' ')) {
        const wordOverlap = productWords.filter(w => fileWords.includes(w)).length
        const score = 0.8 + (wordOverlap / Math.max(productWords.length, 1)) * 0.2
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { file, score, matchType: prefix === renamedPrefix ? 'renamed' : 'exact-prefix' }
        }
      }
    }

    // Strategy 2: First word appears in filename
    if (!bestMatch || bestMatch.score < 0.7) {
      for (const prefix of searchPrefixes) {
        if (fileNameNorm.includes(prefix)) {
          const wordOverlap = productWords.filter(w => fileWords.includes(w)).length
          const score = 0.5 + (wordOverlap / Math.max(productWords.length, 1)) * 0.3
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = { file, score, matchType: 'contains-prefix' }
          }
        }
      }
    }

    // Strategy 3: Multiple word match (at least 2 words must match)
    if (!bestMatch || bestMatch.score < 0.5) {
      const matchedWords = productWords.filter(w => fileWords.includes(w))
      if (matchedWords.length >= 2) {
        const score = 0.3 + (matchedWords.length / Math.max(productWords.length, 1)) * 0.4
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { file, score, matchType: 'word-overlap' }
        }
      }
    }
  }

  // Only return if confidence is high enough
  return bestMatch && bestMatch.score >= 0.5 ? bestMatch : null
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Get duplicate image URLs for audit
  const { data: products } = await supabase
    .from('products')
    .select('id, name, category, primary_image_url')
    .eq('is_active', true)
    .not('primary_image_url', 'is', null)
  
  const urlCounts: Record<string, { count: number; products: string[] }> = {}
  for (const p of products || []) {
    if (p.primary_image_url) {
      if (!urlCounts[p.primary_image_url]) {
        urlCounts[p.primary_image_url] = { count: 0, products: [] }
      }
      urlCounts[p.primary_image_url].count++
      urlCounts[p.primary_image_url].products.push(p.name)
    }
  }
  
  const duplicates = Object.entries(urlCounts)
    .filter(([_, v]) => v.count > 1)
    .map(([url, v]) => ({ 
      url: url.split('/').pop(), 
      count: v.count, 
      products: v.products 
    }))
    .sort((a, b) => b.count - a.count)

  const missingUrls = (products || []).filter(p => !p.primary_image_url).length

  return NextResponse.json({ 
    message: 'POST to fix URLs, or POST with ?preview=true to preview',
    stats: {
      totalProducts: products?.length || 0,
      uniqueUrls: Object.keys(urlCounts).length,
      duplicateUrls: duplicates.length,
      productsWithDuplicateUrls: duplicates.reduce((sum, d) => sum + d.count, 0),
      missingUrls,
    },
    duplicates: duplicates.slice(0, 25),
    renamedProducts: RENAMED_PRODUCTS,
    categories: Object.keys(CATEGORY_FOLDERS),
  })
}

export async function POST(request: NextRequest) {
  const preview = request.nextUrl.searchParams.get('preview') === 'true'
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const results = {
    matched: 0,
    unmatched: 0,
    skipped: 0,
    errors: [] as string[],
    matches: [] as { product: string; file: string; score: number; matchType: string; oldUrl?: string }[],
    unmatched_products: [] as { name: string; category: string; firstWord: string }[],
  }

  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category, primary_image_url')
      .eq('is_active', true)
    
    if (productsError) throw productsError
    
    // Get all files from storage
    const allFiles: { name: string; folder: string }[] = []
    const uniqueFolders = [...new Set(Object.values(CATEGORY_FOLDERS))]
    
    for (const folder of uniqueFolders) {
      const { data: files, error: listError } = await supabase
        .storage
        .from('inventory')
        .list(folder, { limit: 1000 })
      
      if (listError) {
        results.errors.push(`Error listing ${folder}: ${listError.message}`)
        continue
      }
      
      if (files) {
        for (const file of files) {
          if (file.name && !file.name.startsWith('.') && 
              (file.name.endsWith('.png') || file.name.endsWith('.PNG') || file.name.endsWith('.jpg'))) {
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
        results.skipped++
        continue
      }
      
      const categoryFiles = allFiles.filter(f => f.folder === folder)
      const match = findBestMatch(product.name, categoryFiles)
      
      if (match) {
        // Encode path segments individually to preserve slashes
        const encodedPath = `${encodeURIComponent(match.file.folder)}/${encodeURIComponent(match.file.name)}`
        const newUrl = `${supabaseUrl}/storage/v1/object/public/inventory/${encodedPath}`
        
        // Skip if already correct
        if (product.primary_image_url === newUrl) {
          results.skipped++
          continue
        }
        
        if (!preview) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ primary_image_url: newUrl })
            .eq('id', product.id)
          
          if (updateError) {
            results.errors.push(`Error updating ${product.name}: ${updateError.message}`)
            continue
          }
        }
        
        results.matched++
        results.matches.push({
          product: product.name,
          file: `${match.file.folder}/${match.file.name}`,
          score: Math.round(match.score * 100),
          matchType: match.matchType,
          oldUrl: product.primary_image_url?.split('/').pop()
        })
      } else {
        results.unmatched++
        results.unmatched_products.push({
          name: product.name,
          category: product.category,
          firstWord: getFirstWord(product.name)
        })
      }
    }

    return NextResponse.json({
      success: true,
      preview,
      summary: {
        matched: results.matched,
        unmatched: results.unmatched,
        skipped: results.skipped,
        totalProducts: products?.length || 0,
        totalFiles: allFiles.length,
      },
      sampleMatches: results.matches.slice(0, 30),
      unmatchedProducts: results.unmatched_products.slice(0, 30),
      errors: results.errors.slice(0, 10),
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
