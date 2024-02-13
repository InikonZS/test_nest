import React, { useEffect, useMemo, useState } from "react";
import './app.css';
import { Game } from "./core/game";
import { BankLetter } from "./core/bankLetter";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [selected, setSelected] = useState<BankLetter>(null);
    const [fix, setFix] = useState(0);
    useEffect(()=>{
        const _game = new Game();
        setGame(_game);
        return ()=>{
            _game.destroy();
        }
    }, []);
    return (
        <>
            <div>
                {game && game.lettersToMap().field.map((row, y) => {
                return <div className="row">
                {row.map((cell, x) => {                            
                    const bounds = game.lettersToMap().bounds;
                    //console.log(game.inputLetters);
                    const input = game.inputLetters.find((inputLetter)=>{
                        return (inputLetter.x == (x + bounds.left)) && (inputLetter.y == (y + bounds.top));
                    });
                    if (input){
                        return <div className="cell cell_input" onMouseDown={()=>{
                            setSelected({id: input.id, text: input.text});
                        }}>
                            {input.text || ''}
                        </div>
                    }
                    return <div className={`cell ${cell?.text ? 'cell_letter' : ''}`} onMouseUp={()=>{
                        if (selected){

                            const playerLetterIndex = game.players[0].letters.findIndex(it=> it.id == selected.id);
                            if (playerLetterIndex != -1){
                                game.players[0].letters.splice(playerLetterIndex, 1);
                            } else {
                                const letterIndex = game.inputLetters.findIndex(it=> it.id == selected.id);
                                game.inputLetters.splice(letterIndex, 1);
                            }                            
                            game.inputLetters.push({id: selected.id, text: selected.text, value: 0, y: y + bounds.top , x: x + bounds.left});
                            setSelected(null);
                        }
                    }}>
                        {cell?.text || ''}
                    </div>
                })}
                </div>
            })}
            </div>
            <div>
               <div className="row">
                    {game && game.players[0].letters.map(letter=>{
                        return <div className="cell" onMouseDown={()=>{
                            setSelected(letter);
                        }}
                        onMouseUp={()=>{
                            if (selected){
    
                                const playerLetterIndex = game.players[0].letters.findIndex(it=> it.id == selected.id);
                                if (playerLetterIndex != -1){
                                    
                                } else {
                                    const letterIndex = game.inputLetters.findIndex(it=> it.id == selected.id);
                                    game.inputLetters.splice(letterIndex, 1);
                                    game.players[0].letters.push({id: selected.id, text: selected.text});
                                }                            
                    
                                setSelected(null);
                            }}}
                        >{letter.text}</div>
                    })}
                </div> 
                <button onClick={()=>{
                    game.submitWord();
                    setFix(last=>last+1);
                }}>submit word {game ? (game.checkInput(game.inputLetters) && 'ok'): ''}</button>
                <button onClick={()=>{
                    game.scanField();
                    setFix(last=>last+1);
                }}>scan</button>
                <button onClick={()=>{
                    game.finishBotTest();
                    setFix(last=>last+1);
                }}>test finish</button>
            </div>
            
        </>
        
    )
}

