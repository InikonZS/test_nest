export interface IVector {
  x: number,
  y: number
}

export class Game {
  field: Array<Array<number>>;
  onGameState: () => void;

  constructor() {
    this.field = new Array(10).fill(null).map(it => new Array(10).fill(0).map(it => Math.floor(Math.random() * 4) + 1));
  }

  move(position: IVector, direction: IVector) {
    const cell = this.field[position.y][position.x];
    this.field[position.y][position.x] = this.field[position.y + direction.y][position.x + direction.x];
    this.field[position.y + direction.y][position.x + direction.x] = cell;
    this.check();
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

  _check(field: Array<Array<number>>) {
    const threeList: Array<Array<IVector>> = [];
    field.forEach((row, y) => {
      let three: Array<IVector> = [];
      let lastColor = -1;
      row.forEach((cell, x) => {
        if (lastColor != cell) {
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
    threeList.map(three => three.map(cell => {
      this.field[cell.y][cell.x] = 0;
    }))
    const cols = this.byCols();
    const sorted = cols.map(col => [...col].sort((a,b)=> a==0 ? - 1 : 1));
    sorted.forEach((col, x) => col.forEach((cell, y) => {
      this.field[y][x] = cell;
    }))
  }

  byCols() {
    const result: Array<Array<number>> = new Array(this.field[0].length).fill(null).map(it => []);
    this.field.forEach((row, y) => {
      row.forEach((cell, x) => {
        result[x][y] = cell;
      })
    })
    return result;
  }
}