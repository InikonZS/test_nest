import { AABB, renderModel } from "./aabb";
import { generateChunkUni, grey, noise } from "./noise";
import { intersect } from "./noisy";
import { PlaneChunk } from "./planeChunk";
import { Vector } from "./vector";
import { requestMap, requestNoise } from "./requestWorker";
import { getScreenVector, inTriangle } from "./hoverRender";

type AbstractLod = {
    ready: boolean, 
    render?: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>void,
    react?: (v: Vector)=>void,
    hover: (cursor: Vector, playerPos: Vector, viewMatrix: any, canvas: HTMLCanvasElement)=>any
};
export class DynamicChunk {
    //models: AABB[] = [];
    map: HTMLCanvasElement | OffscreenCanvas | HTMLImageElement;
    position: {
        x: number,
        y: number
    };
    currentLod: AbstractLod;
    lods: Record<string, AbstractLod> = {};
    gl: WebGLRenderingContext;
    chunkSize: number;
    textures: Record<string, WebGLTexture>;

    constructor(gl: WebGLRenderingContext, ox: number, oy: number, chunkSize: number, textures: Record<string, WebGLTexture>){
        this.gl = gl;
        this.position = {x: ox, y: oy}
        this.chunkSize = chunkSize;
        this.textures = textures;
    }

    _prepareModelsList(lod: number, ox: number, oy: number, blockSize: number, chunkSize: number){
        const list:AABB[] = [];
        const corners:AABB[] = [];
        generateChunkUni(ox-1*lod, oy-1*lod, chunkSize + 2*lod, (noiseValue, x, y)=>{
            const targetList = ((x <= 0) || (y <= 0) || (x > chunkSize) || (y > chunkSize)) ? corners : list;
            //todo: fix lod edge leak, be sure all previous lod blocks are filled
            if (x % lod == 0 && y % lod == 0) {
                const blockZ = Math.floor(noiseValue * 120 / (blockSize * lod)) * blockSize * lod;
                for (let h = 0; h < 4; h++) {
                    let ob = new AABB(
                        new Vector((x + ox) * blockSize, (y + oy) * blockSize, -blockSize * lod + blockZ - h * blockSize * lod),
                        new Vector(((x + ox) + lod) * blockSize, ((y + oy) + lod) * blockSize, + blockZ - h * blockSize * lod),
                        true
                    );
                    //3d gen
                    //if ((((x + ox + y +oy)* Math.sin(blockZ) + blockZ + h) % 31) <18){
                        targetList.push(ob);
                    //}
                }
            }
        });
        return {list, corners};      
    }

    prepareModelsList(lod: number, ox: number, oy: number, blockSize: number, chunkSize: number){
        return requestNoise(lod, ox, oy, blockSize, chunkSize);
    }

