import {IVector} from '../common/IVector';
import { Game } from '../game2';
import { GameObject } from './gameObject';

export class SubtiledCell extends GameObject{
    health: number = 3;
    subtiles= [
        ['-', '+', '-'],
        ['+', '-', '+'],
        ['-', '+', '-'],
    ];
    healthMap: Array<Array<number>>;

    constructor(game: Game, position: IVector){
        super(game, position);
        this.healthMap = this.subtiles.map(row=> row.map(cell=> cell == '-'? -1 : 1));
        console.log(this.healthMap);
    }

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

    /*
    //damage full health
    damage(type?: string): void {
        this.health -= 1;
        if (this.health == 0){
            this.removed = true;
        }
    }*/

    damage(type?: string): void {
        //this.healthMap.flat().find(it=> it==0) != undefined
        console.log(this.healthMap, this.healthMap.flat().find(it=> it>0) )
        if (this.healthMap.flat().find(it=> it>0) == undefined){
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

    checkDamagePos(pos: IVector, anyX: boolean = false, anyY = false){
        let result = false;
        if (!this.removed){
            
            this.subtiles.forEach((row, y)=>{
                row.forEach((it, x)=>{
                    
                   let found = false; 
                   if (anyX){
                    found = it == '+'  && y + this.position.y == pos.y;
                   } else
                   if (anyY){
                    found = it == '+'  && x + this.position.x == pos.x;
                   } else {
                    found = it == '+' && x + this.position.x == pos.x && y + this.position.y == pos.y;
                   }
                   if (found && this.healthMap[y][x]>0){
                        this.healthMap[y][x]-=1; 
                   }
                   
                   if (found) {
                    result = true;
                   }
                })
            }) != undefined;
        }
        return result;
    }

    damagePos(pos: IVector, type?: string): void {
        if (this.checkDamagePos(pos)){
            this.damage(type);
        }
    }
}