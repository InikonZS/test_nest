import {IVector} from '../common/IVector';
import { GameObject } from './gameObject';

export class RocketCell extends GameObject{
    actionType = 'dm';

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
        return 7;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    execute (objects: GameObject[]) {
        this.removed = true;
        const dir = Math.random()>0.5;
        if (dir) {
            objects.forEach(it=>{
                if (it.position.x == this.position.x){
                   
                    !it.removed && it.execute(objects); 
                    !it.removed && it.damage('a');
                    //it.removed = true;
                }
            })
        } else {
            objects.forEach(it=>{
                if (it.position.y == this.position.y){
                    
                    !it.removed && it.execute(objects);
                    !it.removed && it.damage('a');
                    //it.removed = true;
                }
            })
        }
    };
}