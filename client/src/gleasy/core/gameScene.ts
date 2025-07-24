import { TickerSystem } from "./tickerSystem";
import { KeyboardSystem } from "./keyboardSystem";
import { GLShader, GLBuffer, GLTexture } from "./glSystem";
//import texImage from "../../gl/assets/dirt.png";
import texImage from "../assets/colors3.png";
import m4 from '../../gl/core/m4';
import fragmentSource from "./fragment.glsl";
import vertexSource from "./vertex.glsl";
import { makeBoxModel, makeBoxNormalsFromVertexList, setTexcoordsLWH } from "../../gl/core/aabb";
import { Vector } from "../../gl/core/vector";
import { getScreenVector, inPlane } from "../../gl/core/hoverRender";
import { remip }from "./remip";

class MyGLShader extends GLShader{
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

const makeChunk = (vf: VoxelField, _list: {point: any, vector: Vector}[], _corners: {point: any, vector: Vector}[], blockSize: number) => {
    const mp: Record<string, number> = {};
    _list.forEach(((it, i) => mp[`${it.vector.x}_${it.vector.y}_${it.vector.z}`] = i));
    _corners.forEach(((it, i) => mp[`${it.vector.x}_${it.vector.y}_${it.vector.z}`] = i));
    //const models = [];
    const vertexList: Array<number> = [];
    const normList: Array<number> = [];
    const uvList: Array<number> = [];
    for (let plane = 0; plane < 6; plane++) {
        if ([].includes(plane)) {

        } else {

        let dx = 0;
        let dy =0;
        let dz = 0;
        if (plane == 5){
            dx = -blockSize;
        }
        if (plane == 3){
            dx = blockSize;
        }
        if (plane == 2){
            dy = -blockSize;
        }
        if (plane == 4){
            dy = blockSize;
        }
        if (plane == 0){
            dz = -blockSize;
        }
        if (plane == 1){
            dz = blockSize;
        }

        let list = _list.filter((it, i)=>mp[(it.vector.x + dx) +'_'+(it.vector.y + dy)+'_'+(it.vector.z + dz)] == undefined);
        //const cutted = cut24(list, plane, _list[0].aVector3d, blockSize, chunkSize ) || cut35(list, plane, _list[0].aVector3d, blockSize, chunkSize ) ||cut01(list, plane, _list[0].aVector3d, blockSize, chunkSize );
    let cutted = list;
        //const vertexList: Array<number> = [];
        cutted.forEach((it, i)=>{
            makeBoxModel(it.vector, blockSize, blockSize, blockSize).forEach((jt, j)=>{
                const _plane = Math.floor(j/(6*4));
                if (plane == undefined || plane == _plane){
                    vertexList.push(jt);
                }
            })
        });
        //const vertexes = new Float32Array(vertexList);

        //const normList: Array<number> = [];
        cutted.forEach((it, i)=>{
            makeBoxNormalsFromVertexList().forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 3));
                if (plane == undefined || plane == _plane){
                        normList.push( (it.point.lights?.[plane] || it.point.light)  / 16);
                }
            })
        });
        //const norm = new Float32Array(normList);

        //const uvList: Array<number> = [];
        cutted.forEach((it, i)=>{
            setTexcoordsLWH(1, 1, 1).forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 2));
                if (plane == undefined || plane == _plane){
                    uvList.push(jt);
                    if (j % 2 != 0){
                        const mpy = Math.floor(plane / 3);
                        const mpx = Math.floor(plane % 3);
                        uvList.push(((it.point?.mx1 || 0)*3 + mpx) % 4);
                        uvList.push( ((it.point?.my1 || 1)*2  + mpy) % 4);
                    }
                }
            })
        });
        //const uv = new Float32Array(uvList)
        /*models.push({
            vertexes, normals: norm, uv
        })*/
    }
}
return {
    vertexes: new Float32Array(vertexList),
    normals:new Float32Array(normList),
    uv: new Float32Array(uvList)
};
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
        const pointList: Array<{point: any, vector: Vector}> = [];
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
        const res = makeChunk(field, pointList, [], 1);
        console.log('sliced: ', pointList.length * 36, '/', res.vertexes.length / 4);
        this.pointCount = res.vertexes.length / 4;

        //this.positionBuffer.updateBuffer(new Float32Array(posData));
        //this.normalBuffer.updateBuffer(new Float32Array(normData));
        //this.texcoordBuffer.updateBuffer(new Float32Array(texData));
         this.positionBuffer.updateBuffer(res.vertexes);
        this.normalBuffer.updateBuffer(res.normals);
        this.texcoordBuffer.updateBuffer(res.uv);
    }
}

class VoxelField {
    height: number;
    width: number;
    depth: number;
    data: any[];
    updated: boolean = false;

    constructor(width: number, height: number, depth: number){
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.data = new Array(width * height * depth).fill(null).map(it=>({type: 'air', light: 0, lights: [0, 0, 0, 0, 0 ,0]}));
    }

    setPoint(point: any, x: number, y: number, z: number){
        this.data[x + y * this.width + z * this.width * this.height] = point;
        this.updated = true;
    }

    getPoint(x: number, y: number, z: number){
        return this.data[x + y * this.width + z * this.width * this.height];
    }
    
