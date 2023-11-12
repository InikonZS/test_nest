import {IVector} from '../../common/IVector';
import { GameObject } from './gameObject';

export class BombCell extends GameObject{

    actionType: string = 'bm';

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
                //!it.removed && it.damagePos(it.position, 'a');
                //it.removed = true; 
            }
            for (let x = -2; x <= 2; x++){
                for (let y = -2; y <= 2; y++){
                    //!it.removed && it.execute(objects);
                    !it.removed && it.damagePos({x:this.position.x + x, y: this.position.y + y}, 'a');
                }
            }
            //if (Math.abs(it.position.y - this.position.y) <=2 && Math.abs(it.position.x - this.position.x) <=2){
                
                //it.removed = true; 
            //}
        })
    
    }
}