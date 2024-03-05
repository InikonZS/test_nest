import React, { useEffect, useState } from "react";
import './factory.css';
import { Factory as FactoryModel} from "../../core/factory";

interface IFactoryProps{
    onClick:()=>void;
    factoryModel: FactoryModel;
}

export function Factory({onClick, factoryModel}: IFactoryProps){
    return <div className="wf_factory" onClick={onClick}>
        <div>level:{factoryModel.level}</div>
        {factoryModel.isStarted ? 'started': 'run'}
        <div onClick={(e)=>{
            e.stopPropagation();
            factoryModel.upLevel();
        }}>upgrade: {factoryModel.config.prices[factoryModel.level]}</div>
    </div>
}