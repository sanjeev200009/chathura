import '../styles/base.css'
import '../styles/page.css'
import '../styles/expertise.css'
import { mountPage } from '../core/innerPage.js'
import { pageHero, chip, rows, contactFooter } from '../components/ui.js'
import { STATS, SKILLS, PRINCIPLES } from '../data/content.js'

const STAT_LEFT = [177, 706, 1235]
const experience = `
  ${chip('xp-chip', 'EXPERIENCE', 'grey')}
  <h2 id="xp-title">A creative journey built on<br />experience and ideas.</h2>
  ${STATS.map((s, i) => `<div class="xs" style="left:${STAT_LEFT[i]}px"><h3>${s.value}</h3><p>${s.label}</p></div>`).join('\n  ')}`

const skills = `
  ${chip('sk-chip', 'SPECIALTIES', 'grey')}
  <h2 id="sk-title">Skills that shape the work.</h2>
  ${rows('sk-list', SKILLS)}`

const CARD_LEFT = [152, 549, 944, 1341]
const principles = `
  <section id="pp" aria-label="How I think">
    ${chip('pp-chip', 'HOW I THINK', 'light')}
    <h2 id="pp-title">Principles behind every design.</h2>
    ${PRINCIPLES.map((p, i) => `<div class="pc" style="left:${CARD_LEFT[i]}px"><b>${String(i + 1).padStart(2, '0')}</b><h3>${p.title}</h3><p>${p.text}</p></div>`).join('\n    ')}
  </section>`

mountPage({
  height: 3379,
  html: pageHero({
    active: 'expertise', label: 'Our expertise', chipLabel: 'OUR EXPERTISE', chipStyle: 'width:134px;left:881px', title: 'Our Expertise',
    text: 'A creative journey built on experience and ideas — and a focused set of skills that turn<br />both into results.',
  }) + experience + skills + principles + contactFooter(),
  headings: ['#xp-title', '#sk-title', '#pp-title', '#ct-title'],
  groups: [
    ['#xp-chip', '#xp-chip', { y: 20 }],
    ['.xs', '.xs', { y: 70, stagger: 0.15, duration: 1.1 }],
    ['#sk-chip', '#sk-chip', { y: 20 }],
    ['#sk-list', '#sk-list .prow', { y: 34, stagger: 0.12 }],
    ['#pp-chip', '#pp-chip', { y: 20 }],
    ['.pc', '.pc', { y: 80, scale: 0.97, stagger: 0.14, duration: 1.1 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ],
})
