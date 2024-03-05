import React, { useEffect, useState } from "react";
import './productSlot.css';

interface IProductSlotProps {
    count: number,
    maxCount: number,
    onClick: ()=>void
}

export function ProductSlot({onClick, count, maxCount}: IProductSlotProps) {
    return <div className="wf_productSlot" onClick={()=>onClick}>
        <div className="wf_productSlot_image"></div>
        <div className="wf_productSlot_counts">
            {new Array(maxCount).fill(null).map((_, index)=>{
                return <div className={`wf_productSlot_countItem ${index < count ? "wf_productSlot_countItem_filled" : ""}`}></div>
            })}
        </div>
    </div>
}