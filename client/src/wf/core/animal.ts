import { IVector } from './IVector';

export class Animal{
    position: IVector;
    lastPosition: IVector;
    onPositionChange: ()=>void;
    onObjectEmit: ()=>void;
    totalDist = 0;

    constructor(){
        this.position = {x: Math.random() * 300, y: Math.random() * 300};
        this.lastPosition = {...this.position};
        this.startLogicTimer();
    }

    startLogicTimer(){
        let timerId: ReturnType<typeof setTimeout> = null;
        const update = (time: number)=>{
            const lastPosition = {...this.position};
            const newPosition = {x: Math.random() * 300, y: Math.random() * 300};
            const dist = Math.hypot(lastPosition.x- newPosition.x, lastPosition.y- newPosition.y);
            
            timerId = setTimeout(()=>{
                this.position = newPosition;
                this.lastPosition = lastPosition;
                this.onPositionChange?.();
                
                this.totalDist+= Number.isNaN(dist) ? 0 : dist;
                console.log('td ', this.totalDist)
                if (this.totalDist>1000){
                    this.totalDist = 0;
                    this.onObjectEmit();
                }
                update(dist * 5);
            }, time);  
        }
        update(1000);
    }
}