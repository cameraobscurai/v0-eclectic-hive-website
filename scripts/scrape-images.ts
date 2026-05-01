/**
 * Script to scrape images from eclectichive.com and import them
 * Run with: npx tsx scripts/scrape-images.ts
 */

import { put } from '@vercel/blob'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Inventory category pages on eclectichive.com
const INVENTORY_PAGES = [
  'https://www.eclectichive.com/inventory',
  'https://www.eclectichive.com/inventory?category=Tables',
  'https://www.eclectichive.com/inventory?category=Lighting',
  'https://www.eclectichive.com/inventory?category=Bars',
  'https://www.eclectichive.com/inventory?category=Rugs',
  'https://www.eclectichive.com/inventory?category=Pillows',
]

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function scrapePageForImages(url: string): Promise<Array<{ name: string; imageUrl: string }>> {
  console.log(`Fetching: ${url}`)
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ImageScraper/1.0)',
    },
  })
  
  if (!response.ok) {
    console.error(`Failed to fetch ${url}: ${response.status}`)
    return []
  }
  
  const html = await response.text()
  const products: Array<{ name: string; imageUrl: string }> = []
  
  // Extract from JSON-LD structured data
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)
  if (jsonLdMatch) {
    for (const match of jsonLdMatch) {
      try {
        const jsonContent = match.replace(/<script type="application\/ld\+json">/i, '').replace(/<\/script>/i, '')
        const data = JSON.parse(jsonContent)
        
        if (data['@type'] === 'ItemList' && data.itemListElement) {
          for (const item of data.itemListElement) {
            if (item.item?.name && item.item?.image) {
              products.push({
                name: item.item.name,
                imageUrl: item.item.image,
              })
            }
          }
        }
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
  
  // Also try extracting from data-image attributes (Squarespace pattern)
  const imgMatches = html.matchAll(/data-image="([^"]+)"/g)
  const titleMatches = html.matchAll(/<h1[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/h1>/gi)
  
  console.log(`Found ${products.length} products from JSON-LD on ${url}`)
  
  return products
}

async function matchAndImportImages() {
  // Get all products from database that don't have images
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select('id, name, slug, category, primary_image_url')
    .is('primary_image_url', null)
    .eq('is_active', true)
  
  if (error) {
    console.error('Failed to fetch products:', error)
    return
  }
  
  console.log(`Found ${dbProducts.length} products without images`)
  
  // Scrape all pages
  const allScrapedProducts: Array<{ name: string; imageUrl: string }> = []
  
  for (const pageUrl of INVENTORY_PAGES) {
    const products = await scrapePageForImages(pageUrl)
    allScrapedProducts.push(...products)
    await new Promise(r => setTimeout(r, 500)) // Rate limit
  }
  
  console.log(`Scraped ${allScrapedProducts.length} total products with images`)
  
  // Match and import
  let imported = 0
  let failed = 0
  
  for (const dbProduct of dbProducts) {
    const normalizedDbName = normalizeProductName(dbProduct.name)
    
    // Find matching scraped product
    const match = allScrapedProducts.find(scraped => {
      const normalizedScrapedName = normalizeProductName(scraped.name)
      return normalizedScrapedName === normalizedDbName ||
             normalizedScrapedName.includes(normalizedDbName) ||
             normalizedDbName.includes(normalizedScrapedName)
    })
    
    if (match) {
      console.log(`Matched: ${dbProduct.name} -> ${match.name}`)
      
      try {
        // Download image
        const imgResponse = await fetch(match.imageUrl)
        if (!imgResponse.ok) throw new Error(`Failed to download: ${imgResponse.status}`)
        
        const imgBuffer = await imgResponse.arrayBuffer()
        const ext = match.imageUrl.split('.').pop()?.split('?')[0] || 'jpg'
        const filename = `inventory/${dbProduct.slug || dbProduct.id}.${ext}`
        
        // Upload to Vercel Blob
        const blob = await put(filename, imgBuffer, {
          access: 'private',
          contentType: imgResponse.headers.get('content-type') || 'image/jpeg',
        })
        
        // Update database
        await supabase
          .from('products')
          .update({ primary_image_url: blob.pathname })
          .eq('id', dbProduct.id)
        
        console.log(`Imported: ${dbProduct.name}`)
        imported++
        
        await new Promise(r => setTimeout(r, 200)) // Rate limit
      } catch (e) {
        console.error(`Failed to import ${dbProduct.name}:`, e)
        failed++
      }
    }
  }
  
  console.log(`\nDone! Imported: ${imported}, Failed: ${failed}`)
}

matchAndImportImages().catch(console.error)
