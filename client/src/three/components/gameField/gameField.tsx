import React, { useState, useEffect, useRef } from "react";
import { CellView } from "../cellView/cellView";
import { Field } from "./field";
import { FailScreen } from "../failScreen/failScreen";
import { WinScreen } from "../winScreen/winScreen";
import { IDragData } from "../../common/interfaces";
import { Game } from "../../core/game2";
import { TopPanel } from "./topPanel";
import { SideMenu } from "./sideMenu";

export function GameField({onClose, levelData} : {onClose:()=>void, levelData: any}) {
    //const [levelData, setLevelData] = useState(level);
    const [game, setGame] = useState<Game>(null);
    const [tick, setTick] = useState(0);
    const [dragStart, setDragStart] = useState<IDragData>(null);
    const gameWrapper = useRef<HTMLDivElement>();
    const [cellSize, setCellSize] = useState(30);
    const [sideMenu, setSideMenu] = useState(false);

    useEffect(()=>{
      const handler = ()=>{
        const bounds = gameWrapper.current?.getBoundingClientRect();
        const minSize = Math.min(bounds.width, bounds.height);
        setCellSize(minSize / 10 || 30);
      }
      window.addEventListener('resize', handler);
      handler();
      return ()=>{
        window.removeEventListener('resize', handler);
      }
    }, [gameWrapper.current]);
  
  
    const startLevel = ()=>{
      const _game = new Game(levelData);
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
      {false && <div className="ani_cell"></div>}
      <TopPanel game={game} onSideMenu={()=>{
        setSideMenu(last=>!last);
      }}></TopPanel>
      {sideMenu && <SideMenu
        onMenu = {()=>{
          onClose();
        }}
        onClose={()=>{
          setSideMenu(false);
        }}
      ></SideMenu>} 
      <div ref={gameWrapper} className="game_wrapper" style={{'--size': cellSize + 'px'}}>
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
      <div>
        bottom panel
      </div>
      </div>
    )
  }