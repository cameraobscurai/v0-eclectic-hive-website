import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Status enum
type MatchStatus = 'APPLY_SAFE' | 'ALLOWED_SHARED_IMAGE' | 'CONFLICT' | 'MANUAL_REVIEW' | 'UNMATCHED'

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

// Known flatware families that can share set images
const FLATWARE_FAMILIES = [
  'FIONA', 'ANASTASIA', 'QUINN', 'DONAVER', 'WINSLOW', 'ASTRID', 'ESTELLA',
  'HESTON', 'ALTA', 'DEJA', 'MILLIE', 'ARIAN', 'MIDAS', 'NISHA', 'VIDAL'
]

// Known dinnerware families that can share pattern images
const DINNERWARE_FAMILIES = [
  'AKOYA', 'BELISSA', 'BULAN', 'DOVER', 'EDEN', 'JAIN', 'LAPIS', 'TILLERY',
  'MARINA', 'MIDORI', 'ALUMINA', 'TALIA', 'ALANI'
]

// Known glassware families
const GLASSWARE_FAMILIES = [
  'HONEY', 'SAGE', 'KIMORA', 'ALLIRA', 'ADONIS', 'CARLISLE', 'NARIN', 'THISTLE'
]

// Umbrella/variant families that can share one image
const VARIANT_FAMILIES = ['CHATTA']

interface FileRecord {
  full_path: string
  category_folder: string
  type_folder: string | null
  filename: string
  filename_stem: string
  filename_tokens: string[]
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

// Tokenize a string: lowercase, remove punctuation, split on spaces
function tokenize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0)
}

// Check if a family is allowed to share images
function isAllowedSharedFamily(itemRoot: string, category: string): { allowed: boolean; type: string } {
  const root = itemRoot.toUpperCase()
  
  if (category === 'Tableware') {
    if (FLATWARE_FAMILIES.includes(root)) return { allowed: true, type: 'flatware_set' }
    if (DINNERWARE_FAMILIES.includes(root)) return { allowed: true, type: 'dinnerware_collection' }
    if (GLASSWARE_FAMILIES.includes(root)) return { allowed: true, type: 'glassware_collection' }
  }
  
  if (category === 'Serveware') {
    if (GLASSWARE_FAMILIES.includes(root)) return { allowed: true, type: 'glassware_collection' }
  }
  
  if (VARIANT_FAMILIES.includes(root)) return { allowed: true, type: 'variant_family' }
  
  return { allowed: false, type: 'none' }
}

// Build file records from storage paths
function buildFileRecords(files: { name: string }[]): FileRecord[] {
  return files.map(f => {
    const parts = f.name.split('/')
    const filename = parts[parts.length - 1]
    const stem = filename.replace(/\.png$/i, '')
    
    return {
      full_path: f.name,
      category_folder: parts[0] || '',
      type_folder: parts.length > 2 ? parts[1] : null,
      filename,
      filename_stem: stem,
      filename_tokens: tokenize(stem),
    }
  })
}

// Calculate token overlap score
function tokenOverlapScore(productTokens: string[], fileTokens: string[]): number {
  if (fileTokens.length === 0 || productTokens.length === 0) return 0
  const fileSet = new Set(fileTokens)
  const matches = productTokens.filter(t => fileSet.has(t)).length
  // Require matching both ways
  const productSet = new Set(productTokens)
  const reverseMatches = fileTokens.filter(t => productSet.has(t)).length
  return Math.min(matches / Math.max(productTokens.length, 1), reverseMatches / Math.max(fileTokens.length, 1))
}

