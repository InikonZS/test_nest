import {IVector} from '../../common/IVector';
import { Game } from '../game2';
import { GameObject } from './gameObject';

export class Cell extends GameObject{
    color: number;

    constructor(game: Game, position: IVector, color: number){
        super(game, position);
        this.color = color;
    }

    move(directed: GameObject): boolean {
        const lastDirectedPos = directed.position;
        if (directed.reverseMove(this) && directed !== this){
            this.position = {...lastDirectedPos};
            return true;
        }
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        this.position = origin.position;
        return true;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    valueOf(){
        return this.color;
    }

    damage(type: string = ''): void {
        if (type == 'a'){
            //this.removed = true;
            this.remove();
        }
    }

    remove(): void {
        if (!this.removed){
            this.game.colorsCount[this.color - 1]++;
        }
        super.remove();
    }
}