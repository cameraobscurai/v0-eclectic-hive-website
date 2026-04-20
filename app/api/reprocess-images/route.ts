import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { put, del } from '@vercel/blob'
import sharp from 'sharp'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CANVAS_SIZE = 1200
const BATCH_SIZE = 5 // Process 5 at a time to avoid timeouts

// Reprocess image with white background
async function reprocessWithWhiteBackground(imageUrl: string): Promise<Buffer> {
  // Fetch the existing image
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }
  
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // Create white background and composite the image on top
  const processed = await sharp({
    create: {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    },
  })
    .composite([
      {
        input: await sharp(buffer)
          .resize({
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 255 },
          })
          .toBuffer(),
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer()
  
  return processed
}

export async function POST(request: Request) {
  try {
    // Get offset from query params for pagination
    const url = new URL(request.url)
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const limit = parseInt(url.searchParams.get('limit') || String(BATCH_SIZE))
    
    // Get products with images (paginated)
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, primary_image_url')
      .not('primary_image_url', 'is', null)
      .eq('is_active', true)
      .range(offset, offset + limit - 1)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!products?.length) {
      return NextResponse.json({ 
        message: 'No more products to process', 
        processed: 0,
        done: true 
      })
    }
    
    const results = {
      processed: 0,
      failed: 0,
      errors: [] as { id: string; name: string; error: string }[],
      processedNames: [] as string[],
    }
    
    for (const product of products) {
      try {
        if (!product.primary_image_url) continue
        
        const oldUrl = product.primary_image_url
        
        // Reprocess the image with white background
        const processedBuffer = await reprocessWithWhiteBackground(oldUrl)
        
        // Delete old blob and upload new one with same path structure
        // Extract just the path portion for the new upload
        const urlObj = new URL(oldUrl)
        const pathParts = urlObj.pathname.split('/')
        // Get everything after the random hash in the filename, or use original
        const pathname = pathParts.slice(1).join('/')
        
        // Upload new version (will get new URL)
        const { url: newUrl } = await put(pathname, processedBuffer, {
          access: 'public',
          contentType: 'image/png',
          addRandomSuffix: false,
        })
        
        // Update Supabase with new URL if it changed
        if (newUrl !== oldUrl) {
          await supabase
            .from('products')
            .update({ primary_image_url: newUrl })
            .eq('id', product.id)
          
          // Try to delete old blob (don't fail if it doesn't work)
          try {
            await del(oldUrl)
          } catch {
            // Ignore deletion errors
          }
        }
        
        results.processed++
        results.processedNames.push(product.name)
        
      } catch (err) {
        results.failed++
        results.errors.push({
          id: product.id,
          name: product.name,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }
    
    return NextResponse.json({
      message: `Batch complete: ${results.processed} processed, ${results.failed} failed`,
      ...results,
      nextOffset: offset + limit,
      done: products.length < limit,
    })
    
  } catch (err) {
    console.error('[v0] Batch reprocess error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET to check status / dry run
export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, primary_image_url')
      .not('primary_image_url', 'is', null)
      .eq('is_active', true)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({
      message: 'Dry run - no changes made',
      totalImages: products?.length || 0,
      products: products?.map(p => ({ id: p.id, name: p.name })),
    })
    
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
