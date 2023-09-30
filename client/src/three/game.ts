export interface IVector {
  x: number,
  y: number
}

type IField = Array<Array<number | Cell>>;

export class Cell{
  colorIndex: number;
  position: IVector;
  id: number;
  static lastId: number = 0;
  static getNextId(){
    Cell.lastId++;
    return Cell.lastId;
  }
  
  constructor(colorIndex: number, position: IVector){
    this.colorIndex = colorIndex;
    this.position = position
    this.id = Cell.getNextId();
  }

  valueOf(){
    return this.colorIndex;
  }

  toString(){
    return this.colorIndex;
  }

  handleClick(pos: IVector, field: IField){

  }
}

class RocketCell extends Cell{
  constructor(position: IVector){
    super(5, position);
  }

  handleClick(pos: IVector, field: IField){
    field[pos.y].forEach((it, i, row)=>{
      row[i] = 0;
    })
  }
}

export class Game {
  field: IField;
  onGameState: () => void;

  constructor() {
    this.field = new Array(10).fill(null).map((it, y) => new Array(10).fill(0).map((it, x) => new Cell(this.randomColor(), {x, y}) ));
  }

  randomColor(){
    return Math.floor(Math.random() * 4) + 1
  }

  move(position: IVector, direction: IVector) {
    const cell = this.field[position.y][position.x];
    this.field[position.y][position.x] = this.field[position.y + direction.y][position.x + direction.x];
    this.field[position.y + direction.y][position.x + direction.x] = cell;
    const cell2 = this.field[position.y][position.x]
    if (cell instanceof Cell){
      cell.position = {x: position.x + direction.x, y: position.y + direction.y};
    }
    if (cell2 instanceof Cell){
      cell2.position = {x: position.x, y: position.y};
    }
    this.onGameState();
    setTimeout(()=>{
      if (cell instanceof Cell){
        cell.handleClick({x:position.x + direction.x, y:position.y + direction.y}, this.field);
        this.fallCells();
        this.addCells();
        this.check();
        this.onGameState();
      }
    }, 500);  
  }

  check() {
    const threeListH = this._check(this.field);
    const threeListV = this._check(this.byCols()).map(it => it.map(v => ({
      x: v.y,
      y: v.x
    })));

    const threeList = [...threeListH, ...threeListV];
    console.log(threeList);
    if(threeList.length) {
      this.removeCells(threeList);
      this.onGameState();
      setTimeout(() => {
        this.check();
      }, 500)
    }    
  }

  _check(field: IField) {
    const threeList: Array<Array<IVector>> = [];
    field.forEach((row, y) => {
      let three: Array<IVector> = [];
      let lastColor: number | Cell = -1;
      row.forEach((cell, x) => {
        if (Number(lastColor) != Number(cell)) {
          if (three.length >= 3) {           
            threeList.push(three);
          }
          three = [];
        } /*else {
          console.log(cell);*/
          if(cell != 0) {
            three.push({ x, y });
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

  removeCells(threeList: Array<Array<IVector>>) {
    threeList.map(three => three.map((cell, cellIndex) => {
      if (three.length == 4 && cellIndex == 0){
        this.field[cell.y][cell.x] = new RocketCell({x: cell.x, y: cell.y});
      } else {
        this.field[cell.y][cell.x] = 0;
      }
    }))
    this.fallCells();
    this.addCells();
  }

  fallCells(){
    const cols = this.byCols();
    const sorted = cols.map(col => [...col].sort((a,b)=> a==0 ? - 1 : 1));
    sorted.forEach((col, x) => col.forEach((cell, y) => {
      this.field[y][x] = cell;
      if (cell instanceof Cell){
        cell.position = {x, y};
      }
    }))
  }

  addCells(){
    let added = false;
    this.field.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell == 0){
          added = true;
          this.field[y][x] = new Cell(this.randomColor(), {x, y});
        }
      })
    })
    return added;
  }

  byCols() {
    const result: IField = new Array(this.field[0].length).fill(null).map(it => []);
    this.field.forEach((row, y) => {
      row.forEach((cell, x) => {
        result[x][y] = cell;
      })
    })
    return result;
  }
}