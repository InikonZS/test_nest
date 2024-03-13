import { IVector } from './IVector';
import { collectables } from './collectable';
import { Game } from './game';
import { Grass } from './grass';
import { getDist } from './utils';

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
    grassEat: Grass = null;
    hungry: number = 5;
    private game: Game;
    id: number;

    constructor(game: Game, type: string){
        this.position = {x: Math.random() * 300, y: Math.random() * 300};
        this.lastPosition = {...this.position};
        
        this.type = (type) as keyof typeof animals;
        this.game = game;
        this.id = Date.now() + Math.random();
        this.startLogicTimer();
    }

    findClosestGrassIndex(){
        let minDist = Number.MAX_SAFE_INTEGER;
        let minIndex = -1;
        this.game.grass.forEach((grass, index)=>{
            const dist = getDist(grass.position, this.position);
            if (dist<minDist){
                minDist = dist;
                minIndex = index;
            }
        });
        return minIndex;
    }

    startLogicTimer(){
        let timerId: ReturnType<typeof setTimeout> = null;
        const update = (time: number)=>{
            const lastPosition = {...this.position};
            const randomPosition = {x: Math.random() * 300, y: Math.random() * 300};
            const grassIndex = (this.hungry < 4) ? this.findClosestGrassIndex() : -1;
            const grassInstance = this.game.grass[grassIndex];
            const newPosition = (this.game.grass[grassIndex]?.position && this.hungry < 4) ?  this.game.grass[grassIndex]?.position : randomPosition;
           
            const dist = Math.hypot(lastPosition.x- newPosition.x, lastPosition.y- newPosition.y);
            if (lastPosition && newPosition){
                this.hungry -= 0.5 * (dist / 100); // depend on dist;
            }

            //grass length - easy mode
            if (this.hungry<=0 && this.game.grass.length == 0){
                console.log('dead chicken');
                const idx = this.game.animals.findIndex(it=>it==this)
                if (idx !=-1){
                   this.game.animals.splice(idx, 1);
                    this.destroy();
                    this.game.onChange();
                    return;
                }
            }

            timerId = setTimeout(()=>{
                if (this.grassEat){
                    const foundIndex = this.game.grass.findIndex(it=> it == this.grassEat);
                    if (foundIndex !=-1){
                        this.game.grass.splice(foundIndex, 1);
                        this.hungry+=2;
                    }else {
                        console.log('eaten before')
                    }
                    this.grassEat = null;   
                } 
                else {
                    this.grassEat = this.game.grass.find(it=> it == grassInstance);
                }
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