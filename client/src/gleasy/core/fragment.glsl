precision mediump float;
uniform vec4 u_color;
varying vec4 pos;
varying vec4 ppos;
varying vec3 nos;
varying vec2 v_texcoord;
uniform sampler2D u_texture;

vec4 tex;

void main() {
    vec2 vmod = mod(v_texcoord, 1.0);
    float textureOffset = pos.z > -10.0 ? 0.0 : 1.0;
    tex = texture2D(u_texture, vec2((vmod.x + textureOffset) / 2.0, (vmod.y + 0.0) / 1.0));
    gl_FragColor = (tex / 5.0 * 4.0 + tex / 5.0 * abs(dot(normalize(vec3(1.0, 0.5, 0.25)), normalize(nos)))) / max((ppos.z * ppos.z / 1000.0 / 100.0), 1.0);
}