import React, { useContext, useEffect, useState } from "react";
import './collectable.css';
import {Collectable as CollectableModel} from "../../core/collectable";
import { AssetsContext } from "../../assetsContext";

interface ICollectableProps{
    itemData: CollectableModel;
    onCollect: ()=>void;
}

export function Collectable({itemData, onCollect}: ICollectableProps){
    const {assets} =  useContext(AssetsContext);
    return <div className="wf_collectable"
    onClick={onCollect}
    style={{left: itemData.position.x, top: itemData.position.y, 'background-image': `url(${assets[itemData.type].objectUrl})`}}
    >
    </div>
}