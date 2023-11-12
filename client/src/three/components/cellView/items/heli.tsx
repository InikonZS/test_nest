import React from "react";
import heli from '../../../imgs/heli.png';
import { GameObject } from "../../../core/items/gameObject";

export function HeliView({cell}: {cell: GameObject}){
    return <div className="cell-img" style={{'zIndex': 1, 'backgroundImage': 'url('+heli+')'}}></div>
}