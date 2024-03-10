import React, { useEffect, useState } from "react";
import {Car as CarModel} from "../../core/car";
import './car.css';

interface ICarProps{
    carModel: CarModel;
    onCarClick: ()=>void;
    onUpgradeClick: ()=> void;
}

export function Car({carModel, onUpgradeClick, onCarClick}: ICarProps){
    return <div className="wf_car" onClick={()=>{
        onCarClick();
    }}>
        car
        {carModel.isStarted ? 'started': ''}
        <button onClick={(e)=>{
            e.stopPropagation(); 
            onUpgradeClick();
        }}>upgrade</button>
    </div>
}