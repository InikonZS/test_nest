import { IVector } from "../common/IVector";
import { GameObject } from "./gameObject";

export class BreakableCell extends GameObject{

    move(directed: GameObject): boolean {
        this.removed = true;
        return true;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 6;
    }
}