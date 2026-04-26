import { Metadata } from 'next'

// Force dynamic rendering for collection page - uses nuqs URL state
export const dynamic = 'force-dynamic'

// Prevent search engine indexing of inventory data
export const metadata: Metadata = {
  title: 'Hive Signature Collection | ECLECTIC HIVE',
  description: 'Browse our curated collection of luxury furniture and decor.',
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

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
