// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Created by S.Guillitte
void mains()
{
	float time=iGlobalTime*1.0;
	vec2 uv = (gl_FragCoord.xy / iResolution.xx-0.5)*8.0;
    vec2 uv0=uv;
	float i0=1.0;
	float i1=1.0;
	float i2=1.0;
	float i4=0.0;
	for(int s=0;s<7;s++)
	{
		vec2 r;
		r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*0.3;
		uv.xy+=r;

		i0*=1.93;
		i1*=1.15;
		i2*=1.7;
		i4+=0.05+0.1*time*i1;
	}
    float r=sin(uv.x-time)*0.5+0.5;
    float b=sin(uv.y+time)*0.5+0.5;
    float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
	gl_FragColor = vec4(r,g,b,1.0);
}

void main() {
    vec4 sum = vec4(0.0);
    vec2 texcoord = gl_FragCoord.xy;
    for(int xx = -4; xx <= 4; xx++) {
        for(int yy = -4; yy <= 4; yy++) {
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
    gl_FragColor = sum * 0.025 + texture2D(u_sampler, texcoord);
}
