import { Collectable, collectables } from "./collectable";
import { Game } from "./game";
import { Delay } from "./delay";
import { IVector } from "./IVector";

interface IFactoryConfig {
    type: string,
    from: Array<keyof typeof collectables>,
    to: Array<keyof typeof collectables>,
    prices: Array<number>
}

export const factories: Record<string, IFactoryConfig> = {
    f_egg0: {
        type: 'f_egg0',
        from: ['egg0'],
        to: ['egg1'],
        prices: [100, 150, 200, 300, 500]
    },

    f_egg1: {
        type: 'f_egg1',
        from: ['egg1'],
        to: ['egg2'],
        prices: [100, 150, 200, 300, 500]
    },

    f_egg2: {
        type: 'f_egg2',
        from: ['egg2', 'meal'],
        to: ['egg3'],
        prices: [100, 150, 200, 300, 500]
    },

    f_meat0: {
        type: 'f_meat0',
        from: ['meat0'],
        to: ['meat1'],
        prices: [100, 150, 200, 300, 500]
    },

    f_meat1: {
        type: 'f_meat1',
        from: ['meat1'],
        to: ['meat2'],
        prices: [100, 150, 200, 300, 500]
    },
    
    f_meat2: {
        type: 'f_meat2',
        from: ['meat2', 'pack'],
        to: ['meat3'],
        prices: [100, 150, 200, 300, 500]
    },

    f_milk0: {
        type: 'f_milk0',
        from: ['milk0'],
        to: ['milk1'],
        prices: [100, 150, 200, 300, 500]
    },

    f_milk1: {
        type: 'f_milk1',
        from: ['milk1'],
        to: ['milk2'],
        prices: [100, 150, 200, 300, 500]
    },
    
    f_milk2: {
        type: 'f_milk2',
        from: ['milk2', 'bottle'],
        to: ['milk3'],
        prices: [100, 150, 200, 300, 500]
    },
}

const slotPositions: IVector[] = [
    {x: 0, y: 0},
    {x: 0, y: 150 - 50},
    {x: 0, y: 300 - 50},
    {x: 300 - 50, y: 0},
    {x: 300 - 50, y: 150 - 50},
    {x: 300 - 50, y: 300 - 50},
]

export class Factory{
    progress: number = 0;
    isStarted: boolean = false;
    onFinish: ()=>void;
    protected game: Game;
    config:IFactoryConfig;
    slotIndex: number;
    level = 0;
    //timerId: ReturnType<typeof setTimeout> = null;
    timer: Delay;
    radius = 50;

    get isPaused(){
        return this.timer && this.timer.isPaused;
    }

    constructor(game: Game, config:IFactoryConfig, slotIndex: number){
        this.game = game;
        this.config = config;
        this.slotIndex = slotIndex;
    }

    protected finish(count: number){
        //todo: use all items to
        for (let i = 0; i<count; i++){
            const slotPosition = slotPositions[this.slotIndex];
            this.game.items.push(new Collectable(this.config.to[0], {x: Math.random() * this.radius + slotPosition.x, y: Math.random() * this.radius + slotPosition.y}));
        }
        this.onFinish?.();
    }
    
    startFactory(){
        if (this.isStarted || this.isPaused) {
            return;
        }
        //todo: use all items from
        //const foundIndex = this.game.storage.items.findIndex(it=>it.type==this.config.from[0]);
        const configFrom = this.config.from;
        const foundList = configFrom.map(from=>this.game.storage.items.filter(it=>it.type==from).slice(0, this.level + 1));
        const minCount= Math.min(...foundList.map(it=>it.length));
        const usedList: Collectable[] = foundList.map(list=> list.slice(0, minCount)).flat();
       
        //const found = this.game.storage.items[foundIndex];
        if (minCount){
            //this.game.storage.items.splice(foundIndex, 1);
            this.game.storage.items = this.game.storage.items.filter(it=> !usedList.includes(it));
            usedList.forEach((used, i)=>{
                //console.log('i', i);
               // setTimeout(()=>{
                    this.game.flyItem(used, 'storage', 'f_'+this.slotIndex, i);  
               // }, i * 100);  
            });
            this.isStarted = true;
            this.tick(minCount);
        }
    }

    protected tick(minCount: number){
        this.timer = new Delay(()=>{
            this.progress+=1;
            if (this.progress >=10){
                this.isStarted = false;
                this.finish(minCount);
                this.progress = 0;
            } else {
                this.tick(minCount);
            }
            this.game.onChange();
        }, 200)
    }

    upLevel(){
        if (this.isStarted || this.isPaused) {
            return;
        }
        const price = this.config.prices[this.level];
        if (this.game.checkSum(price)){
           this.level +=1; 
           this.game.money -= price;
        }
        this.game.onChange();
    }

    pause(){
        if (!this.timer){
            return;
        }
        this.timer.pause();
    }

    resume(){
        if (!this.timer){
            return;
        }
        this.timer.resume();
    }

    destroy(){
        this.timer.cancel();
        //clearTimeout(this.timerId);
    }
}