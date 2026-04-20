import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  // Get categories from the categories table
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  // Also get unique categories from products (in case some aren't in categories table)
  const { data: productCategories } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)
  
  // Combine and deduplicate
  const allCategories = new Set<string>(['All'])
  
  if (categories) {
    categories.forEach(c => allCategories.add(c.name))
  }
  
  if (productCategories) {
    productCategories.forEach(p => {
      if (p.category) allCategories.add(p.category)
    })
  }
  
  // Cache for 5 minutes - categories rarely change
  return NextResponse.json(
    { categories: Array.from(allCategories) },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  )
}
