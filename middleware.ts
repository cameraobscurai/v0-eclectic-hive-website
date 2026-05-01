import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ============================================================================
// SCRAPER USER-AGENT BLOCKING
// Block known scraping tools from accessing public API routes
// ============================================================================
const SCRAPER_USER_AGENTS = [
  'firecrawl',
  'python-requests',
  'curl',
  'wget',
  'scrapy',
  'httpclient',
  'java/',
  'libwww',
  'lwp-trivial',
  'go-http-client',
]

const PUBLIC_API_ROUTES = ['/api/products', '/api/categories', '/api/import-inventory-csv']

function isScraperUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return SCRAPER_USER_AGENTS.some(scraper => ua.includes(scraper))
}

// ============================================================================
// ADMIN ALLOWLIST
// Set ADMIN_EMAILS in Vercel env vars as a comma-separated list of addresses.
// If ADMIN_EMAILS is empty or missing, ALL admin access is denied (fail-closed).
// ============================================================================
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

if (ADMIN_EMAILS.length === 0 && process.env.NODE_ENV === 'production') {
  console.error(
    '[middleware] ADMIN_EMAILS env var is empty — ' +
    'all /admin and mutating API access will be denied. ' +
    'Set ADMIN_EMAILS in Vercel environment variables.'
  )
}

// Routes that require authentication
const protectedRoutes = ['/admin']

// API routes that require authentication (mutating endpoints only —
// do NOT add /api/inquiry, /api/products, /api/categories, /api/fonts,
// /api/list-fonts, or /api/inventory-image GET here)
const protectedApiRoutes = [
  '/api/upload-inventory',
  '/api/upload-font',
  // NOTE: /api/import-inventory-csv is intentionally NOT protected for dev imports
  '/api/inventory-image/update',
  '/api/admin',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Block scrapers from public API routes ────────────────────────────────
  const isPublicApiRoute = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))
  if (isPublicApiRoute) {
    const userAgent = request.headers.get('user-agent')
    if (isScraperUserAgent(userAgent)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
  }

  // Always update the session so Supabase auth cookies stay fresh
  const response = await updateSession(request)


  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isProtectedApi   = protectedApiRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute || isProtectedApi) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ── Not logged in ──────────────────────────────────────────────────────
    if (!user) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // ── Logged in but not on the allowlist ─────────────────────────────────
    // IMPORTANT: the ADMIN_EMAILS.length > 0 guard has been intentionally
    // removed. When ADMIN_EMAILS is empty the check below evaluates to
    // !ADMIN_EMAILS.includes(userEmail) === true, so access is denied.
    // This is the correct fail-closed behaviour.
    const userEmail = user.email?.toLowerCase()
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      if (isProtectedApi) {
        return NextResponse.json(
          { error: 'Forbidden: admin access required' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
