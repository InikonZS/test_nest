import React, { useEffect, useMemo, useState } from "react";
import { Cell, Game, IVector } from './core/game';
import './app.css';
import './screens.css';
import {GameMenu} from './components/gameMenu/gameMenu';
import { IDragData } from './common/interfaces';


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

export function App(){
  return <GameMenu></GameMenu>
}

