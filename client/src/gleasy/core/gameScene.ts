import { TickerSystem } from "./tickerSystem";
import { KeyboardSystem } from "./keyboardSystem";
import { GLShader, GLBuffer, GLTexture } from "./glSystem";
//import texImage from "../../gl/assets/dirt.png";
import texImage from "../assets/colors3.png";
import m4 from '../../gl/core/m4';
import { makeBoxModel, makeBoxNormalsFromVertexList, setTexcoordsLWH } from "../../gl/core/aabb";
import { Vector } from "../../gl/core/vector";
import { getScreenVector, inPlane } from "../../gl/core/hoverRender";
import { remip }from "./remip";
import { MyGLShader } from "./mainShader";
import { Player } from "./player";
import { Collider, ColliderList } from "./collider";
import { ChunkSystem } from "./chunk";
import { ChunkGrid } from "./chunkGrid";
import { makeChunk } from "./makeChunk";
import { IVoxelData, VoxelField } from "./voxelField";
import { generateChunkUni } from "../../gl/core/noise";

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
        ), {usage: this.gl.DYNAMIC_DRAW});

        this.texcoordBuffer = new GLBuffer(this.gl, new Float32Array(
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                1, 1, 0, 0
            ]
        ), {usage: this.gl.DYNAMIC_DRAW});
    }

    update(field: VoxelField){
        const pointList: Array<{point: IVoxelData, vector: Vector}> = [];
        //const posData: Array<number> = [];
        //const normData: Array<number> = [];
        //const texData: Array<number> = [];
        field.raytrace();
        field.iterate((point, x, y, z)=>{
            if (point && point.type!=='air'){
                pointList.push({point, vector: new Vector(x, y, z)});
                /*[ 
                    x, y, z,
                    x, y + 1, z,
                    x + 1, y + 1, z,
                ]*/ /*makeBoxModel({x, y, z}, 1, 1, 1).forEach((it, i)=> posData.push(it));
                makeBoxNormalsFromVertexList().forEach(it=>normData.push(it));
                setTexcoordsLWH(2, 2, 2).forEach((it, i)=>{
                    texData.push(it);
                    if (i % 2 != 0){
                        texData.push(point?.mx || 0);
                        texData.push(point?.my || 0);
                    }
                }
                );*/
                
            }
        });
        const res = makeChunk( pointList, [], 1);
        //console.log('sliced: ', pointList.length * 36, '/', res.vertexes.length / 4);
        this.pointCount = res.vertexes.length / 4;

        //this.positionBuffer.updateBuffer(new Float32Array(posData));
        //this.normalBuffer.updateBuffer(new Float32Array(normData));
        //this.texcoordBuffer.updateBuffer(new Float32Array(texData));
         this.positionBuffer.updateBuffer(res.vertexes);
        this.normalBuffer.updateBuffer(res.normals);
        this.texcoordBuffer.updateBuffer(res.uv);
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
    cursor: Vector = new Vector(0,0,0); 
    hover: any;
    vf: VoxelField;
    cx: number =0;
    cy: number =0;
    ds: number = -10;
    player: Player;
    colliderList: ColliderList;

    constructor(canvas: HTMLCanvasElement){
        this.player = new Player();
        this.player.spawn();
        this.colliderList = new ColliderList();
        const chunkSize = 64;
        const vf = new VoxelField(chunkSize, chunkSize, 16);

        const lod = 1;
        const ox = 0;
        const oy = 0;
        const blockSize = 1;
        generateChunkUni(ox-1*lod, oy-1*lod, chunkSize + 2*lod, (noiseValue, x, y)=>{
            console.log(x, y);
            if (x % lod == 0 && y % lod == 0) {
                const blockZ = Math.floor(noiseValue * 20 / (blockSize * lod)) * blockSize * lod;
                vf.setPoint({type: 'block', light: 0}, x, y, blockZ + 10);
            }
        });
        vf.setPoint({type: 'light', light: 15}, 7, 7, 9);
        vf.setPoint({type: 'light', light: 15}, 27, 27, 9);
        //vf.setPoint('222', 2, 2, 2);
        //vf.setPoint('012', 0, 1, 2);
        vf.iterate((point, x, y, z)=>{
           // console.log(point, x, y, z);
        });
        this.vf = vf;

        this.canvas = canvas;
        this.canvas.onmousemove = (e)=>{
            //this.cursor = new Vector(e.offsetX, e.offsetY, 0);
            this.cursor = new Vector(canvas.clientWidth/ 2, canvas.clientHeight/2, 0);
            this.player.rotateCam(e.movementX, e.movementY);
        };

        this.canvas.onwheel = (e)=>{
            //console.log(e.deltaX);
            this.ds-=e.deltaY / 10;
        };


        this.canvas.onmousedown = (e)=>{
            console.log('down - ', e.button);
            if (e.button == 0){
            this.canvas.requestPointerLock();
            }
            const hm = (em: MouseEvent)=>{
                this.cx += em.movementX;
                this.cy += em.movementY;
            }
            window.addEventListener('mousemove', hm);

            const hu = (em: MouseEvent)=>{
                window.removeEventListener('mouseup', hu);
                window.removeEventListener('mousemove', hm);
            }
            window.addEventListener('mouseup', hu);
        }
        const context = canvas.getContext('webgl');
        if (!context){
            throw new Error('No webgl');
        }
        this.gl = context;

        this.ticker = new TickerSystem();
        this.ticker.onTick = this.handleTick.bind(this);
        this.mainShader = new MyGLShader(this.gl);
        this.model = new MyGLModel(this.gl);
        this.model.update(vf);
        this.colliderList.list = [];
        this.vf.iterate((point, x, y, z)=>{
            if (point && point.type !=='air'){
                this.colliderList.list.push(new Collider(new Vector(x,y,z), new Vector(x+1, y+1, z+1)));
            }
        });

        this.mainTexture = new GLTexture(this.gl, texImage);

        this.keyboardSystem = new KeyboardSystem();
        this.keyboardSystem.onChangeState = this.handleKeyboardState.bind(this);
    }

    
    handleTick(time: number, lastTime: number){
        const fstart = Date.now();
        const deltaTime = time - lastTime;

        this.fps = (this.fps * 31 + (1000 / Math.max(deltaTime, 0.1))) / 32;

        this.vf.iterate((point, x, y, z)=>{
            if (Math.random()<0.0001){
                if (!point){

                   // this.vf.setPoint('t', x,y,z);
                } else {
                   //  this.vf.setPoint(null, x,y,z);
                }
            }
        });

        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const matrix = this.player.getMatrix(aspect);

        this.player.procMoves(this.colliderList, /*deltatime*/0.01);

        if (this.player.posZ > 130) {
            console.log('respawn');
            this.player.spawn();
        } 

        //let matrix = m4.perspective(1, aspect, 0.1, 2000); 
        //matrix = m4.translate(matrix, 0, 0, this.ds);
        ////matrix = m4.yRotate(matrix, time / 6000);
        //matrix = m4.yRotate(matrix, this.cx / 200);
        //matrix = m4.xRotate(matrix, this.cy / 200);

        this.hover = this.vf.checkHover(matrix, this.canvas, this.cursor);

        if (this.vf.updated){
            this.model.update(this.vf);
            this.colliderList.list = [];
            this.vf.iterate((point, x, y, z)=>{
                if (point && point.type !=='air'){
                    this.colliderList.list.push(new Collider(new Vector(x,y,z), new Vector(x+1, y+1, z+1)));
                }
            });
            this.vf.updated = false;
        }
        this.mainShader.run((shader)=>{
            shader.setBuffer(shader.positionLocation, this.model.positionBuffer.buffer, {
                size: 4
            });
            shader.setBuffer(shader.normalLocation, this.model.normalBuffer.buffer, {
                size: 3
            });
            shader.setBuffer(shader.texcoordLocation, this.model.texcoordBuffer.buffer, {
                size: 4
            });
            shader.setTexture(this.mainTexture.texture, 0, this.gl.TEXTURE_2D);

            shader.setMatrix(matrix);

            shader.draw(this.gl.TRIANGLES, 0, this.model.pointCount);
        });

        const fend = Date.now();
        this.fpsnl = (this.fpsnl * 31 + (1000 / Math.max(fend - fstart, 1))) / 32;
        this.onTick?.();
    }

    handleKeyboardState(){
        this.player.tryJump = this.keyboardSystem.tryJump;
        this.player.forward = this.keyboardSystem.forward;
    }

    handleMainShaderDraw(){

    }
}
