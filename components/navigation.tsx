'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TransitionLink } from '@/components/page-transition'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/atelier', label: 'Atelier by The Hive' },
  { href: '/collection', label: 'Hive Signature Collection' },
  // { href: '/studio', label: 'Studio' }, // Hidden for now - consolidated into Atelier
  { href: '/gallery', label: 'The Gallery' },
  { href: '/contact', label: 'Contact' },
]

// Pages with light (cream) backgrounds need dark nav text
const LIGHT_BG_PAGES = ['/collection', '/contact', '/faq', '/privacy', '/studio', '/process']

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  
  // Determine if current page has light background (needs dark nav)
  const isLightPage = LIGHT_BG_PAGES.includes(pathname)

  // B6: Refs to gate setState calls - prevents React reconciling every scroll frame
  const lastScrollY = useRef(0)
  const scrolledRef = useRef(false)
  const hiddenRef = useRef(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Close mobile menu whenever the route changes and ensure scroll is restored
  useEffect(() => {
    setIsOpen(false)
    document.body.style.removeProperty('overflow')
  }, [pathname])

  // B5+B6: Optimized scroll handler with ref guards
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight

      // B6: Only call setState when value actually changes
      const nowScrolled = y > 100
      if (nowScrolled !== scrolledRef.current) {
        scrolledRef.current = nowScrolled
        setScrolled(nowScrolled)
      }

      // Progress bar is continuous — stays as-is
      setProgress(docHeight > 0 ? (y / docHeight) * 100 : 0)

      const nowHidden = y > lastScrollY.current && y > 200
      if (nowHidden !== hiddenRef.current) {
        hiddenRef.current = nowHidden
        setHidden(nowHidden)
      }

      // Show scroll-to-top after scrolling 50% of viewport
      setShowScrollTop(y > window.innerHeight * 0.5)

      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.removeProperty('overflow')
    }
    return () => {
      document.body.style.removeProperty('overflow')
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
              ? 'bg-cream/80 backdrop-blur-sm' 
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
          <Link href="/" className="relative group nav-logo" aria-label="ECLECTIC HIVE — home">
            <span
              className={cn(
                "font-brand text-[0.8rem] lg:text-[0.9rem] tracking-[0.18em] uppercase transition-colors duration-300",
                scrolled ? "text-cream" : isLightPage ? "text-charcoal" : "text-cream"
              )}
              style={{ fontWeight: 400 }}
            >
              ECLECTIC HIVE
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-12">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href
              const textColor = scrolled || !isLightPage
                ? (active ? 'text-cream' : 'text-cream/70 hover:text-cream')
                : (active ? 'text-charcoal' : 'text-charcoal/70 hover:text-charcoal')
              const underlineColor = scrolled || !isLightPage ? 'bg-cream/50' : 'bg-charcoal/50'
              return (
                <TransitionLink
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
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                  />
                </TransitionLink>
              )
            })}
          </div>

          {/* Mobile burger - 44px minimum touch target */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="lg:hidden flex flex-col justify-center items-center w-11 h-11 min-w-[44px] min-h-[44px] -mr-2 touch-manipulation"
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
        <div className="flex flex-col h-full pt-24 px-6" style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom, 3rem))' }}>
          <nav className="flex-1 flex flex-col justify-center">
            {/* Home link - minimum touch target */}
            <TransitionLink
              href="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                'py-4 min-h-[44px] flex items-center touch-manipulation transition-all duration-500',
                isOpen
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-8'
              )}
              style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
            >
              <span className="text-cream font-display text-[7vw] sm:text-4xl md:text-5xl tracking-tight font-light italic hover:text-sand transition-colors">
                Home
              </span>
            </TransitionLink>

            {/* Page links - minimum touch targets */}
            {NAV_LINKS.map((link, i) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'py-4 min-h-[44px] flex items-center touch-manipulation transition-all duration-500',
                  isOpen
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-8'
                )}
                style={{ transitionDelay: isOpen ? `${150 + i * 50}ms` : '0ms' }}
              >
                <span
                  className={cn(
                    'font-display text-[7vw] sm:text-4xl md:text-5xl tracking-tight font-light italic transition-colors',
                    pathname === link.href
                      ? 'text-cream'
                      : 'text-cream/70 hover:text-cream'
                  )}
                >
                  {link.label}
                </span>
              </TransitionLink>
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

      {/* Minimal scroll-to-top - appears as subtle line that grows on hover */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-8 right-8 z-40 group flex items-center gap-2 transition-all duration-500',
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ bottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}
        aria-label="Scroll to top"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream/30 group-hover:text-cream/60 transition-colors duration-300 hidden sm:block">
          Top
        </span>
        <span className="w-8 h-px bg-cream/20 group-hover:bg-cream/50 group-hover:w-12 transition-all duration-300" />
      </button>
    </>
  )
}
