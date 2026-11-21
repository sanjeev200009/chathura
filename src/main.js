import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const W = 1896, H = 1069, PAD = 6 // white border around the hero, in design px
const wrap = document.querySelector('#hero-wrap')
const hero = document.querySelector('#hero')
let fx
const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 }

// Scale the whole 1896 x 1069 frame to the window width (pixel-proportional).
function fit() {
  const s = document.documentElement.clientWidth / (W + 2 * PAD) // clientWidth = without the scroll bar // the white page frame is 1896 + 6px each side
  // dev only: ?z=3&x=300&y=100 magnifies the frame around a design point for pixel checks
  const zq = import.meta.env.DEV ? new URLSearchParams(location.search) : null
  const z = +(zq?.get('z') || 1), zx = +(zq?.get('x') || 0), zy = +(zq?.get('y') || 0)
  hero.style.transform = z > 1
    ? `scale(${s * z}) translate(${PAD - zx}px, ${PAD - zy}px)`
    : `scale(${s}) translate(${PAD}px, ${PAD}px)`
  wrap.style.height = `${(H + 2 * PAD) * s}px`
  fx?.resize(s)
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
  gsap.to('#portrait', { y: -40, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom top', scrub: 1 } })
  gsap.to('.tool', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom top', scrub: 1.4 } })
}

if (!still) {
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
}
const quick = new Map()
function tx(target, x, ry = 0, rx = 0) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!quick.has(el)) quick.set(el, { x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }), ry: gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power3.out' }), rx: gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power3.out' }) })
  const q = quick.get(el)
  q.x(x); q.ry(ry); q.rx(rx)
}
