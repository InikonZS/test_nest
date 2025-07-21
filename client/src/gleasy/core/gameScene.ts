import { TickerSystem } from "./tickerSystem";
import { KeyboardSystem } from "./keyboardSystem";
import { GLShader, GLBuffer, GLTexture } from "./glSystem";
import texImage from "../../gl/assets/dirt.png";
import m4 from '../../gl/core/m4';
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";

class MyGLShader extends GLShader{
    positionLocation: number;
    normalLocation: number;
    texcoordLocation: number;
    matrixLocation: WebGLUniformLocation;
    colorLocation: WebGLUniformLocation;
    textureLocation: WebGLUniformLocation;

    constructor(gl: WebGLRenderingContext){
        let vertexShaderSource = vertexSource;  
    //u_matrix_world *
    //  uniform mat4 u_matrix_world;

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

    setMatrix(matrix: Array<number>){
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);
    }
}

class MyGLModel {
    gl: WebGLRenderingContext;
    positionBuffer: GLBuffer;
    normalBuffer: GLBuffer;
    texcoordBuffer: GLBuffer;
    pointCount: number;
    constructor(gl: WebGLRenderingContext){
        this.gl = gl;
        this.pointCount = 3;
        
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
    }
}

export class GameScene{
    canvas: HTMLCanvasElement;
    ticker: TickerSystem;
    keyboardSystem: KeyboardSystem;
    mainShader: MyGLShader;
    fps: number = 15;
    fpsnl: number = 15;
    onTick: ()=>void;
    gl: WebGLRenderingContext;
    mainTexture: GLTexture;
    model: MyGLModel;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        const context = canvas.getContext('webgl');
        if (!context){
            throw new Error('No webgl');
        }
        this.gl = context;

        this.ticker = new TickerSystem();
        this.ticker.onTick = this.handleTick.bind(this);
        this.mainShader = new MyGLShader(this.gl);
        this.model = new MyGLModel(this.gl);

        this.mainTexture = new GLTexture(this.gl, texImage);

        this.keyboardSystem = new KeyboardSystem();
        this.keyboardSystem.onChangeState = this.handleKeyboardState.bind(this);
    }

    
    handleTick(time: number, lastTime: number){
        const fstart = Date.now();
        const deltaTime = time - lastTime;

        this.fps = (this.fps * 31 + (1000 / Math.max(deltaTime, 0.1))) / 32;

        this.mainShader.run((shader)=>{
            shader.setBuffer(shader.positionLocation, this.model.positionBuffer.buffer, {
                size: 3
            });
            shader.setBuffer(shader.normalLocation, this.model.normalBuffer.buffer, {
                size: 3
            });
            shader.setBuffer(shader.texcoordLocation, this.model.texcoordBuffer.buffer, {
                size: 2
            });
            shader.setTexture(this.mainTexture.texture, 0, this.gl.TEXTURE_2D);

            const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            let matrix = m4.perspective(1, aspect, 0.1, 2000); 
            matrix = m4.translate(matrix, 0, 0, -3);
            shader.setMatrix(matrix);

            shader.draw(this.gl.TRIANGLES, 0, this.model.pointCount);
        });

        const fend = Date.now();
        this.fpsnl = (this.fpsnl * 31 + (1000 / Math.max(fend - fstart, 1))) / 32;
        this.onTick?.();
    }

    handleKeyboardState(){

    }

    handleMainShaderDraw(){

    }
}
