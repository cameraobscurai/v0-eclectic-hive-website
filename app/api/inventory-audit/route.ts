import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category, primary_image_url, is_active')
    
    if (productsError) throw productsError

    // Get all storage files
    const folders = [
      'BARS', 'CANDLELIGHT', 'FURS + PELTS', 'LARGE DECOR',
      'LIGHTING', 'PILLOWS', 'RUGS', 'SEATING', 'SERVEWARE',
      'STORAGE', 'STYLING', 'TABLES', 'TABLEWARE', 'THROWS'
    ]
    
    const storageFiles: { folder: string; name: string }[] = []
    for (const folder of folders) {
      const { data: files } = await supabase.storage.from('inventory').list(folder, { limit: 1000 })
      if (files) {
        for (const file of files) {
          if (file.name && (file.name.endsWith('.png') || file.name.endsWith('.PNG') || file.name.endsWith('.jpg'))) {
            storageFiles.push({ folder, name: file.name })
          }
        }
      }
    }

    // Analyze products
    const activeProducts = products?.filter(p => p.is_active) || []
    const inactiveProducts = products?.filter(p => !p.is_active) || []
    
    // Find duplicates
    const urlCounts: Record<string, string[]> = {}
    for (const p of activeProducts) {
      if (p.primary_image_url) {
        if (!urlCounts[p.primary_image_url]) urlCounts[p.primary_image_url] = []
        urlCounts[p.primary_image_url].push(p.name)
      }
    }
    
    const duplicateUrls = Object.entries(urlCounts)
      .filter(([_, names]) => names.length > 1)
      .map(([url, names]) => ({
        file: url.split('/').pop(),
        count: names.length,
        products: names
      }))
      .sort((a, b) => b.count - a.count)

    // Products without images
    const noImage = activeProducts.filter(p => !p.primary_image_url)

    // Products with broken URLs (not pointing to Supabase)
    const brokenUrls = activeProducts.filter(p => 
      p.primary_image_url && !p.primary_image_url.includes('supabase.co')
    )

    // Category breakdown
    const categoryStats: Record<string, { total: number; withImage: number; duplicates: number }> = {}
    for (const p of activeProducts) {
      const cat = p.category || 'Unknown'
      if (!categoryStats[cat]) categoryStats[cat] = { total: 0, withImage: 0, duplicates: 0 }
      categoryStats[cat].total++
      if (p.primary_image_url) categoryStats[cat].withImage++
    }
    
    // Mark categories with duplicates
    for (const dup of duplicateUrls) {
      for (const productName of dup.products) {
        const product = activeProducts.find(p => p.name === productName)
        if (product?.category && categoryStats[product.category]) {
          categoryStats[product.category].duplicates++
        }
      }
    }

    // Unused storage files (not referenced by any product)
    const usedUrls = new Set(activeProducts.map(p => p.primary_image_url).filter(Boolean))
    const unusedFiles = storageFiles.filter(f => {
      const expectedUrl = `${supabaseUrl}/storage/v1/object/public/inventory/${encodeURIComponent(f.folder)}/${encodeURIComponent(f.name)}`
      return !usedUrls.has(expectedUrl)
    })

    return NextResponse.json({
      summary: {
        totalProducts: products?.length || 0,
        activeProducts: activeProducts.length,
        inactiveProducts: inactiveProducts.length,
        totalStorageFiles: storageFiles.length,
        productsWithImages: activeProducts.filter(p => p.primary_image_url).length,
        productsWithoutImages: noImage.length,
        productsWithBrokenUrls: brokenUrls.length,
        duplicateImageUrls: duplicateUrls.length,
        productsAffectedByDuplicates: duplicateUrls.reduce((sum, d) => sum + d.count, 0),
        unusedStorageFiles: unusedFiles.length,
      },
      categoryBreakdown: Object.entries(categoryStats)
        .map(([cat, stats]) => ({ category: cat, ...stats }))
        .sort((a, b) => b.total - a.total),
      duplicateImages: duplicateUrls.slice(0, 20),
      productsWithoutImages: noImage.map(p => ({ name: p.name, category: p.category })).slice(0, 20),
      brokenUrls: brokenUrls.map(p => ({ name: p.name, url: p.primary_image_url })).slice(0, 10),
      unusedFiles: unusedFiles.slice(0, 20),
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
