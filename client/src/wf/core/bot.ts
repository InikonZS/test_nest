import { Game } from "./game";

export class Bot{
    game: Game;
    constructor(game: Game){
        this.game = game;
    }

    public handleChanges(){
        if (!this.game.useBot){
            return;
        }
        if (this.game.grass.length < 35){
            if (!this.game.water.count && !this.game.water.isReloading){
                this.game.water.reload();
            } else if (this.game.water.count){
                this.game.makeGrass(Math.random() * 300, Math.random() * 300);
            }
        }

        if (this.game.items.length && this.game.storage.maxCount - this.game.storage.getCount() >= this.game.items[0].size){
            this.game.collect(this.game.items[0]);
        }

        this.game.factories.forEach(it=>{
            if (it && !it.isStarted && this.game.storage.items.length) {
                this.game.startFactory(it);
            }
        });
        if (this.game.storage.items.length && !this.game.car.isStarted){
            const allowedToSell = this.game.storage.items.filter((it)=>['egg3','meat3', 'milk3'].includes(it.type));
            if (allowedToSell.length){
                this.game.car.initSlots();
                this.game.car.addItems(allowedToSell);
                this.game.car.start();
            }
        }
    }

    public destroy(){

    }
}