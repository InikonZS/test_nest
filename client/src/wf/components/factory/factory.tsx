import React, { useContext, useEffect, useState } from "react";
import './factory.css';
import { Factory as FactoryModel} from "../../core/factory";
import { AssetsContext } from "../../assetsContext";

interface IFactoryProps{
    onClick:()=>void;
    factoryModel: FactoryModel;
}

export function Factory({onClick, factoryModel}: IFactoryProps){
    const {assets} = useContext(AssetsContext);
    return <div className={`wf_factory ${factoryModel.isStarted ? 'wf_factory_working' : ''}`} onClick={onClick} style={{backgroundImage: `url(${assets['factory_egg0'].objectUrl})`}}>
        <div>level:{factoryModel.level}</div>
        {factoryModel.isStarted ? 'started' + factoryModel.progress: 'run'}
        <div onClick={(e)=>{
            e.stopPropagation();
            factoryModel.upLevel();
        }}>upgrade: {factoryModel.config.prices[factoryModel.level]}</div>
    </div>
}