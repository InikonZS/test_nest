import m4 from "./m4";
import { Vector } from "./vector";

export const getScreenVector = (viewMatrix: Array<number>, vector: Vector, canvas: /*HTMLCanvasElement*/ {clientWidth: number, clientHeight: number})=>{
  var point = [vector.x, vector.y, vector.z, 1];  
  // это верхний правый угол фронтальной части
  // вычисляем координаты пространства отсечения,
  // используя матрицу, которую мы вычисляли для F
  var clipspace = m4.transformVector(viewMatrix, point, undefined);
  // делим X и Y на W аналогично видеокарте
  clipspace[0] /= clipspace[3];
  clipspace[1] /= clipspace[3];
  //dont use real clientWidthgetter 10-100 times worse, never use getBoundingClientRect 1000 times worse
  var pixelX = (clipspace[0] *  0.5 + 0.5) * canvas.clientWidth //* canvas.width;
  var pixelY = (clipspace[1] * -0.5 + 0.5) * canvas.clientHeight //* canvas.height;
  return new Vector(pixelX, pixelY, clipspace[3]);
}

export function inTriangle(a:Vector, b:Vector, c:Vector, p:Vector){
 const orientation = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
 if (orientation<0){
    return false;
 }
  let al = a.subVector(b).abs();
  let bl = b.subVector(c).abs();
  let cl = c.subVector(a).abs();
  let ap = a.subVector(p).abs();
  let bp = b.subVector(p).abs();
  let cp = c.subVector(p).abs();
  let pa = (ap+bp+al)/2;
  let pb = (bp+cp+bl)/2;
  let pc = (cp+ap+cl)/2;
  let sa = Math.sqrt(pa*(pa-ap)*(pa-bp)*(pa-al));
  let sb = Math.sqrt(pb*(pb-bp)*(pb-cp)*(pb-bl));
  let sc = Math.sqrt(pc*(pc-cp)*(pc-ap)*(pc-cl));

  let pr = (al+bl+cl)/2;
  let s = Math.sqrt(pr*(pr-al)*(pr-bl)*(pr-cl));

  return (sa+sb+sc)<=(s+0.00001);
}

export const inPlane = (a:Vector, b: Vector, c: Vector, d: Vector, cursor: Vector)=>{
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