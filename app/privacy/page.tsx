import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Eclectic Hive',
  description: 'Privacy policy for Eclectic Hive. How we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-16 lg:pt-48 lg:pb-24">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
              Legal
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-8 text-cream/50 text-sm">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>
      
      {/* Content */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="prose prose-lg prose-neutral">
              <div className="flex flex-col gap-12">
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Eclectic Hive (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is 
                    committed to protecting your personal information. This Privacy Policy 
                    explains how we collect, use, disclose, and safeguard your information 
                    when you visit our website or engage our services.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may collect personal information that you voluntarily provide to us 
                    when you:
                  </p>
                  <ul className="flex flex-col gap-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Submit an inquiry through our contact form
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Request access to our assets portal
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Subscribe to our newsletter
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Engage our design, fabrication, or production services
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    This information may include your name, email address, phone number, 
                    event details, and any other information you choose to provide.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="flex flex-col gap-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Respond to your inquiries and provide customer service
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Deliver the services you have requested
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Send you relevant updates about your project
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Improve our website and services
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2.5 shrink-0" />
                      Comply with legal obligations
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information 
                    to third parties without your consent, except as necessary to provide 
                    our services (e.g., sharing relevant details with vendors involved in 
                    your project) or as required by law.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational measures to 
                    protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of 
                    transmission over the Internet is 100% secure, and we cannot 
                    guarantee absolute security.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You have the right to access, correct, or delete your personal 
                    information. You may also opt out of receiving marketing communications 
                    from us at any time. To exercise these rights, please contact us at 
                    studio@eclectichive.com.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our website may use cookies and similar tracking technologies to 
                    enhance your browsing experience. You can configure your browser to 
                    refuse cookies, though this may limit certain functionality.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify 
                    you of any changes by posting the new policy on this page and updating 
                    the &quot;Last updated&quot; date.
                  </p>
                </div>
                
                <div>
                  <h2 className="font-serif text-2xl tracking-tight mb-4">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact 
                    us at:
                  </p>
                  <div className="mt-4 text-foreground">
                    <p>Eclectic Hive</p>
                    <p>Denver, Colorado</p>
                    <p>studio@eclectichive.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
