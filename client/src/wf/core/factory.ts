import { Collectable } from "./collectable";
import { Game } from "./game";

export class Factory{
    progress: number = 0;
    isStarted: boolean = false;
    onFinish: ()=>void;
    protected game: Game;

    constructor(game: Game){
        this.game = game;
    }

    protected finish(){
        this.onFinish?.();
    }
    
    startFactory(){
        this.isStarted = true;
        setTimeout(()=>{
            this.isStarted = false;
            this.finish();
        }, 2000);
    }
}

export class FactoryEgg0 extends Factory{
    startFactory(): void {
        if (this.isStarted) {
            return;
        }
        const foundIndex = this.game.storage.items.findIndex(it=>it.type=='egg0');
        const found = this.game.storage.items[foundIndex];
        if (found){
            this.game.storage.items.splice(foundIndex, 1);
            super.startFactory();
        }
    }

    protected finish(): void {
        this.game.items.push(new Collectable('egg1', {x: Math.random() * 300, y: Math.random() * 300}));
        super.finish();
    }
}

export class FactoryEgg1 extends Factory{
    startFactory(): void {
        if (this.isStarted) {
            return;
        }
        const foundIndex = this.game.storage.items.findIndex(it=>it.type=='egg1');
        const found = this.game.storage.items[foundIndex];
        if (found){
            this.game.storage.items.splice(foundIndex, 1);
            super.startFactory();
        }
    }

    protected finish(): void {
        this.game.items.push(new Collectable('egg2', {x: Math.random() * 300, y: Math.random() * 300}));
        super.finish();
    }
}