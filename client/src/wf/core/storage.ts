import { Collectable } from "./collectable";

class StorageItem{
    constructor(){
        
    }
}

interface IStorageConfig {
    maxCount: number,
    price: number
}

const storages: Array<IStorageConfig> = [
    {
        maxCount: 100,
        price: 0
    },
    {
        maxCount: 100,
        price: 100
    },
    {
        maxCount: 100,
        price: 500
    },
    {
        maxCount: 100,
        price: 2000
    },
];

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