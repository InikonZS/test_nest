import { IVector } from './IVector';
import { Collectable } from './collectable';

export function countItems(items: Array< Collectable >): Record<string, number>{
    const storageSum: Record<string, number> = {};
    items.forEach(item=>{
        if (storageSum[item.type]){
            storageSum[item.type] +=1;
        } else {
            storageSum[item.type] = 1;
        }
    })
    return storageSum;
}

export function getDist(a: IVector, b: IVector){
    return Math.hypot(a.x - b.x, a.y - b.y);
}

export function randomKey(){
    return Date.now() + Math.random();
}