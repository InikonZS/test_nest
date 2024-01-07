import { IVector } from "../../common/IVector";
import { GameObject } from "./gameObject";
import { closest } from '../../common/closest';
import { BoxCell } from "./box";
import { SandCell } from "./sand";

export class WaterCell extends GameObject{
    background = true;
    health: number = 1;

    move(directed: GameObject): boolean {
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 17;
    }

    damage(type: string = ''): void {
        
    }

    afterTurn(): boolean {
        console.log('water fall')
        closest.forEach(cell=>{
            const pos = {x: cell.x+ this.position.x, y: cell.y + this.position.y};
            const objects = this.game.getPosObjects(pos);
            if (/*this.game.checkPos(pos) &&*/ this.game.inField(pos) && !objects.find(it=>it.removed == false && (it instanceof WaterCell || it instanceof BoxCell || it instanceof SandCell))){
               const newWater = new WaterCell(this.game, pos);
               this.game.objects.push(newWater); 
               newWater.afterTurn();
            }
            
        });
        return false;
    }
}