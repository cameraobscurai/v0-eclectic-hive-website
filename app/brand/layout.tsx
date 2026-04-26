import { Metadata } from 'next'

// Prevent search engine indexing of internal brand pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
