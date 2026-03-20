'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/atelier', label: 'Atelier' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/team', label: 'The Hive' },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Inquire' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <nav className="flex items-center justify-between px-6 py-6 lg:px-12 lg:py-8">
          <Link 
            href="/" 
            className="text-primary-foreground font-serif text-xl tracking-tight hover:opacity-70 transition-opacity"
          >
            Eclectic Hive
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary-foreground text-sm tracking-wide uppercase editorial-link hover:opacity-70 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <span className={cn(
              "w-6 h-px bg-primary-foreground transition-all duration-300",
              isOpen && "rotate-45 translate-y-1"
            )} />
            <span className={cn(
              "w-6 h-px bg-primary-foreground transition-all duration-300",
              isOpen && "-rotate-45 -translate-y-0.5"
            )} />
          </button>
        </nav>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-charcoal transition-all duration-500",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <nav className="flex flex-col items-start justify-center h-full px-8 gap-6">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="text-cream font-serif text-4xl tracking-tight hover:text-terracotta transition-colors"
          >
            Home
          </Link>
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-cream font-serif text-4xl tracking-tight hover:text-terracotta transition-colors"
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
