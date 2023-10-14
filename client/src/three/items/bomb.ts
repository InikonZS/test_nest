import {IVector} from '../common/IVector';
import { GameObject } from './gameObject';

export class BombCell extends GameObject{

    actionType: string = 'bm';

    constructor(position: IVector){
        super(position);
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
        return 8;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    execute(objects: GameObject[]): void {
        this.removed = true;
        objects.forEach(it=>{
            if (Math.abs(it.position.y - this.position.y) <=2 && Math.abs(it.position.x - this.position.x) <=2){
                !it.removed && it.execute(objects);
                !it.removed && it.damage('a');
                //it.removed = true; 
            }
        })
    
    }
}