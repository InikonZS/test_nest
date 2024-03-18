import React, { useContext, useEffect, useState } from "react";
import {Car as CarModel} from "../../core/car";
import './car.css';
import { AssetsContext } from "../../assetsContext";

interface ICarProps{
    carModel: CarModel;
    onCarClick: ()=>void;
    onUpgradeClick: ()=> void;
}

export function Car({carModel, onUpgradeClick, onCarClick}: ICarProps){
    const {assets} = useContext(AssetsContext);
    const [isHover, setHover] = useState(false);
    return <div className="wf_car_wrapper">
        <div className={`wf_car wf_car_hl ${isHover ? 'wf_car_hl_active' : ''} `} onClick={()=>{
        }} style={{backgroundImage: carModel.isStarted ? '' : `url(${assets['car'+carModel.level].objectUrl})`}}></div>
        <div className="wf_car" 
            onMouseEnter={()=>{
                setHover(true);
            }}
            onMouseLeave={()=>{
                setHover(false);
            }}
            onClick={()=>{
                onCarClick();
        }} style={{backgroundImage: carModel.isStarted ? '' : `url(${assets['car'+carModel.level].objectUrl})`}}>
            {carModel.isStarted ? 'started': ''}
            <button className="wf_car_upgrade" onClick={(e)=>{
                e.stopPropagation(); 
                onUpgradeClick();
            }}>upgrade {carModel.getUpgradePrice() || ''}</button>
        </div>
    </div>
}