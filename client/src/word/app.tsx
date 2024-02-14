import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import './app.css';
import { Game } from "./core/game";
import { BankLetter } from "./core/bankLetter";
import { LetterPanel } from "./components/letterPanel";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [selected, setSelected] = useState<BankLetter>(null);
    const [scrollStart, setScrollStart] = useState<{x: number, y: number}>(null);
    const [scrollPos, setScrollPos] = useState<{x: number, y: number}>({x:0, y: 0});
    const [playerLetterMove, setPlayerLetterMove] = useState('');
    const [fix, setFix] = useState(0);
    const [ghostPosition, setGhostPosition] = useState<{x: number, y: number}>({x:0, y: 0});

    useEffect(()=>{
        const _game = new Game();
        setGame(_game);
        return ()=>{
            _game.destroy();
        }
    }, []);
    const letterMap = game?.lettersToMap();
    const boosterMap = game?.boosterToMap();
    const fieldScroll = useRef<HTMLDivElement>();
    return (
        <>  <div className="field_scroll" ref={fieldScroll}>
            {selected && !playerLetterMove && <div className="cell cell_ghost" style={{top: ghostPosition.y - fieldScroll.current.getBoundingClientRect().top - 15, left: ghostPosition.x - fieldScroll.current.getBoundingClientRect().left - 15}}>{selected.text}</div>}
            <div className="field_content" style={{transform: `translate(${scrollPos.x}px, ${scrollPos.y}px)`}} onMouseDown={(e)=>{
                if (!selected){
                    setScrollStart({x: e.clientX, y: e.clientY});
                }
            }}
            onMouseMove={(e)=>{
                if (scrollStart){
                    setScrollStart({x: e.clientX, y: e.clientY});
                    setScrollPos(last=> ({x: last.x + e.movementX, y: last.y + e.movementY}));
                }
                if (selected){
                    setGhostPosition({x: e.clientX, y: e.clientY});
                }
            }}
            onMouseUp={(e)=>{
                if (scrollStart){
                    setScrollStart(null);
                }
            }}
            >
                {game && letterMap && letterMap.field.map((row, y) => {
                return <div className="row">
                {row.map((cell, x) => {                            
                    const bounds = letterMap.bounds;
                    //console.log(game.inputLetters);
                    const input = game.inputLetters.find((inputLetter)=>{
                        return (inputLetter.x == (x + bounds.left)) && (inputLetter.y == (y + bounds.top));
                    });
                    if (input){
                        return <div className="cell cell_input" onMouseDown={(e)=>{
                            e.stopPropagation();
                            setSelected({id: input.id, text: input.text, value: input.value});
                            
                        }}>
                            {input.text || ''}
                        </div>
                    }
                    return <div className={`cell ${cell?.text ? 'cell_letter' : ({'-': '', '2': 'cell_2w', '1': 'cell_3l', '3': 'cell_2l', '4': 'cell_3w', 'start': 'cell_start'}[boosterMap[y][x]] || '')}`}  /*style={{backgroundColor: !cell?.text && {'-': '#fff', '2': '#9f9', '1': '#ff9', '3': '#9ff', '4': '#f99', 'start': '#f0f'}[boosterMap[y][x]]}}*/ onMouseUp={()=>{
                        if (selected){
                            game.letterToInput(selected, x, y);
                            setSelected(null);
                        }
                    }}>
                        {cell?.text || ''}
                        {<div className="cell_value">{cell?.value}</div>}
                        {!cell?.text && <div>{{'-': '', '1': '3l', '2': '2w', '3': '2l', '4': '3w', 'start': '!!!'}[boosterMap[y][x]] || ''}</div>}
                    </div>
                })}
                </div>
            })}
            </div>
            
            <div className="bottom_panel">
                <LetterPanel selected={selected} onSelect={(letter)=>setSelected(letter)} game={game} onFix={()=>setFix(last=>last+1)}></LetterPanel>
            </div>
            </div>
        </>
        
    )
}

