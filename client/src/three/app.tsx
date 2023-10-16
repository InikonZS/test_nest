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
import { GameObject } from "./items/gameObject";
import { level } from "./levels/level1";
console.log(cell1)

interface IDragData { 
  cell: IVector, 
  position: IVector 
}

function game1Field({game, setDragStart}: {game:Game, setDragStart: (data: IDragData)=>void}){
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
}

function TopPanel({game}: {game:Game2}) {
  return (
    <div className="game-top-wrapper">
      <div className="game-top-moves">
        {'moves ' + (game && game.moveCount)}
      </div>
      <div className="game-top-counters">
        {game && (game.colorsCount.map((it, ind) => <div style={{
          width: '30px',
          height: '30px', position: 'relative'
        }}><div className="cell-img" style={{ 'backgroundImage': 'url(' + [cell1, cell2, cell3, cell4][ind] + ')' }}>{it}</div></div>))}
      </div>
    </div>
  )
}

export function App() {
  const [levelData, setLevelData] = useState(level);
  const [game, setGame] = useState<Game2>(null);
  const [tick, setTick] = useState(0);
  const [dragStart, setDragStart] = useState<IDragData>(null);
  const [isShowEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const _game = new Game2(levelData);
    _game.onGameState = () => {
      setTick(last => last + 1);
    }
    //_game.check();
    setGame(_game);
  }, [levelData]);

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
    <button onClick={()=>{
      setShowEditor((last)=> !last)
    }}>{isShowEditor ? 'hide editor' : 'show editor'}</button>

    <TopPanel game={game}></TopPanel>
    <div className="game_wrapper">
      {game && game.field && <Field data={game.field}></Field>}
      
      <div className="field2">
        {game && game.objects.sort((a:any, b: any)=> b.id - a.id).map((cell:any ) => {
          return <CellView 
            key={cell.id} 
            cell={cell}
            setDragStart={setDragStart} 
            isTo={cell == game.hint?.moveTo} 
            isFrom={cell == game.hint?.moveFrom}
          ></CellView>
        })}
      </div>
      
    </div>
    {isShowEditor && <Editor onTest={(level)=>{
      setLevelData(level);
    }}></Editor>}
    </div>
  )
}

export function CellView({setDragStart, cell, isTo, isFrom}: {setDragStart: (e: { cell: IVector, position: IVector })=>void, cell: Cell, isTo?: boolean, isFrom?: boolean}){
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
  return <div className={`cell2 ${isFrom?'cell2_from':''} ${isTo?'cell2_to':''}`} style={{'backgroundColor': ['#fff', '#f000', '#00f0', '#0f00', '#ff00', '#f0f', '#999', '#f90', '#444', '#0ff', '#4949', '#9f99', '#2999', '#0000'][Number(cell)], '--posx': cell.position.x, '--posy': isNew? -1: cell.position.y, transform: cell.removed?'scale(0)':'', border: Number(cell) == 13 ? '0':''}} onMouseDown={(e) => {
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
    {<div> {(()=>{
      const cl = (cell as any as GameObject);
      if (cl.subtiles){
        return cl.subtiles.map((srow, sy)=>{
          return srow.map((scell, sx) =>{
            return scell != '-' ? <div className="cell2" style={{'backgroundColor': ['#fff', '#f000', '#00f0', '#0f00', '#ff00', '#f0f', '#999', '#f90', '#444', '#0ff', '#4949', '#9f99', '#2999', '#606'][Number(cell)], '--posx': sx , '--posy': sy, transform: cell.removed?'scale(0)':''}}>{cl.health}</div> : '';
          })
          
        })
      }
    })()}</div>}
    {<div className="cell-img" style={{'backgroundImage': 'url('+[null, cell1, cell2, cell3, cell4][Number(cell)]+')'}}></div>}
  </div>
}