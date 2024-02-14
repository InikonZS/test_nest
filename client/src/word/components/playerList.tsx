import React from 'react';
import { Player } from './player';

interface IPlayerListProps{
    players: Array<any>
}

export function PlayerList({players}: IPlayerListProps){
    return (
        <div className='playerList_wrapper'>
            {players.map(player=>{
                return <Player playerData={player}></Player>
            })}
        </div>
    )
}