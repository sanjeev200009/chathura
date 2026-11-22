import { gsap } from 'gsap'
import { replay } from './reveal.js'

const SHAPES = 'path, line, polyline, polygon, rect, circle, ellipse'

// Draw an SVG icon as if by pen: each stroke traces itself in turn, then any fill fades in.
// Returns a paused timeline (play to draw, pause(0) to hide it again).
export function drawIcon(svg) {
  const tl = gsap.timeline({ paused: true })
  const shapes = [...svg.querySelectorAll(SHAPES)]
  let at = 0
  shapes.forEach((s) => {
    const cs = getComputedStyle(s)
    const stroked = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0
    const filled = cs.fill !== 'none' && cs.fill !== 'rgba(0, 0, 0, 0)'
    if (stroked && s.getTotalLength) {
      const len = Math.ceil(s.getTotalLength()) + 1
      tl.fromTo(s, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: Math.min(1.1, 0.35 + len / 160), ease: 'power2.inOut' }, at)
      at += 0.14
    }
    if (filled) tl.fromTo(s, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5, ease: 'power1.out' }, stroked ? at + 0.25 : at)
  })
  // Icons that are a solid shape (no lines to trace) pop in instead.
  if (!tl.getChildren().length) tl.fromTo(svg, { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' })
  tl.progress(0)
  return tl
}

// Every matching icon draws itself each time it scrolls into view. `redrawOn` names a parent whose
// hover draws the icon again (e.g. a card).
export function drawOnScroll(root, selector, { start = 'top 90%', redrawOn } = {}) {
  root.querySelectorAll(selector).forEach((svg) => {
    const tl = drawIcon(svg)
    replay(tl, { trigger: svg, start })
    const host = redrawOn && svg.closest(redrawOn)
    host?.addEventListener('pointerenter', () => { if (tl.progress() === 1) tl.restart() })
  })
}
