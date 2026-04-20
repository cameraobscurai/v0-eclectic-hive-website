import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const category = request.nextUrl.searchParams.get('category')
  const search = request.nextUrl.searchParams.get('search')
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  
  if (category && category !== 'All') {
    query = query.eq('category', category)
  }
  
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  
  const { data: products, error } = await query
  
  if (error) {
    console.error('[v0] Products fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Cache response for 60 seconds
  return NextResponse.json(
    { products },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  )
}
