import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// Cache processed images in memory (in production, use Redis/Blob storage)
const imageCache = new Map<string, Buffer>()

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    // Check cache first
    if (imageCache.has(url)) {
      return new NextResponse(imageCache.get(url), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Fetch the original image
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)
    
    // Load image with sharp
    const image = sharp(inputBuffer)
    const metadata = await image.metadata()
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not read image dimensions')
    }

    // Get raw pixel data
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Sample background color from corners (top-left, top-right, bottom-left, bottom-right)
    const getPixel = (x: number, y: number) => {
      const idx = (y * info.width + x) * 4
      return {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
        a: data[idx + 3],
      }
    }

    // Sample multiple points from corners to find background color
    const samples = [
      getPixel(5, 5),
      getPixel(info.width - 6, 5),
      getPixel(5, info.height - 6),
      getPixel(info.width - 6, info.height - 6),
      getPixel(10, 10),
      getPixel(info.width - 11, 10),
    ]

    // Average the corner samples to get background color
    const bgColor = {
      r: Math.round(samples.reduce((sum, p) => sum + p.r, 0) / samples.length),
      g: Math.round(samples.reduce((sum, p) => sum + p.g, 0) / samples.length),
      b: Math.round(samples.reduce((sum, p) => sum + p.b, 0) / samples.length),
    }

    // Tolerance for background removal (how close a pixel needs to be to bg color)
    const tolerance = 25

    // Create new buffer with transparency
    const newData = Buffer.alloc(data.length)
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      // Check if pixel is close to background color
      const diffR = Math.abs(r - bgColor.r)
      const diffG = Math.abs(g - bgColor.g)
      const diffB = Math.abs(b - bgColor.b)
      
      if (diffR <= tolerance && diffG <= tolerance && diffB <= tolerance) {
        // Make transparent
        newData[i] = r
        newData[i + 1] = g
        newData[i + 2] = b
        newData[i + 3] = 0 // Fully transparent
      } else {
        // Keep original
        newData[i] = r
        newData[i + 1] = g
        newData[i + 2] = b
        newData[i + 3] = a
      }
    }

    // Create final PNG with transparency
    const outputBuffer = await sharp(newData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer()

    // Cache the result
    imageCache.set(url, outputBuffer)

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('[v0] Image processing error:', error)
    // Fallback: redirect to original image
    return NextResponse.redirect(url)
  }
}
