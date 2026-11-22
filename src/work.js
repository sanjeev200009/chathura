import './style.css'
import './about.css'
import './work.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { split } from './scroll.js'

gsap.registerPlugin(ScrollTrigger)

const wrap = document.querySelector('#hero-wrap')
const page = document.querySelector('#page')
const footer = document.querySelector('#contact')
const projects = [...document.querySelectorAll('.proj')]
const FIRST = 1103, PITCH = 810, PANEL = 785, FOOT_GAP = 110, FOOT_H = 509
let shown = projects
let pageH = 0

// Stack the visible project panels, then the footer, and size the page to fit.
function layout() {
  projects.forEach((p) => { p.style.display = shown.includes(p) ? '' : 'none' })
  shown.forEach((p, i) => { p.style.top = `${FIRST + i * PITCH}px` })
  const footTop = FIRST + (shown.length - 1) * PITCH + PANEL + FOOT_GAP
  footer.style.top = `${footTop}px`
  pageH = footTop + FOOT_H
  page.style.height = `${pageH}px`
}

// Scale the 1920-wide design to the window width.
function fit() {
  const S = document.documentElement.clientWidth / 1920
  page.style.transform = `scale(${S})`
  wrap.style.height = `${pageH * S}px`
  ScrollTrigger.refresh()
}
layout()
addEventListener('resize', fit)
fit()

const q = new URLSearchParams(location.search)
const still = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches

// Filters: show one kind of project (or all); the panels fade out, restack, and rise back in.
document.querySelectorAll('.pf').forEach((btn) => btn.addEventListener('click', () => {
  if (btn.classList.contains('on')) return
  document.querySelectorAll('.pf').forEach((b) => b.classList.toggle('on', b === btn))
  const cat = btn.dataset.cat
  const next = projects.filter((p) => cat === 'all' || p.dataset.cat === cat)
  const swap = () => {
    shown = next
    layout()
    fit()
    if (!still) gsap.fromTo(shown, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 })
  }
  if (still) swap()
  else gsap.to(shown, { opacity: 0, y: -20, duration: 0.25, ease: 'power2.in', onComplete: swap })
}))

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
  ;['#pf-title', '#ct-title'].forEach((sel) => {
    const words = split(document.querySelector(sel))
    gsap.set(words, { yPercent: 115 })
    ScrollTrigger.create({ trigger: sel, start: 'top 88%', once: true, onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }) })
  })

  // Small groups arrive in order. Built paused so the hidden state is set at once (no flash).
  const groups = [
    ['#pf-chip', '#pf-chip', { y: 20 }],
    ['#pf-filters', '.pf', { y: 24, stagger: 0.07 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ]
  groups.forEach(([trigger, targets, vars]) => {
    const tw = gsap.from(targets, { opacity: 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
    ScrollTrigger.create({ trigger, start: 'top 86%', once: true, onEnter: () => tw.play() })
  })

  // Each project panel: the panel rises in, then its image wipes open and its text follows.
  projects.forEach((p) => {
    const media = p.querySelector('.pj-img, .pj-ph')
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
      .from(p, { y: 80, opacity: 0, duration: 1 })
      .from(p.querySelectorAll('.pj-chip, .pj-count'), { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.3)
      .from(media, { clipPath: 'inset(0 0 100% 0 round 20px)', duration: 1.2, ease: 'power4.inOut' }, 0.35)
      .from(p.querySelectorAll('.pj-info > *'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.6)
    ScrollTrigger.create({ trigger: p, start: 'top 85%', once: true, onEnter: () => tl.play() })
  })
}
