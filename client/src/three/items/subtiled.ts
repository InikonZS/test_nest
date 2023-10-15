import {IVector} from '../common/IVector';
import { GameObject } from './gameObject';

export class SubtiledCell extends GameObject{
    health: number = 3;
    subtiles= [
        ['-', '+', '+'],
        ['+', '+', '+'],
        ['+', '+', '-'],
    ];

    move(directed: GameObject): boolean{
        //this.removed = true;
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 13;
    }

    damage(type?: string): void {
        this.health -= 1;
        if (this.health == 0){
            this.removed = true;
        }
    }

    checkPos(pos: IVector){
        if (!this.removed && !this.background){
            return this.subtiles.find((row, y)=>{
                return row.find((it, x)=>{
                   return it == '+' && x + this.position.x == pos.x && y + this.position.y == pos.y 
                })
            }) != undefined;
        }
        return false;
    }

    checkDamagePos(pos: IVector){
        if (!this.removed){
            return this.subtiles.find((row, y)=>{
                return row.find((it, x)=>{
                   return it == '+' && x + this.position.x == pos.x && y + this.position.y == pos.y 
                })
            }) != undefined;
        }
        return false;
    }

    damagePos(pos: IVector, type?: string): void {
        if (this.checkDamagePos(pos)){
            this.damage(type);
        }
    }
}