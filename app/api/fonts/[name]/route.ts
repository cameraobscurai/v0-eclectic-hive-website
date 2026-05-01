import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  
  if (!name || !name.endsWith('.otf')) {
    return NextResponse.json({ error: 'Invalid font name' }, { status: 400 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const { data, error } = await supabase.storage
      .from('fonts')
      .download(name)
    
    if (error || !data) {
      console.error('Font fetch error:', error)
      return NextResponse.json({ error: 'Font not found' }, { status: 404 })
    }

    const buffer = await data.arrayBuffer()
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'font/otf',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Font route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
