import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const withCounts = request.nextUrl.searchParams.get('withCounts') === 'true'
    
    // Pull categories directly from products table (no separate categories table needed)
    const { data: productCategories, error: prodError } = await supabase
      .from('products')
      .select('category, primary_image_url')
      .eq('is_active', true)
    
    if (prodError) {
      console.log('[v0] Products query error:', prodError.message)
      return NextResponse.json({ error: prodError.message }, { status: 500 })
    }
    
    // Deduplicate and count
    const allCategories = new Set<string>()
    const counts: Record<string, number> = {}
    
    if (productCategories) {
      productCategories.forEach(p => {
        if (p.category) {
          allCategories.add(p.category)
          // Only count products with images
          if (withCounts && p.primary_image_url) {
            counts[p.category] = (counts[p.category] || 0) + 1
          }
        }
      })
    }
    
    const categoryList = Array.from(allCategories)
    
    // Cache for 5 minutes - categories rarely change
    return NextResponse.json(
      { 
        categories: categoryList,
        ...(withCounts && { counts })
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.log('[v0] Categories API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
