import { GLBufferOptions } from "./glTypes";

export class GLBuffer {
    buffer: WebGLBuffer;
    protected gl: WebGLRenderingContext;
    protected options: GLBufferOptions;
    constructor(
        gl: WebGLRenderingContext, 
        data: Float32Array, 
        options?: GLBufferOptions
    ){
        this.options = {
            target: options?.target || gl.ARRAY_BUFFER,
            usage: options?.usage || gl.STATIC_DRAW
        }
        this.gl = gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(this.options.target, buffer);
        gl.bufferData(this.options.target, data, this.options.usage);
        this.buffer = buffer;
    }

    updateBuffer(data: Float32Array){
        const gl = this.gl;
        gl.bindBuffer(this.options.target, this.buffer);
        gl.bufferData(this.options.target, data, this.options.usage);
    }

    destroy(){
        this.gl.deleteBuffer(this.buffer);
    }
}

type GLBufferType = 
    WebGLRenderingContext['BYTE'] | 
    WebGLRenderingContext['SHORT'] |
    WebGLRenderingContext['UNSIGNED_BYTE'] | 
    WebGLRenderingContext['UNSIGNED_SHORT'] |
    WebGLRenderingContext['FLOAT'];

export class GLShader {
    protected gl: WebGLRenderingContext;
    protected program: WebGLProgram;

    constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string){
        this.gl = gl;
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader){
            throw new Error('Shader create error');
        }
        const program = this.createProgram(vertexShader, fragmentShader);
        if (!program){
            throw new Error('Program create error');
        }
        this.program = program;
    }

    getAttribLocation(name: string){
        return this.gl.getAttribLocation(this.program, name);
    }

    getUniformLocation(name: string){
        return this.gl.getUniformLocation(this.program, name);
    }

    setBuffer(location: GLuint, buffer: WebGLBuffer, options?: {
        target?: WebGLRenderingContext['ARRAY_BUFFER'] | WebGLRenderingContext['ELEMENT_ARRAY_BUFFER'],
        size: number,
        type?: GLBufferType,
        normalize?: boolean,
        stride?: number,
        offset?: number
    }){
        const gl = this.gl;
        gl.bindBuffer(
            options?.target || gl.ARRAY_BUFFER,
            buffer
        );
        gl.vertexAttribPointer(
            location, 
            options?.size || 0, 
            options?.type || gl.FLOAT, 
            options?.normalize || false, 
            options?.stride || 0, 
            options?.offset || 0
        );
    }

    setTexture(texture: WebGLTexture, unit: number, type: WebGLRenderingContext['TEXTURE_2D'] | WebGLRenderingContext['TEXTURE_CUBE_MAP']){
        if (unit < 0 || unit > 31){
            throw new Error('Texture unit shoul be in range 0 - 31');
        }
        const gl = this.gl;
        const textureId = 'TEXTURE' + unit;
        gl.activeTexture(gl[textureId as keyof typeof gl] as GLenum);
        gl.bindTexture(type, texture);
    }

    useProgram(){
        this.gl.useProgram(this.program);
        return ()=>{}
    }

    protected createShader(type: WebGLRenderingContext['VERTEX_SHADER'] | WebGLRenderingContext['FRAGMENT_SHADER'], source: string) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader){
            throw new Error('Shader is not created');
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    protected createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const gl = this.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}