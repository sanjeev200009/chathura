import './style.css'
import './about.css'
import './project.css'
import { startPage } from './pagekit.js'

startPage({
  height: 4645,
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

