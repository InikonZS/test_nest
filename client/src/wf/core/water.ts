import { Game } from "./game";

export class Water{
    count: number;
    maxCount = 5;
    game: Game;
    price: number = 15;

    constructor(game: Game){
        this.game = game;
        this.count = this.maxCount;
    }

    reload(){
        this.count = this.maxCount;
        this.game.money -= this.price;
    }

    makeGrass(){
        this.count -=1;
    }
}
