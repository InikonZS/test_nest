import React from "react";
import { getCellBackground } from "../cellView/cellView";
import { Game } from "../../core/game2";
import cell1 from '../../imgs/tomato.png';//'./imgs/cell1.svg';
import cell2 from '../../imgs/cucu.png';
import cell3 from '../../imgs/carrot.png';
import cell4 from '../../imgs/berries.png';

export function TopPanel({game}: {game:Game}) {
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