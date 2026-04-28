import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | ECLECTIC HIVE',
  description: 'Answers to common questions about working with ECLECTIC HIVE — our process, services, minimums, and more.',
  robots: { index: true, follow: true },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
