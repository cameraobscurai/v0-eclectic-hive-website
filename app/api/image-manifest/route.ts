import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * IMAGE MANIFEST - Correct Matching Architecture
 * 
 * CORE PRINCIPLE: A missing image is acceptable. A wrong image is not.
 * 
 * CATEGORY-SPECIFIC MATCHING:
 * 
 * 1. FURNITURE (Seating, Tables, Bars, Lighting):
 *    Match on: category_folder + type_subfolder + item_root + item_type
 *    Example: "Brooklyn Plush Charcoal Sofa" → SEATING/SOFA/BROOKLYN Sofa 0.png
 *    item_root = BROOKLYN (furniture name)
 * 
 * 2. SOFT GOODS (Pillows, Throws, Rugs, Furs):
 *    Match on: full normalized filename stem = full normalized product descriptor
 *    Example: "Ivory Black Geo Pillow" → PILLOWS/Ivory Black Geo.png
 *    DO NOT use first-word matching (IVORY is a color, not an identifier)
 * 
 * 3. TABLEWARE (Flatware sets, Dinnerware, Glassware):
 *    Allow shared images for same family (Fiona fork, Fiona knife = one set image)
 *    Match on: family root + set image logic
 * 
 * 4. MODULAR SYSTEMS (Bar configurations, Plinths):
 *    Allow shared images for same product family in different configs
 * 
 * STATUSES:
 * - APPLY_SAFE: Unique 1:1 match with high confidence
 * - ALLOWED_SHARED_IMAGE: Explicit allowed sharing (flatware sets, configs)
 * - CONFLICT: Multiple unrelated products would share image (WRONG)
 * - MANUAL_REVIEW: Ambiguous, needs human decision
 * - UNMATCHED: No matching file found (acceptable)
 */

type MatchStatus = 'APPLY_SAFE' | 'ALLOWED_SHARED_IMAGE' | 'CONFLICT' | 'MANUAL_REVIEW' | 'UNMATCHED'

// Categories that use FULL STEM matching (soft goods - color/material driven)
const SOFT_GOODS_CATEGORIES = ['Pillows', 'Throws', 'Rugs', 'Furs & Pelts']

// Categories that use ROOT + TYPE matching (furniture)
const FURNITURE_CATEGORIES = ['Seating', 'Tables', 'Bars', 'Lighting', 'Chandeliers', 'Storage', 'Large Decor & Dividers']

// Type words to remove when normalizing product names for soft goods
const TYPE_WORDS = ['pillow', 'pillows', 'lumbar', 'throw', 'throws', 'rug', 'rugs', 'runner', 'pelt', 'hide', 'fur', 'cover']

// Category to storage folder mapping
const CATEGORY_TO_STORAGE: Record<string, string> = {
  'Bars': 'BARS',
  'Candlelight': 'CANDLELIGHT',
  'Chandeliers': 'LIGHTING',
  'Furs & Pelts': 'FURS + PELTS',
  'Large Decor & Dividers': 'LARGE DECOR',
  'Lighting': 'LIGHTING',
  'Pillows': 'PILLOWS',
  'Rugs': 'RUGS',
  'Seating': 'SEATING',
  'Serveware': 'SERVEWARE',
  'Storage': 'STORAGE',
  'Styling': 'STYLING',
  'Tables': 'TABLES',
  'Tableware': 'TABLEWARE',
  'Throws': 'THROWS',
}

// Allowed shared image families
const FLATWARE_FAMILIES = ['FIONA', 'ANASTASIA', 'QUINN', 'DONAVER', 'WINSLOW', 'ASTRID', 'ESTELLA', 'HESTON', 'ALTA', 'DEJA', 'MILLIE', 'ARIAN', 'MIDAS', 'NISHA', 'VIDAL']
const DINNERWARE_FAMILIES = ['AKOYA', 'BELISSA', 'BULAN', 'DOVER', 'EDEN', 'JAIN', 'LAPIS', 'TILLERY', 'MARINA', 'MIDORI', 'ALUMINA', 'TALIA', 'ALANI']
const GLASSWARE_FAMILIES = ['HONEY', 'SAGE', 'KIMORA', 'ALLIRA', 'ADONIS', 'CARLISLE', 'NARIN', 'THISTLE']
const MODULAR_FAMILIES = ['ARCUS', 'INOLA', 'MONROE', 'IRAJA', 'SINATRA', 'CHATTA', 'KINLEE', 'FARROW', 'BARTOLO', 'OXFORD', 'TOSHIA', 'NIMA', 'TABITHA']

