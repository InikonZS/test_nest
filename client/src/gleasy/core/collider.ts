import { Vector } from "../../gl/core/vector";

export class Collider {
    aVector3d: Vector;
    bVector3d: Vector;

    constructor(aVector3d: Vector, bVector3d: Vector){
        this.aVector3d = aVector3d;
        this.bVector3d = bVector3d;
    }

    inside(vector3d: Vector){
        let v = vector3d;
        let a = this.aVector3d;
        let b = this.bVector3d;
        return inQube(a.x, a.y, b.x, b.y, v.x, v.y, v.z, a.z, b.z);
    }
}

export class ColliderList {
    list: Collider[] = [];
    
    react(v: Vector){
        return this.list.findIndex((chunk)=>{
            return chunk.inside(v);
        }) != -1;   
    }
}

function inBox(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  let n = 0.5; //player width
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
