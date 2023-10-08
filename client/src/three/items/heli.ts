import {IVector} from '../common/IVector';
import { GameObject } from './gameObject';
import {closest} from '../common/closest';

export class HeliCell extends GameObject{
    actionType = 'hc';

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
                if (jt.x + this.position.x == it.position.x && jt.y + this.position.y == it.position.y){
                    !it.removed && it.execute(objects); 
                    it.removed = true;
                }
            });
        })
        const notRemoved = objects.filter(it=> !it.removed);
        const target = notRemoved[Math.floor(Math.random() * notRemoved.length)];
        //const targetList = objects.filter(it=> it.position.x == target.position.x && it.position.y ==)
        if (target){
            this.position = {...target.position}
            setTimeout(()=>{
                target.damage('a');
                this.removed = true;
            }, 500);
        }
    }
}