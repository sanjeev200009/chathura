import './style.css'
import './about.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { split } from './scroll.js'

gsap.registerPlugin(ScrollTrigger)

const PAGE_H = 3800
const wrap = document.querySelector('#hero-wrap')
const page = document.querySelector('#page')
let S = 1

// Scale the 1920-wide design to the window width.
function fit() {
  S = document.documentElement.clientWidth / 1920
  page.style.transform = `scale(${S})`
  wrap.style.height = `${PAGE_H * S}px`
  ScrollTrigger.refresh()
}
addEventListener('resize', fit)
fit()

const q = new URLSearchParams(location.search)
const still = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches
if (!still) {
  // Smooth scrolling on GSAP's own clock.
  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

  // Opening: nav drops in, the big title rises word by word, then the line under it.
  const title = split(document.querySelector('#ah-title'))
  gsap.set(title, { yPercent: 115 })
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#nav', { y: -40, opacity: 0, duration: 0.8 })
    .from('#ah-chip', { y: 20, opacity: 0, duration: 0.7 }, 0.2)
    .to(title, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 }, 0.3)
    .from('#ah-text', { y: 30, opacity: 0, duration: 0.9 }, 0.8)

  // Headings: words rise out of a mask once, when they come into view.
  ;['#st-title', '#pr-title', '#tk-title', '#ct-title'].forEach((sel) => {
    const words = split(document.querySelector(sel))
    gsap.set(words, { yPercent: 115 })
    ScrollTrigger.create({ trigger: sel, start: 'top 88%', once: true, onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }) })
  })

  // Everything else arrives in small groups, in order.
  const groups = [
    ['#st-chip', '#st-chip', { y: 20 }],
    ['#st-photo', '#st-photo', { clipPath: 'inset(100% 0 0 0 round 20px)', duration: 1.4, ease: 'power4.inOut', opacity: 1 }],
    ['#st-text', '#st-text p', { y: 40, stagger: 0.14 }],
    ['.sc', '.sc', { y: 50, stagger: 0.12, duration: 1 }],
    ['#st-cta', '#st-cta a', { y: 24, stagger: 0.1 }],
    ['#pr-chip', '#pr-chip', { y: 20 }],
    ['#pr-list', '.prow', { y: 34, stagger: 0.12 }],
    ['#tk-chip', '#tk-chip', { y: 20 }],
    ['.tool-card', '.tool-card', { y: 80, scale: 0.97, stagger: 0.14, duration: 1.1 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ]
  groups.forEach(([trigger, targets, vars]) => {
    // Built paused so the hidden start state is set at once (no flash), then played when its moment comes.
    const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
    ScrollTrigger.create({ trigger, start: 'top 86%', once: true, onEnter: () => tw.play() })
  })
}
