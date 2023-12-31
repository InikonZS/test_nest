import { IVector } from "../../common/IVector";
import { GameObject } from "./gameObject";

export class SandCell extends GameObject{
    background = true;
    health: number = 1;

    move(directed: GameObject): boolean {
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 18
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