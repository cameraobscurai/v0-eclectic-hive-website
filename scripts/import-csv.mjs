import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://txmgpxvbtljfgswizhoz.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Supabase Storage bucket for inventory images
const STORAGE_BUCKET = 'inventory'
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`

// Read CSV - default to the new inventory import file
const csvPath = process.argv[2] || 'inventory_import.csv'
const csvContent = readFileSync(csvPath, 'utf-8')

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
})

console.log(`Parsed ${records.length} rows from ${csvPath}`)

// Slugify function
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Map Product Group to category slug - updated with all categories
function mapCategory(productGroup) {
  const raw = (productGroup || '').toLowerCase().trim()
  const map = {
    'bars': 'bars',
    'seating': 'seating',
    'tables': 'tables',
    'large-decor': 'large-decor',
    'large decor': 'large-decor',
    'large decor & dividers': 'large-decor',
    'small-decor': 'styling',
    'small decor': 'styling',
    'lighting': 'lighting',
    'rugs': 'rugs',
    'pillows': 'pillows',
    'linens': 'linens',
    'tableware': 'tableware',
    'candlelight': 'candlelight',
    'serveware': 'serveware',
    'storage': 'storage',
    'styling': 'styling',
    'throws': 'pillows', // merge throws into pillows
    'furs-and-pelts': 'furs-and-pelts',
    'furs and pelts': 'furs-and-pelts',
  }
  return map[raw] || 'styling'
}

// Build image URL from filename
function buildImageUrl(filename) {
  if (!filename || filename.trim() === '') return null
  // Encode the filename for URL safety
  const encoded = encodeURIComponent(filename.trim())
  return `${STORAGE_BASE_URL}/${encoded}`
}

// Track created products to avoid duplicates
const createdProducts = new Map()

// Stats
let productsCreated = 0
let productsUpdated = 0
let variantsCreated = 0
let imagesLinked = 0
let errors = []

async function importData() {
  for (const row of records) {
    try {
      // Handle both old and new CSV formats
      const rmsId = parseInt(row['Id'] || row['RMS ID'])
      const name = (row['Name'] || '').trim()
      const stock = parseInt(row['Current Stock'] || row['Stock']) || 0
      const productGroup = (row['Product Group'] || row['Category'] || '').trim()
      const dims = (row['Dims'] || row['("W" x D" x H") Dims'] || '').trim()
      const imageFilename = (row['Image Filename'] || '').trim()
      
      if (!name) {
        console.log(`Skipping row - missing name:`, row)
        continue
      }

      const category = mapCategory(productGroup)
      const slug = slugify(name)
      const imageUrl = buildImageUrl(imageFilename)
      
      // Check if product already exists in this run
      let productId = createdProducts.get(slug)
      
      if (!productId) {
        // Check if product exists in database
        const { data: existing } = await supabase
          .from('products')
          .select('id, primary_image_url')
          .eq('slug', slug)
          .single()

        if (existing) {
          productId = existing.id
          createdProducts.set(slug, productId)
          
          // Update image if we have one and product doesn't
          if (imageUrl && !existing.primary_image_url) {
            const { error: updateError } = await supabase
              .from('products')
              .update({ primary_image_url: imageUrl, category })
              .eq('id', productId)
            
            if (!updateError) {
              imagesLinked++
              console.log(`🖼️  Linked image for: ${name}`)
            }
          }
          productsUpdated++
        } else {
          // Create new product
          const { data: product, error: productError } = await supabase
            .from('products')
            .insert({
              slug,
              name,
              category,
              display_type: 'single',
              is_active: true,
              primary_image_url: imageUrl,
            })
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
          if (imageUrl) imagesLinked++
          console.log(`✅ Created product: ${name} (${category})${imageUrl ? ' with image' : ''}`)
        }
      }

      // Create or update variant
      if (rmsId) {
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
      }
    } catch (err) {
      console.error(`Error processing row:`, err)
      errors.push({ row, error: err.message })
    }
  }

  console.log('\n=== Import Complete ===')
  console.log(`Products created: ${productsCreated}`)
  console.log(`Products updated: ${productsUpdated}`)
  console.log(`Variants created/updated: ${variantsCreated}`)
  console.log(`Images linked: ${imagesLinked}`)
  console.log(`Errors: ${errors.length}`)
  
  if (errors.length > 0) {
    console.log('\nFirst 10 errors:')
    errors.slice(0, 10).forEach(e => console.log(`  - ${e.name || 'Unknown'}: ${e.error}`))
  }
}

importData()
