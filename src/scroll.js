import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Scroll experience: smooth scrolling, sections that layer over each other, and calm one-by-one reveals.
export function startScroll({ secs, lifts, place, markers, getS }) {
  // 1. Smooth scroll (Lenis) driven by GSAP's own clock so ScrollTrigger stays in step.
  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)

  // 2. Layering: while the next section slides up, the one under it moves slower and dims a little,
  //    so the new section feels like a sheet laid on top.
  secs.forEach((el, i) => {
    if (i === secs.length - 1) return
    ScrollTrigger.create({
      trigger: markers[i + 1],
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        lifts[i] = self.progress * innerHeight * 0.32
        el.style.setProperty('--dim', (self.progress * 0.38).toFixed(3))
        place()
      },
    })
  })

  // 3. Thin progress line at the top of the window.
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } })

  // 4. Headings: each word rises out of a mask, one after another.
  const heads = ['#about-title', '#ab-title', '#sv-title', '#wk-title', '#ex-title', '#qa-title', '#ft-title']
  const secOf = { '#about-title': 0, '#ab-title': 1, '#sv-title': 2, '#wk-title': 3, '#ex-title': 4, '#qa-title': 5, '#ft-title': 6 }
  const offY = { '#about-title': 1180, '#ab-title': 20, '#sv-title': 110, '#wk-title': 190, '#ex-title': 230, '#qa-title': 290, '#ft-title': 80 }
  heads.forEach((sel) => {
    const el = document.querySelector(sel)
    const words = split(el)
    gsap.set(words, { yPercent: 115 })
    reveal(markers[secOf[sel]], offY[sel], getS, () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.07 }))
  })

  // 5. Everything else: small groups that arrive in order (chip, text, then the cards).
  const groups = [
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
  groups.forEach(([sec, y, targets, vars]) => {
    // Built paused so the hidden start state is set at once (no flash), then played when its moment comes.
    const tw = gsap.from(targets, { opacity: vars.opacity ?? 0, duration: 0.9, ease: 'power3.out', ...vars, paused: true })
    reveal(markers[sec], y, getS, () => tw.play())
  })
  gsap.from('#qa-mark', { opacity: 0, yPercent: 14, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: markers[5], start: 'top 70%', once: true } })

  return lenis
}

// Play once when the point `y` (design px) below the section's top reaches ~85% of the window.
function reveal(marker, y, getS, play) {
  ScrollTrigger.create({ trigger: marker, start: () => `top+=${y * getS()} 86%`, once: true, onEnter: play })
}

// Wrap each word in a mask so it can rise from below. Keeps <br> and the spaces.
export function split(el) {
  const out = []
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return }
          const w = document.createElement('span')
          w.className = 'w'
          const i = document.createElement('span')
          i.textContent = part
          i.style.display = 'inline-block'
          w.appendChild(i)
          frag.appendChild(w)
          out.push(i)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n)
    })
  }
  walk(el)
  return out
}
