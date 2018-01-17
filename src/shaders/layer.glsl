precision mediump float;
varying vec2 v_tex_coord;
uniform sampler2D u_sampler;
const float amount = 50.0;

void main() {
  float d = 1.0 / amount;
  float ar = iResolution.x / iResolution.y;
  float u = floor(gl_FragCoord.x / d) * d + cos(gl_FragCoord.x) * 0.01;
  d = ar / amount;
  float v = floor(gl_FragCoord.y / d) * d + sin(gl_FragCoord.y) * 0.01;
  gl_FragColor = texture2D(iChannel0, vec2(u, v));
}
