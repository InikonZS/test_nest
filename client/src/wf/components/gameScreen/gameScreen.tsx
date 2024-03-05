import React, { useEffect, useState } from "react";
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

interface IGameScreenProps{
    gameModel: Game;
    onCarPopupShow: ()=>void;
    onPlanePopupShow: ()=>void;
}

export function GameScreen({gameModel, onCarPopupShow, onPlanePopupShow}: IGameScreenProps){
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
        <div className="wf_centralZone">
            <div className="wf_animalsZone" onClick={(e)=>{
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
                [1,2,3,4,5,6].map((it, i)=>{
                    return <div className={`wf_factorySlot wf_factorySlot_${it}`}>
                        factory{it}
                        {gameModel.factories[i] ? <Factory factoryModel={gameModel.factories[i]} onClick={()=>{
                            gameModel.startFactory(gameModel.factories[i])
                        }}></Factory> : ''}
                    </div>
                })
            }
            <div className={`wf_factorySlot wf_waterSlot`}>water
                <Water waterModel={gameModel.water}></Water>
            </div>
            <div className={`wf_factorySlot wf_carSlot`} onClick={()=>{
                onCarPopupShow();
            }}>car 
                <Car carModel={gameModel.car}></Car>
            </div>
            <div className={`wf_factorySlot wf_planeSlot`} onClick={()=>{
                onPlanePopupShow();
            }}>plane
            </div>
            <div className={`wf_factorySlot wf_storageSlot`}>
                storage
                <Storage storageModel={gameModel.storage}></Storage>
            </div>
        </div>
        
    </div>
}