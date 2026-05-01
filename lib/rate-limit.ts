import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Check if Redis credentials are available
const hasRedisCredentials = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

// Create Redis client only if credentials exist
const redis = hasRedisCredentials
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null

// Rate limiter: 30 requests per minute per IP (only if Redis is available)
const rateLimiterInstance = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      analytics: true,
      prefix: 'eclectic-hive-api',
    })
  : null

// Fail-open rate limiter - if Redis is unavailable, allow the request
export const rateLimiter = {
  async limit(identifier: string) {
    if (!rateLimiterInstance) {
      // No Redis - fail open (allow request)
      return { success: true, limit: 30, remaining: 30, reset: Date.now() + 60000 }
    }
    try {
      return await rateLimiterInstance.limit(identifier)
    } catch (error) {
      // Redis error - fail open (allow request)
      console.error('[v0] Rate limiter error, failing open:', error)
      return { success: true, limit: 30, remaining: 30, reset: Date.now() + 60000 }
    }
  },
}

// Security headers for public API routes
export const API_SECURITY_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'private, no-store',
}

// Helper to get client IP from request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  return '127.0.0.1'
}
