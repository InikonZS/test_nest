import React from "react";

import { GameObject } from "../../../core/items/gameObject";

export function SandView({cell}: {cell: GameObject}){
    return <div className="cell-img" style={{'zIndex': 0, 'backgroundColor': '#9904'}}></div>
}