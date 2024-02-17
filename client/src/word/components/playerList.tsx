import React from 'react';
import { Player } from './player';
import './playerList.css';
import { Player as PlayerData} from '../core/player';

interface IPlayerListProps{
    players: Array<PlayerData>,
    currentPlayerIndex: number
}

export function PlayerList({players, currentPlayerIndex}: IPlayerListProps){
    return (
        <div className='playerList_wrapper'>
            {players.map((player, index)=>{
                return <Player playerData={player} isCurrent={index == currentPlayerIndex}></Player>
            })}
        </div>
    )
}