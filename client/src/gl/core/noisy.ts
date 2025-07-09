import { AABB } from './aabb';
import { ABChunk } from './abChunk';
import { PlaneChunk } from './planeChunk';
import { Vector } from './vector';
import { grey, noise } from './noise';

export class Noisy{
  loadedList: Record<string, boolean>;
  chunkList: {models: AABB[], map: HTMLCanvasElement, position: {x: number, y: number}, group: PlaneChunk}[];
  gl: WebGLRenderingContext;
  chunkSize: number;
  textures: Record<string, WebGLTexture>;
  busy: boolean = false;

  constructor(gl: WebGLRenderingContext, chunkSize: number, textures: Record<string, WebGLTexture>){
    this.textures = textures;
    this.chunkSize = chunkSize;
    this.loadedList = {};
    this.chunkList = [];//makeWorld(gl);
    this.gl = gl;
  }
  
  render(gl: WebGLRenderingContext, positionAttributeLocation: number, normAttributeLocation: number, texcoordLocation: number, colorLocation: WebGLUniformLocation){
    this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.chunkList.forEach(chunk=>{
      chunk.group.render(gl, positionAttributeLocation, normAttributeLocation, texcoordLocation, colorLocation);
      //chunk.models.forEach(it=>it.render(this.gl, positionAttributeLocation, normAttributeLocation, colorLocation));
    });
  }

  react(vector: Vector){
    let v = vector;
    return this.chunkList.findIndex(chunk => {
      return Math.abs(chunk.position.x - v.x  / 2) <= this.chunkSize + 1 && Math.abs(chunk.position.y - v.y / 2) <= this.chunkSize +1 && intersect(chunk.models, v.x, v.y, v.z)
    }) != -1;
    // return false;
    //return intersect(this.modelList, v.x, v.y, v.z);
  }

  loadChunk(gl: WebGLRenderingContext, position: { x: number; y: number; }, lod = 2){
    const chunkSize = this.chunkSize;
    if (this.busy){
      return;
    }
    if (!this.loadedList[`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}`]){
       this.loadedList[`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}`] = true;
       this.busy = true;
    //if (this.loadedList.find(it=> `${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}` == it) == undefined){
     //   this.loadedList.push(`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}`);
      setTimeout(()=>{
        this.chunkList.push(
              generateChunk(gl, 
                  Math.floor(position.x / 2 /chunkSize)*chunkSize, 
                  Math.floor(position.y / 2 /chunkSize)*chunkSize, chunkSize,
                  lod,
                  this.textures
              )
          );
          this.busy = false;
      }, 0) ;
    }
  }
}

let intersect = (modelList: any[], px: number, py: number, pz: number): {stat: boolean, index:number} => {
  let inb: {stat: boolean, index:number} = null;
  modelList.forEach((it: { inside: (arg0: Vector) => any; }, i: any)=>{
     if (it.inside(new Vector(px, py, pz))){
      inb = {stat:true, index:i};
     }  
  });
  return inb;
}

const generateChunk = (gl: WebGLRenderingContext, ox: number, oy: number, chunkSize: number, lod: number, textures: Record<string,WebGLTexture>)=>{
    //console.log('generating', ox, oy)
    const canvas = document.createElement('canvas');
    canvas.width = chunkSize;
    canvas.height = chunkSize;
    const ctx = canvas.getContext('2d');


    const list: Array<AABB> = [];
    const octas = 9;
    for (let x=0; x<chunkSize; x++){
        for (let y=0; y<chunkSize; y++){
            let noiseValue = 0;
            for (let k=4; k< octas; k++){
                noiseValue = (noiseValue + (noise((x + ox) / 2 ** k, (y + oy) / 2 ** k)) /((octas-k) ** 1.2));
            }
            //if (noiseValue){
            if (x % lod ==0 &&  y % lod == 0){
            const blockSize = 2;
            const blockZ = Math.floor(noiseValue*50 / blockSize) * blockSize;
                let ob = new AABB(gl, 
                    new Vector((x + ox)*blockSize, (y+oy)*blockSize, -blockSize*lod + blockZ), 
                    new Vector(((x+ox)+lod)*blockSize, ((y+oy)+lod)*blockSize, + blockZ), 
                {r:Math.random()*100+100, g:Math.random()*100+100, b:Math.random()*100+100, a:255}
                );
                list.push(ob);
              }
           // }
           
            //ctx.fillStyle = noiseValue > 0 ? grey(0) : grey(255); 
            //ctx.fillStyle = grey(Math.max(Math.min((noiseValue + 1) / 2 * 256, 255), 100));//grey((noiseValue + 1) / 2 * 256);
            ctx.fillStyle = grey((noiseValue + 1) / 2 * 256);
            ctx.fillRect(x, y, 1, 1);
            
        }
    }
    return {
            models: list,
            group: new PlaneChunk(gl, list, textures),
            position: {x: ox, y: oy},
            map: canvas,
            lod
          }
    //return list;
}

