/**
 * Inventory Scraper for Eclectic Hive
 * 
 * This script fetches the inventory page HTML and extracts product data
 * including names, categories, and image URLs.
 * 
 * Run with: node scripts/scrape-inventory.js
 */

const INVENTORY_URL = 'https://www.eclectichive.com/inventory';

async function scrapeInventory() {
  console.log('[v0] Fetching inventory page...');
  
  try {
    const response = await fetch(INVENTORY_URL);
    const html = await response.text();
    
    // Extract product blocks - Squarespace uses specific markup
    // Look for product items with images and titles
    
    // Find all image URLs (Squarespace CDN pattern)
    const imageMatches = html.matchAll(/https:\/\/images\.squarespace-cdn\.com\/content\/[^"'\s]+\.(png|jpg|jpeg|webp)/gi);
    const images = [...new Set([...imageMatches].map(m => m[0]))];
    
    // Find product titles (h1 or specific class patterns)
    const titleMatches = html.matchAll(/<h1[^>]*class="[^"]*ProductItem[^"]*"[^>]*>([^<]+)<\/h1>/gi);
    const titles = [...titleMatches].map(m => m[1].trim());
    
    console.log('\n[v0] Found images:', images.length);
    console.log('[v0] Sample images:');
    images.slice(0, 10).forEach((img, i) => console.log(`  ${i + 1}. ${img}`));
    
    console.log('\n[v0] Found titles:', titles.length);
    
    // Also look for data attributes or JSON embedded in page
    const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/s);
    if (jsonMatch) {
      console.log('\n[v0] Found embedded JSON data!');
      try {
        const data = JSON.parse(jsonMatch[1]);
        console.log('[v0] JSON structure:', Object.keys(data));
      } catch (e) {
        console.log('[v0] Could not parse JSON');
      }
    }
    
    // Output the raw HTML structure for analysis
    console.log('\n[v0] HTML snippet (first 5000 chars):');
    console.log(html.substring(0, 5000));
    
    // Look for product grid/list patterns
    const productSectionMatch = html.match(/<div[^>]*class="[^"]*products?-list[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (productSectionMatch) {
      console.log('\n[v0] Found product list section');
    }
    
  } catch (error) {
    console.error('[v0] Error:', error.message);
  }
}

scrapeInventory();
