import React, { useMemo, useState } from 'react';
import {Game} from '../core/game';
import { Player } from './player';
import { BankLetter } from '../core/bankLetter';

interface ILetterPanelProps{
    game: Game;
    selected: BankLetter,
    onSelect: (letter: BankLetter)=>void;
    onFix: ()=>void;
    playerLetterMove: string;
    onPlayerLetterMove: (letter: string)=>void;
}

export function LetterPanel({game, selected, onSelect, onFix, playerLetterMove, onPlayerLetterMove}: ILetterPanelProps){
    //const [playerLetterMove, setPlayerLetterMove] = useState('');

    const score = useMemo(()=>game ? game.checkInput(game.inputLetters)?.score : 0, [JSON.stringify(game?.inputLetters)]);

    return (
        <div className="control_panel">
            <div className="row player_letters">
                {game && game.players[0].letters.map((letter, _letterIndex)=>{
                    return (letter !== selected) && <div key={letter.id} className={`${playerLetterMove == letter.id ? 'cell_player_expand' : ''}`} 
                    onMouseMove={()=>{
                        if (selected){
                            onPlayerLetterMove(letter.id);
                        }
                    }}
                    onMouseLeave={()=>{
                        if (selected){
                            onPlayerLetterMove('');
                        }
                    }}
                    onMouseEnter={()=>{
                        if (selected){
                            onPlayerLetterMove(selected.id);
                        }
                    }}
                    onMouseDown={()=>{
                        onSelect(letter);
                        onPlayerLetterMove(game.players[0].letters[_letterIndex+1]?.id || letter.id);
                    }}
                    onMouseUp={()=>{
                        if (selected){
                            game.moveOrRevertLetter(selected, _letterIndex);
                            onFix();                        
                            onSelect(null);
                            onPlayerLetterMove('');
                            
                        }}}
                    ><div className="cell cell_player">{letter.text}</div></div>
                })}
            </div> 
            <div className="controlButtons_list">
                <button className={`default_button ${!score ? 'default_button_inactive' : ''}`} onClick={()=>{
                    game.submitWord();
                    onFix();
                }}>submit {score ? score : ''}</button>
                <button className={`default_button ${!(game && game.inputLetters.length) ? 'default_button_inactive' : ''}`} onClick={()=>{
                    game.resetInput();
                    onFix();
                }}>reset</button>
                <button className={"default_button"} onClick={()=>{
                    game.scanField();
                    onFix();
                }}>scan</button>
                <button className={"default_button"} onClick={()=>{
                    game.finishBotTest();
                    onFix();
                }}>test finish</button>
            </div>
        </div>
    )
}