    iterate(onPoint: (point:any, x: number, y: number, z: number)=>void){
        this.data.forEach((it, i)=>{
            const x = Math.floor(i % (this.width));
            const y = Math.floor((i / this.width)) % this.height;
            const z = Math.floor((i / this.width / this.height)  % (this.depth));
            onPoint(it, x, y, z);
        });
    }

    raytrace(){
        const steps = [
        {x: 0, y: 0, z: 1},
        {x: 0, y: 0, z: -1},
        {x: 0, y: -1, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: -1, y: 0, z: 0},
        ];
        this.iterate((point, x,y,z)=>{
            if (point.type == 'light'){
                this.setPoint({...point, light: 15}, x, y, z);
            } else {
                this.setPoint({...point, light: 1}, x, y, z);
            }
        });

        for (let i =0; i< 16; i++){
        this.iterate((point, x,y,z)=>{
            steps.forEach((step, si)=>{
                const stepPoint = this.getPoint(x+step.x, y+step.y, z+step.z);
                if (stepPoint && point.type != 'block'){
                    this.setPoint({...stepPoint, light: Math.max( point.light - 1, stepPoint.light, 0)}, x+step.x, y+step.y, z+step.z)
                }
                //if (stepPoint.type != 'air'){
                //    this.setPoint({...stepPoint, light: Math.max( point.light - 1, 0)}, x+step.x, y+step.y, z+step.z)
                //}
            })
        });

        this.iterate((point, x,y,z)=>{
            if (point.type == 'block'){
                const lights = steps.map((step, si)=>{
                    const stepPoint = this.getPoint(x+step.x, y+step.y, z-step.z);
                    if (stepPoint?.type == 'air'){
                        return stepPoint.light;
                    }
                })
                this.setPoint({...point, lights}, x, y, z);
            }
        });
    }
    }

    checkHover(matrix: number[], canvas: HTMLCanvasElement, cursor: Vector){
        const hoveredList: Array<any> = [];
        this.iterate((point, x, y, z)=>{
            if (!point || point.type == 'air'){
                return;
            } 
            const aVector3d = new Vector(x, y, z);
            const lwh = new Vector(1, 1, 1);
            const procPoint = (px: number, py: number, pz: number)=>getScreenVector(matrix, aVector3d.add(px, py, pz), canvas);
            const points = {
                a: procPoint(0,0,lwh.z),
                b: procPoint(lwh.x,0,lwh.z),
                c: procPoint(lwh.x,lwh.y,lwh.z),
                d: procPoint(0,lwh.y,lwh.z),
                a1: procPoint(0,0,0),
                b1: procPoint(lwh.x,0,0),
                c1: procPoint(lwh.x,lwh.y,0),
                d1: procPoint(0,lwh.y,0),
                plane: -1,
                original: new Vector(x, y, z)
            };

            if (!(points.a.z <0 || points.b.z <0 || points.c.z <0 || points.d.z <0 ||
                points.a1.z <0 || points.b1.z <0 || points.c1.z <0 || points.d1.z <0)
            ){
                const it = points;
                const planes = [
                    inPlane(it.d, it.c, it.b, it.a, cursor),
                    inPlane(it.a1, it.b1, it.c1, it.d1, cursor),
                    inPlane(it.a, it.b, it.b1, it.a1, cursor),
                    inPlane(it.b, it.c, it.c1, it.b1, cursor),
                    inPlane(it.c, it.d, it.d1, it.c1, cursor),
                    inPlane(it.d, it.a, it.a1, it.d1, cursor),
                ];
                const pind =planes.findIndex(p=>p == true);
                it.plane = pind;
                if (pind != -1){
                    hoveredList.push(points);
                }
            };
        });

        hoveredList.sort((a, b)=>{
            return (a.a.z + a.b.z + a.c.z + a.d.z + a.a1.z + a.b1.z + a.c1.z + a.d1.z) - (b.a.z + b.b.z + b.c.z + b.d.z + b.a1.z + b.b1.z + b.c1.z + b.d1.z)
        });
        return hoveredList[0];
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

    constructor(canvas: HTMLCanvasElement){
        const vf = new VoxelField(16, 16, 16);
        vf.setPoint({type: 'light', light: 15}, 7, 7, 7);
        //vf.setPoint('222', 2, 2, 2);
        //vf.setPoint('012', 0, 1, 2);
        vf.iterate((point, x, y, z)=>{
           // console.log(point, x, y, z);
        });
        this.vf = vf;

        this.canvas = canvas;
        this.canvas.onmousemove = (e)=>{
            this.cursor = new Vector(e.offsetX, e.offsetY, 0);
        };

        this.canvas.onwheel = (e)=>{
            //console.log(e.deltaX);
            this.ds-=e.deltaY / 10;
        };


        this.canvas.onmousedown = (e)=>{
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
        let matrix = m4.perspective(1, aspect, 0.1, 2000); 
        matrix = m4.translate(matrix, 0, 0, /*-10*/ this.ds);
        //matrix = m4.yRotate(matrix, time / 6000);
        matrix = m4.yRotate(matrix, this.cx / 200);
        matrix = m4.xRotate(matrix, this.cy / 200);

        this.hover = this.vf.checkHover(matrix, this.canvas, this.cursor);

        if (this.vf.updated){
            this.model.update(this.vf);
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

    }

    handleMainShaderDraw(){

    }
}
