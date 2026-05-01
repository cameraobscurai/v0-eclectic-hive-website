import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

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

// Categories that use SOFT GOODS matching (full token overlap required)
const SOFT_GOODS_CATEGORIES = ['Pillows', 'Throws', 'Rugs', 'Styling', 'Furs & Pelts']

// Categories that allow shared set images
const SHARED_SET_CATEGORIES = ['Tableware', 'Serveware']

// Furniture categories that use root + type matching
const FURNITURE_CATEGORIES = ['Seating', 'Tables', 'Bars', 'Lighting', 'Chandeliers', 'Large Decor & Dividers', 'Candlelight', 'Storage']

interface FileRecord {
  full_path: string
  category_folder: string
  type_folder: string | null
  filename: string
  filename_stem: string
  filename_tokens: string[]
  trailing_index: number | null
  detected_item_type: string | null
}

interface ProductRecord {
  id: string
  name: string
  category: string
  storage_category: string
  storage_subfolder: string | null
  product_tokens: string[]
  item_root: string
  item_type: string | null
}

interface ManifestEntry {
  product_id: string
  product_name: string
  storage_category: string
  storage_subfolder: string | null
  matched_file_path: string | null
  match_method: string
  match_confidence: number
  duplicate_image_count: number
  is_allowed_shared_image: boolean
  unmatched_reason: string | null
  action: 'write' | 'manual_review' | 'skip'
}

// Tokenize a string: lowercase, remove punctuation, split on spaces
function tokenize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0)
}

// Extract trailing number from filename (e.g., "BROOKLYN Sofa 1" -> 1)
function extractTrailingIndex(stem: string): number | null {
  const match = stem.match(/\s(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

// Detect item type from filename
function detectItemType(filename: string): string | null {
  const lower = filename.toLowerCase()
  if (/\bsofa\b/.test(lower)) return 'SOFA'
  if (/\bloveseat\b/.test(lower)) return 'LOVESEAT'
  if (/\bsectional\b/.test(lower)) return 'SECTIONAL'
  if (/\bchair\b/.test(lower)) return 'CHAIR'
  if (/\bbench\b/.test(lower)) return 'BENCH'
  if (/\bottoman\b/.test(lower)) return 'OTTOMAN'
  if (/\bstool\b/.test(lower)) return 'STOOL'
  if (/\btable\b/.test(lower)) return 'TABLE'
  if (/\bbar\b/.test(lower)) return 'BAR'
  if (/\blamp\b/.test(lower)) return 'LAMP'
  if (/\bchandelier\b|\bpendant\b/.test(lower)) return 'CHANDELIER'
  if (/\bpillow\b|\blumbar\b/.test(lower)) return 'PILLOW'
  if (/\bthrow\b/.test(lower)) return 'THROW'
  if (/\brug\b|\brunner\b/.test(lower)) return 'RUG'
  return null
}

// Build file records from storage
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
      trailing_index: extractTrailingIndex(stem),
      detected_item_type: detectItemType(stem),
    }
  })
}

// Build product records
function buildProductRecords(products: any[]): ProductRecord[] {
  return products.map(p => {
    const storageCategory = CATEGORY_TO_STORAGE[p.category] || ''
    let subfolder: string | null = null
    
    // Determine subfolder based on item_type
    if (p.category === 'Seating') {
      if (p.item_type === 'SOFA') subfolder = 'SOFA'
      else if (p.item_type === 'LOVESEAT') subfolder = 'LOVESEAT'
      else if (p.item_type === 'CHAIR') subfolder = 'CHAIR - LOUNGE'
      else if (p.item_type === 'BENCH') subfolder = 'BENCH'
      else if (p.item_type === 'OTTOMAN') subfolder = 'OTTOMAN'
      else if (p.item_type === 'STOOL') subfolder = 'STOOL'
    } else if (p.category === 'Tables') {
      if (p.name.toLowerCase().includes('coffee')) subfolder = 'COFFEE'
      else if (p.name.toLowerCase().includes('cocktail')) subfolder = 'COCKTAIL'
      else if (p.name.toLowerCase().includes('side')) subfolder = 'SIDE'
      else if (p.name.toLowerCase().includes('console')) subfolder = 'CONSOLE'
      else if (p.name.toLowerCase().includes('dining')) subfolder = 'DINING'
    } else if (p.category === 'Lighting' || p.category === 'Chandeliers') {
      if (p.item_type === 'LAMP') subfolder = 'LAMP'
      else if (p.item_type === 'CHANDELIER') subfolder = 'HANGING'
    }
    
    return {
      id: p.id,
      name: p.name,
      category: p.category,
      storage_category: storageCategory,
      storage_subfolder: subfolder,
      product_tokens: tokenize(p.name),
      item_root: p.item_root || '',
      item_type: p.item_type || null,
    }
  })
}

