import React, { useEffect, useState } from "react";
import {Car as CarModel} from "../../core/car";
import './car.css';

interface ICarProps{
    carModel: CarModel;
}

export function Car({carModel}: ICarProps){
    return <div className="wf_car">
        {carModel.isStarted ? 'started': ''}
    </div>
}