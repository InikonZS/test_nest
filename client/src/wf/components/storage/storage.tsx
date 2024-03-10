import React, { useContext, useEffect, useState } from "react";
import {Storage as StorageModel} from "../../core/storage";
import './storage.css';
import { AssetsContext } from "../../assetsContext";

interface IStorageProps{
    storageModel: StorageModel;
}

export function Storage({storageModel}: IStorageProps){
    const {assets} =  useContext(AssetsContext);
    return <div className="wf_storage">
        {storageModel.items.map(item=>{
            return <div className="wf_storage_item" style={{'background-image': `url(${assets[item.type].objectUrl})`}}></div>
        })}
    </div>
}