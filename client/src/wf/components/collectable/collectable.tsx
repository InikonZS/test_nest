import React, { useEffect, useState } from "react";
import './collectable.css';
import {Collectable as CollectableModel} from "../../core/collectable";

interface ICollectableProps{
    itemData: CollectableModel;
    onCollect: ()=>void;
}

const colors = {
    'egg0': '#090',
    'egg1': '#f90',
    'egg2': '#f9f'
}

export function Collectable({itemData, onCollect}: ICollectableProps){
    return <div className="wf_collectable"
    onClick={onCollect}
    style={{left: itemData.position.x, top: itemData.position.y, 'background-color': colors[itemData.type as keyof typeof colors]}}
    >
        B
    </div>
}