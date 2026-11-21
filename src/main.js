import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// --- Three.js scene ---
const canvas = document.querySelector('#scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
camera.position.set(0, 0, 6)

scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(3, 4, 5)
scene.add(light)

const mesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.32, 160, 24),
  new THREE.MeshStandardMaterial({ color: 0x6d5efc, metalness: 0.5, roughness: 0.25 }),
)
scene.add(mesh)

function resize() {
  const { innerWidth: w, innerHeight: h } = window
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

gsap.ticker.add((t) => {
  mesh.rotation.y += 0.004 // idle spin on top of the scroll motion
  renderer.render(scene, camera)
})

// --- Scroll-driven motion (scrubbed to scroll position) ---
const tl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1 },
})
tl.to(mesh.position, { x: 2, duration: 1 }, 0)
  .to(mesh.rotation, { x: Math.PI * 2, duration: 2 }, 0)
  .to(camera.position, { z: 4, duration: 1 }, 0)
  .to(mesh.position, { x: -2, duration: 1 }, 1)
  .to(camera.position, { z: 7, duration: 1 }, 1)
  .to(mesh.material.color, { r: 0.1, g: 0.8, b: 0.7, duration: 2 }, 0)

// --- Text reveal as sections enter ---
gsap.utils.toArray('[data-reveal]').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
  })
})
