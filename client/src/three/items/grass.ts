import { IVector } from "../common/IVector";
import { GameObject } from "./gameObject";

export class GrassCell extends GameObject{
    background = true;
    health: number = 2;

    constructor(position: IVector){
        super(position);
    }

    move(directed: GameObject): boolean {
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return this.health == 2 ? 10 : 11;
    }

    damage(type: string = ''): void {
        if (type != 'a'){ return;}
        this.health -=1;
        console.log('damaged grass', this.health)
        if (this.health == 0){
            this.removed = true;
        }
    }
}