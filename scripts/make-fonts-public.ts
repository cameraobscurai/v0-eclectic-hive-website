import { get, put, list } from '@vercel/blob'

async function makeFontsPublic() {
  const { blobs } = await list()
  
  const fonts = blobs.filter(b => 
    b.pathname.includes('Saol') && b.pathname.endsWith('.otf')
  )
  
  console.log('Found fonts to make public:')
  
  for (const font of fonts) {
    console.log(`Processing: ${font.pathname}`)
    
    // Fetch the private blob
    const response = await fetch(font.downloadUrl)
    const buffer = await response.arrayBuffer()
    
    // Re-upload as public with fonts/ prefix
    const publicBlob = await put(`fonts/${font.pathname}`, buffer, {
      access: 'public',
      contentType: 'font/otf',
    })
    
    console.log(`Public URL: ${publicBlob.url}`)
  }
}

makeFontsPublic()
