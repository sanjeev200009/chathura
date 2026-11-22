import '../styles/base.css'
import '../styles/home.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { still, startSmoothScroll } from '../motion/smoothScroll.js'
import { split } from '../motion/split.js'
import { homeFooter } from '../components/ui.js'
import * as S from '../sections/home.js'

// Design sizes: the hero frame, the white border around it, and each section's height (design px).
const W = 1896, H = 1069, FH = 1757, PAD = 12
const AH = 891, SH = 961, WH = 1227, EH = 810, QH = 955, FOOTGAP = 123, FTH = 536

const wrap = document.querySelector('#hero-wrap')
wrap.innerHTML = S.hero() + S.about() + S.services() + S.work() + S.expertise() + S.qa() + homeFooter()
const $ = (sel) => wrap.querySelector(sel)
const $$ = (sel) => [...wrap.querySelectorAll(sel)]

// The sections, top to bottom, where each one starts (design px) and how far it is inset.
const secs = ['#hero', '#about', '#services', '#work', '#expertise', '#qa', '#footer'].map($)
const hero = secs[0]
const heights = [FH + 2 * PAD, AH, SH, WH, EH, QH + FOOTGAP]
const baseY = heights.reduce((ys, h) => [...ys, ys.at(-1) + h], [0])
const baseX = [0, 0, 0, 25, 0, 25, 0]
const lifts = secs.map(() => 0) // px each section is held back while the next one slides over it
secs.forEach((el) => el.classList.add('sec'))
// Invisible markers at the true start of each section (they never move), used as scroll triggers.
const markers = secs.map(() => wrap.appendChild(Object.assign(document.createElement('div'), { className: 'mk' })))

let scale = 1, aurora
const place = () => secs.forEach((el, i) => { el.style.top = `${baseY[i] * scale + lifts[i]}px` })

// Scale the whole 1920-wide design to the window width (clientWidth = without the scroll bar).
function fit() {
  scale = document.documentElement.clientWidth / (W + 2 * PAD)
  // dev only: ?z=3&x=300&y=100 magnifies the hero around a design point for pixel checks
  const zq = import.meta.env.DEV ? new URLSearchParams(location.search) : null
  const z = +(zq?.get('z') || 1), zx = +(zq?.get('x') || 0), zy = +(zq?.get('y') || 0)
  hero.style.transform = z > 1 ? `scale(${scale * z}) translate(${PAD - zx}px, ${PAD - zy}px)` : `scale(${scale}) translate(${PAD}px, ${PAD}px)`
  secs.slice(1).forEach((el, i) => { el.style.transform = `scale(${scale})`; el.style.left = `${baseX[i + 1] * scale}px` })
  markers.forEach((m, i) => { m.style.top = `${baseY[i] * scale}px` })
  place()
  wrap.style.height = `${(baseY[6] + FTH) * scale}px`
  aurora?.resize(scale)
  ScrollTrigger.refresh()
}
addEventListener('resize', fit)
fit()

// ?overlay shows the Figma reference at 50% on top (dev only).
if (import.meta.env.DEV && new URLSearchParams(location.search).has('overlay')) {
  const { default: ref } = await import('../../design/hero-reference.png')
  Object.assign($('#overlay'), { src: ref, hidden: false })
}

async function startMotion() {
  // Opening: nav, title lines, portrait, then the tool icons pop in.
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#nav', { y: -40, opacity: 0, duration: 0.8 })
    .from('#hero-title .line > span', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.1)
    .from('#portrait', { y: 60, opacity: 0, duration: 1 }, 0.3)
    .from('.tool', { scale: 0.4, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.8)' }, 0.7)
    .from('#expert, #cursor', { scale: 0, opacity: 0, duration: 0.5, transformOrigin: '0 100%', ease: 'back.out(2)' }, 1.1)
  $$('.tool').forEach((el, i) => gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 }))

  // Scroll: portrait and icons drift at different speeds.
  const heroScroll = (scrub) => ({ trigger: markers[0], start: 'top top', end: () => `+=${FH * scale}`, scrub })
  gsap.to('#portrait', { y: -40, ease: 'none', scrollTrigger: heroScroll(1) })
  gsap.to('.tool', { yPercent: -18, ease: 'none', scrollTrigger: heroScroll(1.4) })

  // Three.js layer, loaded after first paint: aurora light, particles, cursor light.
  const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 }
  const { startAurora } = await import('../three/aurora.js')
  aurora = startAurora($('#fx'), W, H, mouse)
  fit()

  // Depth parallax: layers move differently with the cursor; icons tilt in 3D.
  addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect()
    mouse.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    mouse.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const dx = mouse.x - 0.5, dy = mouse.y - 0.5
    follow($('#hero-title'), -dx * 24)
    follow($('#portrait'), dx * 30, dx * 3)
    $$('.tool').forEach((el, i) => follow(el, dx * (46 + i * 8), dx * 22, -dy * 16))
  })

  startSmoothScroll()
  layerSections()
  revealOnScroll()
}

// Layering: while the next section slides up, the one under it moves slower and dims a little.
function layerSections() {
  secs.slice(0, -1).forEach((el, i) => ScrollTrigger.create({
    trigger: markers[i + 1], start: 'top bottom', end: 'top top', scrub: true,
    onUpdate: (self) => {
      lifts[i] = self.progress * innerHeight * 0.32
      el.style.setProperty('--dim', (self.progress * 0.38).toFixed(3))
      place()
    },
  }))
}

