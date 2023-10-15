import {IVector} from './common/IVector';
import { GameObject } from './items/gameObject';
import { Cell } from './items/cell';
import { BoxCell } from './items/box';
import { DiscoCell } from './items/disco';
import { RocketCell } from './items/rocket';
import { BombCell } from './items/bomb';
import { BreakableCell } from './items/breakable';
import { GrassCell } from './items/grass';
import { HeliCell } from './items/heli';
import { SubtiledCell } from './items/subtiled';
import { closest } from './common/closest';
import {level} from './levels/level1';

const generateLevel = (fieldSize: IVector)=>{
    const objects: Array<GameObject> = [];
    new Array(fieldSize.y).fill(null).map((it, y) => new Array(fieldSize.x).fill(0).map((it, x) => {
        if (Math.random()<0.1){
            const cell = new BreakableCell({x, y});
            objects.push(cell);
        } else if (Math.random()<0.2){
            const cell = new GrassCell({x, y});
            objects.push(cell);
        } else {
            const cell = new Cell({x, y}, Math.floor(Math.random() * 4) + 1);
            objects.push(cell);
        }
    }));
    return objects;
}

function generateLevel1(){
    const objects: Array<GameObject> = [];
    level.objects.forEach(it=>{
        if (it.type == 5){
            const obj = new BoxCell(it.position);
            objects.push(obj);
        }
        if (it.type == 13){
            const obj = new SubtiledCell(it.position);
            objects.push(obj);
        }
    });
    level.field.forEach((row, y)=>{
        row.forEach((cell, x)=>{
            if (cell == '+' && objects.find(it=>it.checkPos({x, y})) == undefined){
                const cell = new Cell({x, y}, Math.floor(Math.random() * 4) + 1);
                objects.push(cell); 
            }
        });
    });
    return objects
}

export class Game{
    objects: GameObject[] = [];
    onGameState: () => void;
    moveCount: number = 0;
    fieldSize = {x:10, y:10};
    field: Array<Array<string>>;

    constructor(){
        //this.objects = generateLevel(this.fieldSize);
        this.objects = generateLevel1();
        this.field = level.field;
    }

    getCurrentFieldMask(){
        const fieldMask: Array<Array<Cell>> = new Array(this.fieldSize.y).fill(null).map(it=>new Array(this.fieldSize.x).fill(null));
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
                //damageList.push({x:cell.position.x, y:cell.position.y});
                closest.forEach(vc=>{
                   if (damageList.find(it=> it.x == vc.x + cell.position.x && it.y == vc.y + cell.position.y) == null){
                    damageList.push({x:vc.x + cell.position.x ,y: vc.y + cell.position.y});
                   } 
                })
                cell.removed = true;
                removed = true;
            });
            
            damageList.forEach(pos=>{
                //const dm = this.objects.find(jt=> jt.position.x == it.x && jt.position.y == it.y && !jt.removed)
                const dm = this.objects.filter(jt=> /*jt.position.x == it.x && jt.position.y == it.y &&*/ !jt.removed);
                dm.forEach(it=>{
                    //it.damage();
                    it.damagePos(pos);
                })
                //if (dm){
                //    dm.damage();
                //}
            });
            three.cells.forEach(cellObj=>{
                const dm = this.objects.filter(jt=> /*jt.position.x == it.position.x && jt.position.y == it.position.y &&*/ !jt.removed);
                dm.forEach(it=>{
                    it.damagePos(cellObj.position, 'a');
                })
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
            this.objects.push(new HeliCell({...initiator.position}));
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

    findByPosNotBack(position: IVector){
        //return this.objects.find(it=> it.position.x == position.x && it.position.y == position.y && !it.removed && !it.background)
        return this.objects.find(it=> it.checkPos(position))
    }

    cleanRemoved(){
        this.objects = this.objects.filter(it=>!it.removed);
    }

    move(position: IVector, direction: IVector){
        this.cleanRemoved();
        const clicked = this.findByPosNotBack(position);
        const directed = this.findByPosNotBack({x: position.x + direction.x, y: position.y + direction.y});

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

    checkPos(pos:IVector){
        return this.objects.find(jt=>{
            return jt.checkPos(pos);
        });
    }

    getUnder(it: IVector){
        let underPosition = it.y + 1;
        while (this.field[underPosition]?.[it.x]!='+'){
            if (underPosition>=this.fieldSize.y){
                return true;
            }
            const under = this.objects.find(jt=>{
                return jt.checkPos({x: it.x, y: underPosition});//jt.position.x == it.x && jt.position.y == (underPosition) && !jt.removed && !jt.background;
            });
            if (under){
            return under;}
            underPosition++;
            
        }
        const under = this.objects.find(jt=>{
            return jt.checkPos({x: it.x, y: underPosition});//jt.position.x == it.x && jt.position.y == (underPosition) && !jt.removed && !jt.background;
        });
        return under;
    }

    _fall(){
        let falling = false;
        [...this.objects].sort((a, b)=> b.position.y - a.position.y).forEach(it=>{
            const under = this.getUnder(it.position);
            /*const under  /*this.getUnder({x: x, y: -1});= this.objects.find(jt=>{
                return jt.position.x == it.position.x && jt.position.y == (it.position.y+1) && !jt.removed && !jt.background;
            }); */
            /*if (it.position.y == -1 && under){
                console.log('err');
            }*/
            if (!under && it.position.y<this.fieldSize.y -1){
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
        new Array(this.fieldSize.x).fill(0).forEach((it, x)=>{
            const under = this.getUnder({x: x, y: -1});//*= this.objects.find(jt=>{
              /*  return jt.position.x == x && jt.position.y == 0 && !jt.removed && !jt.background;
            }); */
            const t = this.objects.find(jt=>{
                return jt.position.x == x && jt.position.y == -1 && !jt.removed && !jt.background;
            });
            if (!under /*&& !t*/){
                const cell = new Cell({x, y:-1}, Math.floor(Math.random() * 4) + 1);
                this.objects.push(cell);
                /*const under1 = this.getUnder({x: x, y: -1});
                if (under1){
                    throw new Error();
                }*/
                added = true
            }
        })
        return added;
    }
}