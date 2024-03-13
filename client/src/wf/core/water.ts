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
        reloadTime: 2,
        price: 0
    },
    {
        maxCount: 7,
        reloadPrice: 15,
        reloadTime: 2,
        price: 150
    },
    {
        maxCount: 10,
        reloadPrice: 10,
        reloadTime: 2,
        price: 750
    },
    {
        maxCount: 15,
        reloadPrice: 10,
        reloadTime: 1,
        price: 2500
    },
];

export class Water{
    count: number;
    maxCount = 5;
    game: Game;
    price: number = 15;
    isReloading: boolean = false;
    onUpdate: ()=>void;

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
}
