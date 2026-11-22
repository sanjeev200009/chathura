import '../styles/base.css'
import '../styles/page.css'
import '../styles/services.css'
import { mountPage } from '../core/innerPage.js'
import { pageHero, chip, rows, contactFooter } from '../components/ui.js'
import { SERVICE_ICONS } from '../components/icons.js'
import { SERVICES, EVERY_PROJECT, FAQ } from '../data/content.js'

const CARD_LEFT = [178, 706, 1235]
const CARD_TOP = [1130, 1622]
const cards = SERVICES.map((s, i) => `
  <article class="svc" style="left:${CARD_LEFT[i % 3]}px;top:${CARD_TOP[Math.floor(i / 3)]}px">
    ${SERVICE_ICONS[s.icon]}
    <h3>${s.title}</h3><p>${s.text}</p><a class="gbtn" href="#">GO TO PROJECT PAGE</a>
  </article>`).join('')

const whatIDo = `
  ${chip('sv2-chip', 'WHAT I DO', 'grey')}
  <h2 id="sv2-title">What I design.</h2>
  <p id="sv2-text"><span class="j">Six core services that cover everything from first sketches to a launched product — each one</span>built around real user needs and clear business goals.</p>
  <div id="sv2-line"></div>
  ${cards}`

const everyProject = `
  ${chip('ev-chip', 'EVERY PROJECT', 'grey')}
  <h2 id="ev-title">What every project includes.</h2>
  ${rows('ev-list', EVERY_PROJECT)}`

const FAQ_POS = [[337, 372], [937, 372], [337, 468], [937, 468], [337, 563], [937, 563]]
const faq = `
  <section id="fq" aria-label="Frequently asked questions">
    ${chip('fq-chip', 'FREQUENTLY ASKED QUESTIONS', 'light')}
    <h2 id="fq-title">Straightforward answers to help<br />you make informed decisions</h2>
    ${FAQ.map((q, i) => `<div class="fqr" style="left:${FAQ_POS[i][0]}px;top:${FAQ_POS[i][1]}px"><span>${q}</span><i></i></div>`).join('\n    ')}
  </section>`

mountPage({
  height: 4348,
  html: pageHero({
    active: 'services', label: 'My services', chipLabel: 'MY SERVICES', chipStyle: 'width:125px;left:885px', title: 'My Services',
    text: 'A focused set of creative services combining strategy, visual design, and technology<br />to build meaningful digital experiences.',
  }) + whatIDo + everyProject + faq + contactFooter(),
  headings: ['#sv2-title', '#ev-title', '#fq-title', '#ct-title'],
  groups: [
    ['#sv2-chip', '#sv2-chip', { y: 20 }],
    ['#sv2-text', '#sv2-text', { y: 30 }],
    ['#sv2-line', '#sv2-line', { scaleX: 0, transformOrigin: '0 50%', duration: 1.4 }],
    ['.svc:nth-of-type(1)', '.svc:nth-of-type(-n+3)', { y: 90, scale: 0.97, stagger: 0.16, duration: 1.2 }],
    ['.svc:nth-of-type(4)', '.svc:nth-of-type(n+4)', { y: 90, scale: 0.97, stagger: 0.16, duration: 1.2 }],
    ['#ev-chip', '#ev-chip', { y: 20 }],
    ['#ev-list', '#ev-list .prow', { y: 34, stagger: 0.12 }],
    ['#fq-chip', '#fq-chip', { y: 20 }],
    ['.fqr', '.fqr', { y: 40, stagger: 0.09 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ],
})
