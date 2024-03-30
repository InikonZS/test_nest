
import React from "react"
import { Game } from "../../core/game"
import { MoneyIndicator } from "./moneyIndicator";
import "./movingPanel.css"

interface IMovingPanelProps{
    gameModel: Game;
}

export function MovingPanel({gameModel}: IMovingPanelProps){
    return <div className="wf_movingPanel">
        <MoneyIndicator money={gameModel.money}/>
        <div className={`wf_movingCar ${gameModel.plane.isStarted ? 'wf_movingCar_active':''} wf_movingPlane`} style={{animationDuration: gameModel.plane.time + 'ms'}}>
            pln
        </div>
        <div className={`wf_movingCar ${gameModel.car.isStarted ? 'wf_movingCar_active':''}`} style={{animationDuration: gameModel.car.getConfigByLevel().time + 'ms'}}>
            car
        </div>
    </div>
}