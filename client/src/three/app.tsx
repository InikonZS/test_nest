import React, { useEffect, useState } from "react";
import { Cell, Game, IVector } from './game';
import { Game as Game2 } from './game2';
import './app.css';
import cell1 from './imgs/tomato.png';//'./imgs/cell1.svg';
import cell2 from './imgs/cucu.png';
import cell3 from './imgs/carrot.png';
import cell4 from './imgs/berries.png';
import { Field } from './field';
import { Editor } from './editor';
import { level } from "./levels/level1";
import { CellView, getCellBackground } from "./cellView";
import aniImg from './imgs/ani-test.png';

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
  const objCounts = game?.getObjectsCount();
  return (
    <div className="game-top-wrapper">
      <div className="game-top-moves">
        {'moves ' + (game && game.getMovesLeft())}
      </div>
      <div className="game-top-counters">
        {game && (game.colorsCount.map((it, ind) => <div style={{
          width: '30px',
          height: '30px', position: 'relative'
        }}><div className="cell-img" style={{ 'backgroundImage': 'url(' + [cell1, cell2, cell3, cell4][ind] + ')' }}>{it}</div></div>))}
      </div>
      <div className="game-top-counters">
        {game && (Object.keys(objCounts).map((key, ind) => <div style={{
          width: '30px',
          height: '30px', position: 'relative'
        }}><div className="cell-img" style={{ 'backgroundImage': 'url(' +  getCellBackground({
          health: 0,
          valueOf: ()=> Number(key),
          directionV: false
        }) + ')' }}>{objCounts[key]}</div></div>))}
      </div>
    </div>
  )
}

export function App(){
  return <GameMenu></GameMenu>
}

function GameMenu(){
  const [isStarted, setStarted] = useState(false);
  return <div>
    {isStarted == false && <div>
      <button onClick={()=>{
        setStarted(true);
      }}>start</button>
    </div>}
    {isStarted == true && <GameField onClose={()=>{
      setStarted(false);
    }}></GameField>}
  </div>
}

export function GameField({onClose} : {onClose:()=>void}) {
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

    <div className="ani_cell"></div>
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
      {
        game && game.checkEmptyObjectsCount() && <div>
          win
          <button onClick={()=>{
            onClose();
          }}>menu</button>
        </div>
      }
       {
        game && game.checkEmptyObjectsCount() == false && game.getMovesLeft() == 0 && <div>
          <button onClick={()=>{
            setLevelData({...levelData})
          }}>try again</button>
          <button onClick={()=>{
            onClose();
          }}>menu</button>
        </div>
      }
    </div>
    {isShowEditor && <Editor onTest={(level)=>{
      setLevelData(level);
    }}></Editor>}
    </div>
  )
}
