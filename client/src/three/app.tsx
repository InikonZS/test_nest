import React, { useEffect, useState } from "react";
import { Cell, Game, IVector } from './game';
import './app.css';

export function App() {
  const [game, setGame] = useState<Game>(null);
  const [tick, setTick] = useState(0);
  const [dragStart, setDragStart] = useState<{ cell: IVector, position: IVector }>(null);

  useEffect(() => {
    const _game = new Game();
    _game.onGameState = () => {
      setTick(last => last + 1);
    }
    _game.check();
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
      {game && game.field.map((row, y) => {
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
      })}
    </div>
    asdfg
    <div className="field2">
      {game && game.field.flat().filter(cell=> cell !=0).sort((a:any, b: any)=> b.id - a.id).map((cell:any ) => {
        //return <div className="row">
          //return row.map((cell: any, x) => {
            return <CellView key={cell.id} cell={cell} setDragStart={setDragStart}></CellView>
        //  })
        //</div>
      })}
    </div>
    </div>
  )
}

function CellView({setDragStart, cell}: {setDragStart: (e: { cell: IVector, position: IVector })=>void, cell: Cell}){
  const [isNew, setNew] = useState(true);
  useEffect(()=>{
    const id = requestAnimationFrame(()=>{
      setNew(false);
    })
    return ()=>{
      cancelAnimationFrame(id);
    }
  }, []);

  return <div className="cell2" style={{'backgroundColor': ['#fff', '#f00', '#00f', '#0f0', '#ff0', '#f0f'][Number(cell)], '--posx': cell.position.x, '--posy': isNew? -1: cell.position.y}} onMouseDown={(e) => {
    setDragStart({
      position: {
        x: e.clientX,
        y: e.clientY
      },
      cell: {
        x: cell.position.x, y: cell.position.y
      }
    })
  }}>{(cell as any).id}</div>
}