    async loadSubchunkedLod(lod: number, slices: number){
        //this.lods[lod] ={ready: false};
        const blockSize = 2;
        const ox = this.position.x;
        const oy = this.position.y;
        const chunkSize = this.chunkSize;
        console.log('load sub', ox, oy);
        //const slices = 8;
        const subchunkList: {
            position: {x: number, y: number},
            models: Array<AABB>,
            chunk: PlaneChunk
        }[] = [];
         this.lods[lod] = {
            ready: true,
            render: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
                subchunkList.forEach(it=>it.chunk.render(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation));
            },
            react: (v: Vector)=>{
                return subchunkList.findIndex((chunk)=>{
                    return Math.abs(chunk.position.x - v.x  / 2) <= chunkSize / slices + 1 && Math.abs(chunk.position.y - v.y / 2) <= chunkSize / slices + 1 && intersect(chunk.models, v.x, v.y, v.z);
                }) != -1;
                
            },
            hover: (cursor: Vector, playerPos: Vector, viewMatrix: any, canvas: HTMLCanvasElement)=>{

                 /*const ind = subchunkList.findIndex((chunk)=>{
                    return Math.abs(chunk.position.x - playerPos.x  / 2) <= chunkSize / slices + 1 && Math.abs(chunk.position.y - playerPos.y / 2) <= chunkSize / slices + 1;
                });*/
                let hov;
                let hovered: Array<any> =[];
                 //const chunk = subchunkList[ind];
                 subchunkList.forEach((chunk)=>{
                 if (!chunk){
                    return;
                 }
                 if (!(Math.abs(chunk.position.x - playerPos.x  / 2) <= chunkSize / slices + 1 + 16 && Math.abs(chunk.position.y - playerPos.y / 2) <= chunkSize / slices + 1 + 16)){
                    return;
                 }
                  const inPlane = (a:Vector, b: Vector, c: Vector, d: Vector)=>{
                        return inTriangle(
                            new Vector(a.x, a.y, 0),
                            new Vector(b.x, b.y, 0),
                            new Vector(c.x, c.y, 0),
                            cursor) || inTriangle(
                            new Vector(a.x, a.y, 0),
                            new Vector(c.x, c.y, 0),
                            new Vector(d.x, d.y, 0),
                            cursor);
                    };
                    const closest = chunk.models.filter(model=>{
                        if (playerPos.subVector(model.aVector3d).abs()< 16){
                            return true;
                        }
                       return false;
                    });
                    const tops = closest.map(it=>{
                        const lwh = new Vector(it.bVector3d.x, it.bVector3d.y, it.bVector3d.z).subVector(it.aVector3d);
                        /*return {
                            a: new Vector(0,0,0),
                            b: new Vector(2,0,0),
                            c: new Vector(2,2,0),
                            d: new Vector(0,2,0),
                        }*/
                        return {
                            a: it.aVector3d.add(0,0,lwh.z),
                            b: it.aVector3d.add(lwh.x,0,lwh.z),
                            c: it.aVector3d.add(lwh.x,lwh.y,lwh.z),
                            d: it.aVector3d.add(0,lwh.y,lwh.z),
                            a1: it.aVector3d.add(0,0,0),
                            b1: it.aVector3d.add(lwh.x,0,0),
                            c1: it.aVector3d.add(lwh.x,lwh.y,0),
                            d1: it.aVector3d.add(0,lwh.y,0),
                            plane: -1,
                        }
                        /*return {
                            a: it.aVector3d.add(0,0,0),
                            b: it.aVector3d.add(lwh.x,0,0),
                            c: it.aVector3d.add(lwh.x,0,lwh.z),
                            d: it.aVector3d.add(0,0,lwh.z),
                        }*/
                    }).map(it=>{
                        const a = getScreenVector(viewMatrix, it.a, canvas);
                            const b = getScreenVector(viewMatrix, it.b, canvas);
                            const c = getScreenVector(viewMatrix, it.c, canvas);
                            const d = getScreenVector(viewMatrix, it.d, canvas);

                            const a1 = getScreenVector(viewMatrix, it.a1, canvas);
                            const b1 = getScreenVector(viewMatrix, it.b1, canvas);
                            const c1 = getScreenVector(viewMatrix, it.c1, canvas);
                            const d1 = getScreenVector(viewMatrix, it.d1, canvas);
                        return {a, b, c, d, a1, b1, c1, d1, plane: it.plane} 
                    });
                    //console.log(tops)
                    const _hovered = tops.filter(it=>{
                        
                    if (it.a.z <0 || it.b.z <0 || it.c.z <0 || it.d.z <0 || it.a1.z <0 || it.b1.z <0 || it.c1.z <0 || it.d1.z <0){
                         return false
                    } else {
                        
                    }
                    //console.log(it);
                            const planes = [
                                inPlane(it.d, it.c, it.b, it.a),
                                inPlane(it.a1, it.b1, it.c1, it.d1),
                                inPlane(it.a, it.b, it.b1, it.a1),
                                inPlane(it.b, it.c, it.c1, it.b1),
                                inPlane(it.c, it.d, it.d1, it.c1),
                                inPlane(it.d, it.a, it.a1, it.d1),
                            ];
                            const pind =planes.findIndex(p=>p == true);
                            it.plane = pind;
                            return pind != -1;
                    });
                    _hovered.forEach(it=> hovered.push(it));
                });
                    //console.log(hovered);
                    hovered.sort((a, b)=>{
                        return (a.a.z + a.b.z + a.c.z + a.d.z + a.a1.z + a.b1.z + a.c1.z + a.d1.z) - (b.a.z + b.b.z + b.c.z + b.d.z + b.a1.z + b.b1.z + b.c1.z + b.d1.z)
                    })
                    if (hovered[0]){
                    hov = hovered[0];
                    //console.log(tops);
                    }
               
                return  hov
            }
        };
        this.currentLod = this.lods[lod];
        for (let ySlice = 0; ySlice<slices; ySlice++){
            for (let xSlice = 0; xSlice<slices; xSlice++){
                //console.log('sub sub ', ySlice, xSlice)
                const {list, corners} = this._prepareModelsList(lod, ox + xSlice * chunkSize / slices, oy + ySlice * chunkSize / slices, blockSize, chunkSize / slices);
                
                //console.log('subchunk ',xSlice, ySlice, this.currentLod);
                //await (new Promise((res)=>setTimeout(()=>res(0), 1)))
                const subchunk = await (new Promise<PlaneChunk>((res)=>{let pc = new PlaneChunk(this.gl, list, corners, chunkSize /slices, blockSize * lod, this.textures, ()=>{res(pc)})}));
                subchunkList.push({models: lod == 1 ? list : [], chunk: subchunk, position: {x: ox + xSlice * chunkSize / slices, y: oy + ySlice * chunkSize / slices}});
            }
        }
        /*this.lods[lod] = {
            ready: true,
            render: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
                subchunkList.forEach(it=>it.chunk.render(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation));
            },
            react: (v: Vector)=>{
                return subchunkList.findIndex((chunk)=>{
                    return Math.abs(chunk.position.x - v.x  / 2) <= chunkSize / slices + 1 && Math.abs(chunk.position.y - v.y / 2) <= chunkSize / slices + 1 && intersect(chunk.models, v.x, v.y, v.z);
                }) != -1;
                
            }
        };*/
    }

    loadLod(lod: number){
        if (lod == 1){
            return this.loadSubchunkedLod(lod, 2);
        }
        if (lod == 2){
            //return this.loadSubchunkedLod(1, 1);
        }
        const blockSize = 2;
        const ox = this.position.x;
        const oy = this.position.y;
        const chunkSize = this.chunkSize;
      
        const loadOperation = new Promise<void>((resolve)=>{    
            this.prepareModelsList(/*lod*/ Math.max(lod / 2, 1), ox, oy, blockSize, chunkSize).then((model)=>{
            /*const chunk = new PlaneChunk(this.gl, list, corners, chunkSize, blockSize * lod, this.textures, ()=>{
                this.currentLod = chunk; 
                resolve();
            }); */
            //console.log(model);
            const rf = bufFromModels(this.gl, this.textures, [model])
            //console.log(models);
            this.lods[lod] = {
                ready: true,
                render: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
                    rf(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation)
                    //console.log('ren')
                },
                hover: (c: Vector)=>{

                }
            };
            this.currentLod = this.lods[lod]; 
            resolve()
            }); 
            //resolve(); 
        })
        
        return loadOperation;

        //if (lod == 1){
            //this.models = list;
        //}
    }

    useLod(lod: number){
        if (this.lods[lod]){
            if (this.lods[lod].ready) {
                this.currentLod = this.lods[lod];
            }
        } else {
            this.loadLod(lod);
        }
    }

    loadMap(){
        /*const canvas = new OffscreenCanvas(this.chunkSize, this.chunkSize) 
        //document.createElement('canvas');
        //canvas.width = this.chunkSize;
        //canvas.height = this.chunkSize;
        const ctx = canvas.getContext('2d');
        generateChunkUni(this.position.x, this.position.y, this.chunkSize, (noiseValue, x, y)=>{
            ctx.fillStyle = grey((noiseValue + 1) / 2 * 256);
            ctx.fillRect(x, y, 1, 1);
        });*/
        requestMap(this.position.x, this.position.y, undefined , this.chunkSize).then(canvas=>{
            const url = URL.createObjectURL(canvas);
            const img = document.createElement('img');
            img.src = url;
            img.onload = () => URL.revokeObjectURL(url);
            this.map = img;//canvas;
        });
    }

    react(vector: Vector){
        return this.currentLod?.react?.(vector);
    }

    hover(cursor: Vector, playerPos: Vector, viewMatrix: any, canvas: HTMLCanvasElement){
        return this.currentLod?.hover?.(cursor, playerPos, viewMatrix, canvas);
    }

    render(positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        if (this.currentLod){
            this.currentLod.render(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation);
        }
    }
}


const bufFromModels = (gl: WebGLRenderingContext, textures: any, models: {
    vertexes: Float32Array;
    normals: Float32Array;
    uv: Float32Array;
}[])=>{
    const renderList: ((positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>void)[] = [];
    models.map((it,i )=>{
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(it.vertexes), gl.STATIC_DRAW); 
        
        var normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(it.normals), gl.STATIC_DRAW); 

        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(it.uv), gl.STATIC_DRAW); 
        renderList.push((positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
            renderModel(gl, positionBuffer, normBuffer, uvBuffer, undefined, it.vertexes.length /4, positionAttributeLocation, positionNormLocation, texcoordLocation, [
                        //textures.texture,
                        textures.texture_top,
                        /*textures.texture_side,
                        textures.texture_side,
                        textures.texture_side,
                        textures.texture_side,*/
                    ][i], {r:0, g:0, b:0, a:0}, colorLocation);
        })
    })
    return (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
        renderList.forEach(it=>it(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation))
    }
}