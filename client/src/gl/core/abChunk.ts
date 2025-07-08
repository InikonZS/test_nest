import {AABB, renderModel} from "./aabb";
import { Vector } from "./vector";
import dirt from "../assets/dirt.png";

export class ABChunk{
    glPositionBuffer: WebGLBuffer;
    normBuffer: WebGLBuffer;
    listLength: number;
    uvBuffer: WebGLBuffer;

    constructor(gl: WebGLRenderingContext, list: AABB[]) {
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
        image.src = dirt;
        image.addEventListener('load', () => {
            // теперь, когда изображение загрузилось, копируем его в текстуру
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

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

        const uvList: Array<number> = [];
        list.forEach(it=>{
            it.uvList.forEach(jt=>{
                uvList.push(jt);
            })
        });
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvList), gl.STATIC_DRAW); 
        
        this.uvBuffer = uvBuffer;
    }

    render(gl: any, positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        renderModel(gl, this.glPositionBuffer, this.normBuffer, this.uvBuffer, (12 * (3)) * this.listLength, positionAttributeLocation, positionNormLocation, texcoordLocation, {r:0, g:0, b:0, a:0}, colorLocation);
    }
}