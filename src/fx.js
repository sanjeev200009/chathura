import * as THREE from 'three'
import { gsap } from 'gsap'

// Premium layer: slow aurora light + soft drifting particles + a light that follows the cursor.
// It is additive (only adds light) and sits behind the heading, so the Figma design is unchanged at rest.
export function startFx(canvas, W, H, mouse) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  const cam = new THREE.OrthographicCamera(0, W, H, 0, -1, 1)
  const U = { uT: { value: 0 }, uA: { value: 0 }, uM: { value: new THREE.Vector2(0.5, 0.5) }, uS: { value: new THREE.Vector2() }, uPr: { value: 1 }, uH: { value: H } }

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
      varying vec2 vUv; uniform float uT,uA; uniform vec2 uM;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}
      void main(){
        float asp=1896./1069.;
        float top=smoothstep(.4,1.,vUv.y);
        float f=fbm(vec2(vUv.x*3.*asp,vUv.y*2.)+vec2(uT*.05,-uT*.03));
        float f2=fbm(vec2(vUv.x*5.*asp,vUv.y*3.)-uT*.07);
        float a=top*(f*.6+f2*.3)*.32;
        vec2 d=(vUv-uM)*vec2(asp,1.);
        float spot=exp(-dot(d,d)*12.)*.15;
        vec3 col=mix(vec3(0.,.78,.5),vec3(.45,1.,.82),f2);
        gl_FragColor=vec4(col,(a+spot)*uA);
      }`,
  }))
  glow.position.set(W / 2, H / 2, 0)
  scene.add(glow)

  const N = 150, pos = new Float32Array(N * 3), seed = new Float32Array(N)
  for (let i = 0; i < N; i++) { pos[i * 3] = Math.random() * W; pos[i * 3 + 1] = Math.random() * H; pos[i * 3 + 2] = Math.random(); seed[i] = Math.random() * 100 }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  const dust = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute float aSeed; uniform float uT,uPr,uH; uniform vec2 uS; varying float vA;
      void main(){
        vec3 p=position; float dp=p.z;
        p.y=mod(p.y+uT*(8.+dp*20.),uH);
        p.x+=sin(uT*.3+aSeed)*14.+uS.x*(.3+dp);
        p.y+=uS.y*(.3+dp);
        vA=(.2+.8*dp)*(.5+.5*sin(uT*.8+aSeed))*smoothstep(0.,140.,p.y)*smoothstep(uH,uH-200.,p.y);
        gl_PointSize=(2.+dp*5.)*uPr;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p.xy,0.,1.);
      }`,
    fragmentShader: 'varying float vA;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.75,1.,.9,smoothstep(.5,0.,d)*vA*.8);}',
  }))
  dust.frustumCulled = false
  scene.add(dust)

  const t0 = performance.now()
  const tick = () => {
    U.uT.value = (performance.now() - t0) / 1000
    mouse.sx += (mouse.x - mouse.sx) * 0.06
    mouse.sy += (mouse.y - mouse.sy) * 0.06
    U.uM.value.set(mouse.sx, 1 - mouse.sy)
    U.uS.value.set((mouse.sx - 0.5) * -60, (mouse.sy - 0.5) * 40)
    renderer.render(scene, cam)
  }
  gsap.ticker.add(tick)
  gsap.to(U.uA, { value: 1, duration: 2.4, ease: 'power2.out' })

  return {
    resize(s) {
      const pr = Math.min(devicePixelRatio * s, 2)
      U.uPr.value = pr
      renderer.setPixelRatio(pr)
      renderer.setSize(W, H, false)
    },
  }
}
