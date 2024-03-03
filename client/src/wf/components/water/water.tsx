import React, { useEffect, useState } from "react";
import {Water as WaterModel} from "../../core/water";
import './water.css';

interface IWaterProps{
    waterModel: WaterModel;
}

export function Water({waterModel}: IWaterProps){
    return <div className="wf_water">
        {waterModel.count} / {waterModel.maxCount}
        {waterModel.count == 0 && <button onClick={()=>{
            waterModel.reload();
        }}>reload</button>}
    </div>
}