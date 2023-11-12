import React from "react";
import grassh1 from '../../../imgs/grass_h2.png';
import grassh2 from '../../../imgs/grass_h1.png';
import { GameObject } from "../../../core/items/gameObject";

export function GrassView({cell}: {cell: GameObject}){
    const background = Number(cell) == 10 ? grassh1 : grassh2;
    return <div className="cell-img" style={{'zIndex': 0, 'backgroundImage': 'url('+background+')'}}></div>
}