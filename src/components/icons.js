// Line icons drawn for the design, as SVG strings.

export const SERVICE_ICONS = {
  uiux: '<svg class="cico" width="54" height="54" viewBox="0 0 54 54" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="22" height="22" rx="6"/><rect x="29" y="29" width="22" height="22" rx="6"/><path d="M13 24v12a5 5 0 0 0 5 5h11"/></svg>',
  web: '<svg class="cico" width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M27 8A24 24 0 1 0 52 33"/><path d="M33 4v22h22A22 22 0 0 0 33 4z" transform="translate(-2 0)"/></svg>',
  graphic: '<svg class="cico" width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="#0a0a0a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M27 6c2 13 6 18 20 21-14 3-18 8-20 21-2-13-6-18-20-21 14-3 18-8 20-21z" transform="translate(-2 4) scale(.92)"/><path d="M47 3v11M41.5 8.5h11"/><circle cx="7" cy="48" r="4"/></svg>',
}

export const chevron = (dir, { size = 24, color = '#044121', width = 2.4 } = {}) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"><path d="${dir === 'left' ? 'M15 4l-8 8 8 8' : 'M9 4l8 8-8 8'}"/></svg>`

export const ARROW_RIGHT = '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#0a0a0a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5"/></svg>'
export const ARROW_UP_RIGHT = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#0a0a0a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l6-6M4 3h5v5"/></svg>'

export const SOCIAL_ICONS = {
  behance: '<svg width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#fff"/><text x="10" y="14" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="10" fill="#0c1715">Be</text></svg>',
  linkedin: '<svg width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#fff"/><text x="10" y="14.5" text-anchor="middle" font-family="Inter,sans-serif" font-weight="700" font-size="11" fill="#0c1715">in</text></svg>',
  facebook: '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#fff"/><path d="M11 17v-6h2l.4-2.4H11V7.2c0-.7.3-1.2 1.3-1.2H13.5V4a14 14 0 0 0-1.8-.1C9.9 3.9 8.7 5 8.7 6.9v1.7H6.7V11h2v6z" fill="#0c1715"/></svg>',
  instagram: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.6"><rect x="2" y="2" width="16" height="16" rx="5"/><circle cx="10" cy="10" r="3.8"/><circle cx="14.7" cy="5.3" r=".6" fill="#fff"/></svg>',
  email: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"><rect x="2" y="4" width="16" height="12" rx="2.5"/><path d="M3 6l7 5 7-5"/></svg>',
}

// A small arrow drawn in the text colour, for buttons ("← back", "next →").
export const textArrow = (dir) =>
  `<svg class="tarrow" width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${dir === 'left' ? 'M13 5H1.5M5.5 1L1.5 5l4 4' : 'M1 5h11.5M8.5 1l4 4-4 4'}"/></svg>`

// The four-point star on the toolkit cards.
export const STAR = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="1.2" stroke-linejoin="round" aria-hidden="true"><path d="M12 5c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7z"/></svg>'
