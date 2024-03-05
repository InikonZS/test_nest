import { Game } from "./game";

export class Plane{
    game: Game;
    isStarted = false;
    
    constructor(game: Game){
        this.game = game;
    }
}