precision lowp float;
varying vec2 v_tex_coord;
uniform sampler2D u_sampler;

void main() {
    vec4 sum = vec4(0.0);
    vec2 texcoord = v_tex_coord;
    for (int xx = -4; xx <= 4; xx++) {
        for (int yy = -4; yy <= 4; yy++) {
            float dist = sqrt(float(xx*xx) + float(yy*yy));
            float factor = 0.0;
            if (dist == 0.0) {
                factor = 2.0;
            } else {
                factor = 2.0/abs(float(dist));
            }
            sum += texture2D(u_sampler, texcoord + vec2(xx, yy) * 0.003) * factor;
        }
    }
    gl_FragColor = sum * 0.012 + texture2D(u_sampler, texcoord);
}
