import { list } from '@vercel/blob'

async function listFonts() {
  const { blobs } = await list()
  
  const fonts = blobs.filter(b => 
    b.pathname.includes('Saol') || 
    b.pathname.endsWith('.otf') || 
    b.pathname.endsWith('.woff') || 
    b.pathname.endsWith('.woff2') ||
    b.pathname.endsWith('.ttf')
  )
  
  console.log('Font files in Blob storage:')
  fonts.forEach(font => {
    console.log(`- ${font.pathname}: ${font.url}`)
  })
  
  if (fonts.length === 0) {
    console.log('No font files found. Listing all blobs:')
    blobs.forEach(b => console.log(`- ${b.pathname}: ${b.url}`))
  }
}

listFonts()
