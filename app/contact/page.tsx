'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Link from 'next/link'

const eventTypes = [
  'Wedding',
  'Corporate Event',
  'Private Celebration',
  'Gala / Benefit',
  'Brand Activation',
  'Other',
]

const budgetRanges = [
  'Under $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000+',
  'Not sure yet',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    venue: '',
    budget: '',
    message: '',
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to an API
    console.log('[v0] Form submitted:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main>
        <Navigation />
        <section className="bg-charcoal text-cream min-h-screen flex items-center">
          <div className="px-6 lg:px-12 max-w-7xl mx-auto py-32">
            <div className="max-w-2xl">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Thank You
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
                We&apos;ve received
                <br />
                <span className="italic">your inquiry</span>
              </h1>
              <p className="mt-8 text-cream/70 leading-relaxed max-w-lg">
                Our team reviews every inquiry personally. You can expect to hear from 
                us within 2-3 business days. In the meantime, feel free to explore our 
                work and process.
              </p>
              <div className="mt-12 flex flex-wrap gap-6">
                <Link 
                  href="/gallery"
                  className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
                >
                  <span className="editorial-link">View Our Work</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="/process"
                  className="inline-flex items-center gap-3 text-sm uppercase tracking-widest group"
                >
                  <span className="editorial-link">Learn Our Process</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navigation />
      
      {/* Hero */}
      <section className="bg-charcoal text-cream pt-32 pb-16 lg:pt-48 lg:pb-24">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-cream/50 text-xs uppercase tracking-[0.3em] mb-6">
                Start an Inquiry
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
                Tell us about
                <br />
                <span className="italic">your vision</span>
              </h1>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-cream/70 leading-relaxed">
                The more detail you can share about your event, the better we can 
                assess fit and prepare for our initial conversation. All inquiries 
                receive a personal response within 2-3 business days.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Form */}
      <section className="bg-background py-24 lg:py-40">
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column - Contact Details */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
                  Your Details
                </p>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2">Name *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>
                
                {/* Direct Contact */}
                <div className="mt-12 pt-8 border-t border-border">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                    Prefer Direct Contact?
                  </p>
                  <a 
                    href="mailto:studio@eclectichive.com"
                    className="text-foreground hover:text-muted-foreground transition-colors editorial-link"
                  >
                    studio@eclectichive.com
                  </a>
                </div>
              </div>
            </div>
            
            {/* Right Column - Event Details */}
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
                Event Details
              </p>
              
              <div className="flex flex-col gap-6">
                <div>
                  <label htmlFor="eventType" className="block text-sm mb-2">Event Type *</label>
                  <select
                    id="eventType"
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                    className="w-full px-4 py-3 bg-secondary border-0 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground appearance-none cursor-pointer"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm mb-2">Event Date</label>
                    <input
                      type="text"
                      id="eventDate"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="Month YYYY or TBD"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="guestCount" className="block text-sm mb-2">Guest Count</label>
                    <input
                      type="text"
                      id="guestCount"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                      className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="Estimated guests"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="venue" className="block text-sm mb-2">Venue</label>
                  <input
                    type="text"
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="Venue name and location (if known)"
                  />
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm mb-2">Design & Production Budget</label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    className="w-full px-4 py-3 bg-secondary border-0 text-foreground focus:outline-none focus:ring-1 focus:ring-foreground appearance-none cursor-pointer"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm mb-2">Tell Us About Your Vision *</label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                    placeholder="Share your vision, inspiration, and what you're hoping to create. The more detail you can provide, the better we can assess fit."
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors w-full md:w-auto"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
