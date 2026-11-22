import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { still, startSmoothScroll } from '../motion/smoothScroll.js'
import { split } from '../motion/split.js'
import { revealWords, revealGroup } from '../motion/reveal.js'
import { drawOnScroll } from '../motion/draw.js'
import { startAurora } from '../three/aurora.js'
import { isMobile, wireMenu, spaceBreaks } from './layout.js'
import '../styles/effects.css'
import '../styles/responsive.css'

const DESIGN_W = 1920
const HERO = { w: 1896, h: 638 }

// Mount an inner page into #hero-wrap and start everything it needs:
// the 1920-wide design scaled to the window, the Three.js hero layer, smooth scrolling and the reveals.
// `height` may be a number or a function (pages whose length changes, e.g. after filtering).
export function mountPage({ html, height, headings = [], groups = [] }) {
  const wrap = document.querySelector('#hero-wrap')
  wrap.innerHTML = `<div id="page">${spaceBreaks(html)}</div>`
  const page = wrap.querySelector('#page')
  const heightOf = () => (typeof height === 'function' ? height() : height)
  let scale = 1
  let aurora

  // Desktop: the design scaled to the window. Phones and tablets: a normal flowing page.
  const fit = () => {
    if (isMobile()) {
      scale = document.documentElement.clientWidth / HERO.w
      page.style.height = page.style.transform = wrap.style.height = ''
    } else {
      const h = heightOf()
      scale = document.documentElement.clientWidth / DESIGN_W
      page.style.height = `${h}px`
      page.style.transform = `scale(${scale})`
      wrap.style.height = `${h * scale}px`
    }
    aurora?.resize(scale)
    ScrollTrigger.refresh()
  }
  addEventListener('resize', fit)
  fit()
  wireMenu()

  if (still) return { page, fit }

  // Three.js: aurora + particles behind the hero text, following the cursor.
  const hero = page.querySelector('#abhero')
  const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 }
  aurora = startAurora(page.querySelector('#hero-fx'), HERO.w, HERO.h, mouse, { particles: 110 })
  aurora.resize(scale)
  addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect()
    mouse.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    mouse.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
  })

  startSmoothScroll()

  // Opening: the nav drops in, the big title rises word by word, then the line under it.
  const title = split(page.querySelector('#ah-title'))
  gsap.set(title, { yPercent: 115 })
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#nav', { y: -40, opacity: 0, duration: 0.8 })
    .from('#ah-chip', { y: 20, opacity: 0, duration: 0.7 }, 0.2)
    .to(title, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.1 }, 0.3)
    .from('#ah-text', { y: 30, opacity: 0, duration: 0.9 }, 0.8)

  headings.forEach((sel) => revealWords(sel))
  groups.forEach(([trigger, targets, vars]) => revealGroup(trigger, targets, vars))
  drawOnScroll(page, 'svg', { redrawOn: '.svc, .tool-card, .abtn, #pd-back' })
  return { page, fit }
}
