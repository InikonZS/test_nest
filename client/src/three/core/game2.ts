import {IVector} from '../common/IVector';
import { GameObject } from './items/gameObject';
import { Cell } from './items/cell';
import { BoxCell } from './items/box';
import { DiscoCell } from './items/disco';
import { RocketCell } from './items/rocket';
import { BombCell } from './items/bomb';
import { BreakableCell } from './items/breakable';
import { GrassCell } from './items/grass';
import { HeliCell } from './items/heli';
import { HeliBombCell } from './items/heliBomb';
import { SubtiledCell } from './items/subtiled';
import { closest } from '../common/closest';
import {level} from '../levels/level1';
import { createGameObject } from './objectFactory';
import {getTransformedPatterns, patterns} from './helpPattern';
import { SandCell } from './items/sand';

const generateLevel = (game: Game, fieldSize: IVector)=>{
    const objects: Array<GameObject> = [];
    new Array(fieldSize.y).fill(null).map((it, y) => new Array(fieldSize.x).fill(0).map((it, x) => {
        if (Math.random()<0.1){
            const cell = new BreakableCell(game, {x, y});
            objects.push(cell);
        } else if (Math.random()<0.2){
            const cell = new GrassCell(game, {x, y});
            objects.push(cell);
        } else {
            const cell = new Cell(game, {x, y}, Math.floor(Math.random() * 4) + 1);
            objects.push(cell);
        }
    }));
    return objects;
}

