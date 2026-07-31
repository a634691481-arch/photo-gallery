import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.defaults({ duration: 0.001, delay: 0 })
    ScrollTrigger.config({ ignoreMobileResize: true })
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
