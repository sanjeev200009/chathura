import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const W = 1896, H = 1069
const wrap = document.querySelector('#hero-wrap')
const hero = document.querySelector('#hero')

// Scale the whole 1896 x 1069 frame to the window width (pixel-proportional).
function fit() {
  const s = innerWidth / W
  // dev only: ?z=3&x=300&y=100 magnifies the frame around a design point for pixel checks
  const zq = import.meta.env.DEV ? new URLSearchParams(location.search) : null
  const z = +(zq?.get('z') || 1), zx = +(zq?.get('x') || 0), zy = +(zq?.get('y') || 0)
  hero.style.transform = z > 1 ? `scale(${s * z}) translate(${-zx}px, ${-zy}px)` : `scale(${s})`
  wrap.style.height = `${H * s}px`
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
