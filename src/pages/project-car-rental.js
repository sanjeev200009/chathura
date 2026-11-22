import '../styles/base.css'
import '../styles/page.css'
import '../styles/project.css'
import { mountPage } from '../core/innerPage.js'
import { pageHero, chip, rows, contactFooter } from '../components/ui.js'

const FACTS = [
  ['CATEGORY', 'Website Design (UI/UX)'],
  ['ROLE', 'UI/UX Designer'],
  ['TOOLS', 'Figma'],
  ['DELIVERABLES', 'Web UI, responsive layouts'],
]
const FACT_LEFT = [0, 392, 785, 1175]

const OVERVIEW = [
  { title: 'Challenge', text: 'Make renting a car feel fast and simple — from choosing a vehicle to confirming a booking.' },
  { title: 'Approach', text: 'A bold hero with a quick booking form, clear fleet highlights, and trust-building stats placed right<br />where decisions are made.' },
  { title: 'Result', text: 'A clear, responsive layout designed to guide visitors to book in just a few steps.' },
]

const facts = `
  <a id="pd-back" href="/work.html">← BACK TO SELECTED WORK</a>
  <div id="pd-meta">
    ${FACTS.map(([k, v], i) => `<div style="left:${FACT_LEFT[i] ? `${FACT_LEFT[i]}px` : '0'}"><small>${k}</small><span>${v}</span></div>`).join('\n    ')}
  </div>`

const overview = `
  ${chip('ov-chip', 'OVERVIEW', 'grey')}
  <h2 id="ov-title">A cleaner way to book a car online.</h2>
  ${rows('ov-list', OVERVIEW, [114, 135, 116])}`

const fullDesign = `
  <section id="fd" aria-label="Full design">
    ${chip('fd-chip', 'FULL DESIGN', 'light')}
    <h2 id="fd-title">The complete design.</h2>
    <img id="fd-img" src="/work/car-rental-full.png" alt="Car rental website home page" />
    <span id="fd-cap">Home page — Desktop</span><span id="fd-count">01 / 03</span>
    <div class="fd-ph" style="left:149px">Add screen — Booking flow<small>02 / 03</small></div>
    <div class="fd-ph" style="left:948px">Add screen — Fleet page<small>03 / 03</small></div>
  </section>`

const more = `
  ${chip('ke-chip', 'KEEP EXPLORING', 'grey')}
  <h2 id="ke-title">See more of my work.</h2>
  <div id="ke-cta"><a class="abtn light" style="width:209px" href="/work.html">← ALL SELECTED WORK</a><a class="abtn dark" style="width:242px" href="/work.html">NEXT: MOBILE APP DESIGN →</a></div>`

mountPage({
  height: 4645,
  html: pageHero({
    active: 'work', label: 'Car Rental Website Design', chipLabel: 'WEBSITE DESIGN (UI/UX)', chipStyle: 'width:181px;left:857px',
    title: 'Car Rental Website Design', titleStyle: 'font-size:95.5px',
    text: 'A modern, conversion-focused website design for a car rental service — built to make<br />booking feel fast and simple.',
  }) + facts + overview + fullDesign + more + contactFooter(),
  headings: ['#ov-title', '#fd-title', '#ke-title', '#ct-title'],
  groups: [
    ['#pd-back', '#pd-back', { y: 20 }],
    ['#pd-meta', '#pd-meta > div', { y: 24, stagger: 0.1 }],
    ['#ov-chip', '#ov-chip', { y: 20 }],
    ['#ov-list', '#ov-list .prow', { y: 34, stagger: 0.12 }],
    ['#fd-chip', '#fd-chip', { y: 20 }],
    ['#fd-img', '#fd-img', { clipPath: 'inset(0 0 100% 0 round 30px)', duration: 1.5, ease: 'power4.inOut', opacity: 1 }],
    ['#fd-cap', '#fd-cap, #fd-count', { y: 16, stagger: 0.1 }],
    ['.fd-ph', '.fd-ph', { y: 60, stagger: 0.14, duration: 1 }],
    ['#ke-chip', '#ke-chip, #ke-cta a', { y: 24, stagger: 0.1 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ],
})
