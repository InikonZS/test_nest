import React from "react";
import rocket from '../../../imgs/rocket.png';
import rocketV from '../../../imgs/red_crystal.png';
import { GameObject } from "../../../core/items/gameObject";
import { RocketCell } from "../../../core/items/rocket";

export function RocketView({cell}: {cell: GameObject}){
    const background = [rocket,rocketV][(cell as RocketCell).directionV == true ? 1 : 0];
    return <div className="cell-img" style={{'zIndex': 1, 'backgroundImage': 'url('+background+')'}}></div>
}