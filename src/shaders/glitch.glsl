precision mediump float;
varying vec2 v_tex_coord;
uniform sampler2D u_sampler;
const vec2 resolution = vec2(8.0, 6.0);
const float amount = 50.0;
void main() {
    float d = 1.0 / amount;
    float ar = resolution.x / resolution.y;
    float u = floor(v_tex_coord.x / d) * d + cos(gl_FragCoord.x) * 0.01;
    d = ar / amount;
    float v = floor(v_tex_coord.y / d) * d + sin(gl_FragCoord.y) * 0.01;
    gl_FragColor = texture2D(u_sampler, vec2(u, v));
}
