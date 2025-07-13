import {AABB, renderModel} from "./aabb";
import {cut} from "./cutter";
import { Vector } from "./vector";

export class ABChunk{
    glPositionBuffer: WebGLBuffer;
    normBuffer: WebGLBuffer;
    listLength: number;
    uvBuffer: WebGLBuffer;
    texture: WebGLTexture;
    indexBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext, _list: AABB[], mp: Record<string, number>, chunkSize: number, tileSize: number, texture: WebGLTexture, _plane?: number) {
        //const chunkSize = _list.length ** 0.5;
        //const tileSize = 2;
        //const mp: Record<string, number> = {};
        //_list.forEach(((it, i)=>mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
        const fullList: AABB[] = [];
        const drawPlanes = [0, 1, 2, 3, 4, 5]
        for (let planeId = 0; planeId<drawPlanes.length; planeId++){
            const plane = drawPlanes[planeId];
        let dx = 0;
        let dy =0;
        let dz = 0;
        if (plane == 5){
            dx = -tileSize;
        }
        if (plane == 3){
            dx = tileSize;
        }
        if (plane == 2){
            dy = -tileSize;
        }
        if (plane == 4){
            dy = tileSize;
        }
        if (plane == 0){
            dz = -tileSize;
        }
        if (plane == 1){
            dz = tileSize;
        }
        //`${it.aVector3d.x + dx}_${it.aVector3d.y + dy}_${it.aVector3d.z + dz}`;
        let list = _list.filter((it, i)=>mp[(it.aVector3d.x + dx) +'_'+(it.aVector3d.y + dy)+'_'+(it.aVector3d.z + dz)] == undefined);

        /*if ([0].includes(plane)){
            list = _list;
        }
        if ([1].includes(plane)){
            list = _list;
        }*/
        const tmtest = Date.now();
        /*static mem*/const mps = new Array(chunkSize ).fill(null).map(it=>new Array(chunkSize).fill('-'));
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
                const aabbs = mpl[it];
                if (aabbs.length == 1){
                    resList.push(new AABB(aabbs[0].aVector3d, aabbs[0].bVector3d));
                    return;
                }
    
                const chunkOffset = _list[0].aVector3d;
                /*static mem use*/mps.forEach((it)=>it.fill('-'));
                //const mps = new Array(chunkSize).fill(null).map(it=>new Array(chunkSize).fill('-'));
                aabbs.forEach(it=>
                    mps[(it.aVector3d.y - chunkOffset.y) /tileSize ][(it.aVector3d.x - chunkOffset.x) / tileSize] = '8'
                );
                const cutted = cut(mps);
                const z = plane == 1 ? aabbs[0].bVector3d.z : aabbs[0].aVector3d.z ;
                cutted.forEach(ct=>{
                    const res = new AABB(new Vector(ct.x * tileSize + chunkOffset.x, ct.y * tileSize + chunkOffset.y, z), new Vector(ct.x * tileSize + chunkOffset.x  + ct.sx*tileSize, ct.y * tileSize + chunkOffset.y + ct.sy * tileSize, z))
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
        
                const chunkOffset = _list[0].aVector3d;
                const mps = new Array((maxZ - minZ)/tileSize + 1).fill(null).map(it=>new Array(chunkSize).fill('-'));
  //mps.forEach((it, i)=>it.fill('-'));
                aabbs.forEach(it=> {
                    mps[(it.aVector3d.z - minZ) /tileSize ][(it.aVector3d.y - chunkOffset.y) / tileSize] = '8';
                });
                const cutted = cut(mps);
                const x = plane == 3 ? aabbs[0].bVector3d.x : aabbs[0].aVector3d.x ;
                cutted.forEach(ct=>{
                    const res = new AABB(
                        new Vector(x, ct.x * tileSize + chunkOffset.y, ct.y * tileSize + minZ), 
                        new Vector(x, ct.x * tileSize + chunkOffset.y  + ct.sx*tileSize, ct.y * tileSize + minZ + ct.sy * tileSize),
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
        
                const chunkOffset = _list[0].aVector3d;
                const mps = new Array((maxZ - minZ)/tileSize + 1).fill(null).map(it=>new Array(chunkSize).fill('-'));
  mps.forEach((it, i)=>it.fill('-'));
                aabbs.forEach(it=> {
                    mps[(it.aVector3d.z - minZ) /tileSize ][(it.aVector3d.x - chunkOffset.x) / tileSize] = '8';
                });
                const cutted = cut(mps);
                const y = plane == 4 ? aabbs[0].bVector3d.y : aabbs[0].aVector3d.y ;
                cutted.forEach(ct=>{
                    const res = new AABB( 
                        new Vector( ct.x * tileSize + chunkOffset.x, y, ct.y * tileSize + minZ), 
                        new Vector( ct.x * tileSize + chunkOffset.x  + ct.sx*tileSize, y, ct.y * tileSize + minZ + ct.sy * tileSize)
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

            //plane == 0 && console.log('tmtest', Date.now()-tmtest, 'pl-', plane)
            list.forEach(it=>{
                it.plane = plane;
                fullList.push(it);
            })
        }
        //let plane = undefined;
        //console.log(mp)
        this.texture = texture;
        const vertexList: Array<number> = [];
        fullList.forEach((it, i)=>{
            it.vertexList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6*4));
                if (it.plane == undefined || it.plane == _plane){
                    vertexList.push(jt);
                }
            })
        });
        this.listLength = vertexList.length / 4;//fullList.length;
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexList), gl.STATIC_DRAW); 
        this.glPositionBuffer = positionBuffer;

        const normList: Array<number> = [];
        fullList.forEach((it, i)=>{
            it.normList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 3));
                if (it.plane == undefined || it.plane == _plane){
                    normList.push(jt);
                }
            })
        });
        var normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normList), gl.STATIC_DRAW); 
        
        this.normBuffer = normBuffer;

        const uvList: Array<number> = [];
        fullList.forEach((it, i)=>{
            it.uvList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 2));
                if (it.plane == undefined || it.plane == _plane){
                    uvList.push(jt);
                }
            })
        });
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvList), gl.STATIC_DRAW); 
        
        this.uvBuffer = uvBuffer;
/*
        // create the buffer
        const indexBuffer = gl.createBuffer();
        
        // make this buffer the current 'ELEMENT_ARRAY_BUFFER'
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        // Fill the current element array buffer with data
        const indicesChunk = [
        0, 1, 2,   // first triangle
        2, 1, 3,   // second triangle
        ];
        const indices: Array<number> = [];
        for (let i = 0; i< this.listLength; i++){
            indices.push(indicesChunk[i % 6] + Math.floor(i / 6)*4);
        }
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            gl.STATIC_DRAW
        );
        this.indexBuffer = indexBuffer;*/
        fullList.forEach((it, i)=>{it.clean()})
        //console.log(this.listLength, fullList.length * 12*3);
    }

    render(gl: any, positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        renderModel(gl, this.glPositionBuffer, this.normBuffer, this.uvBuffer, this.indexBuffer, /*(12 * (3)) * this.listLength*/ this.listLength, positionAttributeLocation, positionNormLocation, texcoordLocation, this.texture, {r:0, g:0, b:0, a:0}, colorLocation);
    }
}