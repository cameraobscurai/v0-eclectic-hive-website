import Link from 'next/link'

export function InquirySection() {
  return (
    <section className="bg-background py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Begin a Conversation
          </p>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
            Ready to author
            <br />
            <span className="italic">your environment?</span>
          </h2>
          
          <p className="mt-8 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            We work with clients who value design intelligence, material consideration, 
            and the creation of spaces that cannot be replicated. Let us know about your vision.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-charcoal text-cream text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
            >
              Start an Inquiry
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
  )
}
