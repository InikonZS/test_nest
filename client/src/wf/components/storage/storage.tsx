import React, { useEffect, useState } from "react";
import {Storage as StorageModel} from "../../core/storage";
import './storage.css';

interface IStorageProps{
    storageModel: StorageModel;
}

const colors = {
    'egg0': '#090',
    'egg1': '#f90',
    'egg2': '#f9f'
}

export function Storage({storageModel}: IStorageProps){
    return <div className="wf_storage">
        {storageModel.items.map(item=>{
            return <div className="wf_storage_item" style={{'background-color': colors[item.type as keyof typeof colors]}}>C</div>
        })}
    </div>
}