interface FileRecord {
  full_path: string
  category_folder: string
  type_folder: string | null
  filename: string
  filename_stem: string // filename without .png
  normalized_stem: string // lowercase, no punctuation, collapsed spaces
  first_word: string // uppercase first word
}

interface ManifestEntry {
  product_id: string
  product_name: string
  website_category: string
  website_subcategory: string | null
  storage_category: string
  storage_subfolder: string | null
  matched_file_path: string | null
  matched_file_name: string | null
  match_method: string
  match_confidence: number
  duplicate_image_count: number
  shared_image_allowed: boolean
  status: MatchStatus
  unmatched_reason: string | null
  conflict_reason: string | null
}

// Normalize string: lowercase, remove punctuation, collapse spaces
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Normalize product name for soft goods: remove type words
function normalizeSoftGoodsProduct(name: string): string {
  let normalized = normalize(name)
  for (const typeWord of TYPE_WORDS) {
    normalized = normalized.replace(new RegExp(`\\b${typeWord}\\b`, 'gi'), '')
  }
  // Also remove trailing numbers (size indicators)
  normalized = normalized.replace(/\b\d+\b/g, '')
  return normalized.replace(/\s+/g, ' ').trim()
}

// Normalize filename stem: remove trailing numbers, remove image indicators
function normalizeFileStem(stem: string): string {
  let normalized = normalize(stem)
  // Remove trailing numbers like "0", "1", "2" or "01", "02"
  normalized = normalized.replace(/\s*\d+\s*$/, '')
  // Remove common suffixes
  normalized = normalized.replace(/\s*(small|large|med|set)\s*$/i, '')
  return normalized.trim()
}

// Check if family allows shared images
function isAllowedSharedFamily(itemRoot: string, category: string): { allowed: boolean; type: string } {
  const root = itemRoot.toUpperCase()
  
  if (category === 'Tableware') {
    if (FLATWARE_FAMILIES.includes(root)) return { allowed: true, type: 'flatware_set' }
    if (DINNERWARE_FAMILIES.includes(root)) return { allowed: true, type: 'dinnerware_collection' }
    if (GLASSWARE_FAMILIES.includes(root)) return { allowed: true, type: 'glassware_collection' }
  }
  
  if (category === 'Serveware' && GLASSWARE_FAMILIES.includes(root)) {
    return { allowed: true, type: 'glassware_collection' }
  }
  
  if (MODULAR_FAMILIES.includes(root)) {
    return { allowed: true, type: 'modular_configuration' }
  }
  
  return { allowed: false, type: 'none' }
}

// Build file records from storage
function buildFileRecords(files: { name: string }[]): FileRecord[] {
  return files.map(f => {
    const parts = f.name.split('/')
    const filename = parts[parts.length - 1]
    const stem = filename.replace(/\.png$/i, '')
    const firstWord = stem.split(' ')[0]?.toUpperCase() || ''
    
    return {
      full_path: f.name,
      category_folder: parts[0] || '',
      type_folder: parts.length > 2 ? parts.slice(1, -1).join('/') : null,
      filename,
      filename_stem: stem,
      normalized_stem: normalizeFileStem(stem),
      first_word: firstWord,
    }
  })
}

// SOFT GOODS MATCHING: Full normalized stem must match
function matchSoftGoods(
  productName: string,
  productCategory: string,
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string } {
  const storageCategory = CATEGORY_TO_STORAGE[productCategory]
  const candidates = files.filter(f => f.category_folder === storageCategory)
  
  if (candidates.length === 0) {
    return { file: null, confidence: 0, method: 'no_files_in_category' }
  }
  
  const normalizedProduct = normalizeSoftGoodsProduct(productName)
  const productTokens = normalizedProduct.split(' ').filter(t => t.length > 0)
  
  let bestFile: FileRecord | null = null
  let bestScore = 0
  let bestMethod = 'none'
  
  for (const file of candidates) {
    const fileTokens = file.normalized_stem.split(' ').filter(t => t.length > 0)
    
    // Exact match
    if (file.normalized_stem === normalizedProduct) {
      return { file, confidence: 1.0, method: 'exact_stem_match' }
    }
    
    // All file tokens must be in product tokens
    const allFileTokensInProduct = fileTokens.every(ft => productTokens.includes(ft))
    const allProductTokensInFile = productTokens.every(pt => fileTokens.includes(pt))
    
    if (allFileTokensInProduct && allProductTokensInFile) {
      // Bidirectional match - very high confidence
      if (0.95 > bestScore) {
        bestFile = file
        bestScore = 0.95
        bestMethod = 'bidirectional_token_match'
      }
    } else if (allFileTokensInProduct && fileTokens.length >= 2) {
      // All file tokens found in product (file is subset of product)
      const score = 0.7 + (fileTokens.length / productTokens.length) * 0.2
      if (score > bestScore) {
        bestFile = file
        bestScore = score
        bestMethod = 'file_tokens_in_product'
      }
    }
  }
  
  return { file: bestFile, confidence: bestScore, method: bestMethod }
}

