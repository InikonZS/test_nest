import { Collectable } from "./collectable";
import { Game } from "./game";

interface IFactoryConfig {
    type: string,
    from: Array<string>,
    to: Array<string>,
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

export class Factory{
    progress: number = 0;
    isStarted: boolean = false;
    onFinish: ()=>void;
    protected game: Game;
    config:IFactoryConfig;
    slotIndex: number;
    level = 0;

    constructor(game: Game, config:IFactoryConfig, slotIndex: number){
        this.game = game;
        this.config = config;
        this.slotIndex = slotIndex;
    }

    protected finish(){
        //todo: use all items to
        this.game.items.push(new Collectable(this.config.to[0], {x: Math.random() * 300, y: Math.random() * 300}));
        this.onFinish?.();
    }
    
    startFactory(){
        if (this.isStarted) {
            return;
        }
        //todo: use all items from
        const foundIndex = this.game.storage.items.findIndex(it=>it.type==this.config.from[0]);
        const found = this.game.storage.items[foundIndex];
        if (found){
            this.game.storage.items.splice(foundIndex, 1);

            this.isStarted = true;
            setTimeout(()=>{
                this.isStarted = false;
                this.finish();
            }, 2000);
        }
    }

    upLevel(){
        const price = this.config.prices[this.level];
        if (this.game.checkSum(price)){
           this.level +=1; 
           this.game.money -= price;
        }
        this.game.onChange();
    }
}