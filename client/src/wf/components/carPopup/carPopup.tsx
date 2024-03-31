import React, { useContext, useEffect, useState } from "react";
import './carPopup.css';
import { Game } from "../../core/game";
import {countItems} from "../../core/utils";
import { ProductSlot } from "../productSlot/productSlot";
import { AssetsContext } from "../../assetsContext";

interface ICarPopupProps {
    onClose: () => void;
    gameModel: Game;
}

export function CarPopup({ onClose, gameModel }: ICarPopupProps) {
    const {assets} =  useContext(AssetsContext);
    
    const game = gameModel;
    const storageSum = game ? countItems(game.storage.items) : {};
    const carSum = game ? countItems(game.car.items) : {};

    return <div className="wf_basePopup_shade">
    <div className="wf_basePopup wf_carPopup">
        <button className="wf_basePopup_close wf_carPopup_close" onClick={onClose}>close</button>
        <div className="wf_carPopup_storageBlock">
            <div className="wf_carPopup_storageList">
                    {Object.keys(storageSum).map(it => {
                        return <div className="wf_carPopup_storageItem">
                            <div className="wf_carPopup_storageItem_img" style={{'background-image': `url(${assets[it].objectUrl})`}}></div>
                            <div>{it} - {storageSum[it]}</div>
                            <button onClick={() => {
                                const items = game.storage.items.filter(jt => jt.type == it);
                                /*game.storage.items = game.storage.items.filter(jt => jt != items[0])
                                game.car.items.push(items[0]);*/
                                game.car.addItems([items[0]]);
                            }}>add 1</button>
                            <button onClick={() => {
                                const items = game.storage.items.filter(jt => jt.type == it);
                                //game.storage.items = game.storage.items.filter(jt => !items.includes(jt));
                                //game.car.items = [...game.car.items, ...items];
                                game.car.addItems(items);
                            }}>add all</button>
                        </div>
                    })}
                </div>
        </div>
        
        <div className="wf_carPopup_carBlock">
            <div className="wf_carPopup_carList">
                {Object.keys(carSum).map(it => {
                    return <div className="wf_carPopup_carItem">
                        <div>{it} - {carSum[it]}</div>
                        <button onClick={() => {
                        }}>remove</button>
                    </div>
                })}
            </div>
            <div className="wf_carPopup_slots">
                {gameModel.car.itemsAsSlots.map((slot, slotIndex)=>{
                    return <ProductSlot onClick={()=>{game.car.removeSlot(slotIndex); console.log('rm ', slotIndex)}} count={slot.filled} maxCount={10} type={slot.type}></ProductSlot>
                })}
            </div>
            
            <div className="wf_carPopup_totalSum">
                <div className="wf_icon" style={{'background-image': `url(${assets['coin'].objectUrl})`}}></div>
                <div>{game.car.getTotalSum()}</div>
            </div>
            <button className="wf_carPopup_sellButton" onClick={() => {
                game.car.start();
            }}>sell</button>
        </div>
    </div>
    </div>
}