import { type NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txmgpxvbtljfgswizhoz.supabase.co'

// Category folder mapping - EXACT folder names from Supabase storage
// Note: Some folders have typos (CANDELIGHT) or double spaces (FURS  + PELTS)
const CATEGORY_FOLDERS: Record<string, string> = {
  // Bars
  'bars': '68 BARS',
  'cocktail & bar': '68 BARS',
  'cocktail and bar': '68 BARS',
  // Seating
  'seating': '68 SEATING',
  'lounge seating': '68 SEATING',
  // Tables
  'tables': '68 TABLES',
  // Lighting
  'lighting': '68 LIGHTING',
  'chandeliers': '68 LIGHTING',
  // Pillows
  'pillows': '68 PILLOWS',
  // Rugs
  'rugs': '68 RUGS',
  // Styling
  'styling': '68 STYLING',
  // Storage
  'storage': '68 STORAGE',
  // Candlelight (folder has typo - missing L)
  'candlelight': '68 CANDELIGHT',
  // Serveware
  'serveware': '68 SERVEWARE',
  // Tableware
  'tableware': '68 TABLEWARE',
  // Throws
  'throws': '68 THROWS',
  // Large Decor
  'large decor': '68 LARGE DECOR',
  'large-decor': '68 LARGE DECOR',
  'large decor & dividers': '68 LARGE DECOR',
  // Furs & Pelts (folder has double space before +)
  'furs & pelts': '68 FURS  + PELTS',
  'furs-and-pelts': '68 FURS  + PELTS',
  'furs + pelts': '68 FURS  + PELTS',
  'furs and pelts': '68 FURS  + PELTS',
}

// Normalize a string for fuzzy comparison
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp)$/i, '') // strip extension
    .replace(/[-_]/g, ' ')                   // normalize separators
    .replace(/\s+/g, ' ')                    // collapse whitespace
    .replace(/\s*\d+$/, '')                  // strip trailing numbers (variant suffix)
    .replace(/\s*\(\d+\)$/, '')              // strip (2) etc
    .trim()
}

// Score how well a filename matches a product name (0-100)
function matchScore(productName: string, filename: string): number {
  const normProduct = normalize(productName)
  const normFile = normalize(filename)

  if (normFile === normProduct) return 100
  if (normFile.startsWith(normProduct)) return 90
  if (normProduct.startsWith(normFile)) return 85
  if (normFile.includes(normProduct)) return 70
  if (normProduct.includes(normFile)) return 65

  // Word overlap score
  const productWords = normProduct.split(' ')
  const fileWords = normFile.split(' ')
  const overlap = productWords.filter(w => fileWords.includes(w) && w.length > 2).length
  const score = Math.round((overlap / Math.max(productWords.length, fileWords.length)) * 60)
  return score
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()

  // 1. Get all products missing images (or all if dryRun=false and force=true)
  const { searchParams } = request.nextUrl
  const dryRun = searchParams.get('dryRun') !== 'false'
  const category = searchParams.get('category') // optional: process one category

  let productsQuery = supabase
    .from('products')
    .select('id, name, category, primary_image_url')
    .eq('is_active', true)

  if (category) {
    productsQuery = productsQuery.ilike('category', category)
  }
  // Process ALL products - existing URLs are wrong and need to be remapped

  const { data: products, error: productsError } = await productsQuery

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 })
  }

  const results: Array<{
    product: string
    category: string
    matched: string | null
    score: number
    updated: boolean
  }> = []

  let updated = 0
  let unmatched = 0

  // 2. For each category, list files once and match
  const categoriesNeeded = [...new Set(products?.map(p => p.category.toLowerCase()) || [])]

  const filesByCategory: Record<string, string[]> = {}

  for (const cat of categoriesNeeded) {
    const folder = CATEGORY_FOLDERS[cat]
    if (!folder) continue

    const { data: files } = await supabase.storage
      .from('inventory')
      .list(folder, { limit: 1000 })

    filesByCategory[cat] = files?.map(f => f.name) || []
  }

  // 3. Match each product to a file
  for (const product of products || []) {
    const cat = product.category.toLowerCase()
    const folder = CATEGORY_FOLDERS[cat]
    const files = filesByCategory[cat] || []

    if (!folder || files.length === 0) {
      results.push({ product: product.name, category: product.category, matched: null, score: 0, updated: false })
      unmatched++
      continue
    }

    // Score all files and pick best match
    let bestFile: string | null = null
    let bestScore = 0

    for (const filename of files) {
      const score = matchScore(product.name, filename)
      if (score > bestScore) {
        bestScore = score
        bestFile = filename
      }
    }

    const MATCH_THRESHOLD = 60
    const matched = bestScore >= MATCH_THRESHOLD ? bestFile : null

    if (matched && !dryRun) {
      // Store full Supabase URL with proper encoding for spaces
      const encodedPath = `${folder}/${matched}`.split('/').map(encodeURIComponent).join('/')
      const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/inventory/${encodedPath}`
      await supabase
        .from('products')
        .update({ primary_image_url: fullUrl })
        .eq('id', product.id)
      updated++
    }

    if (!matched) unmatched++

    const encodedPath = matched ? `${folder}/${matched}`.split('/').map(encodeURIComponent).join('/') : null
    results.push({
      product: product.name,
      category: product.category,
      matched: matched ? `${SUPABASE_URL}/storage/v1/object/public/inventory/${encodedPath}` : null,
      score: bestScore,
      updated: !dryRun && !!matched,
    })
  }

  return NextResponse.json({
    dryRun,
    totalProducts: products?.length || 0,
    updated,
    unmatched,
    results: results.sort((a, b) => a.score - b.score), // worst matches first
  })
}
