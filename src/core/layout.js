// Below this width the 1920 design stops scaling and the pages use their phone/tablet layout
// (styles/responsive.css). Keep the two numbers in step.
export const MOBILE = '(max-width: 1099px)'
export const isMobile = () => matchMedia(MOBILE).matches

// The menu button that opens the navigation on phones and tablets.
export function wireMenu() {
  const nav = document.querySelector('#nav'), btn = document.querySelector('#menu')
  const set = (open) => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open) }
  btn.addEventListener('click', () => set(!nav.classList.contains('open')))
  nav.querySelectorAll('ul a').forEach((a) => a.addEventListener('click', () => set(false)))
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false) })
}

// A space before every <br>: on the desktop it changes nothing; on phones, where the breaks are
// hidden, it keeps the words on either side apart.
export const spaceBreaks = (html) => html.replace(/(\S)<br\s*\/?>/g, '$1 <br />')
