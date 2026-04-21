'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

// ============================================================================
// SAFE REDIRECT VALIDATION
// Prevents open redirect attacks by only allowing internal paths
// ============================================================================
function getSafeRedirect(redirectParam: string | null): string {
  if (!redirectParam) return '/admin'
  
  // Only allow paths starting with / (no protocol, no host)
  // Reject anything that could be an external URL
  if (
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//') &&
    !redirectParam.includes(':')
  ) {
    return redirectParam
  }
  
  return '/admin'
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      // Safely redirect after login (prevents open redirect attacks)
      const redirectTo = getSafeRedirect(searchParams.get('redirect'))
      router.push(redirectTo)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="font-display text-2xl tracking-[0.2em] text-charcoal">
            ECLECTIC HIVE
          </h1>
          <p className="text-xs tracking-[0.15em] text-charcoal/50 mt-2 uppercase">
            Admin Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/60 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-charcoal/10 text-charcoal text-sm focus:outline-none focus:border-charcoal/30 transition-colors"
              placeholder="admin@eclectichive.com"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/60 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-charcoal/10 text-charcoal text-sm focus:outline-none focus:border-charcoal/30 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-charcoal text-cream text-xs uppercase tracking-[0.15em] hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Back to site */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-xs text-charcoal/40 hover:text-charcoal underline underline-offset-4 transition-colors"
          >
            Back to site
          </a>
        </div>
      </div>
    </div>
  )
}
