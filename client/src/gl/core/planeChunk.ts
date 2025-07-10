import {AABB, renderModel} from "./aabb";
import { ABChunk } from "./abChunk";
import { Vector } from "./vector";

export class PlaneChunk{
    models: ABChunk[] = [];
    textures: WebGLTexture;

    constructor(gl: WebGLRenderingContext, list: AABB[], chunkSize: number, tileSize: number, textures: Record<string, WebGLTexture>) {
        const mp: Record<string, number> = {};
        list.forEach(((it, i)=>mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
        for (let i=0; i< 6; i++){
            if ([].includes(i)){
                
            } else {
            this.models.push(new ABChunk(gl, list, mp, chunkSize, tileSize, [
                textures.texture,
                textures.texture_top,
                textures.texture_side,
                textures.texture_side,
                textures.texture_side,
                textures.texture_side,
            ][i], i));
        }
        }  
    }

    render(gl: any, positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        this.models.forEach(it=>it.render(gl, positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation));
    }
}