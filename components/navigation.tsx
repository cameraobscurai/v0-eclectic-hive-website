'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/atelier', label: 'Atelier by The Hive' },
  { href: '/collection', label: 'Hive Signature Collection' },
  { href: '/gallery', label: 'The Gallery' },
  { href: '/studio', label: 'Studio' },
  { href: '/contact', label: 'Contact' },
]

// Pages with light (cream) backgrounds need dark nav text
const LIGHT_BG_PAGES = ['/collection', '/contact', '/faq', '/privacy', '/design', '/studio']

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  
  // Determine if current page has light background (needs dark nav)
  const isLightPage = LIGHT_BG_PAGES.includes(pathname)

  // FIX: useRef prevents the stale closure that caused the old
  // scroll handler to re-subscribe on every render.
  const lastScrollY = useRef(0)

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Single scroll listener — reads/writes ref, never re-subscribes
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      setScrolled(y > 100)
      setProgress(docHeight > 0 ? (y / docHeight) * 100 : 0)

      if (y > lastScrollY.current && y > 200) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, []) // empty — no stale closure risk

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* ── Fixed header ── */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled 
            ? 'bg-charcoal/95 backdrop-blur-sm' 
            : isLightPage 
              ? 'bg-cream/95 backdrop-blur-sm' 
              : 'bg-transparent',
          hidden && !isOpen ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <nav
          className={cn(
            'flex items-center justify-between px-6 lg:px-12 transition-all duration-300',
            scrolled ? 'py-4 lg:py-5' : 'py-6 lg:py-8'
          )}
        >
          {/* Wordmark */}
          <Link href="/" className="relative group" aria-label="Eclectic Hive — home">
            <span
              className={cn(
                "font-display text-2xl lg:text-3xl tracking-tight font-light italic transition-colors duration-300",
                scrolled ? "text-cream" : isLightPage ? "text-charcoal" : "text-cream"
              )}
            >
              Eclectic Hive
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              const textColor = scrolled || !isLightPage
                ? (active ? 'text-cream' : 'text-cream/70 hover:text-cream')
                : (active ? 'text-charcoal' : 'text-charcoal/70 hover:text-charcoal')
              const underlineColor = scrolled || !isLightPage ? 'bg-cream/50' : 'bg-charcoal/50'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative group text-xs tracking-[0.2em] uppercase font-light transition-colors duration-300',
                    textColor
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 w-full h-px origin-left transition-transform duration-300',
                      underlineColor,
                      active
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </Link>
              )
            })}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={cn(
                'w-6 h-px transition-all duration-300 ease-out',
                scrolled || !isLightPage ? 'bg-cream' : 'bg-charcoal',
                isOpen ? 'rotate-45 translate-y-px' : '-translate-y-1'
              )}
            />
            <span
              className={cn(
                'w-6 h-px transition-all duration-300 ease-out',
                scrolled || !isLightPage ? 'bg-cream' : 'bg-charcoal',
                isOpen ? '-rotate-45' : 'translate-y-1'
              )}
            />
          </button>
        </nav>

        {/* Scroll progress bar */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          scrolled || !isLightPage ? 'bg-cream/5' : 'bg-charcoal/10'
        )} aria-hidden="true">
          <div
            className="h-full bg-sand transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-40 bg-charcoal transition-all duration-700 ease-out',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col h-full pt-24 pb-12 px-6">
          <nav className="flex-1 flex flex-col justify-center">
            {/* Home link */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                'py-3 transition-all duration-500',
                isOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-8'
              )}
              style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
            >
              <span className="text-cream font-display text-4xl md:text-5xl tracking-tight font-light italic hover:text-sand transition-colors">
                Home
              </span>
            </Link>

            {/* Page links */}
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'py-3 transition-all duration-500',
                  isOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                )}
                style={{ transitionDelay: isOpen ? `${150 + i * 50}ms` : '0ms' }}
              >
                <span
                  className={cn(
                    'font-display text-4xl md:text-5xl tracking-tight font-light italic transition-colors',
                    pathname === link.href
                      ? 'text-cream'
                      : 'text-cream/70 hover:text-cream'
                  )}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer info */}
          <div
            className={cn(
              'pt-8 border-t border-cream/10 transition-all duration-500',
              isOpen
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            )}
            style={{ transitionDelay: isOpen ? '400ms' : '0ms' }}
          >
            <p className="text-cream/40 text-sm">Denver, Colorado</p>
            <a
              href="mailto:hello@eclectichive.com"
              className="text-cream/60 text-sm hover:text-cream transition-colors"
            >
              hello@eclectichive.com
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
