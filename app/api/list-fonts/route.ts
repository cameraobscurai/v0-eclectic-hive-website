import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list()
    
    const fonts = blobs.filter(blob => 
      blob.pathname.endsWith('.otf') || 
      blob.pathname.endsWith('.woff') || 
      blob.pathname.endsWith('.woff2') ||
      blob.pathname.endsWith('.ttf')
    )
    
    return NextResponse.json({ fonts })
  } catch (error) {
    console.error('Error listing fonts:', error)
    return NextResponse.json({ error: 'Failed to list fonts' }, { status: 500 })
  }
}
