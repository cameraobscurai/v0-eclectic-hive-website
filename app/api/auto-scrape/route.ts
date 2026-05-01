import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'

// Normalize product names for matching
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract products from Squarespace HTML
function extractProducts(html: string): Array<{ name: string; imageUrl: string }> {
  const products: Array<{ name: string; imageUrl: string }> = []
  
  // Method 1: JSON-LD structured data
  const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1])
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
      if (data['@type'] === 'Product' && data.name && data.image) {
        products.push({ name: data.name, imageUrl: data.image })
      }
    } catch {
      // Skip invalid JSON
    }
  }
  
  // Method 2: Squarespace product grid items
  const productGridItems = html.matchAll(/<article[^>]*class="[^"]*ProductItem[^"]*"[^>]*>[\s\S]*?<\/article>/gi)
  for (const match of productGridItems) {
    const itemHtml = match[0]
    const nameMatch = itemHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i) || itemHtml.match(/data-title="([^"]+)"/i)
    const imgMatch = itemHtml.match(/data-src="([^"]+)"/) || itemHtml.match(/src="(https:\/\/images\.squarespace-cdn\.com[^"]+)"/i)
    
    if (nameMatch && imgMatch) {
      products.push({
        name: nameMatch[1].trim(),
        imageUrl: imgMatch[1],
      })
    }
  }
  
  // Method 3: Summary items (another Squarespace pattern)
  const summaryItems = html.matchAll(/<a[^>]*class="[^"]*summary-title-link[^"]*"[^>]*>([^<]+)<\/a>/gi)
  const summaryImages = html.matchAll(/data-image-id="[^"]*"[^>]*data-src="([^"]+)"/gi)
  
  const names = Array.from(summaryItems).map(m => m[1].trim())
  const images = Array.from(summaryImages).map(m => m[1])
  
  for (let i = 0; i < Math.min(names.length, images.length); i++) {
    if (!products.find(p => normalizeProductName(p.name) === normalizeProductName(names[i]))) {
      products.push({ name: names[i], imageUrl: images[i] })
    }
  }
  
  return products
}

// Calculate match score between two product names
function matchScore(a: string, b: string): number {
  const normA = normalizeProductName(a)
  const normB = normalizeProductName(b)
  
  if (normA === normB) return 100
  if (normA.includes(normB) || normB.includes(normA)) return 80
  
  const wordsA = normA.split(' ')
  const wordsB = normB.split(' ')
  const commonWords = wordsA.filter(w => wordsB.includes(w) && w.length > 2)
  const score = (commonWords.length / Math.max(wordsA.length, wordsB.length)) * 60
  
  return score
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Get list of pages to scrape
  const body = await request.json().catch(() => ({}))
  const urls: string[] = body.urls || [
    'https://www.eclectichive.com/inventory',
  ]
  
  const limit = body.limit || 20 // Limit per run to avoid timeouts
  
  // Get products from database that need images
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, slug, category, primary_image_url')
    .is('primary_image_url', null)
    .eq('is_active', true)
    .limit(200)
  
  if (dbError) {
    return NextResponse.json({ error: 'Failed to fetch products', details: dbError.message }, { status: 500 })
  }
  
  // Scrape all provided URLs
  const allScraped: Array<{ name: string; imageUrl: string }> = []
  const scrapeErrors: string[] = []
  
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      })
      
      if (!response.ok) {
        scrapeErrors.push(`${url}: HTTP ${response.status}`)
        continue
      }
      
      const html = await response.text()
      const products = extractProducts(html)
      allScraped.push(...products)
      
      await new Promise(r => setTimeout(r, 300))
    } catch (e) {
      scrapeErrors.push(`${url}: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }
  
  // Match and import
  const results: Array<{ productId: string; productName: string; matchedTo: string; status: 'imported' | 'failed' | 'skipped'; error?: string }> = []
  let imported = 0
  let processed = 0
  
  for (const dbProduct of dbProducts) {
    if (processed >= limit) break
    
    // Find best match
    let bestMatch: { name: string; imageUrl: string } | null = null
    let bestScore = 0
    
    for (const scraped of allScraped) {
      const score = matchScore(dbProduct.name, scraped.name)
      if (score > bestScore && score >= 50) {
        bestScore = score
        bestMatch = scraped
      }
    }
    
    if (!bestMatch) continue
    
    processed++
    
    try {
      // Download image
      const imgResponse = await fetch(bestMatch.imageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      
      if (!imgResponse.ok) {
        results.push({
          productId: dbProduct.id,
          productName: dbProduct.name,
          matchedTo: bestMatch.name,
          status: 'failed',
          error: `Image download failed: ${imgResponse.status}`,
        })
        continue
      }
      
      const contentType = imgResponse.headers.get('content-type') || 'image/jpeg'
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
      const imgBuffer = await imgResponse.arrayBuffer()
      
      // Upload to Vercel Blob
      const filename = `inventory/${dbProduct.slug || dbProduct.id}.${ext}`
      const blob = await put(filename, imgBuffer, {
        access: 'private',
        contentType,
      })
      
      // Update database
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          primary_image_url: blob.pathname,
          updated_at: new Date().toISOString(),
        })
        .eq('id', dbProduct.id)
      
      if (updateError) {
        results.push({
          productId: dbProduct.id,
          productName: dbProduct.name,
          matchedTo: bestMatch.name,
          status: 'failed',
          error: `DB update failed: ${updateError.message}`,
        })
        continue
      }
      
      results.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        matchedTo: bestMatch.name,
        status: 'imported',
      })
      imported++
      
      await new Promise(r => setTimeout(r, 200))
    } catch (e) {
      results.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        matchedTo: bestMatch.name,
        status: 'failed',
        error: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }
  
  return NextResponse.json({
    success: true,
    summary: {
      scrapedProducts: allScraped.length,
      dbProductsWithoutImages: dbProducts.length,
      processed,
      imported,
      failed: results.filter(r => r.status === 'failed').length,
    },
    scrapeErrors: scrapeErrors.length > 0 ? scrapeErrors : undefined,
    results,
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'Auto-scrape endpoint. POST with { urls: [...], limit: 20 } to run.',
    example: {
      urls: ['https://www.eclectichive.com/inventory'],
      limit: 20,
    },
  })
}
