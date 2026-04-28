/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors now fail the build (security best practice)
  // Run `tsc --noEmit` locally to catch errors before deploying
  
  // Tree-shake large icon/component libraries
  optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'date-fns'],
  
  images: {
    // Prefer AVIF (40-55% smaller than JPEG), fallback to WebP
    formats: ['image/avif', 'image/webp'],
    // Quality levels for responsive images
    qualities: [60, 75],
    // Optimized device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Long cache for immutable images
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
