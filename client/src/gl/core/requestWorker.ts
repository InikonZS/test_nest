import {AABB} from "./aabb";

const worker = new Worker('./worker.js');

let _id = 0;
const getId = ()=>{
    _id++;
    return _id;
}

type TRes = {
    vertexes: Float32Array;
    normals: Float32Array;
    uv: Float32Array;
};

//{list: AABB[], corners:AABB[]}

export const requestNoise = (lod: number, ox: number, oy: number, blockSize: number, chunkSize: number)=>{
    return new Promise<TRes>((resolve)=>{
        const id = getId();
        const handleResponse = (message: MessageEvent<{type: string, id: number, result: TRes}>)=>{
            if (message.data.type == 'prepareModelsList' && message.data.id == id){
                worker.removeEventListener('message', handleResponse);
                resolve(message.data.result)
            }
        }
        worker.addEventListener('message', handleResponse);
        worker.postMessage({
            type: 'prepareModelsList',
            id: id,
            props: {
                lod,
                ox,
                oy,
                blockSize,
                chunkSize
            }
        });
    });
}

export const requestMap = (ox: number, oy: number, blockSize: number, chunkSize: number)=>{
     return new Promise<Blob>((resolve)=>{
        const id = getId();
        const handleResponse = (message: MessageEvent<{type: string, id: number, result: Blob}>)=>{
            if (message.data.type == 'prepareMap' && message.data.id == id){
                worker.removeEventListener('message', handleResponse);
                resolve(message.data.result)
            }
        }
        worker.addEventListener('message', handleResponse);
        worker.postMessage({
            type: 'prepareMap',
            id: id,
            props: {
                ox,
                oy,
                blockSize,
                chunkSize
            }
        });
    });
}
