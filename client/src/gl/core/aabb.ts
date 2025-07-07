/*import { Vector } from './vector';
import { getModel } from './model';
import { Calc } from './calc';*/

import { Vector } from "./vector";

export class AABB{
  aVector3d: Vector;
  bVector3d: Vector;
  lwh: Vector;
  vertexList: any[];
  normList: any[];
  color: { r: number; g: number; b: number; a: number; };
  glPositionBuffer: any;
  normBuffer: any;

  constructor(gl: WebGLRenderingContext, aVector3d: Vector, bVector3d: Vector, color: { r: number; g: number; b: number; a: number; }) {
    this.aVector3d = aVector3d;
    this.bVector3d = bVector3d;
    this.lwh = this.bVector3d.subVector(this.aVector3d);
    let vertexList = makeBoxModel(this.aVector3d, this.lwh.x, this.lwh.y, this.lwh.z);
    this.vertexList = vertexList;
    this.color = color;


    /*var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexList), gl.STATIC_DRAW); 
    this.glPositionBuffer = positionBuffer;*/

    let normList = makeBoxNormalsFromVertexList();
    this.normList = normList;
    /*var normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normList), gl.STATIC_DRAW); 
    
    this.normBuffer = normBuffer;*/
  }
  
  inside(vector3d: any){
    let v = vector3d;
    let a = this.aVector3d;
    let b = this.bVector3d;
    return inQube(a.x, a.y, b.x, b.y, v.x, v.y, v.z, a.z, b.z);
  }

  render(gl: any, positionAttributeLocation: any, positionNormLocation: any, colorLocation: any){
    renderModel(gl, this.glPositionBuffer, this.normBuffer, 36, positionAttributeLocation, positionNormLocation, this.color, colorLocation);
  }

}

export function renderModel(gl: WebGLRenderingContext, glBuffer: any, normBuffer: any, bufLength: number, positionAttributeLocation: any, positionNormLocation: any, color: { r: number; g: number; b: number; a: number; }, colorLocation: any){

  gl.uniform4f(colorLocation, color.r/255, color.g/255, color.b/255, color.a/255);
  gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);

  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 2 компоненты на итерацию
  var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
  var normalize = false; // не нормализовать данные
  var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  var offset = 0;        // начинать с начала буфера
  gl.vertexAttribPointer(
  positionAttributeLocation, size, type, normalize, stride, offset);

  gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);

  // Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
  //var size = 3;          // 2 компоненты на итерацию
 // var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
 // var normalize = false; // не нормализовать данные
 // var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
  //var offset = 0;        // начинать с начала буфера
  gl.vertexAttribPointer(
  positionNormLocation, size, type, normalize, stride, offset);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  //var count = positions.length / size;
  var count = bufLength; 
  gl.drawArrays(primitiveType, offset, count); 
}


function inBox(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  let n = 1;
  var bou = ((x3 <= x1 + n) && (x3 > x2 - n) && (y3 <= y1 + n) && (y3 > y2 - n) ||
      (x3 > x1 - n) && (x3 <= x2 + n) && (y3 <= y1 + n) && (y3 > y2 - n) ||
      (x3 <= x1 + n) && (x3 > x2 - n) && (y3 > y1 - n) && (y3 <= y2 + n) ||
      (x3 > x1 - n) && (x3 <= x2 + n) && (y3 > y1 - n) && (y3 <= y2 + n));
  return bou;
}

function inQube(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any, z3: number, zs: number, ze: number){
  let res = inBox(x1, y1, x2, y2, x3, y3);
  if ((z3>zs)&&(z3<=ze)){
    return res;
  }
  else {
    return false;
  }
}

function makeBoxModel(v0: { x: any; y: any; z: any; }, l: any, w: any, h: any){
  return makeBoxModelFromVertexList(
    [
      new Vector(v0.x, v0.y, v0.z),
      new Vector(v0.x + l, v0.y, v0.z),
      new Vector(v0.x + l, v0.y + w, v0.z),
      new Vector(v0.x, v0.y + w, v0.z),
      new Vector(v0.x, v0.y, v0.z + h),
      new Vector(v0.x + l, v0.y, v0.z + h),
      new Vector(v0.x + l, v0.y + w, v0.z + h),
      new Vector(v0.x, v0.y + w, v0.z + h)
    ]
  );
}

function makeBoxNormalsFromVertexList(){
    var normals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  ]; 
  return normals; 
}


function makeBoxModelFromVertexList(va: any[]){
  var positions = [
    va[0].x, va[0].y, va[0].z,
    va[1].x, va[1].y, va[1].z,
    va[2].x, va[2].y, va[2].z,
    va[2].x, va[2].y, va[2].z,
    va[3].x, va[3].y, va[3].z,
    va[0].x, va[0].y, va[0].z,

    va[4].x, va[4].y, va[4].z,
    va[5].x, va[5].y, va[5].z,
    va[6].x, va[6].y, va[6].z,
    va[6].x, va[6].y, va[6].z,
    va[7].x, va[7].y, va[7].z,
    va[4].x, va[4].y, va[4].z,

    va[0].x, va[0].y, va[0].z,
    va[1].x, va[1].y, va[1].z,
    va[1+4].x, va[1+4].y, va[1+4].z,
    va[0].x, va[0].y, va[0].z,
    va[1+4].x, va[1+4].y, va[1+4].z,
    va[0+4].x, va[0+4].y, va[0+4].z,

    va[1].x, va[1].y, va[1].z,
    va[2].x, va[2].y, va[2].z,
    va[2+4].x, va[2+4].y, va[2+4].z,
    va[1].x, va[1].y, va[1].z,
    va[2+4].x, va[2+4].y, va[2+4].z,
    va[1+4].x, va[1+4].y, va[1+4].z,

    va[2].x, va[2].y, va[2].z,
    va[3].x, va[3].y, va[3].z,
    va[3+4].x, va[3+4].y, va[3+4].z,
    va[2].x, va[2].y, va[2].z,
    va[3+4].x, va[3+4].y, va[3+4].z,
    va[2+4].x, va[2+4].y, va[2+4].z,

    va[3].x, va[3].y, va[3].z,
    va[0].x, va[0].y, va[0].z,
    va[0+4].x, va[0+4].y, va[0+4].z,
    va[3].x, va[3].y, va[3].z,
    va[0+4].x, va[0+4].y, va[0+4].z,
    va[3+4].x, va[3+4].y, va[3+4].z,
  ]; 
  return positions;  
}
