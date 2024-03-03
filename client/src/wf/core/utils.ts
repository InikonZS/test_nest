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