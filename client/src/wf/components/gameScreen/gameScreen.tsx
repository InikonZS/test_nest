import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import './gameScreen.css';
import { Game } from "../../core/game";
import { Animal } from "../animal/animal";
import { Collectable } from "../collectable/collectable";
import { Factory } from "../factory/factory";
import { Water } from "../water/water";
import { Car } from "../car/car";
import { Storage } from "../storage/storage";
import { CarPopup } from "../carPopup/carPopup";
import { Grass } from "../grass/grass";
import { factories } from "../../core/factory";
import { IVector } from "../../core/IVector";
import { AssetsContext } from "../../assetsContext";
import { MoneyIndicator } from "./moneyIndicator";

interface IGameScreenProps{
    gameModel: Game;
    onCarPopupShow: ()=>void;
    onPlanePopupShow: ()=>void;
    onClose: ()=>void;
}

export function GameScreen({gameModel, onCarPopupShow, onPlanePopupShow, onClose}: IGameScreenProps){
    const centralZoneRef = useRef<HTMLDivElement>(null);
    const centralRect = useMemo(()=>centralZoneRef.current?.getBoundingClientRect(), [centralZoneRef.current]);
    const animalsZoneRef = useRef<HTMLDivElement>(null);
    const animalsRect = useMemo(()=>animalsZoneRef.current?.getBoundingClientRect(), [animalsZoneRef.current]);

    const posFromRef = (el: HTMLDivElement)=>{
        const elRect = el?.getBoundingClientRect();
        const elPos = elRect && centralRect ? {x: elRect.left - centralRect.left + elRect.width/2, y: elRect.top - centralRect.top + elRect.height/2} : {x:0, y: 0};
        return elPos;
    }

    const storageRef = useRef<HTMLDivElement>(null);
    const slotRefs = gameModel.factoriesSlots.map((_, slotIndex)=>{
        return useRef<HTMLDivElement>(null);
    });
    const posMap = useMemo(()=>{
        const slotsMap: Record<string, IVector> = {};
        slotRefs.forEach((slot, index)=>{
            slotsMap['f_'+index] = posFromRef(slot.current);
        })
        const _posMap: Record<string, IVector> = {
            storage: posFromRef(storageRef.current),
            ...slotsMap
        }
        console.log('posMap update', _posMap);
        return _posMap;
    }, [centralZoneRef.current, animalsZoneRef.current, ...slotRefs.map(it=>it.current)]);
    
    //console.log(posMap);
    const getMotionPath = (_start: IVector | string, _end: IVector| string)=>{
        const start = typeof _start != 'string' ? _start : {x: posMap[_start].x - (animalsRect.left - centralRect.left + 14), y: posMap[_start].y - (animalsRect.top - centralRect.top + 14)};
        const end = typeof _end != 'string' ? _end : posMap[_end];
        const startPos = animalsRect ? {x: start.x + animalsRect.left - centralRect.left, y: start.y - animalsRect.top + centralRect.top}: {x:0, y: 0};
        const centralPos = {x: centralRect.width/2, y: centralRect.height/2};//{x: (storagePos.x - startPos.x + 14) / 2 + startPos.x + Math.random() * 60 - 30, y: (storagePos.y  - startPos.y + 14) /2 + startPos.y + Math.random() * 60 - 30};
        //console.log(startPos, centralPos, storagePos);
        return `path("M${startPos.x + 14},${startPos.y + 14} Q${Math.floor(centralPos.x)},${Math.floor(centralPos.y)} ${Math.floor(end.x)},${Math.floor(end.y)}")`;
    }
    const {assets} =  useContext(AssetsContext);
   
    const formatTime = (time: number)=>{
        const timeObj = new Date(time);
        const timeString = `${timeObj.getUTCMinutes()} : ${timeObj.getUTCSeconds()}`;
        return timeString;
    }
    
    //console.log(motionPath);
    return <div className="wf_gameScreen">
        <div className="wf_animalsPanel">
            {
                Object.keys(gameModel.availableAnimals).map((id: keyof typeof gameModel.availableAnimals)=>{
                    return <div className={`wf_addAnimal_item ${gameModel.checkSum(gameModel.availableAnimals[id].price) ? '' : 'wf_addAnimal_item_disabled'}`} onClick={()=>{
                        gameModel.addAnimal(id);
                    }}>
                        <div> add {id}</div> 
                        <div> price: {gameModel.availableAnimals[id].price}</div>
                    </div>
                })
            }
        </div>
        <div className="wf_movingPanel">
            <MoneyIndicator money={gameModel.money}/>
            <div className={`wf_movingCar ${gameModel.plane.isStarted ? 'wf_movingCar_active':''} wf_plane`} style={{animationDuration: /*gameModel.plane.getConfigByLevel().time*/1000 + 'ms'}}>
                pln
            </div>
            <div className={`wf_movingCar ${gameModel.car.isStarted ? 'wf_movingCar_active':''}`} style={{animationDuration: gameModel.car.getConfigByLevel().time + 'ms'}}>
                car
            </div>
        </div>
        <div ref={centralZoneRef} className="wf_centralZone">
            <div ref={animalsZoneRef} className="wf_animalsZone" onClick={(e)=>{
                if ((e.target as HTMLElement).className == 'wf_animalsZone'){
                   gameModel.makeGrass(e.nativeEvent.offsetX, e.nativeEvent.offsetY); 
                }
                
            }}>
            {gameModel.animals.map(animal=>{
                return <Animal key={animal.id} animalData={animal}></Animal>
            })}
            {gameModel.items.map(item=>{
                return <Collectable key={item.id} itemData= {item} onCollect={()=>{gameModel.collect(item)}}></Collectable>
            })}
            {gameModel.grass.map(item=>{
                return <Grass position={item.position}></Grass>
            })}
            </div>
            {
                gameModel.getAvailableFactories().map((slot, slotIndex)=>{
                    const foundFactory = gameModel.factories[slotIndex];
                    const slotVarians = gameModel.getAvailableFactories()[slotIndex];
                    return <div ref={slotRefs[slotIndex]} className={`wf_factorySlot wf_factorySlot_${slotIndex + 1}`}>
                        {/*factory{slotIndex + 1}*/}
                        {foundFactory ? <Factory factoryModel={foundFactory} onClick={()=>{
                            gameModel.startFactory(foundFactory)
                        }}></Factory> : ''}
                        <div className={`wf_factory_buildButtons ${slotIndex>2 ? 'wf_factory_buildButtons_right':''}`}>
                            {slotVarians.map(variant=>{
                                return <button className={`wf_factory_buildButton`} onClick={()=>{
                                    gameModel.createFactory(variant, slotIndex);
                                }}>{variant} {factories[variant].prices[0]}</button>
                            })}
                        </div>
                    </div>
                })
            }
            <div className={`wf_factorySlot wf_waterSlot`}>
                {/*water*/}
                <Water waterModel={gameModel.water}></Water>
            </div>
            <div className={`wf_factorySlot wf_carSlot`} >
                <Car carModel={gameModel.car} 
                onCarClick={()=>{
                    onCarPopupShow();
                }} 
                onUpgradeClick={()=>{
                    gameModel.car.upgrade();
                }}></Car>
            </div>
            <div className={`wf_factorySlot wf_planeSlot`} onClick={()=>{
                onPlanePopupShow();
            }}>plane
            </div>
            <div ref={storageRef} className={`wf_factorySlot wf_storageSlot`}>
                <Storage storageModel={gameModel.storage}></Storage>
            </div>
            <div className="wf_flying_container">
                {gameModel.flyingItems.map((item)=>{ console.log(item.delay); return <div key={item.flyingId} className={`wf_collectable wf_flying_item wf_flying_item_${item.pathType}`} style={{offsetPath: getMotionPath(item.startPos, item.endPos), 'animation-delay': item.delay*100+'ms', 'background-image': `url(${assets[item.type].objectUrl})`}}></div>})}
            </div>
        </div>
        <div className="wf_missions_container">
            <button onClick={()=>gameModel.isPaused ? gameModel.resume() : gameModel.pause()}>{gameModel.isPaused ? 'resume' : 'pause'}</button>
            <button onClick={onClose}>close</button>
            <div>{formatTime(gameModel.time)}</div>
            <div>{gameModel.getTimeLimitIndex() <gameModel.timeLimits.length ? formatTime(gameModel.timeLimits[gameModel.getTimeLimitIndex()] * 1000): ' - '} ind:{gameModel.getTimeLimitIndex()}</div>
            missions
        <div className="wf_missions">
            {gameModel.missionTasks.map(mission=>{
                return <div className={`wf_missionItem ${mission.isCompleted ? 'wf_missionItem_complete' : ''}`}>
                    {mission.type+' - '}
                    {!mission.isCompleted ? (mission.current +' / '+ mission.count) : 'ok'}
                </div>
            })}
        </div>
        </div>
    </div>
}