import React from 'react';
import './gameResult.css';
import {Game} from '../../core/game';

interface IGameResultProps{
    onPlayAgain: ()=>void;
    game: Game;
}

export function GameResult({onPlayAgain, game}: IGameResultProps){
    return (
        <div className='gameResult_popup'>
            finished
            <button onClick={()=>{
                onPlayAgain();
            }}>play again</button>
        </div>
    )
}