// FURNITURE MATCHING: Root + Type within category subfolder
function matchFurniture(
  product: { name: string; category: string; item_root: string; item_type: string | null },
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string } {
  const storageCategory = CATEGORY_TO_STORAGE[product.category]
  const candidates = files.filter(f => f.category_folder === storageCategory)
  
  if (candidates.length === 0) {
    return { file: null, confidence: 0, method: 'no_files_in_category' }
  }
  
  const itemRoot = (product.item_root || '').toUpperCase()
  const itemType = (product.item_type || '').toUpperCase()
  
  if (!itemRoot) {
    return { file: null, confidence: 0, method: 'no_item_root' }
  }
  
  // Filter by root first
  const rootMatches = candidates.filter(f => f.first_word === itemRoot)
  
  if (rootMatches.length === 0) {
    return { file: null, confidence: 0, method: 'no_root_match' }
  }
  
  // If only one match, use it
  if (rootMatches.length === 1) {
    return { file: rootMatches[0], confidence: 0.9, method: 'unique_root_match' }
  }
  
  // Multiple files with same root - try to match by type
  if (itemType) {
    const typeKeywords: Record<string, string[]> = {
      'SOFA': ['sofa'],
      'LOVESEAT': ['loveseat', 'love'],
      'CHAIR': ['chair', 'lounge'],
      'BENCH': ['bench'],
      'OTTOMAN': ['ottoman', 'pouf'],
      'STOOL': ['stool', 'barstool'],
      'TABLE': ['table', 'coffee', 'cocktail', 'side', 'console', 'dining'],
      'LAMP': ['lamp', 'floor', 'table lamp'],
      'CHANDELIER': ['chandelier', 'pendant', 'hanging'],
      'BAR': ['bar'],
    }
    
    const keywords = typeKeywords[itemType] || []
    
    for (const file of rootMatches) {
      const stemLower = file.filename_stem.toLowerCase()
      for (const kw of keywords) {
        if (stemLower.includes(kw)) {
          return { file, confidence: 0.85, method: 'root_type_match' }
        }
      }
    }
  }
  
  // Fall back to first matching file, but lower confidence
  return { file: rootMatches[0], confidence: 0.6, method: 'root_only_multiple_files' }
}

// TABLEWARE/STYLING/SERVEWARE MATCHING: Hybrid approach
function matchTableware(
  product: { name: string; category: string; item_root: string; item_type: string | null },
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string } {
  const storageCategory = CATEGORY_TO_STORAGE[product.category]
  const candidates = files.filter(f => f.category_folder === storageCategory)
  
  if (candidates.length === 0) {
    return { file: null, confidence: 0, method: 'no_files_in_category' }
  }
  
  const itemRoot = (product.item_root || '').toUpperCase()
  
  // For known set families, match by root
  const { allowed } = isAllowedSharedFamily(itemRoot, product.category)
  if (allowed && itemRoot) {
    const rootMatches = candidates.filter(f => f.first_word === itemRoot)
    if (rootMatches.length > 0) {
      // Prefer "Set" image if available
      const setImage = rootMatches.find(f => /set/i.test(f.filename_stem))
      if (setImage) {
        return { file: setImage, confidence: 0.95, method: 'set_family_match' }
      }
      return { file: rootMatches[0], confidence: 0.9, method: 'family_root_match' }
    }
  }
  
  // Otherwise try full stem match
  const normalizedProduct = normalize(product.name)
  const productTokens = normalizedProduct.split(' ').filter(t => t.length > 0)
  
  for (const file of candidates) {
    const fileTokens = file.normalized_stem.split(' ').filter(t => t.length > 0)
    
    // Check bidirectional token match
    const allFileInProduct = fileTokens.every(ft => productTokens.includes(ft))
    const allProductInFile = productTokens.every(pt => fileTokens.includes(pt))
    
    if (allFileInProduct && allProductInFile) {
      return { file, confidence: 0.9, method: 'bidirectional_token_match' }
    }
  }
  
  // Root match as fallback
  if (itemRoot) {
    const rootMatches = candidates.filter(f => f.first_word === itemRoot)
    if (rootMatches.length === 1) {
      return { file: rootMatches[0], confidence: 0.7, method: 'unique_root_fallback' }
    }
  }
  
  return { file: null, confidence: 0, method: 'no_match' }
}

