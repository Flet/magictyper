// Blur Pass

precision mediump float;
uniform sampler2D sampler;
uniform float dist;
varying vec2 v_tex_coord;
varying vec3 v_color;
varying float v_alpha;

/* source: https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/13.glsl */
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;
    color += texture2D(image, uv) * 0.1964825501511404;
    color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
    return color;
}

void main(void)
{
    const float dist = 2.5;
    vec4 copyColor0 = blur(sampler, v_tex_coord, vec2(800.0, 600.0), vec2(dist, dist));
    vec4 copyColor1 = blur(sampler, v_tex_coord, vec2(800.0, 600.0), vec2(dist, -dist));
    vec4 blurMix = mix(copyColor0, copyColor1, 0.5);
    gl_FragColor = blurMix;
}
