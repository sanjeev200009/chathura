# CS Creative — portfolio

Vite + Three.js + GSAP (ScrollTrigger) + Lenis + Tailwind v4.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

## Structure

```
index.html, about.html, ...   thin shells: <div id="hero-wrap"> + one script
src/
  pages/        one entry per page (home, about, services, work, expertise, project-car-rental)
  sections/     the home page sections (hero, about, services, work, expertise, qa)
  components/   shared markup: nav, chips, rows, page hero, footers, icons
  data/         all text and lists (site.js = nav/contact, content.js = services, projects, FAQ...)
  core/         innerPage.js: mounts an inner page, scales it, starts Three.js + scroll motion
  three/        aurora.js + shaders/*.glsl — the light and particle layer behind every hero
  motion/       smooth scroll, word split, scroll reveals
  styles/       base.css (shared), home.css, page.css (inner pages), one file per page
public/         images (hero, work)
```

- To change text, edit `src/data/`. To add a project, add it to `PROJECTS` in `src/data/content.js`.
- Pages are laid out in 1920-wide design pixels and scaled to the window.
- `?still` on any page turns all motion off (for comparing with Figma).
