// Slow green aurora near the top of the hero, plus a soft light that follows the cursor.
varying vec2 vUv;
uniform float uT, uA, uAsp;
uniform vec2 uM;

float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * n(p); p *= 2.; a *= .5; } return v; }

void main() {
  float top = smoothstep(.4, 1., vUv.y);
  float f = fbm(vec2(vUv.x * 3. * uAsp, vUv.y * 2.) + vec2(uT * .05, -uT * .03));
  float f2 = fbm(vec2(vUv.x * 5. * uAsp, vUv.y * 3.) - uT * .07);
  float a = top * (f * .6 + f2 * .3) * .32;
  vec2 d = (vUv - uM) * vec2(uAsp, 1.);
  float spot = exp(-dot(d, d) * 12.) * .15;
  vec3 col = mix(vec3(0., .78, .5), vec3(.45, 1., .82), f2);
  gl_FragColor = vec4(col, (a + spot) * uA);
}
