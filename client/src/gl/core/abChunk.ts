import {AABB, renderModel} from "./aabb";
import {cut} from "./cutter";
import { Vector } from "./vector";

export class ABChunk{
    glPositionBuffer: WebGLBuffer;
    normBuffer: WebGLBuffer;
    listLength: number;
    uvBuffer: WebGLBuffer;
    texture: WebGLTexture;

    constructor(gl: WebGLRenderingContext, _list: AABB[], chunkSize: number, texture: WebGLTexture, plane?: number) {
        //const chunkSize = _list.length ** 0.5;

        const mp: Record<string, number> = {};
        _list.forEach(((it, i)=>mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
        let dx = 0;
        let dy =0;
        if (plane == 5){
            dx = -2;
        }
        if (plane == 3){
            dx = 2;
        }
        if (plane == 2){
            dy = -2;
        }
        if (plane == 4){
            dy = 2;
        }
        let list = _list.filter((it, i)=>mp[`${it.aVector3d.x + dx}_${it.aVector3d.y + dy}_${it.aVector3d.z}`] == undefined);

        if ([0].includes(plane)){
            list = _list;
        }
        if ([1].includes(plane)){
            list = _list;
        }

        if ([0, 1].includes(plane)){
            const mpl: Record<string, AABB[]> = {};
            list.forEach(it=>{
                if(!mpl[`${it.aVector3d.z}`]){
                    mpl[`${it.aVector3d.z}`] = [];
                }
                mpl[`${it.aVector3d.z}`].push(it);
            });
            const resList: Array<AABB> = [];
            Object.keys(mpl).forEach(it=>{
                const tileSize = 2;
                const chunkOffset = _list[0].aVector3d;
                const mps = new Array(chunkSize).fill(null).map(it=>new Array(chunkSize).fill('-'));
                const aabbs = mpl[it];
                aabbs.forEach(it=>
                    mps[(it.aVector3d.y - chunkOffset.y) /tileSize ][(it.aVector3d.x - chunkOffset.x) / tileSize] = '8'
                );
                const cutted = cut(mps);
                const z = plane == 1 ? aabbs[0].bVector3d.z : aabbs[0].aVector3d.z ;
                cutted.forEach(ct=>{
                    const res = new AABB(gl, new Vector(ct.x * tileSize + chunkOffset.x, ct.y * tileSize + chunkOffset.y, z), new Vector(ct.x * tileSize + chunkOffset.x  + ct.sx*tileSize, ct.y * tileSize + chunkOffset.y + ct.sy * tileSize, z), {r: 0, g: 0, b:0, a:0})
                    resList.push(res);
                });
            });
            list = resList;
        }

         if ([3, 5].includes(plane)){
            const mpl: Record<string, AABB[]> = {};
            list.forEach(it=>{
                if(!mpl[`${it.aVector3d.x}`]){
                    mpl[`${it.aVector3d.x}`] = [];
                }
                mpl[`${it.aVector3d.x}`].push(it);
            });
            const resList: Array<AABB> = [];
            Object.keys(mpl).forEach(it=>{
                const aabbs = mpl[it];
                let minZ = Number.MAX_SAFE_INTEGER;
                let maxZ = Number.MIN_SAFE_INTEGER;
                aabbs.forEach(kt=>{
                    if (kt.aVector3d.z < minZ){
                        minZ = kt.aVector3d.z
                    }
                    if (kt.aVector3d.z > maxZ){
                        maxZ = kt.aVector3d.z
                    }
                });
                //console.log(minZ, maxZ);
                const tileSize = 2;
                const chunkOffset = _list[0].aVector3d;
                const mps = new Array((maxZ - minZ)/tileSize + 1).fill(null).map(it=>new Array(chunkSize).fill('-'));

                aabbs.forEach(it=> {
                    mps[(it.aVector3d.z - minZ) /tileSize ][(it.aVector3d.y - chunkOffset.y) / tileSize] = '8';
                });
                const cutted = cut(mps);
                const x = plane == 3 ? aabbs[0].bVector3d.x : aabbs[0].aVector3d.x ;
                cutted.forEach(ct=>{
                    const res = new AABB(gl, 
                        new Vector(x, ct.x * tileSize + chunkOffset.y, ct.y * tileSize + minZ), 
                        new Vector(x, ct.x * tileSize + chunkOffset.y  + ct.sx*tileSize, ct.y * tileSize + minZ + ct.sy * tileSize),
                        {r: 0, g: 0, b:0, a:0}
                    )
                    resList.push(res);
                });
            });
            list = resList;
        }

        if ([2, 4].includes(plane)){
            const mpl: Record<string, AABB[]> = {};
            list.forEach(it=>{
                if(!mpl[`${it.aVector3d.y}`]){
                    mpl[`${it.aVector3d.y}`] = [];
                }
                mpl[`${it.aVector3d.y}`].push(it);
            });
            const resList: Array<AABB> = [];
            Object.keys(mpl).forEach(it=>{
                const aabbs = mpl[it];
                let minZ = Number.MAX_SAFE_INTEGER;
                let maxZ = Number.MIN_SAFE_INTEGER;
                aabbs.forEach(kt=>{
                    if (kt.aVector3d.z < minZ){
                        minZ = kt.aVector3d.z
                    }
                    if (kt.aVector3d.z > maxZ){
                        maxZ = kt.aVector3d.z
                    }
                });
                //console.log(minZ, maxZ);
                const tileSize = 2;
                const chunkOffset = _list[0].aVector3d;
                const mps = new Array((maxZ - minZ)/tileSize + 1).fill(null).map(it=>new Array(chunkSize).fill('-'));

                aabbs.forEach(it=> {
                    mps[(it.aVector3d.z - minZ) /tileSize ][(it.aVector3d.x - chunkOffset.x) / tileSize] = '8';
                });
                const cutted = cut(mps);
                const y = plane == 4 ? aabbs[0].bVector3d.y : aabbs[0].aVector3d.y ;
                cutted.forEach(ct=>{
                    const res = new AABB(gl, 
                        new Vector( ct.x * tileSize + chunkOffset.x, y, ct.y * tileSize + minZ), 
                        new Vector( ct.x * tileSize + chunkOffset.x  + ct.sx*tileSize, y, ct.y * tileSize + minZ + ct.sy * tileSize),
                        {r: 0, g: 0, b:0, a:0}
                    )
                    resList.push(res);
                });
            });
            list = resList;
        }
            if ([0].includes(plane)){
                //list = _list;
            }
            if ([1].includes(plane)){
                //list = _list;
            }

        //console.log(mp)
        this.texture = texture;
        const vertexList: Array<number> = [];
        list.forEach((it, i)=>{
            it.vertexList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6*4));
                if (plane == undefined || plane == _plane){
                    vertexList.push(jt);
                }
            })
        });
        this.listLength = list.length;
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexList), gl.STATIC_DRAW); 
        this.glPositionBuffer = positionBuffer;

        const normList: Array<number> = [];
        list.forEach((it, i)=>{
            it.normList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 3));
                if (plane == undefined || plane == _plane){
                    normList.push(jt);
                }
            })
        });
        var normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normList), gl.STATIC_DRAW); 
        
        this.normBuffer = normBuffer;

        const uvList: Array<number> = [];
        list.forEach((it, i)=>{
            it.uvList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 2));
                if (plane == undefined || plane == _plane){
                    uvList.push(jt);
                }
            })
        });
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvList), gl.STATIC_DRAW); 
        
        this.uvBuffer = uvBuffer;
        list.forEach((it, i)=>{it.clean()})
    }

    render(gl: any, positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        renderModel(gl, this.glPositionBuffer, this.normBuffer, this.uvBuffer, (12 * (3)) * this.listLength, positionAttributeLocation, positionNormLocation, texcoordLocation, this.texture, {r:0, g:0, b:0, a:0}, colorLocation);
    }
}