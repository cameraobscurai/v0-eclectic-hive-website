import { MetadataRoute } from 'next'

const BASE_URL = 'https://eclectichive.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages = [
    '',
    '/atelier',
    '/collection',
    '/gallery',
    '/contact',
    '/faq',
    '/privacy',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/collection' ? 0.9 : 0.7,
  }))

  return staticEntries
}
