import { type NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrapedProduct {
  name: string
  imageUrl: string
  category?: string
}

interface MatchedProduct {
  scraped: ScrapedProduct
  matched: {
    id: string
    name: string
    slug: string
    category: string
    primary_image_url: string | null
  } | null
  confidence: 'exact' | 'high' | 'low' | 'none'
}

// ─── GET: Scrape page and extract products ────────────────────────────────────

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  try {
    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EclecticHiveBot/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: 502 })
    }

    const html = await response.text()

    // Extract products from Squarespace HTML structure
    const products = extractSquarespaceProducts(html)

    // Get Supabase products for matching
    const supabase = await createClient()
    const { data: dbProducts } = await supabase
      .from('products')
      .select('id, name, slug, category, primary_image_url')
      .eq('is_active', true)

    // Match scraped products to database products
    const matched = matchProducts(products, dbProducts || [])

    return NextResponse.json({
      success: true,
      url,
      totalScraped: products.length,
      products: matched,
    })
  } catch (error) {
    console.error('Scrape error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scrape failed' },
      { status: 500 }
    )
  }
}

// ─── POST: Import selected images ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { items } = body as { items: Array<{ productId: string; imageUrl: string; slug: string; category: string }> }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items to import' }, { status: 400 })
  }

  const supabase = await createClient()
  const results: Array<{ productId: string; success: boolean; error?: string }> = []

  for (const item of items) {
    try {
      // Download image from source
      const imageResponse = await fetch(item.imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EclecticHiveBot/1.0)',
        },
      })

      if (!imageResponse.ok) {
        results.push({ productId: item.productId, success: false, error: 'Download failed' })
        continue
      }

      const imageBuffer = await imageResponse.arrayBuffer()
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
      const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'

      // Upload to Vercel Blob
      const pathname = `inventory/${item.category.toLowerCase()}/${item.slug}.${extension}`
      const blob = await put(pathname, imageBuffer, {
        access: 'private',
        contentType,
        addRandomSuffix: false,
      })

      // Update Supabase product
      const { error: updateError } = await supabase
        .from('products')
        .update({ primary_image_url: pathname, updated_at: new Date().toISOString() })
        .eq('id', item.productId)

      if (updateError) {
        results.push({ productId: item.productId, success: false, error: updateError.message })
      } else {
        results.push({ productId: item.productId, success: true })
      }

      // Rate limit: small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      results.push({
        productId: item.productId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return NextResponse.json({
    success: true,
    imported: successCount,
    failed: failCount,
    results,
  })
}

// ─── Helper: Extract products from Squarespace HTML ───────────────────────────

