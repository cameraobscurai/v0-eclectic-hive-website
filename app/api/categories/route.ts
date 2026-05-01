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
      return NextResponse.json({ error: prodError.message }, { status: 500 })
    }
    
    // Normalize category names to canonical form (handles mixed-case data)
    const normalizeCategory = (cat: string): string => {
      const lower = cat.toLowerCase().trim()
      const canonicalMap: Record<string, string> = {
        'seating': 'Seating',
        'tables': 'Tables',
        'bars': 'Bars',
        'lighting': 'Lighting',
        'chandeliers': 'Chandeliers',
        'pillows': 'Pillows',
        'rugs': 'Rugs',
        'styling': 'Styling',
        'storage': 'Storage',
        'candlelight': 'Candlelight',
        'serveware': 'Serveware',
        'tableware': 'Tableware',
        'large decor & dividers': 'Large Decor & Dividers',
        'large-decor': 'Large Decor & Dividers',
        'furs & pelts': 'Furs & Pelts',
        'furs-and-pelts': 'Furs & Pelts',
        'subrentals': 'Subrentals',
      }
      return canonicalMap[lower] || cat
    }

    // Deduplicate and count (normalize to canonical names)
    const counts: Record<string, number> = {}
    
    if (productCategories) {
      productCategories.forEach(p => {
        if (p.category) {
          const normalized = normalizeCategory(p.category)
          // Only count products with images
          if (p.primary_image_url) {
            counts[normalized] = (counts[normalized] || 0) + 1
          }
        }
      })
    }
    
    const categoryList = Object.keys(counts)
    
    // Cache for 5 minutes - categories rarely change
    return NextResponse.json(
      { 
        categories: categoryList,
        ...(withCounts && { counts })
      },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
