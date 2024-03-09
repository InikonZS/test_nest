import React, { useContext, useEffect, useState } from "react";
import './productSlot.css';
import { AssetsContext } from "../../assetsContext";

interface IProductSlotProps {
    count: number,
    maxCount: number,
    type: string,
    onClick: ()=>void
}

export function ProductSlot({onClick, count, maxCount, type}: IProductSlotProps) {
    const {assets} = useContext(AssetsContext);
    return <div className="wf_productSlot" onClick={()=>onClick}>
        <div className="wf_productSlot_image"  style={{'background-image': `url(${assets[type]?.objectUrl || ''})`}}></div>
        <div className="wf_productSlot_counts">
            {new Array(maxCount).fill(null).map((_, index)=>{
                return <div className={`wf_productSlot_countItem ${index < count ? "wf_productSlot_countItem_filled" : ""}`}></div>
            })}
        </div>
    </div>
}