// Find best match for a product with STRICT rules
function findBestMatch(
  product: { id: string; name: string; category: string; item_root: string; item_type: string | null },
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string } {
  const storageCategory = CATEGORY_TO_STORAGE[product.category] || ''
  const productTokens = tokenize(product.name)
  const itemRoot = (product.item_root || '').toUpperCase()
  
  // Filter to only files in the correct category folder FIRST
  // This prevents cross-category matches (the Fringe Throw -> Fringe Lampshade bug)
  const candidates = files.filter(f => f.category_folder === storageCategory)
  
  if (candidates.length === 0) {
    return { file: null, confidence: 0, method: 'no_files_in_category' }
  }
  
  let bestFile: FileRecord | null = null
  let bestConfidence = 0
  let bestMethod = 'none'
  
  for (const file of candidates) {
    const fileRoot = (file.filename_tokens[0] || '').toUpperCase()
    
    // Strategy 1: Full token match (high confidence)
    const overlap = tokenOverlapScore(productTokens, file.filename_tokens)
    if (overlap >= 0.85) {
      if (overlap > bestConfidence) {
        bestFile = file
        bestConfidence = overlap
        bestMethod = 'full_token_match'
      }
      continue
    }
    
    // Strategy 2: Root + type match for furniture
    if (itemRoot && fileRoot === itemRoot) {
      // Check if item types also match
      const productType = product.item_type?.toUpperCase()
      const fileHasType = file.filename_stem.toLowerCase()
      
      let typeMatch = false
      if (productType === 'SOFA' && /sofa/i.test(fileHasType)) typeMatch = true
      else if (productType === 'CHAIR' && /chair/i.test(fileHasType)) typeMatch = true
      else if (productType === 'TABLE' && /table/i.test(fileHasType)) typeMatch = true
      else if (productType === 'BENCH' && /bench/i.test(fileHasType)) typeMatch = true
      else if (productType === 'OTTOMAN' && /ottoman/i.test(fileHasType)) typeMatch = true
      else if (productType === 'LAMP' && /lamp/i.test(fileHasType)) typeMatch = true
      else if (productType === 'BAR' && /bar/i.test(fileHasType)) typeMatch = true
      else if (!productType) typeMatch = true // No type required
      
      if (typeMatch) {
        const conf = 0.80 + (overlap * 0.15)
        if (conf > bestConfidence) {
          bestFile = file
          bestConfidence = conf
          bestMethod = 'root_type_match'
        }
      }
    }
    
    // Strategy 3: Medium token overlap (lower confidence, needs review)
    if (overlap >= 0.5 && overlap > bestConfidence) {
      bestFile = file
      bestConfidence = overlap * 0.85
      bestMethod = 'partial_token_match'
    }
  }
  
  return { file: bestFile, confidence: bestConfidence, method: bestMethod }
}

