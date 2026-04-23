'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const team = [
  {
    name: 'Jill Livingston',
    role: 'Founder & Creative Director',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jill%2BLivingston%2B2023%2BHeadshot%2BClose%2BUp-NHuZ95g6QfydPaT0PXTA0TdvNPtczK.webp',
  },
  {
    name: 'Annie Ohman',
    role: 'Director of Company Operations',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Annie-001-tNiKz1tG6JqpBALc82EWwaLgrQx4Rl.webp',
  },
  {
    name: 'Amanda Ferguson',
    role: 'Senior Designer',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amanda%2BFerguson%2C%2BSenior%2BDesigner%2BB%2BW-PccIqTjE27Epv1ieb04mUYeg4HbcFC.webp',
  },
  {
    name: 'Sam Young',
    role: 'Project Manager',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sam%2BYoung%2Bv3-FziaYBR9Xlec5f3osxqy4l2Sr97UoE.webp',
  },
  {
    name: 'Adrienne Moon',
    role: 'Purchasing & Inventory Specialist',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ADRIENNE-HGFhUJ0Q7QPg8tQ7sUzncVkfXrhrxX.webp',
  },
  {
    name: 'Patrick Batten',
    role: 'Director of Warehouse Operations',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PAT-aPnp2misGRmwtvwRDbonB20HPpAraT.webp',
  },
]

// Check for reduced motion preference
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  return prefersReducedMotion
}

export function TeamSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    if (prefersReducedMotion) {
      setIsInView(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      // Smoother trigger - earlier and lower threshold
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section ref={ref} className="bg-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Header */}
          <div className="lg:col-span-4">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6 transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
            >
              The Team
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase text-charcoal transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '80ms' }}
            >
              Professional but approachable
            </h2>
            <p 
              className={cn(
                'mt-6 text-charcoal/70 leading-relaxed transition-all duration-500 ease-out',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              )}
              style={{ transitionDelay: '160ms' }}
            >
              Our team brings together design intelligence, fabrication expertise, 
              and production experience. We love what we do—and it shows in every 
              detail of our work.
            </p>
          </div>

          {/* Team Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {team.map((member, i) => (
                <div
                  key={member.name + i}
                  className={cn(
                    'group transition-all duration-500 ease-out',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  )}
                  style={{ transitionDelay: `${240 + i * 60}ms` }}
                >
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-sand">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-display text-lg tracking-tight text-charcoal">{member.name}</h3>
                  <p className="text-sm text-charcoal/60">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
