import {IVector} from '../../common/IVector';
import { GameObject } from './gameObject';
import {closest} from '../../common/closest';

export class HeliBombCell extends GameObject{
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
        return 120;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    bombAttack(objects: GameObject[]){
        objects.forEach(it=>{
            if (Math.abs(it.position.y - this.position.y) <=2 && Math.abs(it.position.x - this.position.x) <=2){
                !it.removed && it.execute(objects);
            }
            for (let x = -2; x <= 2; x++){
                for (let y = -2; y <= 2; y++){
                    !it.removed && it.damagePos({x:this.position.x + x, y: this.position.y + y}, 'a');
                }
            }
        })
    }

    execute(objects: GameObject[]): void {
        this.activated = true; 
        objects.forEach(it=>{
            closest.forEach(jt=>{
                const closePos = {x: jt.x + this.position.x, y: jt.y + this.position.y}
                if ( closePos.x == it.position.x && closePos.y == it.position.y){
                    !it.removed && !it.activated && it.execute(objects); 
                }
                !it.removed && it.damagePos(closePos, 'a');
            });
        })
        const notRemoved = objects.filter(it=> !it.removed && !it.activated && it !== this);
        const target = notRemoved[Math.floor(Math.random() * notRemoved.length)];
        if (target){
            this.position = {...target.position}
            setTimeout(()=>{
                //target.damagePos(this.position, 'a');
                this.remove();
                this.bombAttack(objects);
            }, 500);
        }
    }
}