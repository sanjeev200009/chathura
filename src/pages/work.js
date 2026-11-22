import '../styles/base.css'
import '../styles/page.css'
import '../styles/work.css'
import { gsap } from 'gsap'
import { mountPage } from '../core/innerPage.js'
import { still } from '../motion/smoothScroll.js'
import { replay } from '../motion/reveal.js'
import { pageHero, chip, contactFooter } from '../components/ui.js'
import { PROJECTS } from '../data/content.js'

const FILTERS = [
  { cat: 'all', label: 'ALL WORK', width: 118 },
  { cat: 'web', label: 'WEBSITE DESIGN (UI/UX)', width: 207 },
  { cat: 'mobile', label: 'MOBILE APP DESIGN (UI/UX)', width: 235 },
  { cat: 'graphic', label: 'GRAPHIC DESIGN', width: 163 },
  { cat: 'saas', label: 'SAAS DESIGN', width: 138 },
]

// Where the picture and the text sit in each panel (the design alternates sides).
const LAYOUT = [
  { mediaFirst: true, media: 'left:101px;width:788px', info: 'left:985px;top:292px', line: false },
  { mediaFirst: false, media: 'left:1094px', info: 'left:101px', line: true },
  { mediaFirst: true, media: 'left:99px', info: 'left:872px', line: true },
  { mediaFirst: false, media: 'left:1094px', info: 'left:101px', line: true },
]

const projectPanel = (p, i) => {
  const L = LAYOUT[i % LAYOUT.length]
  const media = p.image
    ? `<img class="pj-img" src="${p.image}" alt="${p.title}" style="${L.media}" />`
    : `<div class="pj-ph" style="${L.media}">Add project image</div>`
  const info = `<div class="pj-info" style="${L.info}">
      <h3>${p.title}</h3><h4>${p.kind}</h4>
      <p>${p.text}</p>
      <a class="wbtn" href="${p.href}">VIEW FULL DESIGN</a>
    </div>`
  return `
  <article class="proj" data-cat="${p.cat}">
    <span class="chip chip-light pj-chip"><span>/</span>${p.label}</span><span class="pj-count">${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}</span>${L.line ? '<i class="pj-line"></i>' : ''}
    ${L.mediaFirst ? media + info : info + media}
  </article>`
}

const intro = `
  ${chip('pf-chip', 'PORTFOLIO', 'grey')}
  <h2 id="pf-title">Design solutions built around your vision.</h2>
  <div id="pf-filters">
    ${FILTERS.map((f, i) => `<button class="pf${i ? '' : ' on'}" data-cat="${f.cat}" style="width:${f.width}px">${f.label}</button>`).join('\n    ')}
  </div>`

// Panels stack one under another; the footer follows the last visible one.
const FIRST = 1103, PITCH = 810, PANEL = 785, FOOT_GAP = 110, FOOT_H = 509
let shown = []
const footTop = () => FIRST + (shown.length - 1) * PITCH + PANEL + FOOT_GAP

const { page, fit } = mountPage({
  height: () => footTop() + FOOT_H,
  html: pageHero({
    active: 'work', label: 'Selected work', chipLabel: 'SELECTED WORK', chipStyle: 'width:131px;left:882px', title: 'Selected Work',
    text: 'A curated look at recent UI/UX, web, mobile, and graphic design projects — each built<br />around a clear idea.',
  }) + intro + PROJECTS.map(projectPanel).join('') + contactFooter(),
  headings: ['#pf-title', '#ct-title'],
  groups: [
    ['#pf-chip', '#pf-chip', { y: 20 }],
    ['#pf-filters', '.pf', { y: 24, stagger: 0.07 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ],
})

const projects = [...page.querySelectorAll('.proj')]
const footer = page.querySelector('#contact')
function layout() {
  projects.forEach((p) => { p.style.display = shown.includes(p) ? '' : 'none' })
  shown.forEach((p, i) => { p.style.top = `${FIRST + i * PITCH}px` })
  footer.style.top = `${footTop()}px`
  fit()
}
shown = projects
layout()

// Filters: the panels fade out, restack with only the chosen kind, and rise back in.
page.querySelectorAll('.pf').forEach((btn) => btn.addEventListener('click', () => {
  if (btn.classList.contains('on')) return
  page.querySelectorAll('.pf').forEach((b) => b.classList.toggle('on', b === btn))
  const next = projects.filter((p) => btn.dataset.cat === 'all' || p.dataset.cat === btn.dataset.cat)
  const swap = () => {
    shown = next
    layout()
    if (!still) gsap.fromTo(shown, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 })
  }
  if (still) swap()
  else gsap.to(shown, { opacity: 0, y: -20, duration: 0.25, ease: 'power2.in', onComplete: swap })
}))

// Each panel rises in, then its picture wipes open and its text follows.
if (!still) {
  projects.forEach((p) => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
      .from(p, { y: 80, opacity: 0, duration: 1 })
      .from(p.querySelectorAll('.pj-chip, .pj-count'), { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.3)
      .from(p.querySelector('.pj-img, .pj-ph'), { clipPath: 'inset(0 0 100% 0 round 20px)', duration: 1.2, ease: 'power4.inOut' }, 0.35)
      .from(p.querySelectorAll('.pj-info > *'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.6)
    replay(tl, { trigger: p, start: 'top 85%' })
  })
}
