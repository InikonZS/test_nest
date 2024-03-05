import React, { useEffect, useState } from "react";
import './planePopup.css';
import { Game } from "../../core/game";

interface IPlanePopupProps {
    onClose: () => void;
    gameModel: Game;
}

export function PlanePopup({ onClose, gameModel }: IPlanePopupProps) {
    const game = gameModel;
    return <div className="wf_basePopup wf_planePopup">
        <button className="wf_basePopup_close wf_planePopup_close" onClick={onClose}>close</button>
    </div>
}