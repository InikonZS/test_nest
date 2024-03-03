import { Collectable } from "./collectable";
import { Game } from "./game";

export class Car{
    isStarted: boolean = false;
    items: Array<Collectable> = [];
    onFinish: ()=>void;
    game: Game;
    
    constructor(game: Game){
        this.game = game;
    }

    finish(){
        this.onFinish?.();
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
