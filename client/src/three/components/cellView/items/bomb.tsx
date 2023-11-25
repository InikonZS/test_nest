import React from "react";
import bomb from '../../../imgs/bomb.png';
import { GameObject } from "../../../core/items/gameObject";

export function BombView({cell}: {cell: GameObject}){
    return <div className="cell-img" style={{'zIndex': 1, 'backgroundImage': 'url('+bomb+')'}}></div>
}