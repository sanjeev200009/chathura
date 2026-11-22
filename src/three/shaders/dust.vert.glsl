// Soft particles that drift upward at different depths and lean away from the cursor.
attribute float aSeed;
uniform float uT, uPr, uH;
uniform vec2 uS;
varying float vA;
void main() {
  vec3 p = position; float dp = p.z;
  p.y = mod(p.y + uT * (8. + dp * 20.), uH);
  p.x += sin(uT * .3 + aSeed) * 14. + uS.x * (.3 + dp);
  p.y += uS.y * (.3 + dp);
  vA = (.2 + .8 * dp) * (.5 + .5 * sin(uT * .8 + aSeed)) * smoothstep(0., 140., p.y) * smoothstep(uH, uH - 200., p.y);
  gl_PointSize = (2. + dp * 5.) * uPr;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p.xy, 0., 1.);
}
