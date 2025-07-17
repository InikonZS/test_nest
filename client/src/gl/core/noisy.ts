import { AABB } from './aabb';
import { ABChunk } from './abChunk';
import { PlaneChunk } from './planeChunk';
import { Vector } from './vector';
import { grey, noise } from './noise';
import { Player } from './player';
import { DynamicChunk } from "./dynamicChunk";

export class Noisy{
  loadedList: Record<string, boolean>;
  chunkList: DynamicChunk[];//{models: AABB[], map: HTMLCanvasElement, position: {x: number, y: number}, currentLod?: PlaneChunk, lods: Record<string, PlaneChunk>}[];
  chunkMap: Record<string, DynamicChunk>={};
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
    /*for (let i =0; i <6; i++){
    this.chunkList.forEach(chunk=>{
      chunk.currentLod.models[i].render(gl, positionAttributeLocation, normAttributeLocation, texcoordLocation, colorLocation)
      //chunk.groupL1.render(gl, positionAttributeLocation, normAttributeLocation, texcoordLocation, colorLocation);
      //chunk.currentLod.render(positionAttributeLocation, normAttributeLocation, texcoordLocation, colorLocation);
      //chunk.models.forEach(it=>it.render(this.gl, positionAttributeLocation, normAttributeLocation, colorLocation));
    });
  }*/

   this.chunkList.forEach(chunk=>{
    if (!chunk.currentLod /*|| !chunk.currentLod.ready*/){
      return;
    }
    chunk.currentLod.render(positionAttributeLocation, normAttributeLocation, texcoordLocation, colorLocation);
   });
  }

  react(vector: Vector){
    let v = vector;
    
    return this.chunkList.findIndex(chunk => {
      return chunk.react(v);
      //return Math.abs(chunk.position.x - v.x  / 2) <= this.chunkSize + 1 && Math.abs(chunk.position.y - v.y / 2) <= this.chunkSize +1 && intersect(chunk.models, v.x, v.y, v.z)
    }) != -1;
    // return false;
    //return intersect(this.modelList, v.x, v.y, v.z);
  }

  hover(cursor: Vector, playerPos: Vector, viewMatrix: any, canvas: HTMLCanvasElement){
    let hov;
    let zdist = Number.MAX_SAFE_INTEGER;
    this.chunkList.forEach(chunk => {
      const _hov = chunk.hover(cursor, playerPos, viewMatrix, canvas);

      if (_hov){      
        const a = _hov;
      let cdist = a.a.z + a.b.z + a.c.z + a.d.z + a.a1.z + a.b1.z + a.c1.z + a.d1.z;
        if (zdist > cdist){
          zdist = cdist;
          hov = _hov;
        }
      }
    });
    //console.log(hov);
    return hov
  }

  loadChunk(gl: WebGLRenderingContext, position: { x: number; y: number; }, lod: number){
    if (this.busy){
      return;
    }
    const chunkSize = this.chunkSize;
    const found = this.chunkMap[`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}`];//this.chunkList.find(it=>it.position.x == Math.floor(position.x / 2 /chunkSize)*chunkSize && it.position.y == Math.floor(position.y / 2 /chunkSize)*chunkSize);
    if (found){
      if (found.lods[lod] /*&& found.lods[lod].ready*/){
        found.currentLod = found.lods[lod];//lod == 1 ? found.group : (lod == 2 ? found.groupL1 : found.groupL2);
        return;
      }
    }
    if (this.busy){
      return;
    }
    if (!this.loadedList[`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}`]){
       this.loadedList[`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}`] = true;
       this.busy = true;
    //if (this.loadedList.find(it=> `${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}` == it) == undefined){
     //   this.loadedList.push(`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}_${lod}`);
      //setTimeout(()=>{
                /*generateChunk(gl, 
                  Math.floor(position.x / 2 /chunkSize)*chunkSize, 
                  Math.floor(position.y / 2 /chunkSize)*chunkSize, chunkSize,
                  lod,
                  this.textures
              );*/
        if (found){
          found.loadLod(lod).then (()=>this.busy = false);
          /*const newLod = newChunk.currentLod;
          if (lod == 1){
            found.currentLod = newLod;
            found.models = newChunk.models;
            found.currentLod = newLod;
            found.lods[1] = newLod;
          }*/ /*else if (lod == 2){
            found.currentLod = newLod;
            //found.groupL1 = newLod;
            found.lods[2] = newLod;
          }*/ /*else {
            found.lods[lod] = newLod;
            found.currentLod = newLod;*/
            //found.groupL2 = newLod;
          //}
          //found.currentLod = lod == 1 ? found.group : (lod == 2 ? found.groupL1 : found.groupL2);
        } else {
          //newChunk.currentLod = newChunk.group;
          const newChunk = new DynamicChunk(gl, Math.floor(position.x / 2 /chunkSize)*chunkSize, 
                  Math.floor(position.y / 2 /chunkSize)*chunkSize, chunkSize, this.textures);
          newChunk.loadMap();
          newChunk.loadLod(lod).then (()=>this.busy = false);
          this.chunkList.push(
                newChunk
            );
            //console.log(this.chunkList);
          this.chunkMap[`${Math.floor(position.x / 2 / chunkSize)}_${Math.floor(position.y / 2 / chunkSize)}`] = newChunk;
        }
          //this.busy = false;
      //}, 0) ;
    }
  }
}