// PRIORITY 1: CSV filename match (source_image_filename from import)
function matchCsvFilename(
  csvFilename: string | null | undefined,
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string } {
  if (!csvFilename) {
    return { file: null, confidence: 0, method: 'no_csv_filename' }
  }
  
  // Normalize CSV filename
  const normalized = csvFilename.toLowerCase().replace(/\.png$/i, '').trim()
  
  // Exact filename match
  for (const file of files) {
    const fileNormalized = file.filename.toLowerCase().replace(/\.png$/i, '').trim()
    if (fileNormalized === normalized) {
      return { file, confidence: 1.0, method: 'csv_exact_match' }
    }
  }
  
  // Filename stem match (ignoring folder structure)
  for (const file of files) {
    const fileNormalized = file.filename_stem.toLowerCase().trim()
    if (fileNormalized === normalized) {
      return { file, confidence: 0.98, method: 'csv_stem_match' }
    }
  }
  
  return { file: null, confidence: 0, method: 'csv_no_match' }
}

// Main matching dispatcher
function findBestMatch(
  product: { id: string; name: string; category: string; item_root: string; item_type: string | null; csvFilename?: string | null },
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string } {
  
  // PRIORITY 1: CSV filename from original import
  if (product.csvFilename) {
    const csvMatch = matchCsvFilename(product.csvFilename, files)
    if (csvMatch.file) {
      return csvMatch
    }
  }
  
  // PRIORITY 2: Category-specific heuristic matching
  
  // SOFT GOODS: Use full stem matching
  if (SOFT_GOODS_CATEGORIES.includes(product.category)) {
    return matchSoftGoods(product.name, product.category, files)
  }
  
  // FURNITURE: Use root + type matching
  if (FURNITURE_CATEGORIES.includes(product.category)) {
    return matchFurniture(product, files)
  }
  
  // TABLEWARE/SERVEWARE/STYLING: Hybrid
  if (['Tableware', 'Serveware', 'Styling', 'Candlelight'].includes(product.category)) {
    return matchTableware(product, files)
  }
  
  // Fallback: try soft goods style matching
  return matchSoftGoods(product.name, product.category, files)
}

