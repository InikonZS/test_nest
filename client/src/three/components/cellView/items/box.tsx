import React from "react";
import boxh0 from '../../../imgs/box2_h0.png'
import boxh1 from '../../../imgs/box2_h1.png';
import boxh2 from '../../../imgs/box2_h2.png';
import boxh3 from '../../../imgs/box2_h3.png';
import { GameObject } from "../../../core/items/gameObject";

export function BoxView({cell}: {cell: GameObject}){
    const background = [boxh0, boxh1, boxh2, boxh3][cell.health];
    return <div className="cell-img" style={{'zIndex': 1, 'backgroundImage': 'url('+background+')'}}></div>
}