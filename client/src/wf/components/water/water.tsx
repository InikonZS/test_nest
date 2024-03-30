import React, { useContext, useEffect, useState } from "react";
import {Water as WaterModel} from "../../core/water";
import './water.css';
import { AssetsContext } from "../../assetsContext";

interface IWaterProps{
    waterModel: WaterModel;
}

export function Water({waterModel}: IWaterProps){
    const {assets} = useContext(AssetsContext);
    return <div className="wf_water_wrapper">
        <button className="wf_water_upgradeButton" onClick={()=>{
            waterModel.upgrade();
        }}>upgrade: {waterModel.upgradePrice}</button>
        <div className="wf_water" style={{backgroundImage: `url(${assets['water'+waterModel.level].objectUrl})`}}>
            {waterModel.count} / {waterModel.maxCount}
            {waterModel.count == 0 && waterModel.isReloading == false && <button onClick={()=>{
                waterModel.reload();
            }}>reload</button>}
            {waterModel.isReloading && 'reloading...'}
            {waterModel.level}
           
        </div> 
        
    </div>
}