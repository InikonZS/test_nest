import React from 'react';
import './player.css';

interface IPlayerProps{
    playerData: Array<any>
}

export function Player({playerData}: IPlayerProps){
    return (
        <div className='player_wrapper'>
            <div className='player_ava'>ava</div>
            <div className='player_name'>name</div>
            <div className='player_score'>2300</div>
        </div>
    )
}