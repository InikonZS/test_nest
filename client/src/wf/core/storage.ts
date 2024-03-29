import { Collectable } from "./collectable";
import { Game } from "./game";

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
        maxCount: 200,
        price: 100
    },
    {
        maxCount: 400,
        price: 500
    },
    {
        maxCount: 800,
        price: 2000
    },
];

export class Storage{
    items: Array<Collectable> = [];
    level= 0;
    game: Game;

    get maxCount(){
        return storages[this.level].maxCount
    }

    get upgradePrice(){
        return storages[this.level + 1].price | 0;
    }

    constructor(game: Game){
        this.game = game;
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

    getConfigByLevel(){
        return storages[this.level];
    }

    getUpgradePrice(){
        return storages[this.level+1]?.price || 0;
    }

    upgrade(){
        const isPaid = this.game.paySum(this.upgradePrice);
        if (!isPaid){
            return false;
        };
        if (this.level<storages.length-1){
            this.level+=1;
        }
        this.game.onChange();
        return true;
    }
}