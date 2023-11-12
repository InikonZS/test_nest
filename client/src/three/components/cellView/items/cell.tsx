import React from "react";
import cell1 from '../../../imgs/tomato.png';//'./imgs/cell1.svg';
import cell2 from '../../../imgs/cucu.png';
import cell3 from '../../../imgs/carrot.png';
import cell4 from '../../../imgs/berries.png';
import { GameObject } from "../../../core/items/gameObject";

export function CellView({cell}: {cell: GameObject}){
    const background = [null, cell1, cell2, cell3, cell4][Number(cell)];
    return <div className="cell-img" style={{'zIndex': 1, 'backgroundImage': 'url('+background+')'}}></div>
}