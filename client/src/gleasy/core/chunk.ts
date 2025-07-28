import { generateChunkUni } from "../../gl/core/noise";
import { Vector } from "../../gl/core/vector";

export class Chunk{
    size: number;
    position: Vector;

    constructor(size: number, position: Vector){
        const lod = 1;
        const ox = position.x;
        const oy = position.y;
        const chunkSize = size;
        const blockSize = 1;
        this.size = size;
        this.position = position;
        generateChunkUni(ox-1*lod, oy-1*lod, chunkSize + 2*lod, (noiseValue, x, y)=>{
            if (x % lod == 0 && y % lod == 0) {
                const blockZ = Math.floor(noiseValue * 120 / (blockSize * lod)) * blockSize * lod;
                
            }
        });
    }
}

export class ChunkSystem{
    chunks: Chunk[];

    constructor(){

    }
}