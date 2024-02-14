import React, { useState } from 'react';
import {Game} from '../core/game';
import { Player } from './player';
import { BankLetter } from '../core/bankLetter';

interface ILetterPanelProps{
    game: Game;
    selected: BankLetter,
    onSelect: (letter: BankLetter)=>void;
    onFix: ()=>void;
}

export function LetterPanel({game, selected, onSelect, onFix}: ILetterPanelProps){
    const [playerLetterMove, setPlayerLetterMove] = useState('');

    return (
        <div className="control_panel">
            <div className="row player_letters">
                {game && game.players[0].letters.map((letter, _letterIndex)=>{
                    return (letter !== selected) && <div key={letter.id} className={`${playerLetterMove == letter.id ? 'cell_player_expand' : ''}`} 
                    onMouseMove={()=>{
                        if (selected){
                            setPlayerLetterMove(letter.id);
                        }
                    }}
                    onMouseLeave={()=>{
                        if (selected){
                            setPlayerLetterMove('');
                        }
                    }}
                    onMouseDown={()=>{
                        onSelect(letter);
                        setPlayerLetterMove(game.players[0].letters[_letterIndex+1]?.id || letter.id);
                    }}
                    onMouseUp={()=>{
                        if (selected){
                            game.moveOrRevertLetter(selected, _letterIndex);
                            onFix();                        
                            onSelect(null);
                            setPlayerLetterMove('');
                            
                        }}}
                    ><div className="cell cell_player">{letter.text}</div></div>
                })}
            </div> 
            <div className="controlButtons_list">
                <button onClick={()=>{
                    game.submitWord();
                    onFix();
                }}>submit word {game ? (game.checkInput(game.inputLetters) && 'ok'): ''}</button>
                <button onClick={()=>{
                    game.resetInput();
                    onFix();
                }}>reset</button>
                <button onClick={()=>{
                    game.scanField();
                    onFix();
                }}>scan</button>
                <button onClick={()=>{
                    game.finishBotTest();
                    onFix();
                }}>test finish</button>
            </div>
        </div>
    )
}
