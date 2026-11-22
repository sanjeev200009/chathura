import './style.css'
import './about.css'
import './expertise.css'
import { startPage } from './pagekit.js'

startPage({
  height: 3379,
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
