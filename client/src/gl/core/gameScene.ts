import "./m4";
import {Player} from "./player";
import { Noisy } from "./noisy";
import {createShader, createProgram} from "./gl-utils";
import m4 from './m4';
import dirt from "../assets/dirt.png";
import dirt_top from "../assets/dirt_top.png";
import dirt_side from "../assets/dirt_side.png";

export class GameScene {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    mapCanvas: HTMLCanvasElement;
    mapContext: CanvasRenderingContext2D;
    player: Player;
    world: Noisy;
    chunkSize: number;
    loadDistance: number;
    lodPoint: number;
    lodPoint2: number;
    lodPoints: number[];
    fps: number = 15;
    onTick: any;


    constructor(canvas: HTMLCanvasElement, mapCanvas: HTMLCanvasElement){
        /*this.chunkSize = 32;
        this.loadDistance = 10;
        this.lodPoints = [3, 6, 12, 18];*/
        this.chunkSize = 128;
        this.loadDistance = 7;
        this.lodPoints = [2, 3, 4, 5];
        this.canvas = canvas;
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('mousemove', this.handleMove);
        window.addEventListener('keydown', this.handleDown);
        window.addEventListener('keyup', this.handleUp);
        this.context = this.canvas.getContext('webgl'); 

        this.mapCanvas = mapCanvas;
        this.mapContext = this.mapCanvas.getContext('2d');

        this.player = new Player();
         this.player.spawn();
        this.init();
    }

      init(){
    let vertexShaderSource = `
      attribute vec4 a_position;
      attribute vec3 n_position;  
      attribute vec2 a_texcoord;
      uniform mat4 u_matrix;

      varying vec4 pos;
      varying vec3 nos;

    
    varying vec2 v_texcoord;

      void main() {
        gl_Position = u_matrix *  a_position;
        pos = gl_Position;
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
      varying vec3 nos;
    varying vec2 v_texcoord;       
    uniform sampler2D u_texture;

        vec4 tex;
      void main() {
      tex = texture2D(u_texture, v_texcoord);
      gl_FragColor = (tex / 5.0 * 4.0 + tex/5.0 * abs(dot(normalize(vec3(1.0, 0.5, 0.25)), normalize(nos)) ))/ max((pos.z /1000.0), 1.0);
      }
    `; 
    
    //clamp(dot(normalize(vec3(1.0, 1.0, 1.0)), normalize(nos)), 0.1, 0.9);
    //gl_FragColor.rgb = clamp(texture2D(u_texture, v_texcoord) + dot(normalize(vec3(1.0, 1.0, 1.0)), normalize(nos)), 0.0, 1.0) ;
    //gl_FragColor = clamp(texture2D(u_texture, v_texcoord) + max(min(0.8, (0.01 * 1.3 / sqrt(pos.z))), 0.15) * dot(normalize(vec3(1.0, 0.7, 0.3)), normalize(vec3(nos.x + 1.0, nos.y + 1.0, nos.z + 1.0))), 0.0, 1.0);
    // gl_FragColor = texture2D(u_texture, v_texcoord);
    // gl_FragColor = clamp(vec4(0.0, 0.0, 0.0, 1.0) + max(min(0.8, (1.3 / sqrt(pos.z))), 0.15) * dot(normalize(vec3(1.0, 0.7, 0.3)), normalize(vec3(nos.x + 1.0, nos.y + 1.0, nos.z + 1.0))), 0.0, 1.0);
    //  gl_FragColor = u_color;
    //gl_FragColor = normalize(vec4(nos.x, nos.y, nos.z, 1));
    let gl = this.context;
    //this.gl = gl;

    let program = makeShader(gl, vertexShaderSource, fragmentShaderSource);
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionNormLocation = gl.getAttribLocation(program, "n_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    //var worldLocation = gl.getUniformLocation(program, "u_matrix_world");

    //console.log(m4.identity());

    const texture = this.createTexture(dirt);
    const texture_top = this.createTexture(dirt_top);
    const texture_side = this.createTexture(dirt_side);

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(program);
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK)
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(positionNormLocation);
    gl.enableVertexAttribArray(texcoordLocation);

    //let world = new World (gl, mapa);
    //this.world=world;

    let world = new Noisy(gl, this.chunkSize, {texture_top, texture, texture_side});
    this.world=world;
    
    var then = 0;
    let ang =0;
    let checkTick = 0;

    const lf = (x: number, y: number, r: number)=>{
        let lodIndex = this.lodPoints.findIndex(it=> it > r);
        if (lodIndex == -1){
            lodIndex = this.lodPoints.length;
        }
        const lodScalers = [1, 2, 4, 8, 16];
        const lod = lodScalers[lodIndex];
        //let lod = r < this.lodPoint ? 1 : (r < this.lodPoint2 ? 2 : 8);
        this.world.loadChunk(gl, {x: -this.player.posX + x* this.chunkSize * 2, y: -this.player.posY + y* this.chunkSize  * 2}, lod);        
    }

    var drawScene = (now: number)=>{
      now *= 0.001;
      var deltaTime = now - then;
      then = now;

      this.fps = (this.fps * 31 + (1 / deltaTime)) / 32

      this.player.procMoves(world, deltaTime);

      if (this.player.posZ > 130) {
        console.log('death');
        this.player.spawn();
      } 

      /*[
       { x: 1, y: 0 },
       { x: -1, y: 0 },
       { x: 0, y: 1 },
       { x: 0, y: -1 },
        
       { x: 1, y: 1 },
       { x: -1, y: 1 },
       { x: 1, y: -1 },
       { x: -1, y: -1 },
    ].forEach(it=>{
      this.world.loadChunk(gl, {x: -this.player.posX + it.x * 10, y: -this.player.posY + it.y * 10});
      });*/

      /*for (let px = -loadDistance; px<loadDistance; px++){
           for (let py = -loadDistance; py<loadDistance; py++){
        this.world.loadChunk(gl, {x: -this.player.posX + px* this.chunkSize, y: -this.player.posY + py* this.chunkSize}, (Math.abs(px) < lodPoint2 && Math.abs(py) < lodPoint2) ? ((Math.abs(px) < lodPoint && Math.abs(py) < lodPoint) ? 1 : 2) : 4 );
        }
      }*/

        checkTick -= deltaTime;
        if (checkTick <0){
            for (let r = 0; r< this.loadDistance; r++){
                for (let px = -r; px<=r; px++){
                    lf(px, r, r);
                    lf(-px, -r, r);
                }
                for (let py = -r+1; py<r; py++){
                    lf(r, py, r);
                    lf(-r, -py, r);
                }
            }
            this.onTick?.();
            checkTick = 0.05;
        }

      var aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      var matrix = makeCameraMatrix(aspect, this.player.camRX, this.player.camRY, this.player.posX, this.player.posY, this.player.posZ);
      gl.uniformMatrix4fv(matrixLocation, false, matrix);

      /*let wmat = m4.identity();
      ang+=0.1*deltaTime;
      wmat = m4.translate(wmat, 30, 15, 5);
      wmat = m4.xRotate(wmat, ang);
      wmat = m4.scale(wmat,3,3,1);*/
      
      
      //gl.uniformMatrix4fv(worldLocation, false, wmat);

      world.render(gl, positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation);

      const ctx = this.mapContext;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0,0, this.mapCanvas.width, this.mapCanvas.height);

      const offset = {x: this.mapCanvas.width / 2 + this.player.posX / 2, y: this.mapCanvas.height / 2 + this.player.posY / 2}
      ctx.strokeStyle = '#9ff2';
      ctx.lineWidth = 1;
      world.chunkList.forEach(it=>{
        
        ctx.drawImage(it.map, it.position.x + offset.x, it.position.y +offset.y);  
        ctx.strokeRect(it.position.x + offset.x + 0.5, it.position.y +offset.y + 0.5, this.chunkSize, this.chunkSize); 
      });
      ctx.fillStyle = '#9f9';
      ctx.fillRect(-this.player.posX / 2 + offset.x, -this.player.posY / 2 + offset.y, 4, 4);

      requestAnimationFrame(drawScene);
    }
    requestAnimationFrame(drawScene);
    
  }

  createTexture(src: string){
    const gl = this.context;
            // создаём текстуру
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // заполняем текстуру голубым пикселем 1x1
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                    new Uint8Array([0, 0, 255, 255]));
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
 // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        
        // асинхронная загрузка изображения
        var image = new Image();
        image.src = src;
        image.addEventListener('load', () => {
            // теперь, когда изображение загрузилось, копируем его в текстуру
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
        return texture;
  }

    destroy(){
        this.canvas.removeEventListener('click', this.handleClick);
    }

    render(){

    }

    handleClick = ()=>{
        this.canvas.requestPointerLock();
    }

    handleMove = (e: MouseEvent)=>{
        this.player.rotateCam(e.movementX, e.movementY);
    }

    handleUp = (e: KeyboardEvent)=>{
            if (e.code == 'KeyW'){
        this.player.forward = false;
      }  
      if (e.code == 'Space'){
        this.player.tryJump = false;
      }
    }

    handleDown = (e: KeyboardEvent)=>{
        if (e.code == 'KeyW'){
        this.player.forward = true;
      } 
      if (e.code == 'Space'){
        this.player.tryJump = true;
      } 
    }

}


