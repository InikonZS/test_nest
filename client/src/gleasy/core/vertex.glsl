attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;
uniform mat4 u_matrix;

varying vec4 pos;
varying vec3 nos;
varying vec4 ppos;

varying vec2 v_texcoord;

void main() {
    gl_Position = u_matrix * a_position;
    pos = a_position;
    ppos = gl_Position;
    nos = a_normal;
    v_texcoord = a_texcoord;
}