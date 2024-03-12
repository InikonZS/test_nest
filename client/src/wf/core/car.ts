import { Collectable } from "./collectable";
import { Game } from "./game";
import { countItems } from "./utils";

interface ICarConfig {
    slotCount: number,
    time: number,
    price: number
}

const cars: Array<ICarConfig> = [
    {
        slotCount: 2,
        time: 5,
        price: 0,
    },
    {
        slotCount: 3,
        time: 4,
        price: 100,
    },
    {
        slotCount: 5,
        time: 3,
        price: 500,
    },
    {
        slotCount: 7,
        time: 2,
        price: 2000
    }
]

export class Car{
    isStarted: boolean = false;
    items: Array<Collectable> = [];
    onFinish: ()=>void;
    game: Game;
    slotCount = 2;
    slotSize = 10;
    itemsAsSlots: {
        type: string;
        filled: number;
        items: Array<Collectable>;
    }[] = new Array(this.slotCount).fill(null).map(it=> ({type: '', filled: 0, items:[]}));
    level = 0;
    
    constructor(game: Game){
        this.game = game;
    }

    finish(){
        this.onFinish?.();
    }

    itemsToSlots(items: Array<Collectable>){
        const slots = this.itemsAsSlots;//new Array(this.slotCount).fill(null).map(it=> ({type: '', filled: 0}));
        const restItems: Array<Collectable> = [];
        const acceptedItems: Array<Collectable> = [];
        items.forEach(it=>{
            const emptySlot = slots.find(slot=> slot.type == '' || (slot.type== it.type && slot.filled + it.size <= this.slotSize));
            if (!emptySlot){
                restItems.push(it);
            } else {
                if (emptySlot.type == ''){
                    emptySlot.type = it.type;
                }
                emptySlot.filled += it.size;
                emptySlot.items.push(it);
                acceptedItems.push(it);
            }
        });
        this.itemsAsSlots = slots;
        return acceptedItems;
    }

    addItems(list: Array<Collectable>){
        const accepted = this.itemsToSlots(list);
        this.items = [...this.items, ...accepted];
        this.game.storage.items = this.game.storage.items.filter(jt => !accepted.includes(jt));
    }

    removeSlot(slotIndex: number){
        const slot = this.itemsAsSlots[slotIndex];
        const item = slot.items.pop();
        if (!item){
            console.log('no item');
            return;
        }
        this.items = this.items.filter(it=>it!=item);
        slot.filled -= item.size;
        this.game.storage.addItem(item);
        if (slot.items.length == 0){
            slot.type = '';
        }
    }

    start(){
        if (this.isStarted){
            return;
        }
        this.isStarted = true;
        setTimeout(()=>{
            this.isStarted = false;
            const totalPrice = this.items.reduce((ac, it)=>ac+it.price, 0);
            this.game.money += totalPrice;
            this.items = [];
            this.itemsAsSlots = new Array(this.slotCount).fill(null).map(it=> ({type: '', filled: 0, items:[]}));
            this.finish();
        }, 2000);
    }

    upgrade(){
        if (this.level<3){
            this.level+=1;
        }
    }
}
