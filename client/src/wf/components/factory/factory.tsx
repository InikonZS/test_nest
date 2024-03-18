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
    const [isHover, setHover] = useState(false);
    return <div className="wf_factory_wrapper">
        <div className="wf_factory_type">{factoryModel.config.type}</div>
        <div className={`wf_car wf_car_hl ${isHover && !factoryModel.isStarted ? 'wf_car_hl_active' : ''} `} onClick={()=>{
        }} style={{backgroundImage: `url(${assets['factory'+factoryModel.level].objectUrl})`}}></div>

        <div className={`wf_factory ${factoryModel.isStarted ? 'wf_factory_working' : ''} ${factoryModel.isPaused ? 'wf_paused' : ''}`} 
            onMouseEnter={()=>{
                setHover(true);
            }}
            onMouseLeave={()=>{
                setHover(false);
            }}
            onClick={onClick} 
            style={{backgroundImage: `url(${assets['factory'+factoryModel.level].objectUrl})`}}>
            {/*<div>level:{factoryModel.level}</div>*/}
            {/*factoryModel.isStarted ? 'started' + factoryModel.progress: 'run'*/}
            
        </div>
        <div className="wf_progress_wrapper">
            <div className="wf_progress" style={{width: Math.min(100, factoryModel.progress * 10)+'%'}}>{/*factoryModel.progress*/}</div>
        </div>
        {factoryModel.level<4 && <button className="wf_factory_upgrade" onClick={(e)=>{
            e.stopPropagation();
            factoryModel.upLevel();
        }}>upgrade: {factoryModel.config.prices[factoryModel.level]}</button>}
    </div>
}