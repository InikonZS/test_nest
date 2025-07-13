import {AABB, renderModel} from "./aabb";
import { ABChunk } from "./abChunk";
import { Vector } from "./vector";

export class PlaneChunk{
    models: ABChunk[] = [];
    textures: WebGLTexture;
    gl: WebGLRenderingContext;
    ready: boolean = false;

    constructor(gl: WebGLRenderingContext, list: AABB[], corners: AABB[], chunkSize: number, tileSize: number, textures: Record<string, WebGLTexture>, onReady: ()=>void) {
        this.gl = gl;
        const load = async ()=>{
            const mp: Record<string, number> = {};
            list.forEach(((it, i)=>mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
            corners.forEach(((it, i)=>mp[`${it.aVector3d.x}_${it.aVector3d.y}_${it.aVector3d.z}`] = i));
                for (let i=0; i< 1; i++){
                    if ([].includes(i)){
                        
                    } else {
                        await new Promise<void>(res=>setTimeout(()=>res(), 0))
                    this.models.push(new ABChunk(gl, list, mp, chunkSize, tileSize, [
                        //textures.texture,
                        textures.texture_top,
                        /*textures.texture_side,
                        textures.texture_side,
                        textures.texture_side,
                        textures.texture_side,*/
                    ][i], i));
                }
                setTimeout(()=>{
                    this.ready = true;
                    onReady();
                }, 0);
                
            }
        };
        load();
    }

    render(positionAttributeLocation: any, positionNormLocation: any, texcoordLocation: number, colorLocation: any){
        this.models.forEach(it=>it.render(this.gl, positionAttributeLocation, positionNormLocation, texcoordLocation, colorLocation));
    }
}