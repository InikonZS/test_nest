import React from "react";
import disco from '../../../imgs/disco.png';
import { GameObject } from "../../../core/items/gameObject";

export function DiscoView({cell}: {cell: GameObject}){
    return <div className="cell-img" style={{'zIndex': 1, 'backgroundImage': 'url('+disco+')'}}></div>
}