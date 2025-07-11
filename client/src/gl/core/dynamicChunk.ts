import { AABB } from "./aabb";
import { grey, noise } from "./noise";
import { intersect } from "./noisy";
import { PlaneChunk } from "./planeChunk";
import { Vector } from "./vector";

type AbstractLod = {
    ready: boolean, 
    render?: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>void,
    react?: (v: Vector)=>void
};
export class DynamicChunk {
    //models: AABB[] = [];
    map: HTMLCanvasElement;
    position: {
        x: number,
        y: number
    };
    currentLod: AbstractLod;
    lods: Record<string, AbstractLod> = {};
    gl: WebGLRenderingContext;
    chunkSize: number;
    textures: Record<string, WebGLTexture>;

    constructor(gl: WebGLRenderingContext, ox: number, oy: number, chunkSize: number, textures: Record<string, WebGLTexture>){
        this.gl = gl;
        this.position = {x: ox, y: oy}
        this.chunkSize = chunkSize;
        this.textures = textures;
    }

    prepareModelsList(lod: number, ox: number, oy: number, blockSize: number, chunkSize: number){
        const list:AABB[] = [];
        const corners:AABB[] = [];
        generateChunkUni(ox-1*lod, oy-1*lod, chunkSize + 2*lod, (noiseValue, x, y)=>{
            const targetList = ((x <= 0) || (y <= 0) || (x > chunkSize) || (y > chunkSize)) ? corners : list;

            if (x % lod == 0 && y % lod == 0) {
                const blockZ = Math.floor(noiseValue * 120 / (blockSize * lod)) * blockSize * lod;
                for (let h = 0; h < 4; h++) {
                    let ob = new AABB(
                        new Vector((x + ox) * blockSize, (y + oy) * blockSize, -blockSize * lod + blockZ - h * blockSize * lod),
                        new Vector(((x + ox) + lod) * blockSize, ((y + oy) + lod) * blockSize, + blockZ - h * blockSize * lod),
                        true
                    );
                    targetList.push(ob);
                }
            }
        });
        return {list, corners};      
    }

    async loadSubchunkedLod(lod: number, slices: number){
        //this.lods[lod] ={ready: false};
        const blockSize = 2;
        const ox = this.position.x;
        const oy = this.position.y;
        const chunkSize = this.chunkSize;
        console.log('load sub', ox, oy);
        //const slices = 8;
        const subchunkList: {
            position: {x: number, y: number},
            models: Array<AABB>,
            chunk: PlaneChunk
        }[] = [];
         this.lods[lod] = {
            ready: true,
            render: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
                subchunkList.forEach(it=>it.chunk.render(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation));
            },
            react: (v: Vector)=>{
                return subchunkList.findIndex((chunk)=>{
                    return Math.abs(chunk.position.x - v.x  / 2) <= chunkSize / slices + 1 && Math.abs(chunk.position.y - v.y / 2) <= chunkSize / slices + 1 && intersect(chunk.models, v.x, v.y, v.z);
                }) != -1;
                
            }
        };
        this.currentLod = this.lods[lod];
        for (let ySlice = 0; ySlice<slices; ySlice++){
            for (let xSlice = 0; xSlice<slices; xSlice++){
                //console.log('sub sub ', ySlice, xSlice)
                const {list, corners} = this.prepareModelsList(lod, ox + xSlice * chunkSize / slices , oy + ySlice * chunkSize / slices, blockSize, chunkSize / slices);
                
                //console.log('subchunk ',xSlice, ySlice, this.currentLod);
                //await (new Promise((res)=>setTimeout(()=>res(0), 1)))
                const subchunk = await (new Promise<PlaneChunk>((res)=>{let pc = new PlaneChunk(this.gl, list, corners, chunkSize /slices, blockSize * lod, this.textures, ()=>{res(pc)})}));
                subchunkList.push({models: list, chunk: subchunk, position: {x: ox + xSlice * chunkSize / slices, y: oy + ySlice * chunkSize / slices}});
            }
        }
        /*this.lods[lod] = {
            ready: true,
            render: (positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any)=>{
                subchunkList.forEach(it=>it.chunk.render(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation));
            },
            react: (v: Vector)=>{
                return subchunkList.findIndex((chunk)=>{
                    return Math.abs(chunk.position.x - v.x  / 2) <= chunkSize / slices + 1 && Math.abs(chunk.position.y - v.y / 2) <= chunkSize / slices + 1 && intersect(chunk.models, v.x, v.y, v.z);
                }) != -1;
                
            }
        };*/
    }

    loadLod(lod: number){
        if (lod == 1){
            return this.loadSubchunkedLod(lod, 8);
        }
        if (lod == 2){
            return this.loadSubchunkedLod(lod, 4);
        }
        const blockSize = 2;
        const ox = this.position.x;
        const oy = this.position.y;
        const chunkSize = this.chunkSize;

        const {list, corners} = this.prepareModelsList(lod, ox, oy, blockSize, chunkSize);
        const loadOperation = new Promise<void>(resolve=>{
            const chunk = new PlaneChunk(this.gl, list, corners, chunkSize, blockSize * lod, this.textures, ()=>{
                this.currentLod = chunk; 
                resolve();
            }); 
            this.lods[lod] = chunk;
        })
        
        return loadOperation;

        //if (lod == 1){
            //this.models = list;
        //}
    }

    useLod(lod: number){
        if (this.lods[lod]){
            if (this.lods[lod].ready) {
                this.currentLod = this.lods[lod];
            }
        } else {
            this.loadLod(lod);
        }
    }

    loadMap(){
        const canvas = document.createElement('canvas');
        canvas.width = this.chunkSize;
        canvas.height = this.chunkSize;
        const ctx = canvas.getContext('2d');
        generateChunkUni(this.position.x, this.position.y, this.chunkSize, (noiseValue, x, y)=>{
            ctx.fillStyle = grey((noiseValue + 1) / 2 * 256);
            ctx.fillRect(x, y, 1, 1);
        });
        this.map = canvas;
    }

    react(vector: Vector){
        return this.currentLod?.react?.(vector);
    }

    render(positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        if (this.currentLod){
            this.currentLod.render(positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation);
        }
    }
}



const generateChunkUni = (ox: number, oy: number, chunkSize: number, onValue: (value: number, x: number, y: number)=>void)=>{
    const octas = 11;
    for (let x=0; x<chunkSize; x++){
        for (let y=0; y<chunkSize; y++){
            let noiseValue = 0;
            for (let k=4; k< octas; k++){
                noiseValue = (noiseValue + (noise((x + ox) / 2 ** k, (y + oy) / 2 ** k)) /((octas-k) ** 1.2));
            }
            onValue(noiseValue, x, y);  
        }
    }
}
