import { gsap } from 'gsap'
import { NAV, BRAND, EMAIL, SOCIALS } from '../data/site.js'
import { textArrow } from '../components/icons.js'
import { lenis } from '../motion/smoothScroll.js'

// Below this width the 1920 design stops scaling and the pages use their phone/tablet layout
// (styles/responsive.css). Keep the two numbers in step.
export const MOBILE = '(max-width: 1099px)'
export const isMobile = () => matchMedia(MOBILE).matches

const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

// The phone and tablet menu: a sheet that pops in from the right over a blurred page.
function sheetHtml() {
  const here = NAV.find((n) => n.href === location.pathname)?.key ?? 'home'
  return `
  <div id="sheet" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <div class="sh-bg"></div>
    <div class="sh-panel">
      <div class="sh-top"><span class="sh-logo">${BRAND}</span><button class="sh-close" type="button" aria-label="Close menu"><i></i><i></i></button></div>
      <nav class="sh-links">
        ${NAV.map((n, i) => `<a href="${n.href}"${n.key === here ? ' class="on" aria-current="page"' : ''}><small>${String(i + 1).padStart(2, '0')}</small><span>${titleCase(n.label)}</span>${textArrow('right')}</a>`).join('\n        ')}
      </nav>
      <div class="sh-foot">
        <small>Have a project in mind?</small>
        <a class="sh-mail" href="mailto:${EMAIL}">${EMAIL} ${textArrow('right')}</a>
        <div class="sh-social">${SOCIALS.filter((s) => s.key !== 'email').map((s) => `<a href="${s.href}">${s.label}</a>`).join('')}</div>
      </div>
    </div>
  </div>`
}

export function wireMenu() {
  let btn = document.querySelector('#menu')
  document.body.insertAdjacentHTML('beforeend', sheetHtml() + `
  <div id="minibar"><a href="/">${BRAND}</a><button type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i></button></div>`)
  const mini = document.querySelector('#minibar')

  // Phones: once the page is scrolled past the top, a small bar with the menu button slides in
  // (and hides again while scrolling down, so it never sits on the content you are reading).
  let lastY = 0
  addEventListener('scroll', () => {
    const y = scrollY
    mini.classList.toggle('show', y > innerHeight * 0.6 && y < lastY)
    lastY = y
  }, { passive: true })
  const sheet = document.querySelector('#sheet'), panel = sheet.querySelector('.sh-panel')
  const close = sheet.querySelector('.sh-close')

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
    .fromTo('.sh-bg', { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
    .fromTo(panel, { xPercent: 12, opacity: 0, scale: 0.97 }, { xPercent: 0, opacity: 1, scale: 1, duration: 0.65 }, 0)
    .fromTo('.sh-top > *', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, 0.15)
    .fromTo('.sh-links a', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, 0.18)
    .fromTo('.sh-foot > *', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, 0.4)

  const open = () => {
    sheet.hidden = false
    document.documentElement.classList.add('locked')
    lenis?.stop()
    btn.setAttribute('aria-expanded', 'true')
    tl.timeScale(1).play(0)
    close.focus({ preventScroll: true })
  }
  const shut = () => {
    if (sheet.hidden) return
    btn.setAttribute('aria-expanded', 'false')
    tl.timeScale(1.8).reverse().then(() => {
      sheet.hidden = true
      document.documentElement.classList.remove('locked')
      lenis?.start()
      btn.focus({ preventScroll: true })
    })
  }
  const menuBtn = btn // whichever button opened the menu gets the focus back when it closes
  menuBtn.addEventListener('click', () => { btn = menuBtn; open() })
  mini.querySelector('button').addEventListener('click', (e) => { btn = e.currentTarget; open() })
  close.addEventListener('click', shut)
  sheet.querySelector('.sh-bg').addEventListener('click', shut)
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', shut))
  addEventListener('keydown', (e) => {
    if (sheet.hidden) return
    if (e.key === 'Escape') shut()
    if (e.key === 'Tab') { // keep the keyboard inside the menu
      const f = [...panel.querySelectorAll('a, button')], first = f[0], last = f.at(-1)
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  })
  addEventListener('resize', () => { if (!isMobile()) shut() })
}

// Long text on phones: show the first paragraph (a few lines) and a "Read more" button.
export function readMore(selectors) {
  document.querySelectorAll(selectors).forEach((el) => {
    el.classList.add('clamp')
    const b = Object.assign(document.createElement('button'), { type: 'button', className: 'more', textContent: 'Read more' })
    b.setAttribute('aria-expanded', 'false')
    el.after(b)
    b.addEventListener('click', () => {
      const open = el.classList.toggle('open')
      b.textContent = open ? 'Read less' : 'Read more'
      b.setAttribute('aria-expanded', open)
      if (open) gsap.from(el.children, { opacity: 0, y: 10, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
      gsap.delayedCall(0.05, () => import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh()))
    })
  })
}

// A space before every <br>: on the desktop it changes nothing; on phones, where the breaks are
// hidden, it keeps the words on either side apart.
export const spaceBreaks = (html) => html.replace(/(\S)<br\s*\/?>/g, '$1 <br />')
