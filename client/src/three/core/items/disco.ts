import {IVector} from '../../common/IVector';
import { Game } from '../game2';
import { GameObject } from './gameObject';

export class DiscoCell extends GameObject{
    actionType = 'ds';

    constructor(game: Game, position: IVector){
        super(game, position);
    }

    move(directed: GameObject): boolean {
        this.activated = true;
        const lastDirectedPos = directed.position;
        if (directed.reverseMove(this)){
            this.position = {...lastDirectedPos};
        }
        return true;
    }

    reverseMove(origin: GameObject): boolean {
        this.position = origin.position;
        return true;
    }

    valueOf(){
        return 9;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    execute(objects: GameObject[]): void {
        this.removed = true;
        const color = Number(objects.find(it=>!it.removed && it.moving)) || Math.floor(Math.random() * 4) + 1;
        objects.forEach(it=>{
            if (Number(it) == color){
                it.removed = true;
            }
        })
    }
}