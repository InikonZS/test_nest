import {AABB, renderModel} from "./aabb";
import { Vector } from "./vector";

export class ABChunk{
    glPositionBuffer: WebGLBuffer;
    normBuffer: WebGLBuffer;
    listLength: number;
    uvBuffer: WebGLBuffer;
    texture: WebGLTexture;

    constructor(gl: WebGLRenderingContext, list: AABB[], texture: WebGLTexture, plane?: number) {
        this.texture = texture;
        const vertexList: Array<number> = [];
        list.forEach(it=>{
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
        list.forEach(it=>{
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
        list.forEach(it=>{
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