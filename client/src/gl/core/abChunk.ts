import {AABB, renderModel} from "./aabb";
import { Vector } from "./vector";

export class ABChunk{
    glPositionBuffer: WebGLBuffer;
    normBuffer: WebGLBuffer;
    listLength: number;

    constructor(gl: WebGLRenderingContext, list: AABB[]) {
        const vertexList: Array<number> = [];
        list.forEach(it=>{
            it.vertexList.forEach(jt=>{
                vertexList.push(jt);
            })
        });
        this.listLength = list.length;
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexList), gl.STATIC_DRAW); 
        this.glPositionBuffer = positionBuffer;

        const normList: Array<number> = [];
        list.forEach(it=>{
            it.normList.forEach(jt=>{
                normList.push(jt);
            })
        });
        var normBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normList), gl.STATIC_DRAW); 
        
        this.normBuffer = normBuffer;
    }

    render(gl: any, positionAttributeLocation: any, positionNormLocation: any, colorLocation: any){
        renderModel(gl, this.glPositionBuffer, this.normBuffer, 36 * this.listLength, positionAttributeLocation, positionNormLocation, {r:0, g:0, b:0, a:0}, colorLocation);
    }
}