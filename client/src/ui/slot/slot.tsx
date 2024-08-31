import React, { useEffect, useMemo, useState } from "react";
import './slot.css';

interface ISlotProps {
}

export function Slot({ }: ISlotProps) {
    const [isStarted, setStarted] = useState(false);
    const [roundId, setRoundId] = useState(0);
    useEffect(()=>{
        setStarted(true);
    }, []);

    return (
        <div className="slot_game">
            <div className="slot_wrapper">
                {new Array(5).fill(0).map((it, i)=><Reel reelIndex={i} roundId={roundId}></Reel>)}
            </div>
            <button onClick={()=>{
                setRoundId(last=>last+1)
            }}>spin</button>
        </div>
    )
}

function Reel({reelIndex, roundId}: {reelIndex: number, roundId: number}){
    const [position, setPosition] = useState(0);
    
    const allSymbols = useMemo(()=>[
        <div className="slot_symbol slot_symbol_a">A</div>,
        <div className="slot_symbol slot_symbol_b">B</div>,
        <div className="slot_symbol slot_symbol_c">C</div>,
    ], []);

    const symbols = useMemo(()=>{
        console.log('update initial symbols');
        return new Array(5).fill(0).map(it=>allSymbols[Math.floor(Math.random()* (allSymbols.length))])
    }, []);

    useEffect(()=>{
        symbols.pop();
        symbols.unshift(allSymbols[Math.floor(Math.random()* (allSymbols.length))])
    }, [position]);
    
    useEffect(()=>{
        setPosition(0);
    }, [roundId]);

    return <div className="slot_reel">
        {symbols.map((content, index)=>{
            return <div onAnimationEnd={()=>{
                if (index == 0 && position<(40+reelIndex*2)){
                    setPosition(last=>last + 4);
                }
            }} className={`slot_symbol_animation slot_symbol_move`} style={{animationDuration: (Math.abs(position - 20))**1.5 * 1 + 100+'ms'}} key={index+'_'+position+'_'+roundId}>
                {content}
            </div>
        })}
    </div>
}