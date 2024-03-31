import React, { useCallback, useContext, useEffect, useState } from "react";
import './planePopup.css';
import { Game } from "../../core/game";
import { AssetsContext } from "../../assetsContext";
import { ProductSlot } from "../productSlot/productSlot";

interface IPlanePopupProps {
    onClose: () => void;
    gameModel: Game;
}

export function PlanePopup({ onClose, gameModel }: IPlanePopupProps) {
    const {assets} =  useContext(AssetsContext);
    const game = gameModel;

    const handleBuy = useCallback(()=>{
        game.plane.buy();
    }, []);

    const getAddOneHandler = (itemType: string)=>()=>{
        game.plane.addItems(itemType, 1);
    };

    const getAddManyHandler = (itemType: string)=>()=>{
        game.plane.addItems(itemType, 5);
    };

    return <div className="wf_basePopup_shade">
    <div className="wf_basePopup wf_planePopup">
        <button className="wf_basePopup_close wf_planePopup_close" onClick={onClose}>close</button>
        <div className="wf_planePopup_storePanel">
            {game.getPlaneItems().map((item, index)=>{
                return <div>
                    <div className="wf_carPopup_storageItem_img" style={{'background-image': `url(${assets[item.type].objectUrl})`}}></div>
                    <button onClick={getAddOneHandler(item.type)}>add 1</button>
                    <button onClick={getAddManyHandler(item.type)}>add 5</button>
                </div>
            })}
        </div>
        <div className="wf_planePopup_planePanel">
        <div className="wf_carPopup_slots">
                {gameModel.plane.slots.itemsAsSlots.map((slot, slotIndex)=>{
                    return <ProductSlot onClick={()=>{game.plane.slots.removeSlot(slotIndex); console.log('rm ', slotIndex)}} count={slot.filled} maxCount={10} type={slot.type}></ProductSlot>
                })}
            </div>
            
            <div className="wf_carPopup_totalSum">
                <div className="wf_icon" style={{'background-image': `url(${assets['coin'].objectUrl})`}}></div>
                <div>{game.plane.getTotalSum()}</div>
            </div>
            <button onClick={handleBuy}>buy</button>
        </div>
        
    </div>
    </div>
}