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
    name: 'Annie',
    role: 'Operations Director',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Annie-001-tNiKz1tG6JqpBALc82EWwaLgrQx4Rl.webp',
  },
  {
    name: 'Amanda Ferguson',
    role: 'Senior Designer',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Amanda%2BFerguson%2C%2BSenior%2BDesigner%2BB%2BW-PccIqTjE27Epv1ieb04mUYeg4HbcFC.webp',
  },
  {
    name: 'Sam Young',
    role: 'Production Manager',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sam%2BYoung%2Bv3-FziaYBR9Xlec5f3osxqy4l2Sr97UoE.webp',
  },
  {
    name: 'Team Member',
    role: 'Fabrication Lead',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eclectic%2BHive-Carrie%2BKing%2BPhotographer-154-gzuuJFrZ86qUqzaJhZrEAjBXHLwwPe.webp',
  },
  {
    name: 'Team Member',
    role: 'Designer',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Eclectic%2BHive-Carrie%2BKing%2BPhotographer-199-r3X3oOyxvAoTbdOkiUyuhXDdlRXeKk.webp',
  },
]

export function TeamSection() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

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
      { threshold: 0.2 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-cream py-24 lg:py-40">
      <div className="px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Header */}
          <div className="lg:col-span-4">
            <p 
              className={cn(
                'text-xs uppercase tracking-[0.3em] text-charcoal/50 mb-6 transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              The Team
            </p>
            <h2 
              className={cn(
                'font-display text-2xl md:text-3xl tracking-[0.2em] font-light uppercase text-charcoal transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '100ms' }}
            >
              Professional but approachable
            </h2>
            <p 
              className={cn(
                'mt-6 text-charcoal/70 leading-relaxed transition-all duration-700',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: '200ms' }}
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
                    'group transition-all duration-700',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
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
