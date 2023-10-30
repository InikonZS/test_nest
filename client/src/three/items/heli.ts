import {IVector} from '../common/IVector';
import { GameObject } from './gameObject';
import {closest} from '../common/closest';

export class HeliCell extends GameObject{
    actionType = 'hc';

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
        return 12;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    execute(objects: GameObject[]): void {
        this.activated = true; 
        objects.forEach(it=>{
            closest.forEach(jt=>{
                const closePos = {x: jt.x + this.position.x, y: jt.y + this.position.y}
                if ( closePos.x == it.position.x && closePos.y == it.position.y){
                    !it.removed && !it.activated && it.execute(objects); 
                    //!it.removed && it.damagePos(closePos, 'a');
                    //it.removed = true;
                }
                !it.removed && it.damagePos(closePos, 'a');
            });
        })
        const notRemoved = objects.filter(it=> !it.removed && !it.activated && it !== this);
        const target = notRemoved[Math.floor(Math.random() * notRemoved.length)];
        //const targetList = objects.filter(it=> it.position.x == target.position.x && it.position.y ==)
        if (target){
            this.position = {...target.position}
            setTimeout(()=>{
                target.damagePos(this.position, 'a');
                this.remove();
                //this.removed = true;
            }, 500);
        }
    }
}