// Calculate token overlap score
function tokenOverlapScore(productTokens: string[], fileTokens: string[]): number {
  if (fileTokens.length === 0) return 0
  const fileSet = new Set(fileTokens)
  const matches = productTokens.filter(t => fileSet.has(t)).length
  return matches / fileTokens.length
}

// FURNITURE MATCHING: root + type + folder
function furnitureMatch(product: ProductRecord, file: FileRecord): { match: boolean; confidence: number } {
  // Must be in correct category folder
  if (file.category_folder !== product.storage_category) {
    return { match: false, confidence: 0 }
  }
  
  // If product has subfolder expectation, file must be in it
  if (product.storage_subfolder && file.type_folder !== product.storage_subfolder) {
    return { match: false, confidence: 0 }
  }
  
  // item_root must match first token of filename
  const fileFirstToken = file.filename_tokens[0]?.toUpperCase() || ''
  if (product.item_root !== fileFirstToken) {
    return { match: false, confidence: 0 }
  }
  
  // item_type should match if both exist
  if (product.item_type && file.detected_item_type && product.item_type !== file.detected_item_type) {
    return { match: false, confidence: 0 }
  }
  
  // High confidence if all checks pass
  return { match: true, confidence: 0.92 }
}

// SOFT GOODS MATCHING: full token overlap within category
function softGoodsMatch(product: ProductRecord, file: FileRecord): { match: boolean; confidence: number } {
  // Must be in correct category folder
  if (file.category_folder !== product.storage_category) {
    return { match: false, confidence: 0 }
  }
  
  // Calculate token overlap
  const overlap = tokenOverlapScore(product.product_tokens, file.filename_tokens)
  
  // Require strong overlap (at least 80% of file tokens present in product)
  if (overlap >= 0.8) {
    return { match: true, confidence: overlap }
  }
  
  // Medium confidence if 60%+ overlap
  if (overlap >= 0.6) {
    return { match: true, confidence: overlap * 0.9 }
  }
  
  return { match: false, confidence: overlap }
}

// SHARED SET MATCHING: for tableware/flatware
function sharedSetMatch(product: ProductRecord, file: FileRecord): { match: boolean; confidence: number; isSet: boolean } {
  // Must be in correct category folder
  if (file.category_folder !== product.storage_category) {
    return { match: false, confidence: 0, isSet: false }
  }
  
  // Check if file is a "Set" image
  const isSetImage = file.filename_stem.toLowerCase().includes('set')
  
  // item_root must match first token
  const fileFirstToken = file.filename_tokens[0]?.toUpperCase() || ''
  if (product.item_root !== fileFirstToken) {
    return { match: false, confidence: 0, isSet: false }
  }
  
  if (isSetImage) {
    return { match: true, confidence: 0.88, isSet: true }
  }
  
  // For non-set images, require higher token overlap
  const overlap = tokenOverlapScore(product.product_tokens, file.filename_tokens)
  return { match: overlap >= 0.5, confidence: overlap, isSet: false }
}