export async function GET() {
  const supabase = await createClient()
  
  // Fetch all active products with their variant source_image_filename
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select(`
      id, name, category, item_root, item_type,
      product_variants!product_variants_product_id_fkey (source_image_filename)
    `)
    .eq('is_active', true)
  
  if (prodError) {
    return NextResponse.json({ error: prodError.message }, { status: 500 })
  }
  
  // List all storage files recursively
  const allFiles: { name: string }[] = []
  const folders = Object.values(CATEGORY_TO_STORAGE)
  
  for (const folder of [...new Set(folders)]) {
    const { data: folderFiles } = await supabase.storage.from('inventory').list(folder, { limit: 1000 })
    if (folderFiles) {
      for (const item of folderFiles) {
        if (item.name.toLowerCase().endsWith('.png')) {
          allFiles.push({ name: `${folder}/${item.name}` })
        } else if (!item.name.includes('.')) {
          // Subfolder
          const { data: subFiles } = await supabase.storage.from('inventory').list(`${folder}/${item.name}`, { limit: 1000 })
          if (subFiles) {
            for (const subItem of subFiles) {
              if (subItem.name.toLowerCase().endsWith('.png')) {
                allFiles.push({ name: `${folder}/${item.name}/${subItem.name}` })
              } else if (!subItem.name.includes('.')) {
                const { data: subSubFiles } = await supabase.storage.from('inventory').list(`${folder}/${item.name}/${subItem.name}`, { limit: 1000 })
                if (subSubFiles) {
                  for (const subSubItem of subSubFiles) {
                    if (subSubItem.name.toLowerCase().endsWith('.png')) {
                      allFiles.push({ name: `${folder}/${item.name}/${subItem.name}/${subSubItem.name}` })
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  const fileRecords = buildFileRecords(allFiles)
  
  // First pass: find best match for each product
  const fileAssignments: Map<string, { productId: string; productName: string; category: string; itemRoot: string; confidence: number }[]> = new Map()
  const preliminaryMatches: { product: typeof products[0]; file: FileRecord | null; confidence: number; method: string }[] = []
  
  for (const product of products || []) {
    // Extract CSV filename from variant (if exists)
    const variants = (product as unknown as { product_variants?: { source_image_filename: string | null }[] }).product_variants
    const csvFilename = variants?.[0]?.source_image_filename || null
    
    const { file, confidence, method } = findBestMatch(
      { ...product, csvFilename },
      fileRecords
    )
    preliminaryMatches.push({ product, file, confidence, method })
    
    if (file) {
      const existing = fileAssignments.get(file.full_path) || []
      existing.push({
        productId: product.id,
        productName: product.name,
        category: product.category,
        itemRoot: product.item_root || '',
        confidence
      })
      fileAssignments.set(file.full_path, existing)
    }
  }
  
  // Second pass: determine status
  const manifest: ManifestEntry[] = []
  
  for (const { product, file, confidence, method } of preliminaryMatches) {
    const storageCategory = CATEGORY_TO_STORAGE[product.category] || ''
    let status: MatchStatus
    let conflictReason: string | null = null
    let unmatchedReason: string | null = null
    let sharedAllowed = false
    let duplicateCount = 0
    
    if (!file) {
      status = 'UNMATCHED'
      unmatchedReason = method
    } else {
      const assignments = fileAssignments.get(file.full_path) || []
      duplicateCount = assignments.length
      
      if (duplicateCount === 1) {
        // Unique match
        status = confidence >= 0.75 ? 'APPLY_SAFE' : 'MANUAL_REVIEW'
        if (status === 'MANUAL_REVIEW') {
          conflictReason = `Low confidence (${Math.round(confidence * 100)}%)`
        }
      } else {
        // Multiple products matched
        const { allowed, type } = isAllowedSharedFamily(product.item_root || '', product.category)
        
        if (allowed) {
          sharedAllowed = true
          status = 'ALLOWED_SHARED_IMAGE'
        } else {
          const categories = [...new Set(assignments.map(a => a.category))]
          
          if (categories.length > 1) {
            status = 'CONFLICT'
            conflictReason = `CROSS-CATEGORY ERROR: ${categories.join(' vs ')}`
          } else {
            const roots = [...new Set(assignments.map(a => a.itemRoot))]
            
            if (roots.length === 1 && roots[0]) {
              // Same root, might be variants
              status = 'MANUAL_REVIEW'
              conflictReason = `${duplicateCount} products with root "${roots[0]}" share this image`
            } else {
              status = 'CONFLICT'
              conflictReason = `${duplicateCount} unrelated products: ${assignments.slice(0, 3).map(a => a.productName).join(', ')}${duplicateCount > 3 ? '...' : ''}`
            }
          }
        }
      }
    }
    
    manifest.push({
      product_id: product.id,
      product_name: product.name,
      website_category: product.category,
      website_subcategory: product.item_type || null,
      storage_category: storageCategory,
      storage_subfolder: file?.type_folder || null,
      matched_file_path: file?.full_path || null,
      matched_file_name: file?.filename || null,
      match_method: method,
      match_confidence: Math.round(confidence * 100) / 100,
      duplicate_image_count: duplicateCount,
      shared_image_allowed: sharedAllowed,
      status,
      unmatched_reason: unmatchedReason,
      conflict_reason: conflictReason,
    })
  }
  
  const summary = {
    total_products: manifest.length,
    apply_safe: manifest.filter(m => m.status === 'APPLY_SAFE').length,
    allowed_shared: manifest.filter(m => m.status === 'ALLOWED_SHARED_IMAGE').length,
    conflict: manifest.filter(m => m.status === 'CONFLICT').length,
    manual_review: manifest.filter(m => m.status === 'MANUAL_REVIEW').length,
    unmatched: manifest.filter(m => m.status === 'UNMATCHED').length,
  }
  
  // Sort: CONFLICT first, then MANUAL_REVIEW, then UNMATCHED, then safe
  const order: Record<MatchStatus, number> = { CONFLICT: 0, MANUAL_REVIEW: 1, UNMATCHED: 2, ALLOWED_SHARED_IMAGE: 3, APPLY_SAFE: 4 }
  manifest.sort((a, b) => order[a.status] - order[b.status] || a.website_category.localeCompare(b.website_category))
  
  return NextResponse.json({ summary, manifest })
}

export async function POST() {
  return NextResponse.json({ error: 'POST disabled until manifest is reviewed and approved' }, { status: 403 })
}
