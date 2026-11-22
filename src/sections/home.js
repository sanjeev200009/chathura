// The home page, one function per section. Every size is in design pixels (1920-wide page).
import { nav, chip } from '../components/ui.js'
import { SERVICE_ICONS, chevron } from '../components/icons.js'
import { HOME_SERVICES, STATS, FAQ, PROJECTS } from '../data/content.js'

const TOOLS = ['ai', 'figma', 'canva', 'ps']

export const hero = () => `
  <section id="hero" aria-label="Hero">
    <canvas id="fx" width="1896" height="1069"></canvas>
    <h1 id="hero-title">
      <span class="line"><span>FREELANCE</span></span>
      <span class="line"><span>CREATIVE DESIGNER</span></span>
    </h1>
    <img id="portrait" src="/hero/portrait.webp" alt="Portrait" width="743" height="775" />
    ${TOOLS.map((t) => `<img class="tool" id="tool-${t}" src="/hero/icon-${t}.png" alt="" />`).join('\n    ')}
    <svg id="cursor" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M2 2 L20 8 L11.5 11.5 L8 20 Z" fill="#c8f21d" /></svg>
    <span id="expert">Expert</span>
    ${nav('', { logoHref: '#', ctaHref: '#footer' })}
    <h2 id="about-title">Digital designer crafting impactful digital experiences, creative visuals, and modern designs that bring brands to life.</h2>
    <p id="about-text">I’m <strong>Chathura</strong>, freelance designer creating modern digital experiences through UI/UX, web, mobile, and<br />graphic design. I combine clean visuals and creative thinking to transform ideas into engaging solutions<br />that help brands stand out.</p>
    <div id="about-cta">
      <a class="btn solid" href="#">VIEW SELECTED WORK</a>
      <a class="btn line" href="#">START A PROJECT</a>
    </div>
    <img id="overlay" alt="" hidden />
  </section>`

// Accordion items; only those with text open.
const ACC = [
  { title: 'Digital-first mindset' },
  { title: 'Creative &amp; visual design' },
  { title: 'People-first experiences', text: 'Designing digital products, websites, and experiences with purpose.', open: true },
  { title: 'Concept to delivery' },
]

export const about = () => `
  <section id="about" aria-label="About us">
    <span id="chip"><span>/</span>ABOUT US</span>
    <h2 id="ab-title">Digital designer who thinks beyond visuals.</h2>
    <div id="ab-text">
      <p>I design digital experiences, websites, and visual identities that bring ideas to life — combining creativity, strategy, and technology to create meaningful digital products. With 5+ years of hands-on experience in digital design, I work across UI/UX, web design, branding, and creative design, helping businesses turn complex ideas into clear, engaging, and user-focused experiences.</p>
      <p>I enjoy solving design problems, exploring new ideas, and creating digital experiences that look great and work even better. From early concepts and wireframes to polished interfaces and website experiences, I focus on every detail that makes a product feel right. I believe great design is more than how something looks — it's how it communicates, connects, and creates value.</p>
    </div>
    <div id="acc">
      ${ACC.map((a, i) => `<div class="row${a.open ? ' open' : ''}"><span class="num">/ ${String(i + 1).padStart(3, '0')}</span><h3>${a.title}</h3><i class="ico"></i>${a.text ? `\n        <div class="desc"><p>${a.text}</p></div>` : ''}</div>`).join('\n      ')}
    </div>
  </section>`

const CARD_LEFT = [176, 705, 1234]
export const services = () => `
  <section id="services" aria-label="My services">
    ${chip('sv-chip', 'MY SERVICES')}
    <h2 id="sv-title">What I design.</h2>
    <p id="sv-text"><span class="j">A focused set of creative services combining strategy, visual design, and technology to build meaningful</span>digital experiences and strong brand identities.</p>
    <button class="arrow" id="sv-prev" aria-label="Previous">${chevron('left')}</button>
    <button class="arrow" id="sv-next" aria-label="Next">${chevron('right')}</button>
    <div id="sv-line"></div>
    ${HOME_SERVICES.map((s, i) => `<article class="card" style="left:${CARD_LEFT[i]}px">
      ${SERVICE_ICONS[s.icon]}
      <h3>${s.title}</h3>
      <p>${s.text}</p>
      <a class="gbtn" href="#">GO TO PROJECT PAGE</a>
    </article>`).join('\n    ')}
  </section>`

const TABS = ['WEBSITE DESIGN (UI/UX)', 'Mobile App Design (UI/UX)', 'Graphic Design', 'SaaS Design']
const lead = PROJECTS[0]
export const work = () => `
  <section id="work" aria-label="Selected work">
    ${chip('wk-chip', 'SELECTED WORK')}
    <h2 id="wk-title">Design solutions built around your vision.</h2>
    <div id="wk-tabs">
      ${TABS.map((t, i) => `<button class="tab${i ? '' : ' on'}">${t}</button>`).join('\n      ')}
    </div>
    <button class="arrow wk-arrow" id="wk-prev" aria-label="Previous">${chevron('left', { size: 22, color: '#0a1f1a', width: 2.6 })}</button>
    <button class="arrow wk-arrow" id="wk-next" aria-label="Next">${chevron('right', { size: 22, color: '#0a1f1a', width: 2.6 })}</button>
    <div id="wk-bars">${TABS.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div>
    <img id="wk-img" src="${lead.image}" alt="${lead.title}" />
    <div id="wk-info">
      <h3>${lead.title}</h3>
      <h4>${lead.kind}</h4>
      <p><span class="j">Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero</span><span class="j">et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora</span><span class="j">torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna</span>at turpis condimentum lobortis.</p>
      <a class="wbtn" href="${lead.href}">VIEW FULL DESIGN</a>
    </div>
  </section>`

const STAT_LEFT = [257, 732, 1205]
export const expertise = () => `
  <section id="expertise" aria-label="Our expertise">
    ${chip('ex-chip', 'OUR EXPERTISE', 'grey')}
    <h2 id="ex-title">A creative journey built on<br />experience and ideas.</h2>
    ${STATS.map((s, i) => `<div class="stat" style="left:${STAT_LEFT[i]}px"><h3>${s.value}</h3><p>${s.label}</p></div>`).join('\n    ')}
  </section>`

const FAQ_LEFT = [327, 927], FAQ_TOP = [552, 645, 738]
export const qa = () => `
  <section id="qa" aria-label="Frequently asked questions">
    <div id="qa-mark" aria-hidden="true">Q &amp; A</div>
    ${chip('qa-chip', 'FREQUENTLY ASKED QUESTIONS', 'dark')}
    <h2 id="qa-title">Straightforward answers to<br />help you make informed</h2>
    <div id="qa-line"></div>
    ${FAQ.map((q, i) => `<div class="faq" style="left:${FAQ_LEFT[i % 2]}px;top:${FAQ_TOP[i >> 1]}px"><span>${q}</span><i></i></div>`).join('\n    ')}
  </section>`
