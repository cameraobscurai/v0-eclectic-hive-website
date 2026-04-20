import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { list, del } from '@vercel/blob'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Check how many images exist
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('primary_image_url', 'is', null)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      productsWithImages: count,
      message: `${count} products have images that will be cleared`
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// POST - Clear all primary_image_url values and delete blobs
export async function POST() {
  try {
    // Get all image URLs first
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, primary_image_url')
      .not('primary_image_url', 'is', null)
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    
    const imageUrls = products?.map(p => p.primary_image_url).filter(Boolean) || []
    
    // Clear all primary_image_url in Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({ primary_image_url: null })
      .not('primary_image_url', 'is', null)
    
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    
    // Delete blobs (don't fail if some don't exist)
    let deletedBlobs = 0
    for (const url of imageUrls) {
      try {
        await del(url)
        deletedBlobs++
      } catch {
        // Ignore - blob may not exist or already deleted
      }
    }
    
    return NextResponse.json({ 
      message: 'All product images cleared',
      clearedProducts: products?.length || 0,
      deletedBlobs
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