function makeCameraMatrix(aspect: number, rx: number, ry: number, px: number, py: number, pz: number){
  let matrix = m4.perspective(1, aspect, 0.1, 20000); 
  matrix = m4.xRotate(matrix, ry);
  matrix = m4.yRotate(matrix, 0);
  matrix = m4.zRotate(matrix, rx);
  matrix = m4.scale(matrix, 1, 1, 1);
  matrix = m4.translate(matrix, px, py, pz);
  return matrix;
}

function makeShader(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string){
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  var program = createProgram(gl, vertexShader, fragmentShader);  
  return program;
}

function getNormal(u: { x: any; y: any; z: any; }, v: { x: number; y: number; z: number; }, w: { x: number; y: number; z: number; }){
  let nv = {x: v.x-u.x, y: v.y-u.y, z: v.z-u.z}  
  let nw = {x: w.x-u.x, y: w.y-u.y, z: w.z-u.z}  
  let n = {x: nv.y*nw.z - nv.z*nw.y, y: nv.z * nw.x - nv.x * nw.z, z: nv.x * nw.y - nv.y * nw.x}
  let d = Math.hypot(n.x, n.y, n.z);
  //console.log(nv);
  return {x: n.x/d, y: n.y/d, z: n.z/d}
}

function getValueD(v: { x: number; y: number; z: number; }, n: { x: any; y: any; z: any; }){
  let d = -(v.x*n.x + v.y*n.y + v.z*n.z);
  return d;
}

function solveLinear(v1: { x: number; y: number; z: number; }, v2: { x: number; y: number; z: number; }, u: { x: number; y: number; z: number; }, v: any, w: any){
  let n = getNormal (u, v, w);
  
  let d = getValueD(u, n);
  let nv = {x: v1.x-v2.x, y: v1.y-v2.y, z: v1.z-v2.z};
  let h = (n.x*v1.x + n.y*v1.y + n.z*v1.z +d) / (-(n.x*nv.x + n.y*nv.y + n.z*nv.z));
  //console.log(h, d);
  return {x: v1.x + h*nv.x, y: v1.y + h*nv.y, z: v1.z + h*nv.z}
}
