import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Hero panels entrance */
      gsap.fromTo('.hero-left', { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.hero-right', { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out', delay: 0.4 })

      /* Feature cards stagger */
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.6, ease: 'power2.out',
          stagger: 0.10,
          scrollTrigger: {
            trigger: '.feature-card',
            start: 'top 85%',
          },
        }
      )

      /* Pricing cards entrance */
      gsap.fromTo('.pricing-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.7, ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.pricing-card',
            start: 'top 80%',
          },
        }
      )

      /* Pricing title */
      gsap.fromTo('.pricing-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.pricing-title', start: 'top 85%' },
        }
      )

      /* Contact section */
      gsap.fromTo('.contact-inner',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: '.contact-inner', start: 'top 80%' },
        }
      )
    })

    return () => ctx.revert()
  }, [])
}
