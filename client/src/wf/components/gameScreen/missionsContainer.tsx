import React, { useContext } from "react"
import { Game } from "../../core/game"
import { formatTime } from "../../core/utils";
import "./missionsContainer.css"
import { AssetsContext } from "../../assetsContext";

interface IMissionsContainerProps{
    gameModel: Game;
    onClose: ()=>void;
}

export function MissionsContainer({gameModel, onClose}: IMissionsContainerProps){
    const timeIndex = gameModel.getTimeLimitIndex();
    const timeLimit = timeIndex < gameModel.timeLimits.length ? formatTime(gameModel.timeLimits[timeIndex] * 1000): ' - ';
    const {assets} =  useContext(AssetsContext);
    
    return <div className="wf_missions_container">
        <div>
            <button onClick={()=>{
                gameModel.isPaused ? gameModel.resume() : gameModel.pause()
            }}>
                {gameModel.isPaused ? 'resume' : 'pause'}
            </button> 
            <button onClick={onClose}>close</button>
        </div>
        
        <div>{formatTime(gameModel.time)}</div>
        <div>{timeLimit + 'ind: ' + timeIndex}</div>
        missions
        <div className="wf_missions">
            {gameModel.missionTasks.map(mission=>{
                return <div className={`wf_missionItem ${mission.isCompleted ? 'wf_missionItem_complete' : ''}`}>
                    {/*mission.type*/}
                    <div className="wf_missionItem_img" style={{backgroundImage: `url(${assets[mission.type]?.objectUrl})`}}></div>
                    <div className="wf_missionItem_value">{!mission.isCompleted ? (mission.current +' / '+ mission.count) : 'ok'}</div>
                    {mission.isCompleted && <div className="wf_missionItem_ok" style={{backgroundImage: `url(${assets['ok'].objectUrl})`}}></div>}
                </div>
            })}
        </div>
    </div>
}