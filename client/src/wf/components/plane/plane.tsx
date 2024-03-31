import React, { useEffect, useState } from "react";
import {Plane as PlaneModel} from "../../core/plane";
import './plane.css';

interface IPlaneProps{
    planeModel: PlaneModel;
    onPlaneClick: ()=>void;
}

export function Plane({planeModel, onPlaneClick}: IPlaneProps){
    return <div className="wf_plane_wrapper">
        <div className="wf_plane" onClick={onPlaneClick}>
            {'plane'}
            {planeModel.isStarted ? 'started': ''}
            {planeModel.level}
        </div>
        <button onClick={()=>planeModel.upgrade()}>upgrade: {planeModel.upgradePrice}</button>
    </div>
}