import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that require authentication
// TODO: Re-enable auth after setting up admin account
const protectedRoutes: string[] = [] // ['/admin'] - temporarily disabled

// API routes that require authentication
// TODO: Re-enable auth after setting up admin account
const protectedApiRoutes: string[] = [] // temporarily disabled

export async function middleware(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request)
  
  const { pathname } = request.nextUrl

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute || isProtectedApi) {
    // Create a Supabase client to check auth
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

    if (!user) {
      if (isProtectedApi) {
        // Return 401 for API routes
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      // Redirect to login for page routes
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
