import React, { useEffect, useState } from "react";
import {Plane as PlaneModel} from "../../core/plane";
import './car.css';

interface IPlaneProps{
    planeModel: PlaneModel;
}

export function Plane({planeModel}: IPlaneProps){
    return <div className="wf_car">
        {planeModel.isStarted ? 'started': ''}
    </div>
}