import React, { useEffect, useMemo, useRef, useState } from "react";
import './spinDigit.css';

export function SpinDigit({digit, rounds, duration, roundId, onIterate, onDropAni}: {digit: number, rounds: number, duration:number, roundId: number, onIterate?: ()=>void, onDropAni?:()=>void}){
    const [aniState, setAniState] = useState('initial');
    const [finalDigit, setFinalDigit] = useState(0);
    const [aniTime, setAniTime] = useState(100);
    const digits = useMemo(()=>{
        return new Array(11).fill(0).map((it, i)=>i<=9 ? i : 0);
    }, []);
    console.log(aniState, finalDigit, digit)
    useEffect(()=>{
        console.log('rnd', roundId)
        if (aniState == 'initial'){
            if (rounds){
                setFinalDigit(10);
                setAniState('in');
                setAniTime(10-finalDigit);
            } else if (!rounds && finalDigit<digit) {
                setFinalDigit(digit);
                setAniState('out');
                setAniTime(digit-finalDigit);
            } else if (!rounds && finalDigit>digit) {
                setFinalDigit(10);
                setAniState('in');
                setAniTime(10-finalDigit);
            }
        }else {
            console.log('drop ani')
            onDropAni?.();
            setAniState('initial'),
            setFinalDigit(digit);
        }
    }, [digit, rounds, roundId]);
    return <div className="spinDigit_container">
        {digits.map((it, i)=>(
            <div className={`spinDigit_digit ${{initial:'', 'loop':'spinDigit_digit_animate', 'in':'spinDigit_digit_in', 'out':'spinDigit_digit_out'}[aniState]}`} style={{ animationIterationCount: rounds, top: (-100 * finalDigit + '%'), transitionDuration: (duration*1.41 * aniTime / 10)+'ms', animationDuration: duration+'ms'}}
            onTransitionEnd={()=>{
                if (aniState == 'in'){
                    if (!rounds){
                        if(i==0){
                            onIterate();
                        }
                        setFinalDigit(0);
                        setAniTime(0);
                        if (digit == 0){
                            setAniState('initial')
                            onDropAni?.();
                        } else {
                            requestAnimationFrame(()=>{requestAnimationFrame(()=>{
                                setAniState('out');
                                setFinalDigit(digit);
                                setAniTime(digit);
                            })});
                        }
                    } else {
                        setFinalDigit(0);
                        setAniState('loop');
                    }
                }
                if (aniState == 'out'){
                    setAniState('initial'); 
                    onDropAni?.();
                }
            }}
            onAnimationIteration={()=>{
                if (i==0){
                    onIterate();
                }
            }}
            onAnimationEnd={()=>{
                if (i==0){
                    onIterate();
                }
                if (aniState == 'loop'){
                    if (digit == 0){
                        setAniState('initial')
                        onDropAni?.();
                    } else {
                        setAniTime(digit);
                        setAniState('out');
                        setFinalDigit(digit); 
                    }
                }
            }}>{it}</div>
        ))}
    </div>
}

export function SpinNumber({value}: {value: number}){
    const [dig, setDig] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [high, setHigh] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [controlNum, setControlNum] = useState(0);
    const highSigns = 3;
    const lowSigns = 1;
    const highArr = new Array(highSigns).fill(0);
    high.toString().split('').reverse().forEach((it, i)=>{
        highArr[highSigns - i - 1] = Number(it);
    });
    const lowArr = new Array(lowSigns).fill(0);
    dig.toString().split('').reverse().forEach((it, i)=>{
        lowArr[lowSigns - i - 1] = Number(it);
    });
    console.log(high);
    return <div className="spinNumber_container">
        <button onClick={()=>{
            const _rand = Math.floor(Math.random()*120);
            const newNum = controlNum+_rand;
            const _dig = newNum % (10**lowSigns);
            const _rounds = (newNum - controlNum) < (10**lowSigns)? 0: Math.floor(newNum / (10**lowSigns)) - Math.floor(controlNum / (10**lowSigns));
            setDig(_dig);
            setRounds(_rounds);
            setClicks(last=>last+1);
            setControlNum(last=>newNum)
            console.log('control num', controlNum, newNum);
        }}>rand</button>
        {highArr.map(it=>(
             <SpinDigit digit={it} rounds={0} duration={500} roundId={clicks} onIterate={()=>{
        }}></SpinDigit>
        ))}
        {lowArr.map((it, i)=>(
         i==0?<SpinDigit digit={it} rounds={rounds} duration={150*3**(lowSigns-i) + 100} roundId={clicks} onDropAni={()=>{
            setHigh(Math.floor(controlNum/(10**lowSigns)));
         }} onIterate={()=>{
            setHigh(last=>{
                return Math.floor(controlNum/(10**lowSigns))<=last ? Math.floor(controlNum/(10**lowSigns)): 
                last+1
         });
           // setRounds(last=>last+1);
        }}></SpinDigit>:<SpinDigit digit={it} rounds={rounds} duration={150*3**(lowSigns-i) + 100} roundId={clicks}
           // setRounds(last=>last+1);
           onIterate={()=>{}}
        ></SpinDigit>
        ))}
    </div>
}