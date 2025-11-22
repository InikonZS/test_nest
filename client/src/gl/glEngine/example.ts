export class Example{
    canvas: HTMLCanvasElement;
    ticker: TickerSystem;
    glSystem: GLSystem;
    keyboardSystem: KeyboardSystem;
    mainShader: GLShaderSystem;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.ticker = new TickerSystem();
        this.ticker.onTick = this.handleTick.bind(this);
        this.glSystem = new GLSystem(canvas);
        this.mainShader = this.glSystem.createShaderSystem(GLShaderSystem);
        this.mainShader.onDraw = this.handleMainShaderDraw.bind(this);
        this.keyboardSystem = new KeyboardSystem();
        this.keyboardSystem.onChangeState = this.handleKeyboardState.bind(this);
    }

    handleTick(time: number, lastTime: number){
        this.glSystem.draw(time);
    }

    handleKeyboardState(){

    }

    handleMainShaderDraw(){

    }
}

class TickerSystem {
    lastTimeStamp: number;
    onTick: (time: number, lastTime: number)=>void;

    constructor(){
        this.lastTimeStamp = Date.now();
        requestAnimationFrame((timeStamp)=>this.tick(timeStamp));
    }

    tick(timeStamp: number){
        this.onTick?.(timeStamp, this.lastTimeStamp);
        this.lastTimeStamp = timeStamp;
        requestAnimationFrame((timeStamp)=>this.tick(timeStamp));
    }
}

class KeyboardSystem {
    lastTimeStamp: number;
    onChangeState: ()=>void;

    constructor(){
       window.addEventListener('keydown', ()=>{});
    }
}

class GLSystem {
    gl: WebGLRenderingContext;
    shaderSystems: Array<GLShaderSystem>;

    constructor(canvas: HTMLCanvasElement){
        const context = canvas.getContext('webgl');
        if (!context){
            throw new Error('No webgl');
        }
        this.gl = context;
    }

    createBuffer(){

    }

    createShaderSystem(ShaderSystemClass: {new (gl: WebGLRenderingContext):GLShaderSystem}){
        return new ShaderSystemClass(this.gl);
    }

    draw(time: number){
        this.shaderSystems.forEach(shader=>shader.draw(time));
    }
}

class GLShaderSystem {
    onDraw: ()=>{};

    constructor(gl: WebGLRenderingContext){
        let vertexShaderSource = `
      attribute vec4 a_position;
      attribute vec3 n_position;  
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
        nos = n_position;
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

        let program = makeShader(gl, vertexShaderSource, fragmentShaderSource);
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionNormLocation = gl.getAttribLocation(program, "n_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    }

    draw(time: number){
        this.onDraw?.();
    }
}

interface GLBufferOptions {
    target: WebGLRenderingContext['ARRAY_BUFFER'] | WebGLRenderingContext['ELEMENT_ARRAY_BUFFER'], 
    usage: WebGLRenderingContext['STATIC_DRAW'] | WebGLRenderingContext['DYNAMIC_DRAW']
}

class GLBuffer {
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

class GLShader {
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
        target: WebGLRenderingContext['ARRAY_BUFFER'] | WebGLRenderingContext['ELEMENT_ARRAY_BUFFER'],
        size: number,
        type: GLBufferType,
        normalize: boolean,
        stride: number,
        offset: number
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
        const gl = this.gl;
        gl.activeTexture(gl['TEXTURE'+unit]);
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


class MyGLShader extends GLShader{
    constructor(gl: WebGLRenderingContext){
        let vertexShaderSource = `
      attribute vec4 a_position;
      attribute vec3 n_position;  
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
        nos = n_position;
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
        const aPositionLocation = this.getAttribLocation('a_position');
    }

    useProgram(): () => void {
        const destructor = super.useProgram();
        const gl = this.gl;
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.enableVertexAttribArray(positionNormLocation);
        gl.enableVertexAttribArray(texcoordLocation);
        return ()=>{
            gl.disableVertexAttribArray(positionAttributeLocation);
            gl.disableVertexAttribArray(positionNormLocation);
            gl.disableVertexAttribArray(texcoordLocation);
            destructor();
        }
    }

}


class usg {
    gl: WebGLRenderingContext;
    shaderSystems: Array<GLShaderSystem>;

    constructor(canvas: HTMLCanvasElement){
        const context = canvas.getContext('webgl');
        if (!context){
            throw new Error('No webgl');
        }
        this.gl = context;

        const shader = new MyGLShader(this.gl);
        const positionBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0, 0,
                0, 1, 0,
                1, 1, 0,
            ]
        ));

        const normalBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0, 1,
                0, 0, 1,
                0, 0, 1,
            ]
        ));

        const texcoordBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0,
                0, 1,
                1, 1,
            ]
        ));

        const closeProgram = shader.useProgram();
        shader.setBuffer(1, buffer.buffer);
        //shader.draw
        closeProgram();

    }
}