function extractSquarespaceProducts(html: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []

  // Squarespace product items typically have data-item-id and contain images
  // Pattern 1: Product summary items
  const productItemRegex = /<div[^>]*class="[^"]*ProductItem[^"]*"[^>]*>[\s\S]*?<\/div>/gi
  
  // Pattern 2: Image URLs from Squarespace CDN
  const imageRegex = /https:\/\/images\.squarespace-cdn\.com\/content\/v1\/[^"'\s]+/g
  
  // Pattern 3: Product titles - look for various title patterns
  const titlePatterns = [
    /<h1[^>]*class="[^"]*ProductItem-details-title[^"]*"[^>]*>([^<]+)<\/h1>/gi,
    /<div[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/div>/gi,
    /<span[^>]*class="[^"]*ProductItem-details-title[^"]*"[^>]*>([^<]+)<\/span>/gi,
    /data-product-title="([^"]+)"/gi,
    /<a[^>]*class="[^"]*product-title[^"]*"[^>]*>([^<]+)<\/a>/gi,
  ]

  // Extract all image URLs
  const imageUrls = [...new Set(html.match(imageRegex) || [])]
    .filter(url => {
      // Filter to likely product images (not icons, not tiny)
      return !url.includes('favicon') && 
             !url.includes('logo') && 
             !url.includes('icon') &&
             (url.includes('format=') || url.includes('.jpg') || url.includes('.png') || url.includes('.webp'))
    })

  // Extract product names
  const names: string[] = []
  for (const pattern of titlePatterns) {
    let match
    while ((match = pattern.exec(html)) !== null) {
      const name = match[1].trim()
      if (name && name.length > 2 && name.length < 100) {
        names.push(name)
      }
    }
  }

  // Also try to extract from structured data
  const structuredDataMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)
  if (structuredDataMatch) {
    for (const script of structuredDataMatch) {
      try {
        const jsonContent = script.replace(/<script[^>]*>|<\/script>/gi, '')
        const data = JSON.parse(jsonContent)
        
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item['@type'] === 'Product' && item.name && item.image) {
              products.push({
                name: item.name,
                imageUrl: Array.isArray(item.image) ? item.image[0] : item.image,
              })
            }
          }
        } else if (data['@type'] === 'Product' && data.name && data.image) {
          products.push({
            name: data.name,
            imageUrl: Array.isArray(data.image) ? data.image[0] : data.image,
          })
        } else if (data['@type'] === 'ItemList' && data.itemListElement) {
          for (const item of data.itemListElement) {
            if (item.item && item.item.name && item.item.image) {
              products.push({
                name: item.item.name,
                imageUrl: Array.isArray(item.item.image) ? item.item.image[0] : item.item.image,
              })
            }
          }
        }
      } catch {
        // JSON parse failed, skip
      }
    }
  }

  // If we found products from structured data, return those
  if (products.length > 0) {
    return products
  }

  // Fallback: Try to pair names with images by proximity in HTML
  // This is a heuristic - may need tuning based on actual page structure
  const productSections = html.split(/<div[^>]*class="[^"]*sqs-block[^"]*product[^"]*"/i)
  
  for (const section of productSections.slice(1)) {
    const sectionImageMatch = section.match(imageRegex)
    let sectionName = ''
    
    for (const pattern of titlePatterns) {
      const match = pattern.exec(section)
      if (match) {
        sectionName = match[1].trim()
        break
      }
    }
    
    // Also try alt text
    if (!sectionName) {
      const altMatch = section.match(/alt="([^"]+)"/i)
      if (altMatch) {
        sectionName = altMatch[1].trim()
      }
    }

    if (sectionImageMatch && sectionImageMatch[0] && sectionName) {
      products.push({
        name: sectionName,
        imageUrl: sectionImageMatch[0],
      })
    }
  }

  // If still no products, return images with placeholder names
  if (products.length === 0 && imageUrls.length > 0) {
    return imageUrls.slice(0, 100).map((url, i) => ({
      name: `Product ${i + 1}`,
      imageUrl: url,
    }))
  }

  return products
}

// ─── Helper: Match scraped products to database products ──────────────────────

function matchProducts(
  scraped: ScrapedProduct[],
  dbProducts: Array<{ id: string; name: string; slug: string; category: string; primary_image_url: string | null }>
): MatchedProduct[] {
  return scraped.map(scrapedProduct => {
    const normalizedScraped = normalize(scrapedProduct.name)
    
    // Try exact match first
    let bestMatch = dbProducts.find(db => normalize(db.name) === normalizedScraped)
    let confidence: 'exact' | 'high' | 'low' | 'none' = bestMatch ? 'exact' : 'none'

    // Try slug match
    if (!bestMatch) {
      const scrapedSlug = normalizedScraped.replace(/\s+/g, '-')
      bestMatch = dbProducts.find(db => db.slug === scrapedSlug || db.slug.includes(scrapedSlug) || scrapedSlug.includes(db.slug))
      if (bestMatch) confidence = 'high'
    }

    // Try substring match
    if (!bestMatch) {
      bestMatch = dbProducts.find(db => {
        const dbNorm = normalize(db.name)
        return dbNorm.includes(normalizedScraped) || normalizedScraped.includes(dbNorm)
      })
      if (bestMatch) confidence = 'low'
    }

    // Try word overlap
    if (!bestMatch) {
      const scrapedWords = normalizedScraped.split(/\s+/).filter(w => w.length > 2)
      let maxOverlap = 0
      let bestOverlapMatch = null
      
      for (const db of dbProducts) {
        const dbWords = normalize(db.name).split(/\s+/).filter(w => w.length > 2)
        const overlap = scrapedWords.filter(w => dbWords.includes(w)).length
        if (overlap > maxOverlap && overlap >= 2) {
          maxOverlap = overlap
          bestOverlapMatch = db
        }
      }
      
      if (bestOverlapMatch) {
        bestMatch = bestOverlapMatch
        confidence = 'low'
      }
    }

    return {
      scraped: scrapedProduct,
      matched: bestMatch || null,
      confidence,
    }
  })
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
