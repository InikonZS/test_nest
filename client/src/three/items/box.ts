import {IVector} from '../common/IVector';
import { GameObject } from './gameObject';

export class BoxCell extends GameObject{
    health: number = 3;

    constructor(position: IVector){
        super(position);
    }

    move(directed: GameObject): boolean{
        //this.removed = true;
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 5;
    }

    damage(): void {
        this.health -= 1;
        if (this.health == 0){
            this.removed = true;
        }
    }
}