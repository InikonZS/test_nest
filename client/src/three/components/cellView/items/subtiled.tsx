import React from "react";
import banana from '../../../imgs/banana.png';
import { GameObject } from "../../../core/items/gameObject";
import { RocketCell } from "../../../core/items/rocket";

export function SubtiledView({cell}: {cell: GameObject}){
    const backgroundColor = "#0000";
    return <div> {
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
      </div>
}