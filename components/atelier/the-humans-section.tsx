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

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return prefersReducedMotion
}

export function TheHumansSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (prefersReducedMotion) { setIsInView(true); return }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <section ref={ref} id="the-humans" className="bg-sand py-24 lg:py-32">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-mono text-xs text-charcoal/40">02</span>
            <div className="w-12 h-px bg-charcoal/20" />
          </div>
          <h2 
            className={cn(
              'font-display text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light uppercase text-charcoal transition-all duration-700',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            The Humans
          </h2>
          <p 
            className={cn(
              'mt-6 text-charcoal/60 text-lg max-w-2xl transition-all duration-700 delay-100',
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Professional but approachable. Design intelligence meets fabrication expertise 
            meets production experience. We love what we do—and it shows.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {team.map((member, i) => (
            <div
              key={member.name}
              className={cn(
                'group transition-all duration-500',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-cream">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <h3 className="font-display text-sm tracking-wide text-charcoal">{member.name}</h3>
              <p className="text-xs text-charcoal/50 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
