import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { split } from './split.js'

// Play an animation every time its trigger comes into view from below, and reset it when the
// trigger drops back below the window - so scrolling up and down again replays it.
export function replay(anim, { trigger, start = 'top 86%' }) {
  return ScrollTrigger.create({ trigger, start, onEnter: () => anim.restart(), onLeaveBack: () => { anim.pause(0); anim.data?.reset?.() } })
}

// A heading whose words rise out of a mask, one after another.
export function revealWords(sel, { trigger = sel, start = 'top 88%' } = {}) {
  const words = split(document.querySelector(sel))
  const tl = gsap.timeline({ paused: true }).fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 })
  tl.progress(0)
  replay(tl, { trigger, start })
}

// A small group that arrives in order. Built paused so the hidden state is set at once (no flash).
export function revealGroup(trigger, targets, vars, { start = 'top 86%' } = {}) {
  const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
  replay(tw, { trigger, start })
}
