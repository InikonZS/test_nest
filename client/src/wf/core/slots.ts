import { Collectable } from "./collectable";

export class Slots{
    items: Array<Collectable> = [];
    slotSize = 10;
    slotCount = 2;
    itemsAsSlots: {
        type: string;
        filled: number;
        items: Array<Collectable>;
    }[];
    onChange: ()=>void;

    constructor(){

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
        //this.game.storage.items = this.game.storage.items.filter(jt => !accepted.includes(jt));
        this.onChange?.();
        return accepted;
    }

    initSlots(){
        this.itemsAsSlots = new Array(this.slotCount).fill(null).map(it=> ({type: '', filled: 0, items:[]}));
    }

    resetItems(){
        /*this.items.forEach(item=>{
            this.game.storage.items.push(item);
        })*/
        const reseted = this.items;
        this.items = [];
        this.initSlots();
        this.onChange?.();
        return reseted;
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
        //this.game.storage.addItem(item);
        if (slot.items.length == 0){
            slot.type = '';
        }
        this.onChange?.();
        return item;
    }
}