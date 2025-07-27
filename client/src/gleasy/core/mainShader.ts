import { GLShader } from "./glSystem";
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

export class MyGLShader extends GLShader{
    positionLocation: number;
    normalLocation: number;
    texcoordLocation: number;
    matrixLocation: WebGLUniformLocation;
    colorLocation: WebGLUniformLocation;
    textureLocation: WebGLUniformLocation;

    constructor(gl: WebGLRenderingContext){
        let vertexShaderSource = vertexSource;  
        let fragmentShaderSource = fragmentSource;

        super(gl, vertexShaderSource, fragmentShaderSource);
        this.positionLocation = this.getAttribLocation('a_position');
        this.normalLocation = this.getAttribLocation('a_normal');
        this.texcoordLocation = this.getAttribLocation('a_texcoord');
        this.matrixLocation = this.getUniformLocation('u_matrix');
        this.colorLocation = this.getUniformLocation('u_color');
        this.textureLocation = this.getUniformLocation('u_texture');
    }

    protected useProgram(): () => void {
        const destructor = super.useProgram();
        const gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.texcoordLocation);
        return ()=>{
            gl.disableVertexAttribArray(this.positionLocation);
            gl.disableVertexAttribArray(this.normalLocation);
            gl.disableVertexAttribArray(this.texcoordLocation);
            gl.disable(gl.DEPTH_TEST);
            destructor();
        }
    }

    setMatrix(matrix: Array<number>){
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    }
}