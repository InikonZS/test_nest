import React, { useEffect, useMemo, useRef, useState } from "react";
import './wheel.css';
import { SpinDigit, SpinNumber } from './spinDigit';

export function Wheel(){
    const [rotateAngle, setRotateAngle] = useState(0);
    return <div className="wheel_section" >
        <div className="wheel_rotate" style={{transform:`rotate(${rotateAngle}deg)`}} onClick={()=>{
            setRotateAngle(last=> last + 360 * 5 + 18);
        }}>
            
        </div>
        <div className="wheel_text_container">
            <div className="wheel_text wheel_text_1">
                spin
            </div>
            <div className="wheel_text wheel_text_0">
                spin
            </div>
        </div>

        <div className="wheel_text_container">
            <div className="wheel_text wheel_text_3">
                wheel
            </div>
            <div className="wheel_text wheel_text_2">
                wheel
            </div>
        </div>
        <SpinNumber value={2345}></SpinNumber>
    </div>
}