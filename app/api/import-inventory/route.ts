import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Parse dimensions string like "92"W x 24"D x 41"H"
function parseDimensions(dims: string): { width: number | null; depth: number | null; height: number | null } {
  if (!dims) return { width: null, depth: null, height: null }
  
  const match = dims.match(/(\d+(?:\.\d+)?)"?\s*W?\s*x\s*(\d+(?:\.\d+)?)"?\s*D?\s*x\s*(\d+(?:\.\d+)?)"?\s*H?/i)
  if (match) {
    return {
      width: parseFloat(match[1]),
      depth: parseFloat(match[2]),
      height: parseFloat(match[3])
    }
  }
  return { width: null, depth: null, height: null }
}

// Map RMS product groups to our categories
function mapCategory(productGroup: string): string {
  const mapping: Record<string, string> = {
    'Bars': 'Bars',
    'Seating': 'Seating',
    'Tables': 'Tables',
    'Large Decor & Dividers': 'Large Decor & Dividers',
    'Lighting': 'Lighting',
    'Small Decor': 'Small Decor',
    'Candlelight': 'Candlelight',
    'Pillows': 'Pillows',
    'Rugs': 'Rugs',
    'Linens': 'Linens',
    'Tableware': 'Tableware',
  }
  return mapping[productGroup] || productGroup
}

// Tableware piece patterns
const TABLEWARE_PIECES = [
  'Dinner Fork', 'Salad Fork', 'Dessert Fork',
  'Steak Knife', 'Butter Knife', 'Dinner Knife',
  'Tea Spoon', 'Soup Spoon', 'Dessert Spoon', 'Serving Spoon',
  'Bread Plate', 'Salad Plate', 'Dinner Plate', 'Charger',
  'Cup', 'Saucer', 'Bowl', 'Goblet', 'Wine Glass', 'Champagne Flute'
]

// Extract tableware collection name
function extractTablewareCollection(name: string): { collection: string; piece: string } | null {
  for (const piece of TABLEWARE_PIECES) {
    if (name.toLowerCase().includes(piece.toLowerCase())) {
      const collection = name.replace(new RegExp(piece, 'i'), '').trim()
      return { collection, piece }
    }
  }
  // Check for plate sizes like "11" Plate"
  const plateMatch = name.match(/^(.+?)\s+(\d+(?:\.\d+)?["']?\s*(?:inch)?\s*(?:Plate|Bowl|Charger))/i)
  if (plateMatch) {
    return { collection: plateMatch[1].trim(), piece: plateMatch[2].trim() }
  }
  return null
}

// Check if item is custom inquiry (Sinatra/Monroe bars)
function isCustomInquiry(name: string): boolean {
  return /\b(sinatra|monroe)\b/i.test(name)
}

// Determine display type
function getDisplayType(category: string, name: string): 'single' | 'variants' | 'custom_inquiry' {
  if (isCustomInquiry(name)) return 'custom_inquiry'
  if (category === 'Tableware') return 'variants'
  return 'single'
}

// Parse CSV row
function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

export async function POST(request: NextRequest) {
  // Secret key protection - check header or query param
  const authHeader = request.headers.get('x-import-key')
  const expectedKey = process.env.IMPORT_SECRET_KEY
  
  if (!expectedKey || authHeader !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const supabase = await createClient()
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }
    
    // Parse header
    const headers = parseCSVRow(lines[0])
    const idIdx = headers.findIndex(h => h.toLowerCase() === 'id')
    const nameIdx = headers.findIndex(h => h.toLowerCase() === 'name')
    const stockIdx = headers.findIndex(h => h.toLowerCase().includes('stock'))
    const groupIdx = headers.findIndex(h => h.toLowerCase().includes('product group'))
    const dimsIdx = headers.findIndex(h => h.toLowerCase().includes('dims'))
    const imageIdx = headers.findIndex(h => h.toLowerCase().includes('image'))
    
    // Create import log
    const { data: importLog, error: logError } = await supabase
      .from('import_logs')
      .insert({
        filename: file.name,
        status: 'processing',
        total_rows: lines.length - 1,
        // imported_by: user.id // TODO: re-enable with auth
      })
      .select()
      .single()
    
    if (logError) {
      console.error('Failed to create import log:', logError)
    }
    
    const stats = {
      products_created: 0,
      products_updated: 0,
      variants_created: 0,
      variants_updated: 0,
      images_downloaded: 0,
      images_failed: 0,
      errors: [] as string[]
    }
    
    // Group tableware items by collection
    const tablewareGroups: Record<string, Array<{
      rmsId: number
      name: string
      piece: string
      stock: number
      dims: string
      imageUrl: string
    }>> = {}
    
    // Process each row
    const rows = lines.slice(1)
    
    for (let i = 0; i < rows.length; i++) {
      const row = parseCSVRow(rows[i])
      if (row.length < 3) continue
      
      const rmsId = parseInt(row[idIdx]) || 0
      const name = row[nameIdx] || ''
      const stock = parseInt(row[stockIdx]) || 0
      const productGroup = row[groupIdx] || ''
      const dims = row[dimsIdx] || ''
      const imageUrl = row[imageIdx] || ''
      
      if (!name) continue
      
      const category = mapCategory(productGroup)
      const displayType = getDisplayType(category, name)
      
      // Handle tableware grouping
      if (category === 'Tableware') {
        const extracted = extractTablewareCollection(name)
        if (extracted) {
          const key = slugify(extracted.collection + ' flatware')
          if (!tablewareGroups[key]) {
            tablewareGroups[key] = []
          }
          tablewareGroups[key].push({
            rmsId,
            name,
            piece: extracted.piece,
            stock,
            dims,
            imageUrl
          })
          continue
        }
      }
      
      // Create or update single product
      const slug = slugify(name)
      const parsedDims = parseDimensions(dims)
      
      // Check if product exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single()
      
      let productId: string
      
      if (existingProduct) {
        // Update existing
        const { error } = await supabase
          .from('products')
          .update({
            name,
            category,
            display_type: displayType,
            public_notes: displayType === 'custom_inquiry' ? 'Available in multiple sizes. Contact us for availability.' : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProduct.id)
        
        if (error) {
          stats.errors.push(`Failed to update product ${name}: ${error.message}`)
        } else {
          stats.products_updated++
        }
        productId = existingProduct.id
      } else {
        // Create new
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            slug,
            name,
            category,
            display_type: displayType,
            public_notes: displayType === 'custom_inquiry' ? 'Available in multiple sizes. Contact us for availability.' : null
          })
          .select('id')
          .single()
        
        if (error || !newProduct) {
          stats.errors.push(`Failed to create product ${name}: ${error?.message}`)
          continue
        }
        stats.products_created++
        productId = newProduct.id
      }
      
      // Create or update variant
      const { data: existingVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('rms_id', rmsId)
        .single()
      
      if (existingVariant) {
        await supabase
          .from('product_variants')
          .update({
            name,
            stock_count: stock,
            width_inches: parsedDims.width,
            depth_inches: parsedDims.depth,
            height_inches: parsedDims.height,
            dims_display: dims,
            original_image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVariant.id)
        stats.variants_updated++
      } else {
        await supabase
          .from('product_variants')
          .insert({
            product_id: productId,
            rms_id: rmsId,
            name,
            stock_count: stock,
            stock_status: displayType === 'custom_inquiry' ? 'inquire' : 'available',
            width_inches: parsedDims.width,
            depth_inches: parsedDims.depth,
            height_inches: parsedDims.height,
            dims_display: dims,
            original_name: name,
            original_image_url: imageUrl
          })
        stats.variants_created++
      }
    }
    
    // Process tableware groups
    for (const [slug, items] of Object.entries(tablewareGroups)) {
      const collectionName = items[0].name.replace(items[0].piece, '').trim() + ' Flatware'
      
      // Check if parent product exists
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single()
      
      let productId: string
      
      if (existingProduct) {
        await supabase
          .from('products')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProduct.id)
        stats.products_updated++
        productId = existingProduct.id
      } else {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            slug,
            name: collectionName,
            category: 'Tableware',
            display_type: 'variants'
          })
          .select('id')
          .single()
        
        if (error || !newProduct) {
          stats.errors.push(`Failed to create tableware collection ${collectionName}: ${error?.message}`)
          continue
        }
        stats.products_created++
        productId = newProduct.id
      }
      
      // Create variants for each piece
      for (const item of items) {
        const { data: existingVariant } = await supabase
          .from('product_variants')
          .select('id')
          .eq('rms_id', item.rmsId)
          .single()
        
        if (existingVariant) {
          await supabase
            .from('product_variants')
            .update({
              name: item.piece,
              stock_count: item.stock,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingVariant.id)
          stats.variants_updated++
        } else {
          await supabase
            .from('product_variants')
            .insert({
              product_id: productId,
              rms_id: item.rmsId,
              name: item.piece,
              variant_type: 'piece',
              variant_value: item.piece,
              stock_count: item.stock,
              original_name: item.name,
              original_image_url: item.imageUrl
            })
          stats.variants_created++
        }
      }
    }
    
    // Update import log
    if (importLog) {
      await supabase
        .from('import_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          products_created: stats.products_created,
          products_updated: stats.products_updated,
          variants_created: stats.variants_created,
          variants_updated: stats.variants_updated,
          images_downloaded: stats.images_downloaded,
          images_failed: stats.images_failed,
          errors: stats.errors
        })
        .eq('id', importLog.id)
    }
    
    return NextResponse.json({
      success: true,
      stats: {
        totalRows: rows.length,
        productsCreated: stats.products_created,
        productsUpdated: stats.products_updated,
        variantsCreated: stats.variants_created,
        variantsUpdated: stats.variants_updated,
        errors: stats.errors.length
      }
    })
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      error: 'Import failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
