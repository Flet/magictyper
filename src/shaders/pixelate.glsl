precision mediump float;

varying vec2 v_tex_coord;

// uniform vec2 size;
const vec2 size = vec2(0.015, 0.015);

uniform sampler2D u_sampler;

void main() {
    vec2 coord = v_tex_coord;
    coord = floor( coord / size ) * size;

    gl_FragColor = texture2D(u_sampler, coord);
}
