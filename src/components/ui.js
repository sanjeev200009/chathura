// Small shared pieces of markup used across the pages.
import { NAV, BRAND, EMAIL, SOCIALS, CONTACT } from '../data/site.js'
import { ARROW_RIGHT, ARROW_UP_RIGHT, SOCIAL_ICONS } from './icons.js'

const attr = (style) => (style ? ` style="${style}"` : '')

// "/ LABEL" pill. `tone`: '' (light green), 'grey', 'dark' or 'light' (on green panels).
export const chip = (id, label, tone = '', style = '') =>
  `<span class="chip${tone ? ` chip-${tone}` : ''}" id="${id}"${attr(style)}><span>/</span>${label}</span>`

// The top navigation. `active` is a NAV key; the home page uses its own logo and button targets.
export const nav = (active = '', { logoHref = '/', ctaHref = '#contact' } = {}) => `
  <nav id="nav">
    <a id="logo" href="${logoHref}">${BRAND}</a>
    <ul>
      ${NAV.map((n) => `<li><a${n.key === active ? ' class="on"' : ''} href="${n.href}">${n.label}</a></li>`).join('\n      ')}
    </ul>
    <a id="cta" href="${ctaHref}">GET IN TOUCH</a>
  </nav>`

// Numbered rows with a title, one line of text and a plus button (process lists, skills, overview).
export const rows = (id, items, heights = []) => `
  <div id="${id}">
    ${items.map((it, i) => `<div class="prow"${attr(heights[i] ? `height:${heights[i]}px` : '')}><span class="num">/ ${String(i + 1).padStart(3, '0')}</span><h3>${it.title}</h3><p>${it.text}</p><i class="pico"></i></div>`).join('\n    ')}
  </div>`

// The hero card at the top of every inner page, with its own Three.js canvas behind the text.
export const pageHero = ({ active, label, chipLabel, chipStyle, title, titleStyle = '', text }) => `
  <section id="abhero" aria-label="${label}">
    <canvas id="hero-fx" width="1896" height="638"></canvas>
    ${nav(active)}
    <span id="ah-chip"${attr(chipStyle)}><span>/</span>${chipLabel}</span>
    <h1 id="ah-title"${attr(titleStyle)}>${title}</h1>
    <p id="ah-text">${text}</p>
  </section>`

// Contact footer of the inner pages: text links, no icons.
export const contactFooter = () => `
  <footer id="contact">
    <h2 id="ct-title">${CONTACT.title}</h2>
    <p id="ct-text">${CONTACT.text}</p>
    <a id="ct-mail" href="mailto:${EMAIL}">${EMAIL} ${ARROW_UP_RIGHT}</a>
    <div id="ct-links">${SOCIALS.map((s) => `<a href="${s.href}">${s.label}</a>`).join('')}</div>
    <div id="ct-base"><span>${CONTACT.copyright}</span><span>${CONTACT.note}</span></div>
  </footer>`

// Home page footer: rounded dark panel, links with icons.
export const homeFooter = () => `
  <footer id="footer">
    <h2 id="ft-title">${CONTACT.title}</h2>
    <p id="ft-text">${CONTACT.text}</p>
    <a id="ft-mail" href="mailto:${EMAIL}">${EMAIL} ${ARROW_RIGHT}</a>
    <div id="ft-links">
      ${SOCIALS.map((s) => `<a href="${s.key === 'email' ? '#' : s.href}">${SOCIAL_ICONS[s.key]}${s.label}</a>`).join('\n      ')}
    </div>
    <div id="ft-base"><span>${CONTACT.copyright}</span><span>${CONTACT.note}</span></div>
  </footer>`
