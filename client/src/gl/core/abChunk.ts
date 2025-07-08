import {AABB, renderModel} from "./aabb";
import { Vector } from "./vector";

export class ABChunk{
    glPositionBuffer: WebGLBuffer;
    normBuffer: WebGLBuffer;
    listLength: number;
    uvBuffer: WebGLBuffer;
    texture: WebGLTexture;

    constructor(gl: WebGLRenderingContext, _list: AABB[], texture: WebGLTexture, plane?: number, ) {
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
        if ([0, 1].includes(plane)){
            list = _list
        }
        console.log(mp)
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
    }

    render(gl: any, positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        renderModel(gl, this.glPositionBuffer, this.normBuffer, this.uvBuffer, (12 * (3)) * this.listLength, positionAttributeLocation, positionNormLocation, texcoordLocation, this.texture, {r:0, g:0, b:0, a:0}, colorLocation);
    }
}