export let intersect = (modelList: any[], px: number, py: number, pz: number): {stat: boolean, index:number} => {
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
    //ctx.fillStyle = '#000';
    //ctx.fillRect(0, 0, canvas.width, canvas.height);


    const list: Array<AABB> = [];
    //const listL1: Array<AABB> = [];
    //const listL2: Array<AABB> = [];
    const octas = 11;
    //const defaultColor = {r: 0, g: 0, b:0, a:0};
    const blockSize = 2;
    for (let x=0; x<chunkSize; x++){
        for (let y=0; y<chunkSize; y++){
            let noiseValue = 0;
            for (let k=4; k< octas; k++){
                noiseValue = (noiseValue + (noise((x + ox) / 2 ** k, (y + oy) / 2 ** k)) /((octas-k) ** 1.2));
            }
            //if (noiseValue){
            if (x % lod ==0 &&  y % lod == 0){
            const blockZ = Math.floor(noiseValue*120 / (blockSize * lod)) * blockSize * lod;
                for (let h = 0; h<4; h++){
                  let ob = new AABB(
                      new Vector((x + ox)*blockSize, (y+oy)*blockSize, -blockSize * lod + blockZ - h* blockSize*lod), 
                      new Vector(((x+ox)+lod)*blockSize, ((y+oy)+lod)*blockSize, + blockZ - h* blockSize * lod), 
                  //{r:Math.random()*100+100, g:Math.random()*100+100, b:Math.random()*100+100, a:255},
                  true);
                  //const clist = lod == 1 ? list : (lod == 2 ? listL1 : listL2);
                  list.push(ob);
                }
              }
           // }
           
            //ctx.fillStyle = noiseValue > 0 ? grey(0) : grey(255); 
            //ctx.fillStyle = grey(Math.max(Math.min((noiseValue + 1) / 2 * 256, 255), 100));//grey((noiseValue + 1) / 2 * 256);
            
            
            ctx.fillStyle = grey((noiseValue + 1) / 2 * 256);
            ctx.fillRect(x, y, 1, 1);
            
        }
    }
    /*const l0 = lod == 1 && new PlaneChunk(gl, list, chunkSize, blockSize, textures);
    const l1 = lod == 2 &&  new PlaneChunk(gl, listL1, chunkSize, blockSize * 2, textures)
    const l2 = lod == 4 &&  new PlaneChunk(gl, listL2, chunkSize, blockSize * 4, textures)
    const l3 = lod >= 8 &&  new PlaneChunk(gl, listL2, chunkSize, blockSize * lod, textures)
    const l = l0 || l1 || l2 || l3;*/
    const l = new PlaneChunk(gl, list, [], chunkSize, blockSize * lod, textures, ()=>{})
    const result =  {
            models: lod == 1 ? list : [],
            /*group: l0,
            groupL1: l1,
            groupL2: l2,*/
            position: {x: ox, y: oy},
            map: canvas,
            currentLod: l,//lod == 1 ? l0 : (lod == 2 ? l1 : l2) ,
            lods: {[lod.toString()]: l}
          }
    list.forEach(it=>it.clean());
    return result;
    //return list;
}
