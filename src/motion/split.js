// Wrap each word in a mask so it can rise from below. Keeps <br> and the spaces.
export function split(el) {
  const out = []
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment()
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return }
          const w = document.createElement('span')
          w.className = 'w'
          const i = document.createElement('span')
          i.textContent = part
          i.style.display = 'inline-block'
          w.appendChild(i)
          frag.appendChild(w)
          out.push(i)
        })
        n.replaceWith(frag)
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n)
    })
  }
  walk(el)
  return out
}
