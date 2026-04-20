import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { list } from '@vercel/blob'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Step 1: Get all products with image URLs
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, category, primary_image_url')
      .not('primary_image_url', 'is', null)
      .eq('is_active', true)

    if (fetchError) throw fetchError

    // Step 2: Get all blobs in inventory folder
    const { blobs } = await list({ prefix: 'inventory/' })
    const existingPaths = new Set(blobs.map(b => b.pathname))

    // Step 3: Find products with dead image links
    const deadLinks: { id: string; name: string; category: string; path: string }[] = []
    const validLinks: { id: string; name: string; category: string; path: string }[] = []

    for (const product of products || []) {
      if (product.primary_image_url) {
        if (existingPaths.has(product.primary_image_url)) {
          validLinks.push({
            id: product.id,
            name: product.name,
            category: product.category,
            path: product.primary_image_url
          })
        } else {
          deadLinks.push({
            id: product.id,
            name: product.name,
            category: product.category,
            path: product.primary_image_url
          })
        }
      }
    }

    return NextResponse.json({
      total: products?.length || 0,
      valid: validLinks.length,
      dead: deadLinks.length,
      deadLinks: deadLinks.slice(0, 20), // Show first 20
      existingBlobCount: blobs.length
    })
  } catch (error) {
    console.error('Cleanup check error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Step 1: Get all products with image URLs
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, primary_image_url')
      .not('primary_image_url', 'is', null)
      .eq('is_active', true)

    if (fetchError) throw fetchError

    // Step 2: Get all blobs in inventory folder
    const { blobs } = await list({ prefix: 'inventory/' })
    const existingPaths = new Set(blobs.map(b => b.pathname))

    // Step 3: Find and clear dead links
    const deadLinkIds: string[] = []

    for (const product of products || []) {
      if (product.primary_image_url && !existingPaths.has(product.primary_image_url)) {
        deadLinkIds.push(product.id)
      }
    }

    // Step 4: Clear dead links in database
    if (deadLinkIds.length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ primary_image_url: null })
        .in('id', deadLinkIds)

      if (updateError) throw updateError
    }

    return NextResponse.json({
      cleared: deadLinkIds.length,
      message: `Cleared ${deadLinkIds.length} dead image links`
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
