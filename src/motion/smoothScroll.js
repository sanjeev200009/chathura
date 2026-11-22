import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// ?still (and reduced motion) turns every animation off, so a page can be compared with Figma.
export const still = new URLSearchParams(location.search).has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches

export let lenis // the running smooth scroller, so the menu can pause it

// Smooth scrolling (Lenis) on GSAP's own clock, plus the thin progress line at the top of the window.
export function startSmoothScroll() {
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })
  return lenis
}
