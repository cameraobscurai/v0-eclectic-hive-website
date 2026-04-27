import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimiter, API_SECURITY_HEADERS, getClientIP } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute per IP
  const ip = getClientIP(request)
  const { success, limit, remaining, reset } = await rateLimiter.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          ...API_SECURITY_HEADERS,
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }

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
          ...API_SECURITY_HEADERS,
          'Cache-Control': 'private, s-maxage=300, stale-while-revalidate=600',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
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
