import { TickerSystem } from "./tickerSystem";
import { KeyboardSystem } from "./keyboardSystem";
import { GLShader, GLBuffer } from "./glSystem";
import m4 from '../../gl/core/m4';

class MyGLShader extends GLShader{
    positionLocation: number;
    normalLocation: number;
    texcoordLocation: number;
    matrixLocation: WebGLUniformLocation;
    colorLocation: WebGLUniformLocation;
    textureLocation: WebGLUniformLocation;

    constructor(gl: WebGLRenderingContext){
        let vertexShaderSource = `
      attribute vec4 a_position;
      attribute vec3 a_normal;  
      attribute vec2 a_texcoord;
      uniform mat4 u_matrix;

      varying vec4 pos;
      varying vec3 nos;
        varying vec4 ppos;

    
    varying vec2 v_texcoord;

      void main() {
        gl_Position = u_matrix *  a_position;
        pos = a_position;
        ppos = gl_Position;
        nos = a_normal;
        v_texcoord = a_texcoord;
      }
    `;    
    //u_matrix_world *
    //  uniform mat4 u_matrix_world;

    let fragmentShaderSource =`
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
      float textureOffset = pos.z >-10.0 ? 0.0 : 1.0;
      tex = texture2D(u_texture, vec2((vmod.x + textureOffset) / 2.0, (vmod.y + 0.0) / 1.0));
      gl_FragColor = (tex / 5.0 * 4.0 + tex/5.0 * abs(dot(normalize(vec3(1.0, 0.5, 0.25)), normalize(nos)) ))/ max((ppos.z * ppos.z / 1000.0 /100.0), 1.0);
      }
    `; 
        super(gl, vertexShaderSource, fragmentShaderSource);
        this.positionLocation = this.getAttribLocation('a_position');
        this.normalLocation = this.getAttribLocation('a_normal');
        this.texcoordLocation = this.getAttribLocation('a_texcoord');
        this.matrixLocation = this.getUniformLocation('u_matrix');
        this.colorLocation = this.getUniformLocation('u_color');
        this.textureLocation = this.getUniformLocation('u_texture');
    }

    useProgram(): () => void {
        const destructor = super.useProgram();
        const gl = this.gl;
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.texcoordLocation);
        return ()=>{
            gl.disableVertexAttribArray(this.positionLocation);
            gl.disableVertexAttribArray(this.normalLocation);
            gl.disableVertexAttribArray(this.texcoordLocation);
            destructor();
        }
    }

}

export class GameScene{
    canvas: HTMLCanvasElement;
    ticker: TickerSystem;
    //glSystem: GLSystem;
    keyboardSystem: KeyboardSystem;
    mainShader: MyGLShader;
    fps: number = 15;
    fpsnl: number = 15;
    onTick: ()=>void;
    gl: WebGLRenderingContext;
    positionBuffer: GLBuffer;
    normalBuffer: GLBuffer;
    texcoordBuffer: GLBuffer;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        const context = canvas.getContext('webgl');
        if (!context){
            throw new Error('No webgl');
        }
        this.gl = context;

        this.ticker = new TickerSystem();
        this.ticker.onTick = this.handleTick.bind(this);
        /*this.glSystem = new GLSystem(canvas);
        this.mainShader = this.glSystem.createShaderSystem(GLShaderSystem);
        this.mainShader.onDraw = this.handleMainShaderDraw.bind(this);*/
        this.mainShader = new MyGLShader(this.gl);
        this.positionBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0, 0,
                0, 1, 0,
                1, 1, 0,
            ]
        ), {usage: this.gl.DYNAMIC_DRAW});

        this.normalBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            ]
        ));

        this.texcoordBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0,
                0, 1,
                1, 1,
            ]
        ));

        this.keyboardSystem = new KeyboardSystem();
        this.keyboardSystem.onChangeState = this.handleKeyboardState.bind(this);
    }

    
    handleTick(time: number, lastTime: number){
        //console.log(time);
        const fstart = Date.now();
        const deltaTime = time - lastTime;

        this.fps = (this.fps * 31 + (1000 / Math.max(deltaTime, 0.1))) / 32;
        const closeProgram = this.mainShader.useProgram();
        this.mainShader.setBuffer(this.mainShader.positionLocation, this.positionBuffer.buffer, {
            size: 3
        });
        this.mainShader.setBuffer(this.mainShader.normalLocation, this.normalBuffer.buffer, {
            size: 3
        });
        this.mainShader.setBuffer(this.mainShader.texcoordLocation, this.texcoordBuffer.buffer, {
            size: 2
        });

        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        let matrix = m4.perspective(1, aspect, 0.1, 2000); 
        matrix = m4.translate(matrix, 0, 0, -3);
        this.gl.uniformMatrix4fv(this.mainShader.matrixLocation, false, matrix);
        for (let i = 0; i< 2000; i++){
            this.positionBuffer.updateBuffer(new Float32Array(
            [
                0, 0, 0,
                0, 1* Math.sin(time / 100), 0,
                1 + Math.sin(i /10), 1 + Math.cos(i/10), 0,
            ]
        ));
        this.mainShader.setBuffer(this.mainShader.positionLocation, this.positionBuffer.buffer, {
            size: 3
        });
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
        }
        //shader.draw
        closeProgram();

        const fend = Date.now();
        this.fpsnl = (this.fpsnl * 31 + (1000 / Math.max(fend - fstart, 1))) / 32;
        this.onTick?.();
    }

    handleKeyboardState(){

    }

    handleMainShaderDraw(){

    }
}
