'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const footerLinks = {
  studio: [
    { href: '/atelier', label: 'Atelier by The Hive' },
    { href: '/collection', label: 'Hive Signature Collection' },
    { href: '/gallery', label: 'The Gallery' },
    { href: '/contact', label: 'Contact' },
  ],
  info: [
    { href: '/faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy Policy' },
  ],
}

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={ref} className="bg-charcoal text-cream">
      <div className="px-6 lg:px-12 pt-24 lg:pt-36" style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 6rem))' }}>
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand */}
            <div 
              className={cn(
                'lg:col-span-5 transition-all duration-1000',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <Link href="/" className="font-display text-4xl lg:text-5xl tracking-tight font-light italic inline-block group">
                <span className="relative">
                  Eclectic Hive
                  <span className="absolute -bottom-2 left-0 w-full h-px bg-cream/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </span>
              </Link>
              <p className="mt-8 text-cream/50 max-w-sm leading-relaxed">
                Two parts luxe, one part regal, and a dash of edge. A full-service design 
                and production house creating cinematic, art-forward event environments.
              </p>
              <p className="mt-10 text-sm text-cream/30">
                Denver, Colorado
              </p>
            </div>
            
            {/* Links */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
              <div 
                className={cn(
                  'transition-all duration-1000',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '100ms' }}
              >
                <h4 className="text-xs uppercase tracking-[0.2em] text-cream/30 mb-7">Studio</h4>
                <ul className="flex flex-col gap-1">
                  {footerLinks.studio.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-cream/70 hover:text-cream transition-colors duration-300 relative inline-block group py-2 touch-manipulation"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div 
                className={cn(
                  'transition-all duration-1000',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '200ms' }}
              >
                <h4 className="text-xs uppercase tracking-[0.2em] text-cream/30 mb-7">Information</h4>
                <ul className="flex flex-col gap-1">
                  {footerLinks.info.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-cream/70 hover:text-cream transition-colors duration-300 relative inline-block group py-2 touch-manipulation"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div 
                className={cn(
                  'transition-all duration-1000',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: '300ms' }}
              >
                <h4 className="text-xs uppercase tracking-[0.2em] text-cream/30 mb-7">Connect</h4>
                <ul className="flex flex-col gap-1">
                  <li>
                    <a 
                      href="https://www.instagram.com/eclectichive/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cream/70 hover:text-cream transition-colors duration-300 relative inline-block group py-2 touch-manipulation"
                    >
                      Instagram
                      <span className="absolute -bottom-0.5 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.pinterest.com/eclectichive/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cream/70 hover:text-cream transition-colors duration-300 relative inline-block group py-2 touch-manipulation"
                    >
                      Pinterest
                      <span className="absolute -bottom-0.5 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="mailto:studio@eclectichive.com"
                      className="text-cream/70 hover:text-cream transition-colors duration-300 relative inline-block group py-2 touch-manipulation"
                    >
                      Email
                      <span className="absolute -bottom-0.5 left-0 w-full h-px bg-cream/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div 
            className={cn(
              'mt-24 pt-10 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-1000',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            <p className="text-xs text-cream/30">
              {new Date().getFullYear()} Eclectic Hive. All rights reserved.
            </p>
            <Link 
              href="/privacy"
              className="text-xs text-cream/30 hover:text-cream/60 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
