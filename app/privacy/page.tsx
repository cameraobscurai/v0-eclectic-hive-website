import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | ECLECTIC HIVE',
  description: 'Privacy policy for ECLECTIC HIVE. How we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen bg-cream">
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="px-6 lg:px-12 max-w-4xl mx-auto">
          <p className="text-cream/40 text-[10px] uppercase tracking-[0.3em] mb-4">
            Legal
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-[0.1em] uppercase font-light">
            Privacy Policy
          </h1>
          <p className="mt-6 text-cream/40 text-xs tracking-[0.1em]">
            Last Updated: April 2026
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="px-6 lg:px-12 max-w-4xl mx-auto">
          <p className="text-sm leading-relaxed text-charcoal/70 mb-12">
            This Privacy Policy governs the manner in which the website collects, uses, maintains and discloses information collected from users (each, a &quot;User&quot;) of the website (&quot;Site&quot;). This privacy policy applies to the Site and all products and services offered by ECLECTIC HIVE.
          </p>
          
          <div className="space-y-12">
            <Section title="Personal Identification Information">
              <p>
                We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, subscribe to the newsletter, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, email address. Users may, however, visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.
              </p>
            </Section>
            
            <Section title="Non-Personal Identification Information">
              <p>
                We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
              </p>
            </Section>
            
            <Section title="Web Browser Cookies">
              <p>
                Our Site may use &quot;cookies&quot; to enhance User experience. User&apos;s web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
              </p>
            </Section>
            
            <Section title="How We Use Collected Information">
              <p className="mb-4">ECLECTIC HIVE may collect and use Users personal information for the following purposes:</p>
              <ul className="space-y-4 mt-4">
                <li>
                  <strong className="text-charcoal text-xs uppercase tracking-[0.1em]">To improve customer service</strong>
                  <p className="mt-1 text-charcoal/70">
                    Information you provide helps us respond to your customer service requests and support needs more efficiently.
                  </p>
                </li>
                <li>
                  <strong className="text-charcoal text-xs uppercase tracking-[0.1em]">To personalize user experience</strong>
                  <p className="mt-1 text-charcoal/70">
                    We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.
                  </p>
                </li>
                <li>
                  <strong className="text-charcoal text-xs uppercase tracking-[0.1em]">To send periodic emails</strong>
                  <p className="mt-1 text-charcoal/70">
                    We may use the email address to send User information and updates pertaining to their order. It may also be used to respond to their inquiries, questions, and/or other requests. If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email or User may contact us via our Site.
                  </p>
                </li>
              </ul>
            </Section>
            
            <Section title="How We Protect Your Information">
              <p>
                We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.
              </p>
            </Section>
            
            <Section title="Sharing Your Personal Information">
              <p>
                We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
              </p>
            </Section>
            
            <Section title="Third Party Websites">
              <p>
                Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website&apos;s own terms and policies.
              </p>
            </Section>
            
            <Section title="Changes to This Privacy Policy">
              <p>
                ECLECTIC HIVE has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
              </p>
            </Section>
            
            <Section title="Your Acceptance of These Terms">
              <p>
                By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
              </p>
            </Section>
          </div>
          
          {/* Contact */}
          <div className="mt-16 pt-8 border-t border-charcoal/10">
            <p className="text-xs tracking-[0.1em] text-charcoal/50">
              Questions about this policy? Contact us at{' '}
              <a href="mailto:hello@eclectichive.com" className="text-charcoal hover:underline underline-offset-2">
                hello@eclectichive.com
              </a>
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-[0.15em] text-charcoal font-medium mb-4">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-charcoal/70">
        {children}
      </div>
    </div>
  )
}
