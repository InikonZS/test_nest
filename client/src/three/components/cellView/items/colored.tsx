import React from "react";
import { GameObject } from "../../../core/items/gameObject";

/*
    background-color: rgba(0, 0, 0, 0);
    --posx: 2;
    --posy: 2;
    width: calc(var(--size) * 2);
    height: calc(var(--size) * 2);
    font-size: 0;
    padding: 1px;


    width: 100%;
    height: 100%;
    border: 2px solid #fff;
    border-radius: 10px;
    margin: 0px;
*/
export function ColoredView({cell}: {cell: GameObject}){
    const colors = ["#f00", "#f90", "#090", "#00f"];
    console.log('cl view')
    return <div className="cell2_inner"> {
        (() => {
          if (cell.subtiles) {
            return cell.subtiles.map((srow, sy) => {
              return srow.map((scell, sx) => {
                return scell != '-' ? <div
                  className="cell2"
                  style={{
                    'backgroundSize': 'cover',
                    'color': '#fff',
                    '--posx': sx,
                    '--posy': sy,
                    transform: cell.removed ? 'scale(0)' : ''
                  }}
                >
                    <div className="cell-img" style={{
                        'backgroundColor': colors[sy+sx*2],
                    }}>
                        cl{(cell as any).healthMap[sy][sx]}
                    </div>
                </div> : '';
              })
  
            })
          }
        })()
      }
      </div>
}