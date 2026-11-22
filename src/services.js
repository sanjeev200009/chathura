import './style.css'
import './about.css'
import './services.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { split } from './scroll.js'

gsap.registerPlugin(ScrollTrigger)

const PAGE_H = 4348
const wrap = document.querySelector('#hero-wrap')
const page = document.querySelector('#page')

// Scale the 1920-wide design to the window width.
function fit() {
  const S = document.documentElement.clientWidth / 1920
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
  ;['#sv2-title', '#ev-title', '#fq-title', '#ct-title'].forEach((sel) => {
    const words = split(document.querySelector(sel))
    gsap.set(words, { yPercent: 115 })
    ScrollTrigger.create({ trigger: sel, start: 'top 88%', once: true, onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }) })
  })

  // Everything else arrives in small groups, in order. Built paused so the hidden state is set at once (no flash).
  const groups = [
    ['#sv2-chip', '#sv2-chip', { y: 20 }],
    ['#sv2-text', '#sv2-text', { y: 30 }],
    ['#sv2-line', '#sv2-line', { scaleX: 0, transformOrigin: '0 50%', duration: 1.4 }],
    ['.svc:nth-of-type(1)', '.svc:nth-of-type(-n+3)', { y: 90, scale: 0.97, stagger: 0.16, duration: 1.2 }],
    ['.svc:nth-of-type(4)', '.svc:nth-of-type(n+4)', { y: 90, scale: 0.97, stagger: 0.16, duration: 1.2 }],
    ['#ev-chip', '#ev-chip', { y: 20 }],
    ['#ev-list', '#ev-list .prow', { y: 34, stagger: 0.12 }],
    ['#fq-chip', '#fq-chip', { y: 20 }],
    ['.fqr', '.fqr', { y: 40, stagger: 0.09 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ]
  groups.forEach(([trigger, targets, vars]) => {
    const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
    ScrollTrigger.create({ trigger, start: 'top 86%', once: true, onEnter: () => tw.play() })
  })
}
