import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Gallery | ECLECTIC HIVE',
  description: 'Selected work from ECLECTIC HIVE — luxury event design and production across Colorado, Utah, and beyond.',
  robots: { index: true, follow: true },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
