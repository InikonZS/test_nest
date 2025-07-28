import { getScreenVector, inPlane } from "../../gl/core/hoverRender";
import { Vector } from "../../gl/core/vector";

export interface IVoxelData{
    type: string,
    mx?: number,
    my?: number,
    light: number,
    lights?: number[]
}

export class VoxelField {
    height: number;
    width: number;
    depth: number;
    data: IVoxelData[];
    updated: boolean = false;

    constructor(width: number, height: number, depth: number){
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.data = new Array(width * height * depth).fill(null).map(it=>({type: 'air', light: 0, lights: [0, 0, 0, 0, 0 ,0]}));
    }

    setPoint(point: IVoxelData, x: number, y: number, z: number){
        if (x >= 0 && y >=0 && z>=0 && x < this.width && y< this.height && z<this.depth){
            this.data[x + y * this.width + z * this.width * this.height] = point;
            this.updated = true;
        }
    }

    checkPoint(x: number, y: number, z: number){
        return (x >= 0 && y >=0 && z>=0 && x < this.width && y< this.height && z<this.depth)
    }

    getPoint(x: number, y: number, z: number){
        return this.data[x + y * this.width + z * this.width * this.height];
    }
    
    iterate(onPoint: (point: IVoxelData, x: number, y: number, z: number)=>void){
        this.data.forEach((it, i)=>{
            const x = Math.floor(i % (this.width));
            const y = Math.floor((i / this.width)) % this.height;
            const z = Math.floor((i / this.width / this.height)  % (this.depth));
            onPoint(it, x, y, z);
        });
    }

    raytrace(){
        const steps = [
        {x: 0, y: 0, z: 1},
        {x: 0, y: 0, z: -1},
        {x: 0, y: -1, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: -1, y: 0, z: 0},
        ];
        const clearingTime = performance.now();
        let waveFront: any = [];
        this.iterate((point, x,y,z)=>{
            if (point.type == 'light'){
                //this.setPoint({...point, light: 15}, x, y, z);
                point.light = 15;
                waveFront.push({point: point, x, y, z});
            } else {
                point.light = 0;
                //this.setPoint({...point, light: 0}, x, y, z);
            }
        });

        const traceTime = performance.now();
        for (let i =0; i< 16; i++){
            let changed = false;
            //this.iterate((point, x,y,z)=>{
            const wft: any = waveFront;
            waveFront = [];
            wft.forEach(({point, x, y, z}: any)=>{

                if (point.light <=1){
                    return;
                }
                steps.forEach((step, si)=>{
                    const stepPoint = this.getPoint(x+step.x, y+step.y, z+step.z);
                    if (this.checkPoint(x+step.x, y+step.y, z+step.z) && stepPoint && point.type != 'block' && point.light - 1 > stepPoint.light){
                        stepPoint.light = point.light - 1; //Math.max( point.light - 1, stepPoint.light, 0);
                        //this.data[x + step.x + (y + step.y)* this.width + (z + step.z) * this.width * this.height].light = Math.max( point.light - 1, stepPoint.light, 0);
                        this.updated = true;
                        //this.setPoint({...stepPoint, light: Math.max( point.light - 1, stepPoint.light, 0)}, x+step.x, y+step.y, z+step.z)
                        changed = true;
                        waveFront.push({point: stepPoint, x: x+step.x, y: y+step.y, z: z+step.z});
                    }
                    //if (stepPoint.type != 'air'){
                    //    this.setPoint({...stepPoint, light: Math.max( point.light - 1, 0)}, x+step.x, y+step.y, z+step.z)
                    //}
                })
            });

            if (!changed){
                break;
            }
        }

        const lightsTime = performance.now();
        this.iterate((point, x,y,z)=>{
            if (point.type == 'block'){
                const lights = steps.map((step, si)=>{
                    const stepPoint = this.getPoint(x+step.x, y+step.y, z-step.z);
                    if (stepPoint?.type == 'air'){
                        return stepPoint.light;
                    } else {
                        return 0;
                    }
                })
                //this.setPoint({...point, lights}, x, y, z);
                point.lights = lights;
            }
        });

        const finishTime = performance.now();
        console.log('traceTimes: ', traceTime - clearingTime, lightsTime - traceTime, finishTime - lightsTime);
    
    }

    checkHover(matrix: number[], canvas: HTMLCanvasElement, cursor: Vector){
        const hoveredList: Array<any> = [];
        const fixedCanvasSizes = {clientWidth: canvas.clientWidth, clientHeight: canvas.clientHeight}; //fastify 100 times
        this.iterate((point, x, y, z)=>{
            if (!point || point.type == 'air'){
                return;
            } 
            const aVector3d = new Vector(x, y, z);
            const lwh = new Vector(1, 1, 1);
            const procPoint = (px: number, py: number, pz: number)=>getScreenVector(matrix, aVector3d.add(px, py, pz), fixedCanvasSizes);
            const points = {
                a: procPoint(0,0,lwh.z),
                b: procPoint(lwh.x,0,lwh.z),
                c: procPoint(lwh.x,lwh.y,lwh.z),
                d: procPoint(0,lwh.y,lwh.z),
                a1: procPoint(0,0,0),
                b1: procPoint(lwh.x,0,0),
                c1: procPoint(lwh.x,lwh.y,0),
                d1: procPoint(0,lwh.y,0),
                plane: -1,
                original: new Vector(x, y, z)
            };

            if (!(points.a.z <0 || points.b.z <0 || points.c.z <0 || points.d.z <0 ||
                points.a1.z <0 || points.b1.z <0 || points.c1.z <0 || points.d1.z <0)
            ){
                const it = points;
                const planes = [
                    inPlane(it.d, it.c, it.b, it.a, cursor),
                    inPlane(it.a1, it.b1, it.c1, it.d1, cursor),
                    inPlane(it.a, it.b, it.b1, it.a1, cursor),
                    inPlane(it.b, it.c, it.c1, it.b1, cursor),
                    inPlane(it.c, it.d, it.d1, it.c1, cursor),
                    inPlane(it.d, it.a, it.a1, it.d1, cursor),
                ];
                const pind =planes.findIndex(p=>p == true);
                it.plane = pind;
                if (pind != -1){
                    hoveredList.push(points);
                }
            };
        });

        hoveredList.sort((a, b)=>{
            return (a.a.z + a.b.z + a.c.z + a.d.z + a.a1.z + a.b1.z + a.c1.z + a.d1.z) - (b.a.z + b.b.z + b.c.z + b.d.z + b.a1.z + b.b1.z + b.c1.z + b.d1.z)
        });
        return hoveredList[0];
    }
}