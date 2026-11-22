import { gsap } from 'gsap'

// A paragraph or heading that types itself out, letter by letter, with a blinking caret.
// Letters are hidden with opacity (not removed), so the text never reflows while it types.
// Returns a paused timeline: play it to type, pause(0) to hide it again.
export function typeText(el, { speed = 0.022 } = {}) {
  const chars = []
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return }
          const word = document.createElement('span')
          word.className = 'tw' // keeps a word on one line
          for (const ch of part) {
            const c = document.createElement('span')
            c.textContent = ch
            word.appendChild(c)
            chars.push(c)
          }
          frag.appendChild(word)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n)
    })
  }
  walk(el)

  let shown = 0
  const show = (n) => {
    n = Math.round(n)
    if (n === shown) return
    for (let i = Math.min(n, shown); i < Math.max(n, shown); i++) chars[i].style.opacity = i < n ? 1 : 0
    chars[shown - 1]?.classList.remove('caret')
    chars[n - 1]?.classList.add('caret')
    shown = n
  }
  chars.forEach((c) => { c.style.opacity = 0 })
  const state = { n: 0 }
  const tl = gsap.timeline({ paused: true, data: { reset: () => { state.n = 0; show(0) } } })
    .fromTo(state, { n: 0 }, { n: chars.length, duration: chars.length * speed, ease: 'none', onUpdate: () => show(state.n) })
  return tl
}

// The hero title: types each phrase (two lines), holds it, erases it, and moves on - for ever.
export function typeCycle(lines, phrases, { type = 0.07, erase = 0.035, hold = 2.6, delay = 0.3 } = {}) {
  const caret = Object.assign(document.createElement('span'), { className: 'hero-caret' })
  const put = (line, text) => { lines[line].textContent = text; lines[line].appendChild(caret) }
  lines.forEach((l) => { l.textContent = '' })
  put(0, '')

  const tl = gsap.timeline({ repeat: -1, delay })
  phrases.forEach((phrase) => {
    phrase.forEach((text, line) => {
      for (let k = 1; k <= text.length; k++) tl.call(put, [line, text.slice(0, k)], `+=${type}`)
    })
    tl.to({}, { duration: hold })
    for (let line = phrase.length - 1; line >= 0; line--) {
      for (let k = phrase[line].length - 1; k >= 0; k--) tl.call(put, [line, phrase[line].slice(0, k)], `+=${erase}`)
    }
    tl.to({}, { duration: 0.35 })
  })
  return tl
}
