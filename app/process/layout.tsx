import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Process | ECLECTIC HIVE',
  description: 'How we work — from first consultation through production and execution. Every engagement is a fully authored environment.',
  robots: { index: true, follow: true },
}

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return children
}
