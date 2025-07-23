precision mediump float;
uniform vec4 u_color;
varying vec4 pos;
varying vec4 ppos;
varying vec3 nos;
varying vec4 v_texcoord;
uniform sampler2D u_texture;

vec4 tex;

void main() {
    //vec4 vmod = abs(mod(v_texcoord , 2.0) - 1.0);
    vec4 vmod = mod(v_texcoord , 1.0);
    //vec4 vmod = floor(mod(v_texcoord , 1.0) * 32.0) / 32.0;
    //float textureOffset = pos.z > -10.0 ? 0.0 : 1.0;
    tex = texture2D(u_texture, vec2(((vmod.x/2.0 + 0.25 + v_texcoord.z) ) / 4.0, ((vmod.y/2.0 + 0.25 + v_texcoord.w) ) / 4.0));
     //vec4 tex2 = texture2D(u_texture, vec2(((vmod.x/2.0 + 0.27 + v_texcoord.z) ) / 4.0, ((vmod.y/2.0 + 0.27 + v_texcoord.w) ) / 4.0));
//tex //= abs(((vmod.x  -0.5)* (vmod.x -0.5)) * ((vmod.y - 0.5) * (vmod.y-0.5))) * (tex2 + tex1) /2.0 + (1.0-abs(((vmod.x - 0.5) * (vmod.x -0.5)) * ((vmod.y -0.5) * (vmod.y-0.5)))) * tex1;
    gl_FragColor = (tex / 5.0 * 4.0 + tex / 5.0 * abs(dot(normalize(vec3(1.0, 0.5, 0.25)), normalize(nos)))) / max((ppos.z * ppos.z / 1000.0 / 100.0), 1.0);
}