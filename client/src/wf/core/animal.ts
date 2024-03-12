import { IVector } from './IVector';
import { collectables } from './collectable';

export const animals = {
    chicken: {
        type: 'chicken',
        price: 100,
        emitted: 'egg0'
    },
    pig: {
        type: 'pig',
        price: 1000,
        emitted: 'meat0'
    },
    cow: {
        type: 'cow',
        price: 10000,
        emitted: 'milk0'
    },
}

export class Animal{
    position: IVector;
    lastPosition: IVector;
    onPositionChange: ()=>void;
    onObjectEmit: (index: keyof typeof collectables)=>void;
    totalDist = 0;
    type: keyof typeof animals;
    timerId: ReturnType<typeof setTimeout> = null;

    constructor(type: string){
        this.position = {x: Math.random() * 300, y: Math.random() * 300};
        this.lastPosition = {...this.position};
        this.startLogicTimer();
        this.type = (type) as keyof typeof animals;
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
                //console.log('td ', this.totalDist)
                if (this.totalDist>1000){
                    this.totalDist = 0;
                    this.onObjectEmit(animals[this.type].emitted as keyof typeof collectables);
                }
                update(dist * 5);
            }, time); 
            this.timerId = timerId; 
        }
        update(1000);
    }

    destroy(){
        clearInterval(this.timerId);
    }
}