import { Collectable, collectables } from "./collectable";
import { Game } from "./game";

interface IPlaneConfig {
    slotCount: number,
    time: number,
    price: number
}

const planes: Array<IPlaneConfig> = [
    {
        slotCount: 2,
        time: 5000,
        price: 0,
    },
    {
        slotCount: 3,
        time: 4000,
        price: 100,
    },
    {
        slotCount: 4,
        time: 3000,
        price: 500,
    },
    {
        slotCount: 5,
        time: 2000,
        price: 2000
    }
]

export class Plane{
    game: Game;
    isStarted = false;
    items: Array<string> = [];
    level = 0;
    
    constructor(game: Game){
        this.game = game;
    }

    addItems(type: string, count: number){
        for (let i=0; i< count; i++){
            this.items.push(type);
        }
        this.game.onChange();
    }

    removeSlotItem(slot: number){

        this.game.onChange();
    }

    buy(){
        this.isStarted = true;
        setTimeout(()=>{
            this.isStarted = false;
            this.items.forEach(type=>{
                this.game.items.push(new Collectable(type as keyof typeof collectables, {x: Math.random() * 300, y: Math.random() * 300}));
            })
            this.items = [];
        }, this.getConfigByLevel().time);
        this.game.onChange();
    }

    getTotalSum(){
        return this.items.reduce((ac, it)=> ac + collectables[it as keyof typeof collectables].price, 0);
    }

    getConfigByLevel(){
        return planes[this.level];
    }

    getUpgradePrice(){
        return planes[this.level+1]?.price || 0;
    }

    upgrade(){
        if (this.level<planes.length-1){
            this.level+=1;
        }
        this.game.onChange();
    }
}