// Find best match for a product
function findBestMatch(
  product: ProductRecord, 
  files: FileRecord[]
): { file: FileRecord | null; confidence: number; method: string; isSet: boolean } {
  let bestFile: FileRecord | null = null
  let bestConfidence = 0
  let bestMethod = 'none'
  let isSet = false
  
  // Filter candidates to correct category first
  const candidates = files.filter(f => f.category_folder === product.storage_category)
  
  if (candidates.length === 0) {
    return { file: null, confidence: 0, method: 'no_category_files', isSet: false }
  }
  
  for (const file of candidates) {
    let result: { match: boolean; confidence: number; isSet?: boolean }
    let method: string
    
    if (SOFT_GOODS_CATEGORIES.includes(product.category)) {
      result = softGoodsMatch(product, file)
      method = 'soft_goods_token_match'
    } else if (SHARED_SET_CATEGORIES.includes(product.category)) {
      const setResult = sharedSetMatch(product, file)
      result = setResult
      method = setResult.isSet ? 'shared_set_image' : 'tableware_match'
      if (setResult.isSet && setResult.match) {
        isSet = true
      }
    } else {
      result = furnitureMatch(product, file)
      method = 'furniture_root_type_match'
    }
    
    if (result.match && result.confidence > bestConfidence) {
      bestFile = file
      bestConfidence = result.confidence
      bestMethod = method
      if ('isSet' in result) isSet = result.isSet
    }
  }
  
  return { file: bestFile, confidence: bestConfidence, method: bestMethod, isSet }
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
  
  // Fetch all storage files
  const { data: storageFiles, error: storageError } = await supabase
    .storage
    .from('inventory')
    .list('', { limit: 2000, search: '.png' })
  
  // Need to recursively list all folders
  const allFiles: { name: string }[] = []
  const folders = ['BARS', 'CANDLELIGHT', 'FURS + PELTS', 'LARGE DECOR', 'LIGHTING', 
                   'PILLOWS', 'RUGS', 'SEATING', 'SERVEWARE', 'STORAGE', 'STYLING', 
                   'TABLES', 'TABLEWARE', 'THROWS']
  
  for (const folder of folders) {
    const { data: folderFiles } = await supabase.storage.from('inventory').list(folder, { limit: 500 })
    if (folderFiles) {
      for (const item of folderFiles) {
        if (item.name.endsWith('.png')) {
          allFiles.push({ name: `${folder}/${item.name}` })
        } else if (!item.name.includes('.')) {
          // It's a subfolder, list it too
          const { data: subFiles } = await supabase.storage.from('inventory').list(`${folder}/${item.name}`, { limit: 500 })
          if (subFiles) {
            for (const subItem of subFiles) {
              if (subItem.name.endsWith('.png')) {
                allFiles.push({ name: `${folder}/${item.name}/${subItem.name}` })
              }
            }
          }
        }
      }
    }
  }
  
  // Build records
  const fileRecords = buildFileRecords(allFiles)
  const productRecords = buildProductRecords(products || [])
  
  // Generate matches
  const matches: Map<string, { product: ProductRecord; confidence: number; method: string; isSet: boolean }[]> = new Map()
  const manifest: ManifestEntry[] = []
  
  for (const product of productRecords) {
    const { file, confidence, method, isSet } = findBestMatch(product, fileRecords)
    
    if (file) {
      const existing = matches.get(file.full_path) || []
      existing.push({ product, confidence, method, isSet })
      matches.set(file.full_path, existing)
    }
    
    manifest.push({
      product_id: product.id,
      product_name: product.name,
      storage_category: product.storage_category,
      storage_subfolder: product.storage_subfolder,
      matched_file_path: file?.full_path || null,
      match_method: method,
      match_confidence: confidence,
      duplicate_image_count: 0, // Will fill in after
      is_allowed_shared_image: isSet,
      unmatched_reason: file ? null : method === 'no_category_files' ? 'No files in category' : 'No match found',
      action: 'skip', // Will determine after duplicate check
    })
  }
  
  // Duplicate audit
  for (const entry of manifest) {
    if (entry.matched_file_path) {
      const sharing = matches.get(entry.matched_file_path) || []
      entry.duplicate_image_count = sharing.length
      
      // Determine action
      if (sharing.length === 1) {
        // Unique match - safe to write
        entry.action = entry.match_confidence >= 0.75 ? 'write' : 'manual_review'
      } else if (entry.is_allowed_shared_image) {
        // Allowed shared image (set image, variant)
        entry.action = 'write'
      } else {
        // Duplicate not allowed - manual review
        entry.action = 'manual_review'
      }
    }
  }
  
  // Summary stats
  const summary = {
    total_products: manifest.length,
    matched: manifest.filter(m => m.matched_file_path).length,
    unmatched: manifest.filter(m => !m.matched_file_path).length,
    unique_matches: manifest.filter(m => m.duplicate_image_count === 1).length,
    shared_allowed: manifest.filter(m => m.is_allowed_shared_image && m.duplicate_image_count > 1).length,
    duplicates_flagged: manifest.filter(m => m.action === 'manual_review' && m.duplicate_image_count > 1).length,
    ready_to_write: manifest.filter(m => m.action === 'write').length,
    needs_review: manifest.filter(m => m.action === 'manual_review').length,
  }
  
  return NextResponse.json({
    summary,
    manifest: manifest.sort((a, b) => {
      // Sort: manual_review first, then by category
      if (a.action !== b.action) return a.action === 'manual_review' ? -1 : 1
      return a.storage_category.localeCompare(b.storage_category)
    }),
  })
}

// POST: Apply only the "write" actions from manifest
export async function POST() {
  const supabase = await createClient()
  
  // First generate the manifest
  const manifestResponse = await GET()
  const manifestData = await manifestResponse.json()
  
  if (manifestData.error) {
    return NextResponse.json({ error: manifestData.error }, { status: 500 })
  }
  
  const toWrite = manifestData.manifest.filter((m: ManifestEntry) => m.action === 'write')
  
  let written = 0
  let errors = 0
  
  for (const entry of toWrite) {
    const imageUrl = `https://txmgpxvbtljfgswizhoz.supabase.co/storage/v1/object/public/inventory/${encodeURIComponent(entry.matched_file_path).replace(/%2F/g, '/')}`
    
    const { error } = await supabase
      .from('products')
      .update({
        primary_image_url: imageUrl,
        primary_image_path: entry.matched_file_path,
        match_status: 'matched',
        match_confidence: entry.match_confidence >= 0.9 ? 'high' : entry.match_confidence >= 0.75 ? 'medium' : 'low',
      })
      .eq('id', entry.product_id)
    
    if (error) {
      errors++
    } else {
      written++
    }
  }
  
  return NextResponse.json({
    written,
    errors,
    skipped: manifestData.manifest.length - toWrite.length,
    summary: manifestData.summary,
  })
}
