import { AABB } from "./core/aabb";
import { cut } from "./core/cutter";
import { generateChunkUni } from "./core/noise";
import { Vector } from "./core/vector";

const prepareModelsList = (lod: number, ox: number, oy: number, blockSize: number, chunkSize: number) => {
    const list: AABB[] = [];
    const corners: AABB[] = [];
    generateChunkUni(ox - 1 * lod, oy - 1 * lod, chunkSize + 2 * lod, (noiseValue, x, y) => {
        const targetList = ((x <= 0) || (y <= 0) || (x > chunkSize) || (y > chunkSize)) ? corners : list;
        //todo: fix lod edge leak, be sure all previous lod blocks are filled
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
    //console.log(corners)
    return { list, corners };
}

const makeChunk = (lod: number, _list: AABB[], _corners: AABB[], blockSize: number, chunkSize: number) => {
    const mp: Record<string, number> = {};
    _list.forEach(((it, i) => mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
    _corners.forEach(((it, i) => mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
    const models = [];
    for (let plane = 0; plane < 6; plane++) {
        if ([].includes(plane)) {

        } else {

        let dx = 0;
        let dy =0;
        let dz = 0;
        if (plane == 5){
            dx = -blockSize;
        }
        if (plane == 3){
            dx = blockSize;
        }
        if (plane == 2){
            dy = -blockSize;
        }
        if (plane == 4){
            dy = blockSize;
        }
        if (plane == 0){
            dz = -blockSize;
        }
        if (plane == 1){
            dz = blockSize;
        }

        let list = _list.filter((it, i)=>mp[(it.aVector3d.x + dx) +'_'+(it.aVector3d.y + dy)+'_'+(it.aVector3d.z + dz)] == undefined);
        const cutted = cut24(list, plane, _list[0].aVector3d, blockSize, chunkSize ) || cut35(list, plane, _list[0].aVector3d, blockSize, chunkSize ) ||cut01(list, plane, _list[0].aVector3d, blockSize, chunkSize );
    
        const vertexList: Array<number> = [];
        cutted.forEach((it, i)=>{
            it.vertexList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6*4));
                if (plane == undefined || plane == _plane){
                    vertexList.push(jt);
                }
            })
        });
        const vertexes = new Float32Array(vertexList);

        const normList: Array<number> = [];
        cutted.forEach((it, i)=>{
            it.normList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 3));
                if (plane == undefined || plane == _plane){
                    normList.push(jt);
                }
            })
        });
        const norm = new Float32Array(normList);

        const uvList: Array<number> = [];
        cutted.forEach((it, i)=>{
            it.uvList.forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 2));
                if (plane == undefined || plane == _plane){
                    uvList.push(jt);
                }
            })
        });
        const uv = new Float32Array(uvList)
        models.push({
            vertexes, normals: norm, uv
        })
    }
}
return models;
}

const cut24 = (list:AABB[], plane: number, chunkOffset: Vector, blockSize: number, chunkSize: number)=>{
    if ([0, 1].includes(plane)){
        const mpl: Record<string, AABB[]> = {};
        list.forEach(it=>{
            if(!mpl[`${it.aVector3d.z}`]){
                mpl[`${it.aVector3d.z}`] = [];
            }
            mpl[`${it.aVector3d.z}`].push(it);
        });
        const resList: Array<AABB> = [];
        
        Object.keys(mpl).forEach(it=>{
            const aabbs = mpl[it];
            if (aabbs.length == 1){
                resList.push(new AABB(aabbs[0].aVector3d, aabbs[0].bVector3d));
                return;
            }

            //const chunkOffset = _list[0].aVector3d;
            /*static mem use*///mps.forEach((it)=>it.fill('-'));
            const mps = new Array(chunkSize).fill(null).map(it=>new Array(chunkSize).fill('-'));
            aabbs.forEach(it=>
                mps[(it.aVector3d.y - chunkOffset.y) /blockSize ][(it.aVector3d.x - chunkOffset.x) / blockSize] = '8'
            );
            const cutted = cut(mps);
            const z = plane == 1 ? aabbs[0].bVector3d.z : aabbs[0].aVector3d.z ;
            cutted.forEach(ct=>{
                const res = new AABB(new Vector(ct.x * blockSize + chunkOffset.x, ct.y * blockSize + chunkOffset.y, z), new Vector(ct.x * blockSize + chunkOffset.x  + ct.sx*blockSize, ct.y * blockSize + chunkOffset.y + ct.sy * blockSize, z))
                resList.push(res);
            });
        });
        list = resList;
        return list
    }
}

