import React, { useEffect, useMemo, useState } from "react";
import './app.css';
import { Game } from "./core/game";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [selected, setSelected] = useState<string>('');
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
                    return <div className="cell" onMouseUp={()=>{
                        if (selected){
                            const bounds = game.lettersToMap().bounds
                            game.letters.push({text: selected, value: 0, y: y + bounds.top , x: x + bounds.left});
                            
                            setSelected('');
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
                        }}>{letter}</div>
                    })}
                </div> 
                <button>submit word</button>
            </div>
            
        </>
        
    )
}

