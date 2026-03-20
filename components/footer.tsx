import Link from 'next/link'

const footerLinks = {
  studio: [
    { href: '/atelier', label: 'Atelier' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/team', label: 'The Hive' },
  ],
  info: [
    { href: '/process', label: 'Working With Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/assets', label: 'Assets Portal' },
    { href: '/contact', label: 'Inquire' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-5">
              <Link href="/" className="font-serif text-3xl lg:text-4xl tracking-tight">
                Eclectic Hive
              </Link>
              <p className="mt-6 text-cream/60 max-w-sm leading-relaxed">
                A design and fabrication studio creating authored environments through 
                proprietary inventory, material intelligence, and production expertise.
              </p>
              <p className="mt-8 text-sm text-cream/40">
                Denver, Colorado
              </p>
            </div>
            
            {/* Links */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-6">Studio</h4>
                <ul className="flex flex-col gap-3">
                  {footerLinks.studio.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-cream/80 hover:text-cream transition-colors editorial-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-6">Information</h4>
                <ul className="flex flex-col gap-3">
                  {footerLinks.info.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-cream/80 hover:text-cream transition-colors editorial-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-6">Connect</h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cream/80 hover:text-cream transition-colors editorial-link"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://pinterest.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cream/80 hover:text-cream transition-colors editorial-link"
                    >
                      Pinterest
                    </a>
                  </li>
                  <li>
                    <a 
                      href="mailto:studio@eclectichive.com"
                      className="text-cream/80 hover:text-cream transition-colors editorial-link"
                    >
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-xs text-cream/40">
              {new Date().getFullYear()} Eclectic Hive. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-xs text-cream/40 hover:text-cream/60 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
