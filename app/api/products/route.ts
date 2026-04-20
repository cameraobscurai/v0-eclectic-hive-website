import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
  
  // Filter: only products with images
  if (imagesOnly) {
    query = query.not('primary_image_url', 'is', null)
  }
  
  // Filter: category
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  
  // Filter: search
  if (search) {
    query = query.ilike('name', `%${search}%`)
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
  
  const { data: products, error, count } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
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
