import { IVector } from "./IVector";
import { Game } from "./game";
import { Grass } from "./grass";

interface IWaterConfig {
    maxCount: number,
    reloadPrice: number,
    reloadTime: number,
    price: number,
}

const waters: Array<IWaterConfig> = [
    {
        maxCount: 5,
        reloadPrice: 20,
        reloadTime: 2000,
        price: 0
    },
    {
        maxCount: 7,
        reloadPrice: 15,
        reloadTime: 2000,
        price: 150
    },
    {
        maxCount: 10,
        reloadPrice: 10,
        reloadTime: 2000,
        price: 750
    },
    {
        maxCount: 15,
        reloadPrice: 10,
        reloadTime: 1000,
        price: 2500
    },
];

export class Water{
    count: number;
    //maxCount = 5;
    game: Game;
    //price: number = 15;
    isReloading: boolean = false;
    onUpdate: ()=>void;
    level= 0;

    get price(){
        return this.getConfigByLevel().price
    }

    get upgradePrice(){
        return waters[this.level + 1].price || 0;
    }

    get maxCount(){
        return this.getConfigByLevel().maxCount
    }

    constructor(game: Game){
        this.game = game;
        this.count = this.maxCount;
    }

    reload(){
        this.isReloading = true;
        this.onUpdate();
        setTimeout(()=>{
            this.count = this.maxCount;
            this.game.money -= this.price;  
            this.isReloading = false;
            this.onUpdate();
        }, 1000);
    }

    makeGrass(position: IVector){
        if (this.count<1){
            return;
        }
        this.count -=1;
        for (let i=0; i< 7; i++){
            this.game.grass.push(new Grass({x: position.x + Math.random()* 20 - 10, y: position.y + Math.random()* 20 - 10}));
        }
        this.onUpdate();
    }

    getConfigByLevel(){
        return waters[this.level];
    }

    getUpgradePrice(){
        return waters[this.level+1]?.price || 0;
    }

    upgrade(){
        if (this.level<waters.length-1){
            const isPaid = this.game.paySum(this.upgradePrice);
            if (!isPaid){
                return false;
            };
        
            this.level+=1;
        }
        this.game.onChange();
        return true;
    }
}
