varying float vA;
void main() {
  float d = length(gl_PointCoord - .5);
  gl_FragColor = vec4(.75, 1., .9, smoothstep(.5, 0., d) * vA * .8);
}
