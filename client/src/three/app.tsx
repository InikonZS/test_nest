import React, { useEffect, useMemo, useState } from "react";
import { Cell, Game, IVector } from './game';
import { Game as Game2 } from './game2';
import './app.css';
import './screens.css';
import cell1 from './imgs/tomato.png';//'./imgs/cell1.svg';
import cell2 from './imgs/cucu.png';
import cell3 from './imgs/carrot.png';
import cell4 from './imgs/berries.png';
import { Field } from './field';
import { Editor } from './editor';
import { level } from "./levels/level1";
import { level as level2 } from "./levels/level2";
import { CellView, getCellBackground } from "./cellView";
import aniImg from './imgs/ani-test.png';
import {WinScreen} from './components/winScreen/winScreen';
import {FailScreen} from './components/failScreen/failScreen';

const levels = [level, level2];

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
  const [levelList, setLevelList] = useState(levels);
  const [editorLevel, setEditorLevel] = useState(null);
  //const [isStarted, setStarted] = useState(false);
  const [startedLevel, setStartedLevel] = useState<number | null>(null);
  const [isShowEditor, setShowEditor] = useState(false);
  const startedLevelData = useMemo(()=>{
    if (startedLevel === null){
      return null
    }
    if (editorLevel && startedLevel == -1){
      return editorLevel;
    }
    return levelList[startedLevel]
  }, [startedLevel, levelList, editorLevel]);
  return <div className="base_screen">

        <button onClick={()=>{
      setShowEditor((last)=> !last)
    }}>{isShowEditor ? 'hide editor' : 'show editor'}</button>
    { !startedLevelData && <div>
    {
      levelList.map((level, index)=>{
        return <div>
          <button onClick={()=>{
            setStartedLevel(index);
          }
            
          }>{index + 1}</button>
        </div>
      })
    }
    </div>
  }
    {/*isStarted == false && <div>
      <button onClick={()=>{
        setStarted(true);
      }}>start</button>
    </div>*/}
    {startedLevelData !== null && <GameField levelData={startedLevelData} onClose={()=>{
      //setStarted(false);
      setStartedLevel(null);
    }}></GameField>}
      {isShowEditor && <Editor onTest={(level)=>{
      setEditorLevel(level);
      setStartedLevel(-1);
    }}></Editor>}
    
  </div>
}

export function GameField({onClose, levelData} : {onClose:()=>void, levelData: any}) {
  //const [levelData, setLevelData] = useState(level);
  const [game, setGame] = useState<Game2>(null);
  const [tick, setTick] = useState(0);
  const [dragStart, setDragStart] = useState<IDragData>(null);


  const startLevel = ()=>{
    const _game = new Game2(levelData);
    _game.onGameState = () => {
      setTick(last => last + 1);
    }
    //_game.check();
    setGame(_game);
  }

  useEffect(() => {
    startLevel();
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
    <div className="base_screen">
    <div className="ani_cell"></div>
    <TopPanel game={game}></TopPanel>
    <button onClick={()=>{
            onClose();
          }}>menu</button>
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
        game && game.checkEmptyObjectsCount() && <WinScreen onMenu={onClose}></WinScreen>
      }
      {
        game && game.checkEmptyObjectsCount() == false && game.getMovesLeft() == 0 && <FailScreen onMenu={onClose} onRestart={startLevel}></FailScreen>
      }
    </div>
    </div>
  )
}
