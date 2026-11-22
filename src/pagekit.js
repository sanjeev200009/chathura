import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { split } from './scroll.js'

gsap.registerPlugin(ScrollTrigger)

// Shared set-up for the inner pages: scale the 1920-wide design to the window, smooth scroll,
// the hero opening, word-by-word headings and small groups that arrive in order.
export function startPage({ height, headings = [], groups = [] }) {
  const wrap = document.querySelector('#hero-wrap')
  const page = document.querySelector('#page')
  page.style.height = `${height}px`
  const fit = () => {
    const S = document.documentElement.clientWidth / 1920
    page.style.transform = `scale(${S})`
    wrap.style.height = `${height * S}px`
    ScrollTrigger.refresh()
  }
  addEventListener('resize', fit)
  fit()

  const q = new URLSearchParams(location.search)
  if (q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

  const title = split(document.querySelector('#ah-title'))
  gsap.set(title, { yPercent: 115 })
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#nav', { y: -40, opacity: 0, duration: 0.8 })
    .from('#ah-chip', { y: 20, opacity: 0, duration: 0.7 }, 0.2)
    .to(title, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 }, 0.3)
    .from('#ah-text', { y: 30, opacity: 0, duration: 0.9 }, 0.8)

  headings.forEach((sel) => {
    const words = split(document.querySelector(sel))
    gsap.set(words, { yPercent: 115 })
    ScrollTrigger.create({ trigger: sel, start: 'top 88%', once: true, onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }) })
  })

  // Built paused so the hidden state is set at once (no flash), then played when its moment comes.
  groups.forEach(([trigger, targets, vars]) => {
    const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
    ScrollTrigger.create({ trigger, start: 'top 86%', once: true, onEnter: () => tw.play() })
  })
}
