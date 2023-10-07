import {IVector} from './game';

export class GameObject{
    position: IVector;
    zIndex: number;
    id: number;
    removed: boolean = false;
    moving: boolean = false;
    activated: boolean = false;
    actionType: string = '';
    

    static lastId: number = 0;

    static getNextId(){
      GameObject.lastId++;
      return GameObject.lastId;
    }

    constructor(position: IVector){
        this.position = position;
        this.id = GameObject.getNextId();
    }

    move(directed: GameObject): boolean{
        return false
    }

    reverseMove(origin: GameObject): boolean{
        return false;
    }

    fall():boolean{
        return false;
    }

    damage(){

    }
    
    execute (objects: Array<GameObject>){

    }
}

class Cell extends GameObject{
    color: number;

    constructor(position: IVector, color: number){
        super(position);
        this.color = color;
    }

    move(directed: GameObject): boolean {
        const lastDirectedPos = directed.position;
        if (directed.reverseMove(this) && directed !== this){
            this.position = {...lastDirectedPos};
            return true;
        }
        return false;
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

    move(directed: GameObject): boolean {
        this.removed = true;
        return true;
    }

    reverseMove(origin: GameObject): boolean {
        return false;
    }

    valueOf(){
        return 6;
    }
}

class RocketCell extends GameObject{
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
                    it.removed = true;
                }
            })
        } else {
            objects.forEach(it=>{
                if (it.position.y == this.position.y){
                    
                    !it.removed && it.execute(objects);
                    it.removed = true;
                }
            })
        }
    };
}

class DiscoCell extends GameObject{
    actionType = 'ds';

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
        return 9;
    }

    fall(): boolean {
        this.position.y +=1;
        return true;
    }

    execute(objects: GameObject[]): void {
        this.removed = true;
        const color = Number(objects.find(it=>!it.removed && it.moving)) || Math.floor(Math.random() * 4) + 1;
        objects.forEach(it=>{
            if (Number(it) == color){
                it.removed = true;
            }
        })
    }
}

class BombCell extends GameObject{

    actionType: string = 'bm';

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
                it.removed = true;
                
            }
        })
    
    }
}

class BoxCell extends GameObject{
    constructor(position: IVector){
        super(position);
    }

    move(directed: GameObject): boolean{
        //this.removed = true;
        return false;
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
    moveCount: number = 0;

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

      _checkSquare(field: Array<Array<Cell>>){
        const threeList: Array<Array<Cell>> = [];
        field.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell && field[y+1]?.[x]?.color == cell.color &&
                field[y]?.[x+1]?.color == cell.color &&
                field[y+1]?.[x+1]?.color == cell.color
            ){
                threeList.push([cell, field[y+1][x], field[y][x+1], field[y+1][x+1]])
            }
          })
        })
        return threeList;
      }
    
      removeCells(threeList: Array<{type: string, cells: Array<GameObject>}>) {
        let removed = false;
        threeList.map(three => {
            const damageList: Array<IVector> = [];
            three.cells.map((cell, cellIndex) => {
                closest.forEach(vc=>{
                   if (damageList.find(it=> it.x == vc.x + cell.position.x && it.y == vc.y + cell.position.y) == null){
                    damageList.push({x:vc.x + cell.position.x ,y: vc.y + cell.position.y});
                   } 
                })
                cell.removed = true;
                removed = true;
            });
            
            damageList.forEach(it=>{
                const dm = this.objects.find(jt=> jt.position.x == it.x && jt.position.y == it.y && !jt.removed)
                if (dm){
                    dm.damage();
                }
            });
            this.createBonusCell(three);
        })
        return removed;
        //this.fallCells();
        //this.addCells();
    }

    createBonusCell(three: {type: string, cells: Array<GameObject>}){
        const initiator = three.cells.find(it=> it.moving) || three.cells[0];
        if (three.type == 'square'){
            this.objects.push(new BreakableCell({...initiator.position}));
        } else
        if (three.type == 'rocket'){
            this.objects.push(new RocketCell({...initiator.position}));
        } else
        if (three.type == 'disco'){
            this.objects.push(new DiscoCell({...initiator.position}));
        } else
        if (three.type == 'bomb'){
            this.objects.push(new BombCell({...initiator.position}));
        }
    }

    move(position: IVector, direction: IVector){
        const clicked = this.objects.find(it=> it.position.x == position.x && it.position.y == position.y && !it.removed);
        const directed = this.objects.find(it=> it.position.x == position.x + direction.x && it.position.y == position.y + direction.y && !it.removed);

        console.log(clicked.id, directed?.id)
        if (clicked && directed){
            clicked.moving = true;
            directed.moving = true;
            const moved = clicked.move(directed); 
            if (moved){
                this.moveCount ++;
            }
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
            let threeListH = this._check(field);
            let threeListV = this._check(this.byCols(field));
            
            const bombs: Array<{type: string, cells: Cell[]}> = [];
            const forRemove: Array<Array<Cell>> = [];
            threeListH.forEach(threeH=>{
                threeH.forEach(cellH=>{
                    const found = threeListV.find(threeV=>{
                        return threeV.find(cellV=>{
                            if (cellV.position.x == cellH.position.x && cellV.position.y == cellH.position.y){
                                return true;
                            }
                            return false;
                        }) !=null
                    });

                    if (found){
                        const mergedCells = [...threeH];
                        found.forEach(foundCell=>{
                            if (!mergedCells.includes(foundCell)){
                                mergedCells.push(foundCell);
                            }
                        })
                        bombs.push({
                            type: 'bomb',
                            cells: mergedCells
                        });
                        forRemove.push(threeH);
                        forRemove.push(found);
                    }
                })
            })

            threeListH = threeListH.filter(it=> !forRemove.includes(it));
            threeListV = threeListV.filter(it=> !forRemove.includes(it));

            const squares = this._checkSquare(field);
            
            const threeList = [...threeListH.map(it=> ({type: ['', '', '', '', 'rocket', 'disco', 'disco', 'disco'][it.length], cells: it})), ...threeListV.map(it=> ({type: ['', '', '', '', 'rocket', 'disco', 'disco', 'disco'][it.length], cells: it})), ...squares.map(it=> ({type: 'square', cells: it})), ...bombs];
            const removeCellsResult = this.removeCells(threeList);

            const activated = this.objects.filter(it=>it.activated && !it.removed).map(it=>({type: it.actionType, cells: [it]}));
            
            activated.forEach(it=>{
                it.cells[0].execute(this.objects);
            })

            if (removeCellsResult || activated.length){
                setTimeout(()=>{
                    this.check();
                }, 500) 
            };
        };
        this.objects.forEach(it=> it.moving = false);
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
                    it.moving = true;
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