'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/gallery', label: 'Design + Production' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/team', label: 'The Hive' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determine if scrolled past threshold
      setScrolled(currentScrollY > 100)
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'bg-charcoal/95 backdrop-blur-sm' : 'bg-transparent',
          hidden && !isOpen ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <nav className={cn(
          'flex items-center justify-between px-6 lg:px-12 transition-all duration-300',
          scrolled ? 'py-4 lg:py-5' : 'py-6 lg:py-8'
        )}>
          {/* Logo */}
          <Link 
            href="/" 
            className="relative group"
          >
            <span className={cn(
              'font-serif text-xl tracking-tight transition-colors duration-300',
              scrolled || isOpen ? 'text-cream' : 'text-cream'
            )}>
              Eclectic Hive
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className={cn(
                  'text-sm tracking-wide uppercase transition-colors duration-300',
                  scrolled ? 'text-cream/80 hover:text-cream' : 'text-cream/80 hover:text-cream'
                )}>
                  {link.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-px bg-cream/50 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={cn(
              'w-6 h-px bg-cream transition-all duration-300 ease-out',
              isOpen ? 'rotate-45 translate-y-px' : '-translate-y-1'
            )} />
            <span className={cn(
              'w-6 h-px bg-cream transition-all duration-300 ease-out',
              isOpen ? '-rotate-45' : 'translate-y-1'
            )} />
          </button>
        </nav>
        
        {/* Progress Bar */}
        <ProgressBar />
      </header>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          'fixed inset-0 z-40 bg-charcoal transition-all duration-700 ease-out',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col h-full pt-24 pb-12 px-6">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className={cn(
                'py-3 transition-all duration-500',
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              )}
              style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
            >
              <span className="text-cream font-serif text-4xl md:text-5xl tracking-tight hover:text-terracotta transition-colors">
                Home
              </span>
            </Link>
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'py-3 transition-all duration-500',
                  isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                )}
                style={{ transitionDelay: isOpen ? `${150 + index * 50}ms` : '0ms' }}
              >
                <span className="text-cream font-serif text-4xl md:text-5xl tracking-tight hover:text-terracotta transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* Footer Info */}
          <div 
            className={cn(
              'pt-8 border-t border-cream/10 transition-all duration-500',
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
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

function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollProgress)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 h-px bg-cream/5">
      <div 
        className="h-full bg-terracotta/60 transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
