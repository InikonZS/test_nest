import React, { useEffect, useState } from "react";
import './factory.css';
import { Factory as FactoryModel} from "../../core/factory";

interface IFactoryProps{
    onClick:()=>void;
    factoryModel: FactoryModel;
}

export function Factory({onClick, factoryModel}: IFactoryProps){
    return <div className="wf_factory" onClick={onClick}>
        {factoryModel.isStarted ? 'started': 'run'}
    </div>
}