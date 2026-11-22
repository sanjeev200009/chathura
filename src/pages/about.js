import '../styles/base.css'
import '../styles/page.css'
import '../styles/about.css'
import { mountPage } from '../core/innerPage.js'
import { readMore } from '../core/layout.js'
import { pageHero, chip, rows, contactFooter } from '../components/ui.js'
import { PROCESS, TOOLS } from '../data/content.js'
import { STAR } from '../components/icons.js'

const story = `
  ${chip('st-chip', 'MY STORY', 'grey')}
  <h2 id="st-title">Designer by passion, problem solver by nature.</h2>
  <div id="st-photo"><img src="/hero/portrait.webp" alt="Chathura" width="743" height="775" /></div>
  <div id="st-text">
    <p>I’m Chathura, a freelance designer creating modern digital experiences through UI/UX, web, mobile, and graphic design. I combine clean visuals and creative thinking to transform ideas into engaging solutions that help brands stand out.</p>
    <p>With 5+ years of hands-on experience, I help businesses turn complex ideas into clear, engaging, and user-focused experiences — from early concepts and wireframes to polished interfaces and website experiences.</p>
    <p>I believe great design is more than how something looks — it’s how it communicates, connects, and creates value.</p>
  </div>
  <div class="sc" style="left:908px"><h3>5+ years</h3><p>Of design experience</p></div>
  <div class="sc" style="left:1178px"><h3>20+ projects</h3><p>Delivered for clients</p></div>
  <div class="sc" style="left:1445px"><h3>6 services</h3><p>From UI/UX to branding</p></div>
  <div id="st-cta"><a class="abtn dark" href="/work.html">VIEW SELECTED WORK</a><a class="abtn light" href="#contact">START A PROJECT</a></div>`

const process = `
  ${chip('pr-chip', 'HOW I WORK', 'grey')}
  <h2 id="pr-title">A simple process built around you.</h2>
  ${rows('pr-list', PROCESS)}`

const TOOL_LEFT = [152, 549, 944, 1341]
const toolkit = `
  <section id="tk" aria-label="Toolkit">
    ${chip('tk-chip', 'TOOLKIT', 'light')}
    <h2 id="tk-title">The tools behind the work.</h2>
    ${TOOLS.map((t, i) => `<div class="tool-card" style="left:${TOOL_LEFT[i]}px"><b>${STAR}</b><h3>${t.name}</h3><p>${t.text}</p></div>`).join('\n    ')}
  </section>`

mountPage({
  height: 3800,
  html: pageHero({
    active: 'about', label: 'About me', chipLabel: 'ABOUT US', title: 'About Me',
    text: 'Freelance designer creating modern digital experiences — clean visuals, creative<br />thinking, and solutions that help brands stand out.',
  }) + story + process + toolkit + contactFooter(),
  headings: ['#st-title', '#pr-title', '#tk-title', '#ct-title'],
  groups: [
    ['#st-chip', '#st-chip', { y: 20 }],
    ['#st-photo', '#st-photo', { clipPath: 'inset(100% 0 0 0 round 20px)', duration: 1.4, ease: 'power4.inOut', opacity: 1 }],
    ['#st-text', '#st-text p', { y: 40, stagger: 0.14 }],
    ['.sc', '.sc', { y: 50, stagger: 0.12, duration: 1 }],
    ['#st-cta', '#st-cta a', { y: 24, stagger: 0.1 }],
    ['#pr-chip', '#pr-chip', { y: 20 }],
    ['#pr-list', '.prow', { y: 34, stagger: 0.12 }],
    ['#tk-chip', '#tk-chip', { y: 20 }],
    ['.tool-card', '.tool-card', { y: 80, scale: 0.97, stagger: 0.14, duration: 1.1 }],
    ['#ct-text', '#ct-text, #ct-mail, #ct-links a', { y: 30, stagger: 0.1 }],
  ],
})

readMore('#st-text')
