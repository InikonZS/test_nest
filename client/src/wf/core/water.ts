import { IVector } from "./IVector";
import { Game } from "./game";
import { Grass } from "./grass";

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
        for (let i=0; i< 3; i++){
            this.game.grass.push(new Grass({x: position.x + Math.random()* 20 - 10, y: position.y + Math.random()* 20 - 10}));
        }
        this.onUpdate();
    }
}