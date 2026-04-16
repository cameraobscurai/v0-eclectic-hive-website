// Parse Eclectic Hive inventory from Squarespace
// Extracts product name from image URLs and creates structured data

const SQUARESPACE_BASE = 'https://images.squarespace-cdn.com/content/v1/57239bd5f8baf385ff553066'

async function scrapeAllCategories() {
  const categories = [
    { url: 'https://www.eclectichive.com/lounge', category: 'Sofas & Loveseats' },
    { url: 'https://www.eclectichive.com/chairs', category: 'Chairs' },
    { url: 'https://www.eclectichive.com/ottomans-poufs-stools', category: 'Ottomans' },
    { url: 'https://www.eclectichive.com/benches', category: 'Benches' },
    { url: 'https://www.eclectichive.com/tables', category: 'Tables' },
    { url: 'https://www.eclectichive.com/bars-buffets', category: 'Bars & Buffets' },
    { url: 'https://www.eclectichive.com/rugs', category: 'Rugs' },
    { url: 'https://www.eclectichive.com/pillows', category: 'Pillows' },
  ]
  
  const allProducts = []
  
  for (const cat of categories) {
    console.log(`[v0] Fetching ${cat.category}...`)
    try {
      const res = await fetch(cat.url)
      const html = await res.text()
      
      // Extract all Squarespace image URLs
      const imgRegex = /https:\/\/images\.squarespace-cdn\.com\/content\/v1\/57239bd5f8baf385ff553066\/[^"'\s]+\.(?:png|jpg|jpeg|webp)/gi
      const matches = html.match(imgRegex) || []
      
      // Filter to product images (exclude icons, logos, etc.)
      const productImages = [...new Set(matches)].filter(url => {
        const filename = decodeURIComponent(url.split('/').pop())
        // Product images typically have names like INDIWIN_Sofa_0.png or COSETTE+Loveseat+0.png
        return !filename.includes('favicon') && 
               !filename.includes('LOGO') && 
               !filename.includes('icon') &&
               !filename.includes('Eclectic+Hive-Carrie') && // Exclude team photos
               filename.length > 10
      })
      
      // Parse product name from filename
      for (const imgUrl of productImages) {
        const filename = decodeURIComponent(url.split('/').pop())
          .replace(/\.(png|jpg|jpeg|webp)$/i, '')
          .replace(/[_+]/g, ' ')
          .replace(/\s+\d+$/, '') // Remove trailing numbers like "0" or "1"
          .trim()
        
        // Skip duplicates and variations (same product, different angle)
        const existingProduct = allProducts.find(p => 
          p.name.toLowerCase() === filename.toLowerCase() ||
          p.image === imgUrl
        )
        
        if (!existingProduct && filename.length > 3) {
          allProducts.push({
            name: filename.toUpperCase(),
            category: cat.category,
            image: imgUrl
          })
        }
      }
      
      console.log(`  Found ${productImages.length} images`)
    } catch (err) {
      console.log(`  Error: ${err.message}`)
    }
  }
  
  console.log(`\n[v0] Total unique products: ${allProducts.length}`)
  console.log('\n// INVENTORY DATA - Copy this into your data file:\n')
  console.log('export const INVENTORY = ' + JSON.stringify(allProducts, null, 2))
}

// Simpler approach - just fetch lounge and extract all unique products
async function scrapeLounge() {
  console.log('[v0] Fetching lounge seating page...')
  
  const res = await fetch('https://www.eclectichive.com/lounge')
  const html = await res.text()
  
  // Extract all Squarespace image URLs
  const imgRegex = /https:\/\/images\.squarespace-cdn\.com\/content\/v1\/57239bd5f8baf385ff553066\/[^"'\s]+\.(?:png|jpg|jpeg|webp)/gi
  const matches = html.match(imgRegex) || []
  const uniqueUrls = [...new Set(matches)]
  
  console.log(`[v0] Found ${uniqueUrls.length} unique image URLs`)
  
  // Parse each URL to extract product info
  const products = []
  const seenNames = new Set()
  
  for (const url of uniqueUrls) {
    const filename = decodeURIComponent(url.split('/').pop())
      .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    
    // Skip non-product images
    if (filename.includes('favicon') || 
        filename.includes('LOGO') || 
        filename.includes('Eclectic+Hive-Carrie') ||
        filename.length < 5) continue
    
    // Parse name: INDIWIN_Sofa_0 -> INDIWIN SOFA
    let name = filename
      .replace(/[_+]/g, ' ')
      .replace(/\s+\d+$/, '') // Remove trailing number
      .trim()
      .toUpperCase()
    
    // Determine category from name
    let category = 'Sofas'
    if (name.includes('LOVESEAT')) category = 'Loveseats'
    else if (name.includes('CHAIR')) category = 'Chairs'
    else if (name.includes('OTTOMAN') || name.includes('POUF')) category = 'Ottomans'
    else if (name.includes('BENCH')) category = 'Benches'
    else if (name.includes('SOFA')) category = 'Sofas'
    
    // Skip if we've seen this product name already
    if (seenNames.has(name)) continue
    seenNames.add(name)
    
    products.push({ name, category, image: url })
  }
  
  console.log(`[v0] Parsed ${products.length} unique products\n`)
  
  // Group by category
  const byCategory = {}
  for (const p of products) {
    if (!byCategory[p.category]) byCategory[p.category] = []
    byCategory[p.category].push(p)
  }
  
  // Output as TypeScript
  console.log('// Paste this into your inventory data file:\n')
  console.log('export const INVENTORY: Product[] = [')
  for (const p of products) {
    console.log(`  { name: '${p.name}', category: '${p.category}', image: '${p.image}' },`)
  }
  console.log(']')
}

scrapeLounge()
