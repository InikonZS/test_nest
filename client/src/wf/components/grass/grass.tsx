import React, { useContext, useEffect, useState } from "react";
import './grass.css';
import { IVector } from "../../core/IVector";
import { AssetsContext } from "../../assetsContext";

interface IGrassProps{
    position: IVector;
}

export function Grass({position}: IGrassProps){
    const {assets} =  useContext(AssetsContext);

    return <div className="wf_grass" style={{left: position.x, top: position.y, backgroundImage: `url(${assets['grass0'].objectUrl})`}}>
    </div>
}