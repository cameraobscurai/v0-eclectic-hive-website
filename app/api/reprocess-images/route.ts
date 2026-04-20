import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { put } from '@vercel/blob'
import sharp from 'sharp'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CANVAS_SIZE = 1200

// Reprocess image with white background
async function reprocessWithWhiteBackground(imageUrl: string): Promise<Buffer> {
  // Fetch the existing image
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`)
  }
  
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // Get image metadata
  const metadata = await sharp(buffer).metadata()
  const { width = CANVAS_SIZE, height = CANVAS_SIZE } = metadata
  
  // Create white background and composite the image on top
  // This handles both transparent PNGs and images with existing backgrounds
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

// Extract pathname from Blob URL
function getPathnameFromUrl(url: string): string {
  // URL format: https://xxx.public.blob.vercel-storage.com/inventory/category/filename.png
  const urlObj = new URL(url)
  // Remove leading slash
  return urlObj.pathname.slice(1)
}

export async function POST() {
  try {
    // Get all products with images
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, primary_image_url')
      .not('primary_image_url', 'is', null)
      .eq('is_active', true)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!products?.length) {
      return NextResponse.json({ message: 'No products with images found', processed: 0 })
    }
    
    const results = {
      processed: 0,
      failed: 0,
      errors: [] as { id: string; name: string; error: string }[],
    }
    
    for (const product of products) {
      try {
        if (!product.primary_image_url) continue
        
        // Reprocess the image with white background
        const processedBuffer = await reprocessWithWhiteBackground(product.primary_image_url)
        
        // Get the original pathname to overwrite
        const pathname = getPathnameFromUrl(product.primary_image_url)
        
        // Upload back to Blob, overwriting the original
        await put(pathname, processedBuffer, {
          access: 'public',
          contentType: 'image/png',
          addRandomSuffix: false,
        })
        
        results.processed++
        console.log(`[v0] Reprocessed: ${product.name}`)
        
      } catch (err) {
        results.failed++
        results.errors.push({
          id: product.id,
          name: product.name,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
        console.error(`[v0] Failed to reprocess ${product.name}:`, err)
      }
    }
    
    return NextResponse.json({
      message: `Reprocessed ${results.processed} images with white backgrounds`,
      ...results,
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
