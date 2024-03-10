import { Collectable } from "./collectable";

class StorageItem{
    constructor(){
        
    }
}

export class Storage{
    items: Array<Collectable> = [];
    maxCount = 100;
    level: 0;
    constructor(){
        
    }

    addItem(item: Collectable){
        if ((this.getCount() + item.size) < this.maxCount){
            this.items.push(item);
            console.log('storage pushed', item);
            return true;
        }
        console.log('storage is full');
        return false;
    }

    getCount(){
        const count = this.items.reduce((ac, it)=> ac+it.size,0);
        return count;
    }

    upgrade(){
        this.level+=1;
    }
}