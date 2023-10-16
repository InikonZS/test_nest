import React, { useEffect, useState } from "react";
import { IVector } from './game';
import cell1 from './imgs/cell1.svg';
import cell2 from './imgs/cell2.svg';
import cell3 from './imgs/cell3.svg';
import cell4 from './imgs/cell4.svg';
import { GameObject } from "./items/gameObject";

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
    const backgroundColor = ['#fff', '#f000', '#00f0', '#0f00', '#ff00', '#f0f', '#999', '#f90', '#444', '#0ff', '#4949', '#9f99', '#2999', '#606'][Number(cell)];
  
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
                    '--posx': sx,
                    '--posy': sy,
                    transform: cell.removed ? 'scale(0)' : ''
                  }}
                >
                  {cell.health}
                </div> : '';
              })
  
            })
          }
        })()
      }
      </div>}
      {<div className="cell-img" style={{'backgroundImage': 'url('+[null, cell1, cell2, cell3, cell4][Number(cell)]+')'}}></div>}
    </div>
  }