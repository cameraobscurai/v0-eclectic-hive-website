import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eclectic Hive | Design & Fabrication Studio',
  description: 'Denver-based event design, production, and fabrication house. We create authored environments through design intelligence, proprietary inventory, and fabrication expertise.',
  keywords: ['event design', 'fabrication', 'production', 'Denver', 'luxury events', 'custom design', 'environment design'],
  authors: [{ name: 'Eclectic Hive' }],
  openGraph: {
    title: 'Eclectic Hive | Design & Fabrication Studio',
    description: 'We create authored environments through design intelligence, proprietary inventory, and fabrication expertise.',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
