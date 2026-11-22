import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const W = 1896, H = 1069, FH = 1757, PAD = 12 // white border around the hero, in design px
const AH = 891, SH = 961, WH = 1227, EH = 810, QH = 955, FOOTGAP = 123, FTH = 536
const wrap = document.querySelector('#hero-wrap')
const hero = document.querySelector('#hero')
const about = document.querySelector('#about')
const services = document.querySelector('#services')
const work = document.querySelector('#work')
const expertise = document.querySelector('#expertise')
const qa = document.querySelector('#qa')
const footer = document.querySelector('#footer')
let fx
const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 }

// The sections, top to bottom, with where each one starts (design px) and how far it is inset.
const secs = [hero, about, services, work, expertise, qa, footer]
const baseY = [0, FH + 2 * PAD, FH + 2 * PAD + AH, FH + 2 * PAD + AH + SH, FH + 2 * PAD + AH + SH + WH, FH + 2 * PAD + AH + SH + WH + EH, FH + 2 * PAD + AH + SH + WH + EH + QH + FOOTGAP]
const baseX = [0, 0, 0, 25, 0, 25, 0]
const lifts = secs.map(() => 0) // px each section is held back while the next one slides over it
secs.forEach((el) => el.classList.add('sec'))
// Invisible markers at the true start of each section (they never move), used as scroll triggers.
const markers = secs.map(() => {
  const m = document.createElement('div')
  m.className = 'mk'
  wrap.appendChild(m)
  return m
})
let S = 1
const getS = () => S

function place() {
  secs.forEach((el, i) => { el.style.top = `${baseY[i] * S + lifts[i]}px` })
}

// Scale the whole 1920-wide design to the window width (pixel-proportional).
function fit() {
  S = document.documentElement.clientWidth / (W + 2 * PAD) // clientWidth = without the scroll bar
  // dev only: ?z=3&x=300&y=100 magnifies the frame around a design point for pixel checks
  const zq = import.meta.env.DEV ? new URLSearchParams(location.search) : null
  const z = +(zq?.get('z') || 1), zx = +(zq?.get('x') || 0), zy = +(zq?.get('y') || 0)
  hero.style.transform = z > 1
    ? `scale(${S * z}) translate(${PAD - zx}px, ${PAD - zy}px)`
    : `scale(${S}) translate(${PAD}px, ${PAD}px)`
  secs.slice(1).forEach((el) => { el.style.transform = `scale(${S})` })
  secs.forEach((el, i) => { if (i) el.style.left = `${baseX[i] * S}px` })
  markers.forEach((m, i) => { m.style.top = `${baseY[i] * S}px` })
  place()
  wrap.style.height = `${(baseY[6] + FTH) * S}px`
  fx?.resize(S)
  ScrollTrigger.refresh()
}
addEventListener('resize', fit)
fit()

// ?overlay shows the Figma reference at 50% on top (dev only) for pixel checks.
const q = new URLSearchParams(location.search)
if (import.meta.env.DEV && q.has('overlay')) {
  const { default: ref } = await import('../design/hero-reference.png')
  const o = document.querySelector('#overlay')
  o.src = ref
  o.hidden = false
}

// ?still turns motion off (and so does reduced motion) so the frame matches Figma exactly.
const still = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches
if (!still) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('#nav', { y: -40, opacity: 0, duration: 0.8 })
    .from('#hero-title .line > span', { yPercent: 110, duration: 1, stagger: 0.12 }, 0.1)
    .from('#portrait', { y: 60, opacity: 0, duration: 1 }, 0.3)
    .from('.tool', { scale: 0.4, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.8)' }, 0.7)
    .from('#expert, #cursor', { scale: 0, opacity: 0, duration: 0.5, transformOrigin: '0 100%', ease: 'back.out(2)' }, 1.1)

  // Idle float (moves the icons a few px; use ?still to compare with Figma).
  document.querySelectorAll('.tool').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2.4 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5 })
  })

  // Scroll: portrait and icons drift at different speeds.
  gsap.to('#portrait', { y: -40, ease: 'none', scrollTrigger: { trigger: markers[0], start: 'top top', end: () => `+=${FH * S}`, scrub: 1 } })
  gsap.to('.tool', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: markers[0], start: 'top top', end: () => `+=${FH * S}`, scrub: 1.4 } })

  // Premium layer (Three.js): aurora light, particles, cursor light.
  const { startFx } = await import('./fx.js')
  fx = startFx(document.querySelector('#fx'), W, H, mouse)
  fit()

  // Depth parallax: layers move differently with the cursor; icons tilt in 3D.
  addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect()
    mouse.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    mouse.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const dx = mouse.x - 0.5, dy = mouse.y - 0.5
    tx('#hero-title', -dx * 24)
    tx('#portrait', dx * 30, dx * 3)
    document.querySelectorAll('.tool').forEach((el, i) => tx(el, dx * (46 + i * 8), dx * 22, -dy * 16))
  })

  // Smooth scrolling, layered sections and one-by-one reveals.
  const { startScroll } = await import('./scroll.js')
  startScroll({ secs, lifts, place, markers, getS })
}
const quick = new Map()
function tx(target, x, ry = 0, rx = 0) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!quick.has(el)) quick.set(el, { x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }), ry: gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3.out' }), rx: gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3.out' }) })
  const q = quick.get(el)
  q.x(x); q.ry(ry); q.rx(rx)
}

// Accordion: click a plus to open its text (only items with text open).
document.querySelectorAll('#acc .row').forEach((row) => {
  const desc = row.querySelector('.desc')
  if (!desc) return
  row.querySelector('.ico').addEventListener('click', () => {
    const open = row.classList.contains('open')
    document.querySelectorAll('#acc .row.open').forEach((r) => {
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

document.querySelectorAll('.arrow').forEach((b) => b.addEventListener('click', () => gsap.fromTo(b, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })))
document.querySelectorAll('.card').forEach((c) => {
  const lift = gsap.to(c, { y: -8, duration: 0.35, ease: 'power3.out', paused: true })
  c.addEventListener('pointerenter', () => lift.play())
  c.addEventListener('pointerleave', () => lift.reverse())
})

// Selected Work: tabs, arrows and progress bars move together (only the first project has content so far).
{
  const tabs = [...document.querySelectorAll('#wk-tabs .tab')], bars = [...document.querySelectorAll('#wk-bars i')]
  let cur = 0
  const show = (i) => {
    cur = (i + tabs.length) % tabs.length
    tabs.forEach((t, k) => {
      t.classList.toggle('on', k === cur)
    })
    bars.forEach((b, k) => b.classList.toggle('on', k === cur))
    gsap.fromTo('#wk-img, #wk-info', { opacity: 0.3, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => show(k)))
  document.querySelector('#wk-prev').addEventListener('click', () => show(cur - 1))
  document.querySelector('#wk-next').addEventListener('click', () => show(cur + 1))
}
