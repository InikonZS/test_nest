import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import './app.css';
import { Game, IBoostedWord } from "./core/game";
import { BankLetter } from "./core/bankLetter";
import { LetterPanel } from "./components/letterPanel";
import { LetterList } from "./components/letterList";
import { LetterListOpenButton } from "./components/letterListOpenButton";
import { PlayerList } from "./components/playerList";
import { FieldLetter } from "./core/fieldLetter";
import { WordResult } from "./components/wordResult/wordResult";
import { IGameOptions } from "./core/interfaces";
import { OptionsPopup } from "./components/optionsPopup/optionsPopup";
import { GameResult } from "./components/gameResult/gameResult";

export function App(){
    const [game, setGame] = useState<Game>(null);
    const [selected, setSelected] = useState<BankLetter>(null);
    const [scrollStart, setScrollStart] = useState<{x: number, y: number}>(null);
    const [scrollPos, setScrollPos] = useState<{x: number, y: number}>({x:0, y: 0});
    const [playerLetterMove, setPlayerLetterMove] = useState('');
    const [fix, setFix] = useState(0);
    const [ghostPosition, setGhostPosition] = useState<{x: number, y: number}>(null);
    const [showLetterList, setShowLetterList] = useState(false);
    const [shownScoreData, setShownScoreData] = useState<{
        words: IBoostedWord[]
        score: number;
    }>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [gameOptions, setGameOptions] = useState<IGameOptions>({
        players: 1,
        letters: 200
    });
    const [gameResult, setGameResult] = useState(null);

    useEffect(()=>{
        const _game = new Game(gameOptions);
        const lastScoreTimerId: ReturnType<typeof setTimeout> = null;
        _game.onWordSubmitted = (scoreData)=>{
            if (lastScoreTimerId){
                clearInterval(lastScoreTimerId);
            }
            setShownScoreData(scoreData);
           // setTimeout(()=>{
           //     setShownScoreData(null);
           // }, 6000);
        }
        _game.onFinish = ()=>{
            console.log('finished');
            setGameResult({});
        }
        setGameResult(null);
        setGame(_game);
        return ()=>{
            _game.destroy();
        }
    }, [gameOptions]);

    
    const letterMap = useMemo(()=>game?.lettersToMap(), [game?.inputLetters.length, game?.letters.length]);
    const boosterMap = useMemo(()=>game?.boosterToMap(), [game?.inputLetters.length, game?.letters.length]);
    const fieldScroll = useRef<HTMLDivElement>();
    const fieldContent = useRef<HTMLDivElement>();

    useEffect(()=>{
        if (fieldScroll.current && game){
            setScrollPos({x:(fieldScroll.current.clientWidth - fieldContent.current.clientWidth) / 2, y: (fieldScroll.current.clientHeight - fieldContent.current.clientHeight) / 2});
        }
    }, [fieldScroll.current, game]);

    useEffect(()=>{
        const onMouseMove=(e:MouseEvent)=>{
            if (scrollStart){
                //setScrollStart({x: e.clientX, y: e.clientY});
                setScrollPos(last=> ({x: last.x + e.movementX, y: last.y + e.movementY}));
            }
            if (selected){
                setGhostPosition({x: e.clientX, y: e.clientY});
            }
        }
        const onMouseUp=(e:MouseEvent)=>{
            if (scrollStart){
                setScrollStart(null);
                setGhostPosition(null);
            }
        }

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return ()=>{
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
    }, [scrollStart, selected]);

    return (
        <>  <div className="field_scroll" ref={fieldScroll}>
            {selected && !playerLetterMove && ghostPosition &&
                <div className="cell cell_ghost"
                    style={{
                        top: ghostPosition.y - fieldScroll.current.getBoundingClientRect().top - 15,
                        left: ghostPosition.x - fieldScroll.current.getBoundingClientRect().left - 15
                    }}>
                    {selected.text}
                </div>
            }
            <div ref={fieldContent} 
                className="field_content" 
                style={{transform: `translate(${scrollPos.x}px, ${scrollPos.y}px)`}} 
                onMouseDown={(e)=>{
                    if (!selected){
                        setScrollStart({x: e.clientX, y: e.clientY});
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
                            setGhostPosition({x: e.clientX, y: e.clientY});
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
                        {cell?.value && <div className="cell_value">{cell?.value}</div>}
                        {!cell?.text && <div>{{'-': '', '1': '3l', '2': '2w', '3': '2l', '4': '3w', 'start': '!!!'}[boosterMap[y][x]] || ''}</div>}
                    </div>
                })}
                </div>
            })}
            </div>
            {gameResult && <GameResult game={game} onPlayAgain={()=>{setGameResult(null); setGameOptions({...gameOptions});}}></GameResult>}
            {showOptions && <OptionsPopup onClose={()=>{setShowOptions(false)}} onSubmit={(data)=>{setGameOptions(data); setShowOptions(false)}} initialOptions={gameOptions}/>}
            <button className="default_button showOptions_button" onClick={()=>{
                setShowOptions(true);
            }}>settings</button>
            {shownScoreData && <WordResult scoreData={shownScoreData} onAnimated={()=> setShownScoreData(null)}></WordResult>}
            {game && <PlayerList players={game.players} currentPlayerIndex={game.currentPlayerIndex}></PlayerList>}
            <LetterListOpenButton onClick={()=>{setShowLetterList(true);}} count={game?.bank.letters.length || 0}></LetterListOpenButton>
            {showLetterList && <LetterList letters={game?.bank.getLetterCounts() || {}} onClose={()=>{setShowLetterList(false);}}></LetterList>}
            <div className="bottom_panel">
                <LetterPanel 
                    selected={selected} 
                    onSelect={(letter)=>setSelected(letter)} 
                    game={game} 
                    onFix={()=>setFix(last=>last+1)} 
                    playerLetterMove={playerLetterMove} 
                    onPlayerLetterMove={setPlayerLetterMove}
                />
            </div>
            </div>
        </>
        
    )
}

