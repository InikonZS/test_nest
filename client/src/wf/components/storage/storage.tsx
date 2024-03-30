import React, { useContext, useEffect, useMemo, useState } from "react";
import {Storage as StorageModel} from "../../core/storage";
import './storage.css';
import { AssetsContext } from "../../assetsContext";
import { countItems } from "../../core/utils";
import { collectables } from "../../core/collectable";

interface IStorageProps{
    storageModel: StorageModel;
}

export function Storage({storageModel}: IStorageProps){
    const {assets} =  useContext(AssetsContext);
    const displayedSlots = 35;
    const k = displayedSlots / storageModel.maxCount;
    const count = countItems(storageModel.items);
    const slotForDraw: Array<string> = [];
    Object.keys(count).forEach(it=>{
        const slots = Math.floor(count[it] * collectables[it as keyof typeof collectables].size * k) || 1;
        for (let i = 0; i< slots; i++){
            slotForDraw.push(it);
        }
    });
    return <div className="wf_storage_back" style={{'background-image': `url(${assets['storage'+storageModel.level].objectUrl})`}}>
        <div className="wf_storage">
            {/*storageModel.items.map(item=>{
                return <div className="wf_storage_item" style={{'background-image': `url(${assets[item.type].objectUrl})`}}></div>
            })*/}
            {slotForDraw.map(item=>{
                return <div className="wf_storage_item" style={{'background-image': `url(${assets[item].objectUrl})`}}></div>
            })}
        </div>
        <button onClick={()=>storageModel.upgrade()}>upgrade {storageModel.upgradePrice}</button>
    </div>
}