import {IVector} from './game';

export class GameObject{
    position: IVector;
    zIndex: number;
    id: number;
    removed: boolean = false;

    static lastId: number = 0;

    static getNextId(){
      GameObject.lastId++;
      return GameObject.lastId;
    }

    constructor(position: IVector){
        this.position = position;
        this.id = GameObject.getNextId();
    }

    move(directed: GameObject){
    }

    reverseMove(origin: GameObject): boolean{
        return false;
    }

    fall():boolean{
        return false;
    }

    damage(){

    }
}

class Cell extends GameObject{
    color: number;

    constructor(position: IVector, color: number){
        super(position);
        this.color = color;
    }

    move(directed: GameObject): void {
        const lastDirectedPos = directed.position;
        if (directed.reverseMove(this)){
            this.position = {...lastDirectedPos};
        }
    }

    reverseMove(origin: GameObject): boolean {
        this.position = origin.position;
        return true;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    valueOf(){
        return this.color;
    }
}

class BreakableCell extends GameObject{

    constructor(position: IVector){
        super(position);
    }

    move(directed: GameObject): void {
        /*const lastDirectedPos = directed.position;
        if (directed.reverseMove(this)){
            this.position = {...lastDirectedPos};
        }*/
        this.removed = true;
    }

    reverseMove(origin: GameObject): boolean {
        //this.position = origin.position;
        return false;
    }

    valueOf(){
        return 6;
    }
}

class BoxCell extends GameObject{
    constructor(position: IVector){
        super(position);
    }

    move(directed: GameObject): void {
        //this.removed = true;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 5;
    }

    damage(): void {
        this.removed = true;
    }
}

class EmptyCell extends GameObject{

}

const generateLevel = ()=>{
    const objects: Array<GameObject> = [];
    new Array(10).fill(null).map((it, y) => new Array(10).fill(0).map((it, x) => {
        if (Math.random()<0.1){
            const cell = new BreakableCell({x, y});
            objects.push(cell);
        } else if (Math.random()<0.2){
            const cell = new BoxCell({x, y});
            objects.push(cell);
        } else {
            const cell = new Cell({x, y}, Math.floor(Math.random() * 4) + 1);
            objects.push(cell);
        }
    }));
    return objects;
}

const closest: Array<IVector> = [
    {x: -1, y: 0},
    {x: 1, y: 0},
    {x: 0, y: -1},
    {x: 0, y: 1},
]


export class Game{
    objects: GameObject[] = [];
    onGameState: () => void;

    constructor(){
        this.objects = generateLevel();
    }

    getCurrentFieldMask(){
        const fieldMask: Array<Array<Cell>> = new Array(10).fill(null).map(it=>new Array(10).fill(null));
        this.objects.forEach(it=>{
            if (it instanceof Cell && !it.removed){
                fieldMask[it.position.y][it.position.x] = it;
            }
        });
        return fieldMask;
    }

    _check(field: Array<Array<Cell>>) {
        const threeList: Array<Array<Cell>> = [];
        field.forEach((row, y) => {
          let three: Array<Cell> = [];
          let lastColor: Cell = null;
          row.forEach((cell, x) => {
            if ((lastColor && cell && lastColor.color != cell.color) || !lastColor || !cell) {
              if (three.length >= 3) {           
                threeList.push(three);
              }
              three = [];
            } /*else {
              console.log(cell);*/
              if(cell &&!cell.removed) {
                three.push(cell);
              }          
           /* }*/
            lastColor = cell;
          })
          if (three.length >= 3) {
            console.log(lastColor);
            threeList.push(three);
          }
        })
        return threeList;
      }
    
      removeCells(threeList: Array<Array<Cell>>) {
        let removed = false;
        threeList.map(three => {
            const damageList: Array<IVector> = [];
            three.map((cell, cellIndex) => {
                closest.forEach(vc=>{
                   if (damageList.find(it=> it.x == vc.x + cell.position.x && it.y == vc.y + cell.position.y) == null){
                    damageList.push({x:vc.x + cell.position.x ,y: vc.y + cell.position.y});
                   } 
                })
                
            //if (three.length == 4 && cellIndex == 0){
            //  this.field[cell.y][cell.x] = new RocketCell({x: cell.x, y: cell.y});
            //} else {
                cell.removed = true;// = 0;
                removed = true;
            //}
            });
            damageList.forEach(it=>{
                const dm = this.objects.find(jt=> jt.position.x == it.x && jt.position.y == it.y && !jt.removed)
                if (dm){
                    dm.damage();
                }
            });
        })
        return removed;
        //this.fallCells();
        //this.addCells();
      }

    move(position: IVector, direction: IVector){
        const clicked = this.objects.find(it=> it.position.x == position.x && it.position.y == position.y && !it.removed);
        const directed = this.objects.find(it=> it.position.x == position.x + direction.x && it.position.y == position.y + direction.y && !it.removed);
        console.log(clicked.id, directed?.id)
        if (clicked && directed){
           clicked.move(directed); 
           this.onGameState();
           this.check();
        }
    }

    byCols(field: Array<Array<Cell>>) {
        const result: Array<Array<Cell>> = new Array(field[0].length).fill(null).map(it => []);
        field.forEach((row, y) => {
          row.forEach((cell, x) => {
            result[x][y] = cell;
          })
        })
        return result;
      }

    check(){
        if(this._fall()){
            setTimeout(()=>{
                this.check();
            }, 50)   
        } else {
            const field = this.getCurrentFieldMask()
            const threeListH = this._check(field);
            const threeListV = this._check(this.byCols(field))
        
            const threeList = [...threeListH, ...threeListV];
            if (this.removeCells(threeList)){
                setTimeout(()=>{
                    this.check();
                }, 500) 
            };
        };
        this.onGameState();
    }

    _fall(){
        let falling = false;
        this.objects.forEach(it=>{
            const under = this.objects.find(jt=>{
                return jt.position.x == it.position.x && jt.position.y == (it.position.y+1) && !jt.removed;
            });
            if (!under && it.position.y<9){
                if (it.fall()){
                    console.log('fall')
                    falling = true;
                };
            }
        });
        const added = this.addCells();
        return falling || added;
    }

    fall(): boolean{
        if (this._fall()){
            return this.fall();
        }
        return false;
    }

    addCells(){
        let added = false;
        new Array(10).fill(0).forEach((it, x)=>{
            const under = this.objects.find(jt=>{
                return jt.position.x == x && jt.position.y == 0 && !jt.removed;
            }); 
            if (!under){
                const cell = new Cell({x, y:-1}, Math.floor(Math.random() * 4) + 1);
                this.objects.push(cell);
                added = true
            }
        })
        return added;
    }
}