function generateLevel1(game: Game, level: {field: Array<Array<string>>, objects: Array<any>, sand: boolean}){
    const objects: Array<GameObject> = [];
    level.objects.forEach(it=>{
        try {
            const obj = createGameObject(game, it.type, it.position);
            objects.push(obj);
        } catch (e){
            console.log('Wrong obj type');
        }
    });
    level.field.forEach((row, y)=>{
        row.forEach((cell, x)=>{
            if (cell == '+' && objects.find(it=>it.checkPos({x, y})) == undefined){
                const cell = new Cell(game, {x, y}, Math.floor(Math.random() * 4) + 1);
                objects.push(cell); 
                if (level.sand){
                    const cell1 = new SandCell(game, {x, y});
                    objects.push(cell1); 
                }
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
    colorsCount: Array<number> = [0, 0, 0, 0];
    hint: {
        moveFrom: GameObject,
        moveTo: GameObject
    } = null;
    hintTimer: ReturnType<typeof setTimeout> = null;
    maxMoves: number;

    constructor(levelData: any){
        //this.objects = generateLevel(this.fieldSize);
        this.objects = generateLevel1(this, levelData);
        this.field = levelData.field;//level.field;
        this.fieldSize = {x: this.field[0].length, y: this.field.length}
        this.maxMoves = levelData.moves || 30;
        this.checkStart();
        this.colorsCount = [0, 0, 0, 0];
    }

    getObjectsCount(){
        const count: Record<string, number> = {};
        this.objects.forEach(obj=>{
            const type = Number(obj).toString();
            if (!['0', '1', '2', '3', '4', '7', '8', '9', '12'].includes(type) && !obj.removed){
                count[type] = count[type] ? count[type] + 1 : 1;
            }
        })
        return count;
    }

    checkEmptyObjectsCount(){
        const objects = this.getObjectsCount();
        if (Object.keys(objects).length == 0){
            return true;
        }
        return false;
    }

    getMovesLeft(){
        return this.maxMoves - this.moveCount;
    }

    getCurrentFieldMask(){
        const fieldMask: Array<Array<Cell>> = new Array(this.fieldSize.y).fill(null).map(it=>new Array(this.fieldSize.x).fill(null));
        this.objects.forEach(it=>{
            if (it instanceof Cell && !it.removed && it.position.y > -1){
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
            //this.colorsCount[Number(three.cells[0])-1]+=three.cells.length;
            const damageList: Array<IVector & {color: number}> = [];
            three.cells.map((cell, cellIndex) => {
                //damageList.push({x:cell.position.x, y:cell.position.y});
                closest.forEach(vc=>{
                   if (damageList.find(it=> it.x == vc.x + cell.position.x && it.y == vc.y + cell.position.y) == null){
                    damageList.push({x:vc.x + cell.position.x ,y: vc.y + cell.position.y, color: Number(cell)});
                   } 
                })
                //cell.removed = true;
                cell.remove();
                removed = true;
            });
            
            damageList.forEach(pos=>{
                //const dm = this.objects.find(jt=> jt.position.x == it.x && jt.position.y == it.y && !jt.removed)
                const dm = this.objects.filter(jt=> /*jt.position.x == it.x && jt.position.y == it.y &&*/ !jt.removed);
                dm.forEach(it=>{
                    //it.damage();
                    it.damagePos(pos, pos.color.toString());
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
            this.objects.push(new HeliCell(this, {...initiator.position}));
        } else
        if (three.type == 'rocket'){
            this.objects.push(new RocketCell(this, {...initiator.position}));
        } else
        if (three.type == 'disco'){
            this.objects.push(new DiscoCell(this, {...initiator.position}));
        } else
        if (three.type == 'bomb'){
            this.objects.push(new BombCell(this, {...initiator.position}));
        }
    }

    findByPosNotBack(position: IVector){
        //return this.objects.find(it=> it.position.x == position.x && it.position.y == position.y && !it.removed && !it.background)
        return this.objects.find(it=> it.checkPos(position))
    }

    cleanRemoved(){
        this.objects = this.objects.filter(it=>!it.removed);
    }

    updateHintTimer(){
        if (this.hintTimer){
            this.hint = null;
            clearTimeout(this.hintTimer);
            this.hintTimer = null
        }
        this.hintTimer = setTimeout(()=>{
            const move = this.findMove();
            this.hint = move;
            this.onGameState();
        }, 5000)
    }

    move(position: IVector, direction: IVector){
        this.updateHintTimer();
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
            this.checkMoveCombo(clicked, directed);
            this.onGameState();
            this.check();
        }
    }

    checkMoveCombo(clicked: GameObject, directed: GameObject){
        if(Number(clicked) == 12 && Number(directed) == 7) {
            //heli-rocket
            
        }
        if(Number(clicked) == 12 && Number(directed) == 12) {
            //heli-heli
        }
        if((Number(clicked) == 12 && Number(directed) == 8) || (Number(clicked) == 8 && Number(directed) == 12)) {
            //heli-bomb
            clicked.remove();
            directed.remove();
            const heliBomb = new HeliBombCell(this, directed.position);
            heliBomb.execute(this.objects);
        }
        //disco 9
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

    removeCellsStart(threeList: Array<{type: string, cells: Array<GameObject>}>){
        let removed = false;
        threeList.map(three => {
            three.cells.map((cell, cellIndex) => {
                cell.remove();
                removed = true;
            });
        });
        return removed;
    }
    
    checkStart(){
        if(this._fall()){
            this.checkStart();
        } else {
            const field = this.getCurrentFieldMask()
            let threeListH = this._check(field);
            let threeListV = this._check(this.byCols(field));
            const squares = this._checkSquare(field);
            const threeList = [...threeListH.map(it=> ({type: '', cells: it})), ...threeListV.map(it=> ({type: '', cells: it})), ...squares.map(it=> ({type: '', cells: it}))];
            const removeCellsResult = this.removeCellsStart(threeList);
            if (removeCellsResult){
                this.checkStart();
            };
        }
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
            
            const toTypeList = (list: Array<Array<Cell>>)=>{
                return list.map(it=> ({
                    type: ['', '', '', '', 'rocket', 'disco', 'disco', 'disco'][it.length], 
                    cells: it
                }));
            }

            const threeList = [
                ...toTypeList(threeListH),
                ...toTypeList(threeListV),
                ...squares.map(it=> ({type: 'square', cells: it})), 
                ...bombs
            ];
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
        this.objects.forEach(it=> it.afterTurn?.());
        this.onGameState();
    }

    checkPos(pos:IVector){
        return this.objects.find(jt=>{
            return jt.checkPos(pos);
        });
    }

    getPosObjects(pos:IVector){
        return this.objects.filter(jt=>{
            return jt.position.x == pos.x && jt.position.y == pos.y;
        })
    }

    inField(pos:IVector){
        return this.field[pos.y]?.[pos.x]=='+';
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
                const cell = new Cell(this, {x, y:-1}, Math.floor(Math.random() * 4) + 1);
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

    findMove(){
        const priorityPatterns = [patterns.disco, patterns.bomb, patterns.rocket, patterns.heli, patterns.rowThree];
        let foundMove: {
            moveFrom: GameObject,
            moveTo: GameObject
        } = null;
        const foundPattern = priorityPatterns.find(currentPatternList=>{
            const res = this._findMoveByBasePatterns(currentPatternList);
            foundMove = res;
            return res;
        });
        console.log('found pattern list', foundPattern)
        return foundMove;
    }

    _findMoveByBasePatterns(basePatterns: Array<Array<string>>){
        const transformedPatterns = basePatterns.map(pattern => getTransformedPatterns(pattern)).flat(1);
        console.log(transformedPatterns);
        let foundMove: {
            moveFrom: GameObject,
            moveTo: GameObject
        } = null;
        const foundPattern = transformedPatterns.find(currentPattern=>{
            const res = this._findMoveByPattern(currentPattern);
            foundMove = res;
            return res;
        });
        console.log('found pattern', foundPattern)
        return foundMove;
    }

    _findMoveByPattern(currentPattern: Array<string>){
        let foundMove: {
            moveFrom: GameObject,
            moveTo: GameObject
        } = null;
        const foundColor = [1,2,3,4].find(color=>{
            const res = this._findMoveByColorAndPattern(color, currentPattern);
            foundMove = res;
            return res;
        });
        return foundMove;
    }

    _findMoveByColorAndPattern(color:number, currentPattern: Array<string>){
        console.log('find move');
        const mask = this.getCurrentFieldMask();
        console.log(mask, currentPattern, color);
        //const color = 1;
        //const currentPattern = patterns.heli[0];

        let moveFrom: GameObject = null;
        let moveTo: GameObject = null;
        let isFound = false;

        const isFoundMove = mask.find((maskRow, maskY)=>{
            return maskRow.find((maskCell, maskX)=>{

                //moveFrom = null;
                //moveTo = null;
                const isFailedCompare = currentPattern.find((ptRow, ptY)=>{
                    return ptRow.split('').find((ptCell, ptX)=>{
                        //console.log(ptCell)
                        if (ptCell == 'F'){
                            moveFrom = mask[maskY+ptY]?.[maskX+ptX];
                            if (!moveFrom){
                                console.log('rmf')
                                return true;
                            }
                        }
                        if (ptCell == 'T'){
                            moveTo = mask[maskY+ptY]?.[maskX+ptX];
                            if (!moveTo){
                                console.log('rmt')
                                return true;
                            }
                        }
                        if (ptCell == '+' || ptCell == 'F'){
                            return Number(mask[maskY+ptY]?.[maskX+ptX]) != color
                        }
                    });
                }) != undefined;
                if (!isFailedCompare){
                    console.log('success move found', moveFrom, moveTo);
                    isFound = true;
                    return true;
                }
                return false;
            }) !== undefined;
        }) !== undefined; //bug, use isFound;
        
        if (isFound){
            const foundMove = {
                moveFrom,
                moveTo
            }
            console.log('found move', foundMove);
            return foundMove;
        }
        console.log('not found move');
        return null;
    }

    destroy(){
        if (this.hintTimer){
            clearTimeout(this.hintTimer);
            this.hintTimer = null;
        }
    }
}