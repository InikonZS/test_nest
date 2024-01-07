import React from "react";

import { GameObject } from "../../../core/items/gameObject";

export function WaterView({cell}: {cell: GameObject}){
    return <div className="cell-img" style={{'zIndex': 0, 'backgroundColor': '#00f4'}}></div>
}