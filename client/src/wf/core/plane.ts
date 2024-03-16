import { Collectable } from "./collectable";
import { Game } from "./game";

export class Plane{
    game: Game;
    isStarted = false;
    items: Array<string> = [];
    
    constructor(game: Game){
        this.game = game;
    }

    addItems(type: string, count: number){
        for (let i=0; i< count; i++){
            this.items.push(type);
        }
        this.game.onChange();
    }

    removeSlotItem(slot: number){

        this.game.onChange();
    }

    buy(){
        this.isStarted = true;
        setTimeout(()=>{
            this.isStarted = false;
            this.items.forEach(type=>{
                this.game.items.push(new Collectable(type, {x: Math.random() * 300, y: Math.random() * 300}));
            })
            this.items = [];
        }, 2000);
        this.game.onChange();
    }
}