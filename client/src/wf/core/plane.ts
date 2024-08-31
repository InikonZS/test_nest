import { Collectable, collectables } from "./collectable";
import { Game } from "./game";
import { Slots } from "./slots";

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
    //items: Array<string> = [];
    level = 0;
    slots: Slots;

    get items(){
        return this.slots.items;
    }

    get upgradePrice(){
        return planes[this.level + 1]?.price || 0;
    }

    get time(){
        return this.getConfigByLevel().time;
    }
    
    constructor(game: Game){
        this.game = game;
        this.slots = new Slots();
        this.slots.onChange = ()=>{
            this.game.onChange();
        }
        this.slots.initSlots();
    }

    addItems(type: string, count: number){
        const items: Array<Collectable> = [];
        for (let i=0; i< count; i++){
            items.push(new Collectable(type as keyof typeof collectables));
        }
        const accepted = this.slots.addItems(items);
        if (!accepted.length){
            console.log('plane is full');
        }
        this.game.onChange();
    }

    removeSlotItem(slot: number){
        this.slots.removeSlot(slot);
        this.game.onChange();
    }

    resetItems(){
        this.slots.resetItems();
    }

    buy(){
        const buyedItems = [...this.items];
        const sum = this.getTotalSum();
        const isPaid = this.game.paySum(sum);
        if (!isPaid){
            return;
        } 
        this.isStarted = true;
        this.slots.resetItems();
        setTimeout(()=>{
            this.isStarted = false;
            buyedItems.forEach(item=>{
                this.game.items.push(new Collectable(item.type, {x: Math.random() * 300, y: Math.random() * 300}));
            })
            //this.items = [];
        }, this.time);
        this.game.onChange();
    }

    getTotalSum(){
        return this.items.reduce((ac, it)=> ac + it.price, 0);
    }

    getConfigByLevel(){
        return planes[this.level];
    }

    getUpgradePrice(){
        return planes[this.level+1]?.price || 0;
    }

    upgrade(){
        if (this.level<planes.length-1){
            const isPaid = this.game.paySum(this.upgradePrice);
            if (!isPaid){
                return false;
            };
        
            this.level+=1;
            this.slots.resetItems();
            this.slots.slotCount = this.getConfigByLevel().slotCount;
            this.slots.initSlots();
        }
        this.game.onChange();
        return true;
    }
}