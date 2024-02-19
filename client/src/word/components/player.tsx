import React from 'react';
import './player.css';
import { Player as PlayerData} from '../core/player';

interface IPlayerProps{
    playerData: PlayerData;
    isCurrent: boolean;
}

export function Player({playerData, isCurrent}: IPlayerProps){
    return (
        <div className={`player_wrapper ${isCurrent? 'player_wrapper_current': ''}`}>
            <div className='player_ava'>{playerData.ava}</div>
            <div>
                <div className='player_name'>{playerData.name}</div>
                <div className='player_score'><span style={{'font-size': '10px'}}>score: </span>{playerData.score}</div>
                {playerData.isLastMove && <div className=''>last move</div>}
                {playerData.isFinished && <div className=''>finished</div>} 
            </div>
            
        </div>
    )
}