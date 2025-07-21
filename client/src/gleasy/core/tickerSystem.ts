export class TickerSystem {
    lastTimeStamp: number;
    onTick: (time: number, lastTime: number)=>void;

    constructor(){
        this.lastTimeStamp = Date.now();
        requestAnimationFrame((timeStamp)=>this.tick(timeStamp));
    }

    tick(timeStamp: number){
        this.onTick?.(timeStamp, this.lastTimeStamp);
        this.lastTimeStamp = timeStamp;
        requestAnimationFrame((timeStamp)=>this.tick(timeStamp));
    }
}