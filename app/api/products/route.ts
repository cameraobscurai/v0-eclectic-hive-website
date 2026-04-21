import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { escapeIlike } from '@/lib/utils'

const DEFAULT_PAGE_SIZE = 48

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  // Parse query params
  const category = request.nextUrl.searchParams.get('category')
  const search = request.nextUrl.searchParams.get('search')
  const imagesOnly = request.nextUrl.searchParams.get('imagesOnly') === 'true'
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || String(DEFAULT_PAGE_SIZE))
  const sort = request.nextUrl.searchParams.get('sort') || 'name' // name, newest, oldest
  
  // Build query with count for pagination
  // Include first variant data for quick view (stock_count, dimensions)
  let query = supabase
    .from('products')
    .select(`
      *,
      product_variants (
        stock_count,
        dims_display,
        width_inches,
        depth_inches,
        height_inches
      )
    `, { count: 'exact' })
    .eq('is_active', true)
  
  // Filter: only products with images
  if (imagesOnly) {
    query = query.not('primary_image_url', 'is', null)
  }
  
  // Filter: category
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  
  // Filter: search (with escaped wildcards to prevent injection)
  if (search) {
    const safeSearch = escapeIlike(search)
    query = query.ilike('name', `%${safeSearch}%`)
  }
  
  // Sorting
  switch (sort) {
    case 'newest':
      query = query.order('updated_at', { ascending: false })
      break
    case 'oldest':
      query = query.order('updated_at', { ascending: true })
      break
    default:
      query = query.order('name', { ascending: true })
  }
  
  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)
  
  const { data: rawProducts, error, count } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Flatten variant data onto product for easy access in quick view
  const products = rawProducts?.map(product => {
    const variants = product.product_variants || []
    // Aggregate stock count from all variants
    const totalStock = variants.reduce((sum: number, v: { stock_count?: number }) => sum + (v.stock_count || 0), 0)
    // Use first variant's dimensions (they're typically the same for display purposes)
    const firstVariant = variants[0] || {}
    
    return {
      ...product,
      // Flatten variant data for quick view
      stock_count: totalStock > 0 ? totalStock : undefined,
      dims_display: firstVariant.dims_display,
      width_inches: firstVariant.width_inches,
      depth_inches: firstVariant.depth_inches,
      height_inches: firstVariant.height_inches,
      // Remove the nested array
      product_variants: undefined,
    }
  }) || []
  
  const totalPages = Math.ceil((count || 0) / limit)
  
  return NextResponse.json(
    { 
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasMore: page < totalPages
      }
    },
    {
      headers: {
        'Cache-Control': 'private, max-age=10, stale-while-revalidate=30',
      },
    }
  )
}
