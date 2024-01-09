import {IVector} from '../../common/IVector';
import { Game } from '../game2';
import { GameObject } from './gameObject';

export class ColoredCell extends GameObject{
    health: number = 3;
    subtiles= [
        ['+', '+'],
        ['+', '+'],
    ];
    healthMap: Array<Array<number>>;

    constructor(game: Game, position: IVector){
        super(game, position);
        this.healthMap = this.subtiles.map(row=> row.map(cell=> cell == '-'? -1 : 1));
        console.log(this.healthMap);
    }

    move(directed: GameObject): boolean{
        return false;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 19;
    }

    damage(type?: string): void {
        let index = {'1':0, '2':1, '3':2, '4':3}[type];
        if (type == 'a'){
            index = this.healthMap.flat().findIndex(it=> it>0);
        }
        if (index != undefined && this.healthMap[Math.floor(index / 2)][Math.floor(index % 2)]>0){
           this.healthMap[Math.floor(index / 2)][Math.floor(index % 2)] -=1; 
        }
        
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