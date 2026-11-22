import * as THREE from 'three'
import { gsap } from 'gsap'
import auroraVert from './shaders/aurora.vert.glsl?raw'
import auroraFrag from './shaders/aurora.frag.glsl?raw'
import dustVert from './shaders/dust.vert.glsl?raw'
import dustFrag from './shaders/dust.frag.glsl?raw'

// The site's Three.js layer: a slow aurora, soft drifting particles and a light that follows the cursor.
// It is additive (only adds light) and sits behind the text, so the Figma design is unchanged at rest.
// W x H is the size of the hero it lives in (design px); `mouse` is shared with the page's parallax.
export function startAurora(canvas, W, H, mouse, { particles = 150 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  const cam = new THREE.OrthographicCamera(0, W, H, 0, -1, 1)
  const U = {
    uT: { value: 0 }, uA: { value: 0 }, uAsp: { value: W / H },
    uM: { value: new THREE.Vector2(0.5, 0.5) }, uS: { value: new THREE.Vector2() },
    uPr: { value: 1 }, uH: { value: H },
  }
  const additive = { uniforms: U, transparent: true, depthTest: false, blending: THREE.AdditiveBlending }

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.ShaderMaterial({ ...additive, vertexShader: auroraVert, fragmentShader: auroraFrag }))
  glow.position.set(W / 2, H / 2, 0)
  scene.add(glow)

  const pos = new Float32Array(particles * 3), seed = new Float32Array(particles)
  for (let i = 0; i < particles; i++) {
    pos[i * 3] = Math.random() * W; pos[i * 3 + 1] = Math.random() * H; pos[i * 3 + 2] = Math.random()
    seed[i] = Math.random() * 100
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  const dust = new THREE.Points(g, new THREE.ShaderMaterial({ ...additive, vertexShader: dustVert, fragmentShader: dustFrag }))
  dust.frustumCulled = false
  scene.add(dust)

  const t0 = performance.now()
  gsap.ticker.add(() => {
    U.uT.value = (performance.now() - t0) / 1000
    mouse.sx += (mouse.x - mouse.sx) * 0.06
    mouse.sy += (mouse.y - mouse.sy) * 0.06
    U.uM.value.set(mouse.sx, 1 - mouse.sy)
    U.uS.value.set((mouse.sx - 0.5) * -60, (mouse.sy - 0.5) * 40)
    renderer.render(scene, cam)
  })
  gsap.to(U.uA, { value: 1, duration: 2.4, ease: 'power2.out' })

  return {
    // s = the page's current scale, so the canvas draws at the size it is shown.
    resize(s) {
      const pr = Math.min(devicePixelRatio * s, 2)
      U.uPr.value = pr
      renderer.setPixelRatio(pr)
      renderer.setSize(W, H, false)
    },
  }
}
