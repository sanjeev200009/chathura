import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { split } from './split.js'

// A heading whose words rise out of a mask, one after another, the first time it comes into view.
// `start` is a ScrollTrigger start; `trigger` defaults to the heading itself.
export function revealWords(sel, { trigger = sel, start = 'top 88%' } = {}) {
  const words = split(document.querySelector(sel))
  gsap.set(words, { yPercent: 115 })
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }) })
}

// A small group that arrives in order. Built paused so the hidden state is set at once (no flash).
export function revealGroup(trigger, targets, vars, { start = 'top 86%' } = {}) {
  const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => tw.play() })
}
