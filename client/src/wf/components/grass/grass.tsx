import React, { useEffect, useState } from "react";
import './grass.css';
import { IVector } from "../../core/IVector";

interface IGrassProps{
    position: IVector;
}

export function Grass({position}: IGrassProps){
    return <div className="wf_grass" style={{left: position.x, top: position.y}}>
    </div>
}