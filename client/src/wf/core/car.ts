import { Collectable } from "./collectable";
import { Game } from "./game";
import { countItems } from "./utils";

export class Car{
    isStarted: boolean = false;
    items: Array<Collectable> = [];
    onFinish: ()=>void;
    game: Game;
    slotCount = 2;
    slotSize = 10;
    
    constructor(game: Game){
        this.game = game;
    }

    finish(){
        this.onFinish?.();
    }

    itemsAsSlots(){
        const slots = new Array(this.slotCount).fill(null).map(it=> ({type: '', filled: 0}));
        const restItems: Array<Collectable> = [];
        this.items.forEach(it=>{
            const emptySlot = slots.find(slot=> slot.type == '' || (slot.type== it.type && slot.filled + it.size <= this.slotSize));
            if (!emptySlot){
                restItems.push(it);
            } else {
                if (emptySlot.type == ''){
                    emptySlot.type = it.type;
                }
                emptySlot.filled += it.size;
            }
        });
        return slots;
    }

    addItems(list: Array<Collectable>){
        
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
            this.finish();
        }, 2000);
    }
}
