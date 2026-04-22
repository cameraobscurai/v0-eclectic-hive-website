import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { PageTransitionProvider } from '@/components/page-transition'
import { InquiryTray } from '@/components/inquiry-tray'
import { ScrollReset } from '@/components/scroll-reset'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Saol Display is loaded via @font-face in globals.css from Blob storage

export const metadata: Metadata = {
  metadataBase: new URL('https://eclectichive.com'),
  title: {
    default: 'Eclectic Hive | Luxury Event Design & Production | Denver',
    template: '%s | Eclectic Hive',
  },
  description: 'Two parts luxe, one part regal, and a dash of edge. Full-service luxury event design, custom fabrication, and furniture rentals in Denver, Colorado. Creating cinematic, art-forward environments for weddings, galas, and corporate events.',
  keywords: ['luxury event design', 'event fabrication', 'furniture rental Denver', 'wedding design', 'corporate event design', 'custom fabrication', 'destination events', 'Denver event planner', 'luxury furniture rental', 'event production'],
  authors: [{ name: 'Eclectic Hive' }],
  creator: 'Eclectic Hive',
  publisher: 'Eclectic Hive',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Eclectic Hive | Luxury Event Design & Production',
    description: 'Two parts luxe, one part regal, and a dash of edge. Full-service design and production house creating cinematic event environments.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Eclectic Hive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eclectic Hive | Luxury Event Design & Production',
    description: 'Two parts luxe, one part regal, and a dash of edge. Full-service design and production house.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ed' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1816' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

// JSON-LD Structured Data for SEO and AI Chat optimization
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://eclectichive.com',
  name: 'Eclectic Hive',
  description: 'Full-service luxury event design, custom fabrication, and furniture rental company creating cinematic, art-forward environments.',
  url: 'https://eclectichive.com',
  // telephone: Contact via inquiry form
  email: 'hello@eclectichive.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Denver',
    addressRegion: 'CO',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.7392,
    longitude: -104.9903,
  },
  areaServed: [
    { '@type': 'State', name: 'Colorado' },
    { '@type': 'Country', name: 'United States' },
  ],
  priceRange: '$$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [
    'https://www.instagram.com/eclectichive',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Event Design Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Event Design',
          description: 'Full-service event design from concept to execution',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Furniture Rental',
          description: 'Curated collection of luxury furniture for events',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Fabrication',
          description: 'Bespoke fabrication and installation services',
        },
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-charcoal`} data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to Vercel Blob for faster first image load */}
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        
        {/* Preload brand fonts to eliminate FOUT - highest priority */}
        <link
          rel="preload"
          href="/api/fonts/SaolDisplay-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/api/fonts/SaolDisplay-LightItalic.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Speculation Rules - prerender likely destinations for instant navigation */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            prerender: [
              {
                where: { href_matches: ["/collection", "/gallery", "/process", "/contact"] },
                eagerness: "moderate" // triggers on hover, not immediately
              }
            ],
            prefetch: [
              {
                where: { href_matches: "/piece/*" },
                eagerness: "conservative" // triggers on stronger intent signals
              }
            ]
          }) }}
        />
      </head>
      <body className="font-sans antialiased overflow-y-auto">
        <NuqsAdapter>
          <ScrollReset />
          <PageTransitionProvider>
            {/* Skip to main content link for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-cream focus:outline-none"
            >
              Skip to main content
            </a>
            {children}
          </PageTransitionProvider>
          <InquiryTray />
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  )
}
