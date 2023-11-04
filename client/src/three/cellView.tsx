import React, { useEffect, useState } from "react";
import { IVector } from './game';
import cell1 from './imgs/tomato.png';//'./imgs/cell1.svg';
import cell2 from './imgs/cucu.png';
import cell3 from './imgs/carrot.png';
import cell4 from './imgs/berries.png';
import boxh0 from './imgs/box2_h0.png'
import boxh1 from './imgs/box2_h1.png';
import boxh2 from './imgs/box2_h2.png';
import boxh3 from './imgs/box2_h3.png';
import grassh1 from './imgs/grass_h2.png';
import grassh2 from './imgs/grass_h1.png';
import bomb from './imgs/bomb.png';
import rocket from './imgs/rocket.png';
import rocketV from './imgs/red_crystal.png';
import heli from './imgs/heli.png';
import disco from './imgs/disco.png';
import banana from './imgs/banana.png';
import { GameObject } from "./items/gameObject";

export function getCellBackground(cell: GameObject | {health: number, directionV?: boolean, valueOf: ()=>number}){
  return [null, cell1, cell2, cell3, cell4, [boxh0, boxh1, boxh2, boxh3][cell.health], null, [rocket,rocketV][(cell as any).directionV == true ? 1 : 0], bomb, disco, grassh1, grassh2, heli][Number(cell)];
}

export function CellView({setDragStart, cell, isTo, isFrom}: {setDragStart: (e: { cell: IVector, position: IVector })=>void, cell: GameObject, isTo?: boolean, isFrom?: boolean}){
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
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
      setDragStart({
        position: {
          x: e.clientX,
          y: e.clientY
        },
        cell: {
          x: cell.position.x, y: cell.position.y
        }
      });
    }
  
    const cellClassName = `cell2 ${isFrom ? 'cell2_from' : ''} ${isTo ? 'cell2_to' : ''}`;
    const backgroundColor = "#0000"//['#fff', '#f000', '#00f0', '#0f00', '#ff00', '#f0f', '#999', '#f90', '#444', '#0ff', '#4949', '#9f99', '#2999', '#606'][Number(cell)];
  
    return <div 
      className={cellClassName} 
      style={{
        'backgroundColor': cell.subtiles ? '#0000' : backgroundColor, 
        '--posx': cell.position.x, 
        '--posy': isNew? -1: cell.position.y, 
        transform: cell.removed?'scale(0)':'', 
        border: Number(cell) == 13 ? '0':''
      }} 
      onMouseDown={handleMouseMove}
    >
      {false && (cell as any).id}
      {true && ((cell as any).health || '')}
      {<div> {
        (() => {
          if (cell.subtiles) {
            return cell.subtiles.map((srow, sy) => {
              return srow.map((scell, sx) => {
                return scell != '-' ? <div
                  className="cell2"
                  style={{
                    'backgroundColor': backgroundColor,
                    'backgroundImage': `url(${banana})`,
                    'backgroundSize': 'cover',
                    'color': '#fff',
                    '--posx': sx,
                    '--posy': sy,
                    transform: cell.removed ? 'scale(0)' : ''
                  }}
                >
                  {/*cell.health*/}
                  {(cell as any).healthMap[sy][sx]}
                </div> : '';
              })
  
            })
          }
        })()
      }
      </div>}
      {<div className="cell-img" style={{'zIndex': [10, 11].includes(Number(cell)) ? 0: 1, 'backgroundImage': 'url('+getCellBackground(cell)+')'}}></div>}
    </div>
  }