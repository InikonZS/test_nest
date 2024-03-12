import React, { useContext, useEffect, useRef, useState } from "react";
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

interface IGameScreenProps{
    gameModel: Game;
    onCarPopupShow: ()=>void;
    onPlanePopupShow: ()=>void;
}

export function GameScreen({gameModel, onCarPopupShow, onPlanePopupShow}: IGameScreenProps){
    const centralZoneRef = useRef<HTMLDivElement>(null);
    const centralRect = centralZoneRef.current?.getBoundingClientRect();
    const animalsZoneRef = useRef<HTMLDivElement>(null);
    const animalsRect = animalsZoneRef.current?.getBoundingClientRect();

    const storageRef = useRef<HTMLDivElement>(null);
    const storageRect = storageRef.current?.getBoundingClientRect();
    const storagePos = storageRect && centralRect ? {x: storageRect.left - centralRect.left + storageRect.width/2, y: storageRect.top - centralRect.top + storageRect.height/2} : {x:0, y: 0};
    
    const getMotionPath = (start: IVector)=>{
        const startPos = animalsRect ? {x: start.x + animalsRect.left - centralRect.left, y: start.y - animalsRect.top + centralRect.top}: {x:0, y: 0};
        const centralPos = {x: centralRect.width/2, y: centralRect.height/2};//{x: (storagePos.x - startPos.x + 14) / 2 + startPos.x + Math.random() * 60 - 30, y: (storagePos.y  - startPos.y + 14) /2 + startPos.y + Math.random() * 60 - 30};
        //console.log(startPos, centralPos, storagePos);
        return `path("M${startPos.x + 14},${startPos.y + 14} Q${Math.floor(centralPos.x)},${Math.floor(centralPos.y)} ${Math.floor(storagePos.x)},${Math.floor(storagePos.y)}")`;
    }
    const {assets} =  useContext(AssetsContext);
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
            <div>money: {gameModel.money}</div>
            <div className="wf_movingCar">
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
                return <Animal animalData={animal}></Animal>
            })}
            {gameModel.items.map(item=>{
                return <Collectable itemData= {item} onCollect={()=>{gameModel.collect(item)}}></Collectable>
            })}
            {gameModel.grass.map(item=>{
                return <Grass position={item.position}></Grass>
            })}
            </div>
            {
                gameModel.getAvailableFactories().map((slot, slotIndex)=>{
                    const foundFactory = gameModel.factories[slotIndex];
                    const slotVarians = gameModel.getAvailableFactories()[slotIndex];
                    return <div className={`wf_factorySlot wf_factorySlot_${slotIndex + 1}`}>
                        factory{slotIndex + 1}
                        {foundFactory ? <Factory factoryModel={foundFactory} onClick={()=>{
                            gameModel.startFactory(foundFactory)
                        }}></Factory> : ''}
                        {slotVarians.map(variant=>{
                            return <button onClick={()=>{
                                gameModel.createFactory(variant, slotIndex);
                            }}>{variant} {factories[variant].prices[0]}</button>
                        })}
                    </div>
                })
            }
            <div className={`wf_factorySlot wf_waterSlot`}>water
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
                {gameModel.flyingItems.map((item)=>{ return <div key={item.startPos.x+'_'+item.startPos.y} className={`wf_collectable wf_flying_item wf_flying_item_${item.pathType}`} style={{offsetPath: getMotionPath(item.startPos), 'background-image': `url(${assets[item.type].objectUrl})`}}></div>})}
            </div>
        </div>
        <div className="wf_missions">
            missions
            {gameModel.missionTasks.map(mission=>{
                return <div>
                    {mission.type+' - '}
                    {!mission.isCompleted ? (mission.current +' / '+ mission.count) : 'ok'}
                </div>
            })}
        </div>
    </div>
}