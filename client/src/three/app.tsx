import React, { useEffect, useState } from "react";
import { Cell, Game, IVector } from './game';
import { Game as Game2 } from './game2';
import './app.css';
import cell1 from './imgs/cell1.svg';
import cell2 from './imgs/cell2.svg';
import cell3 from './imgs/cell3.svg';
import cell4 from './imgs/cell4.svg';
import { Field } from './field';
import { Editor } from './editor';
console.log(cell1)

export function App() {
  const [game, setGame] = useState<Game2>(null);
  const [tick, setTick] = useState(0);
  const [dragStart, setDragStart] = useState<{ cell: IVector, position: IVector }>(null);

  useEffect(() => {
    const _game = new Game2();
    _game.onGameState = () => {
      setTick(last => last + 1);
    }
    //_game.check();
    setGame(_game);
  }, []);

  useEffect(() => {
    if (!dragStart) return;
    const handleUp = (e: MouseEvent) => {
      const offset = {
        x: e.clientX - dragStart.position.x,
        y: e.clientY - dragStart.position.y
      }
      const direction = {
        x: Math.abs(offset.x) > Math.abs(offset.y) ? Math.sign(offset.x) : 0,
        y: Math.abs(offset.y) > Math.abs(offset.x) ? Math.sign(offset.y) : 0
      }
      game.move(dragStart.cell, direction);
      setDragStart(null);
    }
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
    }
  }, [dragStart]);

  return (
    <div>
    <div className="field">
      {/*game && game.field.map((row, y) => {
        return <div className="row">
          {row.map((cell: Cell, x) => {
            return <div className="cell" style={{'backgroundColor': ['#fff', '#f00', '#00f', '#0f0', '#ff0', '#f0f'][Number(cell)]}} onMouseDown={(e) => {
              setDragStart({
                position: {
                  x: e.clientX,
                  y: e.clientY
                },
                cell: {
                  x, y
                }
              })
            }}>{cell.toString()}</div>
          })}
        </div>
      })*/}
    </div>
    asdfg
    <div className="game_wrapper">
      {game && game.field && <Field data={game.field}></Field>}
      <div className="field2">
        {game && game.moveCount}
        {/*game && game.field.flat()*/game && game.objects./*filter(cell=> !cell.removed).*/sort((a:any, b: any)=> b.id - a.id).map((cell:any ) => {
          //return <div className="row">
            //return row.map((cell: any, x) => {
              return <CellView key={cell.id} cell={cell} setDragStart={setDragStart}></CellView>
          //  })
          //</div>
        })}
      </div>
      
    </div>
    <Editor></Editor>
    </div>
  )
}

export function CellView({setDragStart, cell}: {setDragStart: (e: { cell: IVector, position: IVector })=>void, cell: Cell}){
  const [isNew, setNew] = useState(true);
  useEffect(()=>{
    const id = requestAnimationFrame(()=>{
      setNew(false);
    })
    return ()=>{
      cancelAnimationFrame(id);
    }
  }, []);
  if (cell.removed){
   // console.log('removed');
  }
  return <div className="cell2" style={{'backgroundColor': ['#fff', '#f000', '#00f0', '#0f00', '#ff00', '#f0f', '#999', '#f90', '#444', '#0ff', '#4949', '#9f99', '#2999'][Number(cell)], '--posx': cell.position.x, '--posy': isNew? -1: cell.position.y, transform: cell.removed?'scale(0)':''}} onMouseDown={(e) => {
    setDragStart({
      position: {
        x: e.clientX,
        y: e.clientY
      },
      cell: {
        x: cell.position.x, y: cell.position.y
      }
    })
  }}>
    {false && (cell as any).id}
    {true && ((cell as any).health || '')}
    {<div className="cell-img" style={{'backgroundImage': 'url('+[null, cell1, cell2, cell3, cell4][Number(cell)]+')'}}></div>}
  </div>
}