export async function GET() {
  const supabase = await createClient()
  
  // Fetch all products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name, category, item_root, item_type')
    .eq('is_active', true)
  
  if (prodError) {
    return NextResponse.json({ error: prodError.message }, { status: 500 })
  }
  
  // Recursively list all storage files
  const allFiles: { name: string }[] = []
  const folders = ['BARS', 'CANDLELIGHT', 'FURS + PELTS', 'LARGE DECOR', 'LIGHTING', 
                   'PILLOWS', 'RUGS', 'SEATING', 'SERVEWARE', 'STORAGE', 'STYLING', 
                   'TABLES', 'TABLEWARE', 'THROWS']
  
  for (const folder of folders) {
    const { data: folderFiles } = await supabase.storage.from('inventory').list(folder, { limit: 500 })
    if (folderFiles) {
      for (const item of folderFiles) {
        if (item.name.toLowerCase().endsWith('.png')) {
          allFiles.push({ name: `${folder}/${item.name}` })
        } else if (!item.name.includes('.')) {
          // Subfolder
          const { data: subFiles } = await supabase.storage.from('inventory').list(`${folder}/${item.name}`, { limit: 500 })
          if (subFiles) {
            for (const subItem of subFiles) {
              if (subItem.name.toLowerCase().endsWith('.png')) {
                allFiles.push({ name: `${folder}/${item.name}/${subItem.name}` })
              } else if (!subItem.name.includes('.')) {
                // Sub-subfolder
                const { data: subSubFiles } = await supabase.storage.from('inventory').list(`${folder}/${item.name}/${subItem.name}`, { limit: 500 })
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
  
  // Build file records
  const fileRecords = buildFileRecords(allFiles)
  
  // Track which files are assigned to which products
  const fileAssignments: Map<string, { productId: string; productName: string; category: string; itemRoot: string; confidence: number }[]> = new Map()
  
  // First pass: find best match for each product
  const preliminaryMatches: { product: typeof products[0]; file: FileRecord | null; confidence: number; method: string }[] = []
  
  for (const product of products || []) {
    const { file, confidence, method } = findBestMatch(product, fileRecords)
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
  
  // Second pass: determine status based on duplicate analysis
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
      unmatchedReason = method === 'no_files_in_category' 
        ? `No files found in ${storageCategory} folder` 
        : 'No matching file found'
    } else {
      const assignments = fileAssignments.get(file.full_path) || []
      duplicateCount = assignments.length
      
      if (duplicateCount === 1) {
        // Unique match
        if (confidence >= 0.75) {
          status = 'APPLY_SAFE'
        } else {
          status = 'MANUAL_REVIEW'
          conflictReason = `Low confidence match (${(confidence * 100).toFixed(0)}%)`
        }
      } else {
        // Multiple products matched to same file
        const { allowed, type } = isAllowedSharedFamily(product.item_root || '', product.category)
        
        if (allowed) {
          sharedAllowed = true
          status = 'ALLOWED_SHARED_IMAGE'
        } else {
          // Check if all products sharing this image have the same root
          const allSameRoot = assignments.every(a => a.itemRoot === assignments[0].itemRoot)
          const allSameCategory = assignments.every(a => a.category === assignments[0].category)
          
          if (allSameRoot && allSameCategory && assignments[0].itemRoot) {
            // Could be size/color variants - flag for review but not hard conflict
            status = 'MANUAL_REVIEW'
            conflictReason = `${duplicateCount} products share this image (same family: ${assignments[0].itemRoot}). Verify if variants.`
          } else if (!allSameCategory) {
            // Cross-category - definitely wrong
            status = 'CONFLICT'
            conflictReason = `CROSS-CATEGORY: ${assignments.map(a => `${a.productName} (${a.category})`).join(' vs ')}`
          } else {
            // Same category, different roots - likely wrong
            status = 'CONFLICT'
            conflictReason = `${duplicateCount} unrelated products share this image: ${assignments.map(a => a.productName).slice(0, 3).join(', ')}${duplicateCount > 3 ? '...' : ''}`
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
  
  // Summary
  const summary = {
    total_products: manifest.length,
    apply_safe_count: manifest.filter(m => m.status === 'APPLY_SAFE').length,
    allowed_shared_image_count: manifest.filter(m => m.status === 'ALLOWED_SHARED_IMAGE').length,
    conflict_count: manifest.filter(m => m.status === 'CONFLICT').length,
    manual_review_count: manifest.filter(m => m.status === 'MANUAL_REVIEW').length,
    unmatched_count: manifest.filter(m => m.status === 'UNMATCHED').length,
  }
  
  // Sort manifest: CONFLICT first, then MANUAL_REVIEW, then UNMATCHED, then safe
  const statusOrder: Record<MatchStatus, number> = {
    'CONFLICT': 0,
    'MANUAL_REVIEW': 1,
    'UNMATCHED': 2,
    'ALLOWED_SHARED_IMAGE': 3,
    'APPLY_SAFE': 4,
  }
  
  manifest.sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status]
    if (orderDiff !== 0) return orderDiff
    return a.website_category.localeCompare(b.website_category)
  })
  
  return NextResponse.json({ summary, manifest })
}

// POST: Apply ONLY APPLY_SAFE and ALLOWED_SHARED_IMAGE entries
export async function POST() {
  const supabase = await createClient()
  
  // Generate manifest first
  const manifestResponse = await GET()
  const manifestData = await manifestResponse.json()
  
  if (manifestData.error) {
    return NextResponse.json({ error: manifestData.error }, { status: 500 })
  }
  
  const toWrite = manifestData.manifest.filter(
    (m: ManifestEntry) => m.status === 'APPLY_SAFE' || m.status === 'ALLOWED_SHARED_IMAGE'
  )
  
  let written = 0
  let errors = 0
  
  for (const entry of toWrite) {
    if (!entry.matched_file_path) continue
    
    const imageUrl = `https://txmgpxvbtljfgswizhoz.supabase.co/storage/v1/object/public/inventory/${entry.matched_file_path.split('/').map(encodeURIComponent).join('/')}`
    
    const { error } = await supabase
      .from('products')
      .update({
        primary_image_url: imageUrl,
        primary_image_path: entry.matched_file_path,
        match_status: 'matched',
        match_confidence: entry.match_confidence >= 0.9 ? 'high' : entry.match_confidence >= 0.75 ? 'medium' : 'low',
      })
      .eq('id', entry.product_id)
    
    if (error) errors++
    else written++
  }
  
  return NextResponse.json({
    written,
    errors,
    skipped_conflicts: manifestData.manifest.filter((m: ManifestEntry) => m.status === 'CONFLICT').length,
    skipped_manual_review: manifestData.manifest.filter((m: ManifestEntry) => m.status === 'MANUAL_REVIEW').length,
    skipped_unmatched: manifestData.manifest.filter((m: ManifestEntry) => m.status === 'UNMATCHED').length,
    summary: manifestData.summary,
  })
}
