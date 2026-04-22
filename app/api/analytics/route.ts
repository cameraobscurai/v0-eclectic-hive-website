import { NextRequest, NextResponse } from 'next/server'

/**
 * Analytics endpoint - receives events from fetchLater/sendBeacon
 * 
 * In production, this would forward to your analytics provider
 * (Vercel Analytics, Plausible, PostHog, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.event, event.properties)
    }
    
    // In production, forward to your analytics provider:
    // await fetch('https://your-analytics.com/track', { ... })
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}

// Support GET for health checks
export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
