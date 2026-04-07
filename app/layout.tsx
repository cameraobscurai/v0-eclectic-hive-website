import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Saol Display is loaded via @font-face in globals.css from Blob storage

export const metadata: Metadata = {
  title: 'Eclectic Hive | Design + Production',
  description: 'Two parts luxe, one part regal, and a dash of edge. Full-service design and production house creating cinematic, art-forward event environments.',
  keywords: ['event design', 'fabrication', 'production', 'luxury events', 'destination events', 'custom design', 'environment design'],
  authors: [{ name: 'Eclectic Hive' }],
  openGraph: {
    title: 'Eclectic Hive | Design + Production',
    description: 'Two parts luxe, one part regal, and a dash of edge. Full-service design and production house.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ed' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1816' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
<body className="font-sans antialiased">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-charcoal focus:text-cream focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
