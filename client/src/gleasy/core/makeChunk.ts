import { makeBoxModel, makeBoxNormalsFromVertexList, setTexcoordsLWH } from "../../gl/core/aabb";
import { Vector } from "../../gl/core/vector";

export const makeChunk = (_list: {point: any, vector: Vector}[], _corners: {point: any, vector: Vector}[], blockSize: number) => {
    const mp: Record<string, number> = {};
    _list.forEach(((it, i) => mp[`${it.vector.x}_${it.vector.y}_${it.vector.z}`] = i));
    _corners.forEach(((it, i) => mp[`${it.vector.x}_${it.vector.y}_${it.vector.z}`] = i));
    //const models = [];
    const vertexList: Array<number> = [];
    const normList: Array<number> = [];
    const uvList: Array<number> = [];
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

        let list = _list.filter((it, i)=>mp[(it.vector.x + dx) +'_'+(it.vector.y + dy)+'_'+(it.vector.z + dz)] == undefined);
        //const cutted = cut24(list, plane, _list[0].aVector3d, blockSize, chunkSize ) || cut35(list, plane, _list[0].aVector3d, blockSize, chunkSize ) ||cut01(list, plane, _list[0].aVector3d, blockSize, chunkSize );
    let cutted = list;
        //const vertexList: Array<number> = [];
        cutted.forEach((it, i)=>{
            makeBoxModel(it.vector, blockSize, blockSize, blockSize).forEach((jt, j)=>{
                const _plane = Math.floor(j/(6*4));
                if (plane == undefined || plane == _plane){
                    vertexList.push(jt);
                }
            })
        });
        //const vertexes = new Float32Array(vertexList);

        //const normList: Array<number> = [];
        cutted.forEach((it, i)=>{
            makeBoxNormalsFromVertexList().forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 3));
                if (plane == undefined || plane == _plane){
                        normList.push( (it.point.lights?.[plane] || /*it.point.light**/(it.point.type =='block' ?0 : 15))  / 16);
                }
            })
        });
        //const norm = new Float32Array(normList);

        //const uvList: Array<number> = [];
        cutted.forEach((it, i)=>{
            setTexcoordsLWH(1, 1, 1).forEach((jt, j)=>{
                const _plane = Math.floor(j/(6* 2));
                if (plane == undefined || plane == _plane){
                    uvList.push(jt);
                    if (j % 2 != 0){
                        const mpy = Math.floor(plane / 3);
                        const mpx = Math.floor(plane % 3);
                        uvList.push(((it.point?.mx1 || 0)*3 + mpx) % 4);
                        uvList.push( ((it.point?.my1 || 1)*2  + mpy) % 4);
                    }
                }
            })
        });
        //const uv = new Float32Array(uvList)
        /*models.push({
            vertexes, normals: norm, uv
        })*/
    }
}
return {
    vertexes: new Float32Array(vertexList),
    normals:new Float32Array(normList),
    uv: new Float32Array(uvList)
};
}