// Play once when the point `y` (design px) below a section's top reaches 86% of the window.
const at = (sec, y, play) => ScrollTrigger.create({ trigger: markers[sec], start: () => `top+=${y * scale} 86%`, once: true, onEnter: play })

function revealOnScroll() {
  // Headings: each word rises out of a mask. selector: [section, design y]
  const HEADS = { '#about-title': [0, 1180], '#ab-title': [1, 20], '#sv-title': [2, 110], '#wk-title': [3, 190], '#ex-title': [4, 230], '#qa-title': [5, 290], '#ft-title': [6, 80] }
  Object.entries(HEADS).forEach(([sel, [sec, y]]) => {
    const words = split($(sel))
    gsap.set(words, { yPercent: 115 })
    at(sec, y, () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }))
  })

  // Everything else arrives in small groups, in order. Built paused so the hidden state is set at once.
  const GROUPS = [
    [0, 1330, '#about-text, #about-cta', { y: 36 }],
    [1, 40, '#chip', { y: 20 }],
    [1, 140, '#ab-text p', { y: 40, stagger: 0.14 }],
    [1, 470, '#acc .row', { y: 34, stagger: 0.1 }],
    [2, 40, '#sv-chip', { y: 20 }],
    [2, 200, '#sv-text, .arrow', { y: 30, stagger: 0.1 }],
    [2, 330, '#sv-line', { scaleX: 0, transformOrigin: '0 50%', duration: 1.4 }],
    [2, 390, '.card', { y: 90, scale: 0.97, stagger: 0.16, duration: 1.2 }],
    [3, 120, '#wk-chip', { y: 20 }],
    [3, 340, '#wk-tabs .tab, .wk-arrow', { y: 24, stagger: 0.07 }],
    [3, 470, '#wk-bars i', { scaleX: 0, transformOrigin: '0 50%', stagger: 0.12, duration: 1 }],
    [3, 560, '#wk-img', { clipPath: 'inset(0 100% 0 0 round 28px)', duration: 1.3, ease: 'power4.inOut', opacity: 1 }],
    [3, 600, '#wk-info h3, #wk-info h4, #wk-info p, .wbtn', { y: 34, stagger: 0.1 }],
    [4, 140, '#ex-chip', { y: 20 }],
    [4, 400, '.stat', { y: 70, stagger: 0.15, duration: 1.1 }],
    [5, 230, '#qa-chip', { y: 20 }],
    [5, 460, '#qa-line', { scaleX: 0, transformOrigin: '50% 50%', duration: 1.4 }],
    [5, 520, '.faq', { y: 40, stagger: 0.09 }],
    [6, 170, '#ft-text, #ft-mail, #ft-links a', { y: 30, stagger: 0.1 }],
  ]
  GROUPS.forEach(([sec, y, targets, vars]) => {
    const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
    at(sec, y, () => tw.play())
  })
  gsap.from('#qa-mark', { opacity: 0, yPercent: 14, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: markers[5], start: 'top 70%', once: true } })
}

// Smoothly move an element toward x / rotationY / rotationX (one quickTo set per element).
const quick = new Map()
function follow(el, x, ry = 0, rx = 0) {
  if (!quick.has(el)) quick.set(el, ['x', 'rotationY', 'rotationX'].map((p) => gsap.quickTo(el, p, { duration: 0.9, ease: 'power3.out' })))
  quick.get(el).forEach((to, k) => to([x, ry, rx][k]))
}

function wireControls() {
  // Accordion: click a plus to open its text (only items with text open).
  $$('#acc .row').forEach((row) => {
    const desc = row.querySelector('.desc')
    if (!desc) return
    row.querySelector('.ico').addEventListener('click', () => {
      const open = row.classList.contains('open')
      $$('#acc .row.open').forEach((r) => {
        r.classList.remove('open')
        gsap.to(r.querySelector('.desc'), { height: 0, duration: 0.45, ease: 'power3.inOut' })
      })
      if (!open) {
        row.classList.add('open')
        gsap.fromTo(desc, { height: 0 }, { height: 'auto', duration: 0.5, ease: 'power3.out' })
      }
      setTimeout(() => ScrollTrigger.refresh(), 600)
    })
  })

  $$('.arrow').forEach((b) => b.addEventListener('click', () => gsap.fromTo(b, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })))
  $$('.card').forEach((c) => {
    const lift = gsap.to(c, { y: -8, duration: 0.35, ease: 'power3.out', paused: true })
    c.addEventListener('pointerenter', () => lift.play())
    c.addEventListener('pointerleave', () => lift.reverse())
  })

  // Selected Work: tabs, arrows and progress bars move together (only the first project has content so far).
  const tabs = $$('#wk-tabs .tab'), bars = $$('#wk-bars i')
  let cur = 0
  const show = (i) => {
    cur = (i + tabs.length) % tabs.length
    tabs.forEach((t, k) => t.classList.toggle('on', k === cur))
    bars.forEach((b, k) => b.classList.toggle('on', k === cur))
    gsap.fromTo('#wk-img, #wk-info', { opacity: 0.3, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => show(k)))
  $('#wk-prev').addEventListener('click', () => show(cur - 1))
  $('#wk-next').addEventListener('click', () => show(cur + 1))
}

// Start last, once every helper above is defined.
wireControls()
if (!still) startMotion()
