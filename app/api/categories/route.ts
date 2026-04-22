import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const withCounts = request.nextUrl.searchParams.get('withCounts') === 'true'
  
  // Get categories from the categories table
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  // Also get unique categories from products (in case some aren't in categories table)
  // If withCounts, we need to count products per category
  const { data: productCategories } = await supabase
    .from('products')
    .select('category, primary_image_url')
    .eq('is_active', true)
  
  // Combine and deduplicate, with optional counts
  const allCategories = new Set<string>()
  const counts: Record<string, number> = {}
  
  if (categories) {
    categories.forEach(c => allCategories.add(c.name))
  }
  
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
}
