import React, { useCallback, useContext, useEffect, useState } from "react";
import './winPopup.css';
import { Game } from "../../core/game";
import { AssetsContext } from "../../assetsContext";

interface IWinPopupProps {
    onClose: () => void;
    gameModel: Game;
}

export function WinPopup({ onClose, gameModel }: IWinPopupProps) {
    const {assets} =  useContext(AssetsContext);
    const game = gameModel;

    const formatTime = (time: number)=>{
        const timeObj = new Date(time);
        const timeString = `${timeObj.getUTCMinutes()} : ${timeObj.getUTCSeconds()}`;
        return timeString;
    }

    const handleClose = useCallback(()=>{
        onClose();
    }, []);

    return <div className="wf_basePopup wf_winPopup">
        <div className="wf_winPopup_header">win</div>
        <div>your time: {formatTime(gameModel.time)}</div>
        <div>ind: {gameModel.getTimeLimitIndex()}</div>
        <button onClick={handleClose}>close</button>
    </div>
}