const cut35 = (list:AABB[], plane: number, chunkOffset: Vector, blockSize: number, chunkSize: number)=>{
    if ([3, 5].includes(plane)){
            const mpl: Record<string, AABB[]> = {};
            list.forEach(it=>{
                if(!mpl[`${it.aVector3d.x}`]){
                    mpl[`${it.aVector3d.x}`] = [];
                }
                mpl[`${it.aVector3d.x}`].push(it);
            });
            const resList: Array<AABB> = [];
            Object.keys(mpl).forEach(it=>{
                const aabbs = mpl[it];
                let minZ = Number.MAX_SAFE_INTEGER;
                let maxZ = Number.MIN_SAFE_INTEGER;
                aabbs.forEach(kt=>{
                    if (kt.aVector3d.z < minZ){
                        minZ = kt.aVector3d.z
                    }
                    if (kt.aVector3d.z > maxZ){
                        maxZ = kt.aVector3d.z
                    }
                });
                //console.log(minZ, maxZ);
    
                const mps = new Array((maxZ - minZ)/blockSize + 1).fill(null).map(it=>new Array(chunkSize).fill('-'));
  //mps.forEach((it, i)=>it.fill('-'));
                aabbs.forEach(it=> {
                    mps[(it.aVector3d.z - minZ) /blockSize ][(it.aVector3d.y - chunkOffset.y) / blockSize] = '8';
                });
                const cutted = cut(mps);
                const x = plane == 3 ? aabbs[0].bVector3d.x : aabbs[0].aVector3d.x ;
                cutted.forEach(ct=>{
                    const res = new AABB(
                        new Vector(x, ct.x * blockSize + chunkOffset.y, ct.y * blockSize + minZ), 
                        new Vector(x, ct.x * blockSize + chunkOffset.y  + ct.sx*blockSize, ct.y * blockSize + minZ + ct.sy * blockSize),
                    )
                    resList.push(res);
                });
            });
            list = resList;
             return list;
        }
}

const cut01 = (list:AABB[], plane: number, chunkOffset: Vector, blockSize: number, chunkSize: number)=>{
     if ([2, 4].includes(plane)){
            const mpl: Record<string, AABB[]> = {};
            list.forEach(it=>{
                if(!mpl[`${it.aVector3d.y}`]){
                    mpl[`${it.aVector3d.y}`] = [];
                }
                mpl[`${it.aVector3d.y}`].push(it);
            });
            const resList: Array<AABB> = [];
            Object.keys(mpl).forEach(it=>{
                const aabbs = mpl[it];
                let minZ = Number.MAX_SAFE_INTEGER;
                let maxZ = Number.MIN_SAFE_INTEGER;
                aabbs.forEach(kt=>{
                    if (kt.aVector3d.z < minZ){
                        minZ = kt.aVector3d.z
                    }
                    if (kt.aVector3d.z > maxZ){
                        maxZ = kt.aVector3d.z
                    }
                });
                //console.log(minZ, maxZ);
        
                const mps = new Array((maxZ - minZ)/blockSize + 1).fill(null).map(it=>new Array(chunkSize).fill('-'));
  mps.forEach((it, i)=>it.fill('-'));
                aabbs.forEach(it=> {
                    mps[(it.aVector3d.z - minZ) /blockSize ][(it.aVector3d.x - chunkOffset.x) / blockSize] = '8';
                });
                const cutted = cut(mps);
                const y = plane == 4 ? aabbs[0].bVector3d.y : aabbs[0].aVector3d.y ;
                cutted.forEach(ct=>{
                    const res = new AABB( 
                        new Vector( ct.x * blockSize + chunkOffset.x, y, ct.y * blockSize + minZ), 
                        new Vector( ct.x * blockSize + chunkOffset.x  + ct.sx*blockSize, y, ct.y * blockSize + minZ + ct.sy * blockSize)
                    )
                    resList.push(res);
                });
            });
            list = resList;
            return list;
        }
}

onmessage = (message: MessageEvent<{ type: string, id: string, props: { lod: number, ox: number, oy: number, blockSize: number, chunkSize: number } }>) => {
    //console.log(message);
    if (message.data && typeof message.data == 'object' && message.data.type == 'prepareModelsList') {
        const { lod, ox, oy, blockSize, chunkSize } = message.data.props;
        const result = prepareModelsList(lod, ox, oy, blockSize, chunkSize);
        const models = makeChunk(lod, result.list, result.corners, blockSize*lod, chunkSize);
        //console.log('hello', message);
        //postMessage({ type: message.data.type, id: message.data.id, result: result });
        postMessage({type: message.data.type, id: message.data.id, result:models});
    }
}
