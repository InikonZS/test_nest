import { Vector } from "../../gl/core/vector";

interface IChunkGridItem {
    pos: {x:number, y:number},
    size: number
};

export class ChunkGrid {
    chunks: IChunkGridItem[]

    updatePosition(playerPos: Vector){
        //chunks = [];
        const minLod = 8;
        for (let lod = 0; lod< 4; lod ++){
        const size = 2 ** lod * minLod;
        const count = lod > 0 ? 12 : 8;
        for (let y = 0; y<count; y++){
            for (let x = 0; x<count; x++){
                const newPos ={
                        x: Math.floor((playerPos.x) / size + x - count /2 + 0.5) * size,
                        y: Math.floor((playerPos.y) / size + y - count /2 + 0.5) * size
                    };
                const isEx = this.chunks.find(it=>it.pos.x == newPos.x && it.pos.y == newPos.y && it.size == size);
                if (!isEx){
                    this.chunks.push({
                        size: size,
                        pos: newPos
                    });
                }
            }
        }
        this.chunks = this.chunks.filter(it=> it.size != size || Math.hypot(it.pos.x - playerPos.x , it.pos.y - playerPos.y) < size * count *1.02);
        }
    }

    getVisible(){
        const splitLod = (lodSmall: IChunkGridItem[], lodBig: IChunkGridItem[])=>{
            const resultSmall: IChunkGridItem[] = [];
            const resultBig = lodBig.filter(it=>{
                const filtered = lodSmall.filter(jt=>
                    jt.pos.x >= it.pos.x && 
                    jt.pos.y >= it.pos.y && 
                    jt.pos.x < it.pos.x + it.size && 
                    jt.pos.y < it.pos.y + it.size
                );
                if ( filtered.length == 4){
                    filtered.forEach(fi=>{
                    resultSmall.push(fi);  
                    })
                    
                }
                return filtered.length !=4;
            });
            return [resultSmall, resultBig];
        }

        const filterLods = (chunks: IChunkGridItem[])=>{
            const lods = [64, 32, 16, 8].map(it=>{
                return chunks.filter(jt=>{
                    return jt.size == it;
                });
            });

            let filtered: IChunkGridItem[] = [];
            let prevLod: IChunkGridItem[];
            lods.forEach((lod, i)=>{
                if (i==0){
                    return;
                }
                if (!prevLod){
                    prevLod = lods[i - 1];
                }
                const [small, big] = splitLod(lods[i], prevLod);
                prevLod = small;
                big.forEach(it=>filtered.push(it));
                if (i == lods.length -1){
                    small.forEach(it=>filtered.push(it));
                }
            });
            return filtered;
        }
        return filterLods(this.chunks);
    }
}