import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Read CSV
const csvPath = process.argv[2] || 'user_read_only_context/text_attachments/04.17-Current-Inventory-Export---04.17-Current-Inventory-Export-5Lyyq.csv'
const csvContent = readFileSync(csvPath, 'utf-8')

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
})

console.log(`Parsed ${records.length} rows`)

// Slugify function
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Map Product Group to category slug
function mapCategory(productGroup) {
  const map = {
    'Bars': 'bars',
    'Seating': 'seating',
    'Tables': 'tables',
    'Large Decor & Dividers': 'large-decor',
    'Small Decor': 'small-decor',
    'Lighting': 'lighting',
    'Rugs': 'rugs',
    'Pillows': 'pillows',
    'Linens': 'linens',
    'Tableware': 'tableware',
    'Candlelight': 'candlelight',
  }
  return map[productGroup] || 'other'
}

// Check if item is Sinatra/Monroe (custom inquiry)
function isCustomInquiry(name) {
  return /sinatra|monroe/i.test(name)
}

// Track created products to avoid duplicates
const createdProducts = new Map()

// Stats
let productsCreated = 0
let variantsCreated = 0
let errors = []

async function importData() {
  for (const row of records) {
    try {
      const rmsId = parseInt(row['Id'])
      const name = row['Name']?.trim()
      const stock = parseInt(row['Current Stock']) || 0
      const productGroup = row['Product Group']?.trim()
      const dims = row['("W" x D" x H") Dims']?.trim() || row['Dims']?.trim() || ''
      
      if (!name || !productGroup) {
        console.log(`Skipping row - missing name or product group:`, row)
        continue
      }

      const category = mapCategory(productGroup)
      const slug = slugify(name)
      const displayType = isCustomInquiry(name) ? 'custom_inquiry' : 'single'
      
      // Check if product already exists
      let productId = createdProducts.get(slug)
      
      if (!productId) {
        // Create product
        const { data: product, error: productError } = await supabase
          .from('products')
          .upsert({
            slug,
            name,
            category,
            display_type: displayType,
            is_active: true,
            public_notes: displayType === 'custom_inquiry' ? 'Inquire for availability' : null,
          }, { onConflict: 'slug' })
          .select()
          .single()

        if (productError) {
          console.error(`Error creating product ${name}:`, productError.message)
          errors.push({ name, error: productError.message })
          continue
        }

        productId = product.id
        createdProducts.set(slug, productId)
        productsCreated++
        console.log(`Created product: ${name} (${category})`)
      }

      // Create variant
      const { error: variantError } = await supabase
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
        }, { onConflict: 'rms_id' })

      if (variantError) {
        console.error(`Error creating variant ${name}:`, variantError.message)
        errors.push({ name, error: variantError.message })
        continue
      }

      variantsCreated++
    } catch (err) {
      console.error(`Error processing row:`, err)
      errors.push({ row, error: err.message })
    }
  }

  console.log('\n=== Import Complete ===')
  console.log(`Products created: ${productsCreated}`)
  console.log(`Variants created: ${variantsCreated}`)
  console.log(`Errors: ${errors.length}`)
  
  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.slice(0, 10).forEach(e => console.log(`  - ${e.name || 'Unknown'}: ${e.error}`))
  }
}

importData()
