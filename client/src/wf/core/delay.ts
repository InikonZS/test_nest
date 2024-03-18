export class Delay{
    callback: ()=>void;
    time: number;
    pausedLeftTime: number;
    startStamp: number;
    isPaused = false;
    timerId: ReturnType<typeof setTimeout> = null;

    constructor(callback: ()=>void, time:number){
        this.callback = callback;
        this.time = time;
        this.start();
    }

    start(){
        this.startStamp = Date.now();
        this.timerId = setTimeout(this.callback, this.time);
    }

    pause(){
        this.isPaused = true;
        const currentTime = Date.now();
        this.pausedLeftTime = currentTime - this.startStamp;
        clearTimeout(this.timerId);
    }

    resume(){
        this.isPaused = false;
        setTimeout(this.callback, this.pausedLeftTime);
    }

    cancel(){
        clearTimeout(this.timerId);
    }
}