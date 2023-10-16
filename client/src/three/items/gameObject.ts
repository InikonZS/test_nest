import {IVector} from '../common/IVector';
import { Game } from '../game2';

export class GameObject{
    position: IVector;
    zIndex: number;
    id: number;
    removed: boolean = false;
    moving: boolean = false;
    activated: boolean = false;
    actionType: string = '';
    background: boolean = false;
    health?: number;
    subtiles?: Array<Array<string>>;
    game: Game;

    static lastId: number = 0;

    static getNextId(){
      GameObject.lastId++;
      return GameObject.lastId;
    }

    constructor(game: Game, position: IVector){
        this.game = game;
        this.position = position;
        this.id = GameObject.getNextId();
    }

    move(directed: GameObject): boolean{
        return false
    }

    reverseMove(origin: GameObject): boolean{
        return false;
    }

    fall():boolean{
        return false;
    }

    damage(type: string = ''){

    }

    damagePos(pos: IVector, type: string = ''){
        if (this.checkDamagePos(pos)){
            this.damage(type);
        }
    }
    
    execute (objects: Array<GameObject>){

    }

    checkPos(pos: IVector){
        return this.position.x == pos.x && this.position.y == pos.y && !this.removed && !this.background
    }

    checkDamagePos(pos: IVector){
        return this.position.x == pos.x && this.position.y == pos.y && !this.removed
    }

    remove(){
        this.removed = true;
    }
}