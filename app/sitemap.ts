import { MetadataRoute } from 'next'

const BASE_URL = 'https://eclectichive.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages = [
    '',
    '/atelier',
    // '/collection' removed - noindex'd via collection/layout.tsx
    '/gallery',
    '/contact',
    '/faq',
    '/privacy',
    '/process',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }))

  return staticEntries
}
