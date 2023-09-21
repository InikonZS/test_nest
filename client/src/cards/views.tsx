import React, { useEffect, useRef, useState } from "react";
import "./views.css";
import "./views1.css";

export function Views(){
    const playerCards = [1,2,3,4,5,6,7,8,9,2,3,4,5,6,7,8,9];
    return <div className="v_wrapper">
        {/*<div className="views_player" style={{left: '300px'}}>
                {playerCards.map((it, i)=>{
                    return <div className="views_slot2" style={{'transform-origin': 'center bottom', transform: `translate(${i*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
                })}
            </div>
        <div className="v_table" style={{left: '50px', top: '250px'}}>
            <div className="v_pair">
                <div className="views_slot" style={{transform: 'translate(0px, 0px) rotate(10deg)'}}></div>
                <div className="views_slot" style={{transform: 'translate(20px, 20px) rotate(20deg)'}}></div>
            </div>

            <div className="v_pair" style={{left: '200px'}}>
                <div className="views_slot" style={{transform: 'translate(0px, 0px) rotate(10deg)'}}></div>
                <div className="views_slot" style={{transform: 'translate(20px, 20px) rotate(20deg)'}}></div>
            </div>

            <div className="v_pair" style={{left: '400px'}}>
                <div className="views_slot" style={{transform: 'translate(0px, 0px) rotate(10deg)'}}></div>
                <div className="views_slot" style={{transform: 'translate(20px, 20px) rotate(20deg)'}}></div>
            </div>
        </div>*/}
        <div className="v_player" style={{left: '0px', top: '0px'}}>
        </div>
        <div className="v_player" style={{left: '325px', top: '0px'}}>
        </div>
        <div className="v_player" style={{left: '650px', top: '0px'}}>
        </div>
        <div className="v_player" style={{left: '0px', top: '250px'}}></div>
        <div className="v_player" style={{left: '650px', top: '250px'}}></div>
        <div className="v_my_player" style={{left: '250px', top: '400px'}}></div>
        <div className="v_table" style={{left: '150px', top: '150px'}}></div>
        <div>
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${(i - (playerCards.length-1) / 2)*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${325 + (i - (playerCards.length-1) / 2)*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${650 + (i - (playerCards.length-1) / 2)*5}px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}

            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${(i - (playerCards.length-1) / 2)*5}px, 250px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${325 + (i - (playerCards.length-1) / 2)*10}px, 450px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-50}px) scale(0.5)`}}></div>
            })}
            {playerCards.map((it, i)=>{
                return <div className="views_slot2" style={{transform: `translate(${650 + (i - (playerCards.length-1) / 2)*5}px, 250px) rotate(${(i - (playerCards.length-1) / 2)*Math.min((120/playerCards.length), 15)}deg) translateY(${-20}px) scale(0.3)`}}></div>
            })}
            {new Array(36).fill(null).map((it, i)=>{
                if (i==0) {
                    return <div className="views_slot" style={{transform: `translate(${120 + i*3}px, 100px) rotate(${90+ Math.random() *  12-6}deg) scale(0.3)`}}></div>
                }
                return <div className="views_slot" style={{transform: `translate(${140 + i*3}px, 100px) rotate(${ Math.random() *  12-6}deg) scale(0.3)`}}></div>
            })}
            {new Array(36).fill(null).map((it, i)=>{
                return <div className="views_slot" style={{transform: `translate(${500 + Math.random() *  30}px, ${90 + Math.random() *  30}px) rotate(${i * 10}deg) scale(0.3)`}}></div>
            })}
            {new Array(6).fill(null).map((it, i)=>{
                return <>
                    <div className="views_slot" style={{transform: `translate(${140 + i*70}px, 210px) rotate(10deg) scale(0.5)`}}></div>
                    <div className="views_slot" style={{transform: `translate(${150 + i*70}px, 220px) rotate(20deg) scale(0.5)`}}></div>
                </>
            })}
           
        </div>
    </div>
}

export function Views1(){
    const [animate, setAnimate] = useState(false);
    const [initial, setInitial] = useState('');
    const playerCards = [1,2,3,4,5,6,7,8,9];
    const slot2 = useRef<HTMLDivElement>();
    const slot3 = useRef<HTMLDivElement>();
    const playerDiv = useRef<HTMLDivElement>();
    const animationList = [2, 5, 3, 6, 7, 1, 0];
    const [aniPosition, setAniPosition] = useState(0);
    const deck = [1,2,3,4,5,6,7,8];

    useEffect(()=>{
        console.log('animate ', aniPosition);
        const positions = [...playerDiv.current.children].map(it => (window.getComputedStyle(it)));
        const transforms = [...playerDiv.current.children].map(it => window.getComputedStyle(it).transform);
        console.log(window.getComputedStyle(playerDiv.current).left);
        console.log(positions);
        const slotIndex = animationList[aniPosition]//Math.floor(Math.random()*positions.length);
        setInitial(`translate(${300 * 1}px, ${0}px) ${transforms[slotIndex]} rotateY(180deg)`)
        //setTimeout(()=>{
        requestAnimationFrame(()=>{
            setAnimate(true);  
        })
          
        //},500); 
        setTimeout(()=>{
            setAnimate(false)
            if (aniPosition + 1 < animationList.length){
                setAniPosition(last=> last+1); 
            }
        },1500); 
    }, [aniPosition]);
    return <div>
       <div className="views_container">
            <div className="views_player" ref={playerDiv} style={{left: '300px'}}>
                {playerCards.map((it, i)=>{
                    return <div className="views_slot2" style={{transform: `translate(${i*20}px) rotate(${i*15}deg) scale(0.3)`}}></div>
                })}
            </div>
            <div className="views_player" style={{}}>
                {playerCards.map((it, i)=>{
                    return <div className="views_slot2" style={{transform: `translate(${i*20}px) rotate(${i*15}deg) scale(0.3)`}}></div>
                })}
            </div>
            <div className="views_player" ref={playerDiv} style={{left: '600px'}}>
                {deck.map((it, i)=>{
                    return <div className="views_slot2" style={{transform: `translate(${i*10}px) scale(0.3)`}}></div>
                })}
            </div>
            <div ref={slot2} className="views_slot" style={{transform: 'translate(400px, 300px) rotate(50deg)'}}></div>
            <div ref={slot3} className="views_slot" style={{transform: 'translate(420px, 320px) rotate(60deg)'}}></div>
            <div className="views_card" style={{transition: animate ? '1s': '0s', transform: animate ? window.getComputedStyle(slot2.current).transform : initial}}></div>
        </div> 
        <button onClick={()=>{
            if (animate){
                setAnimate(false);
                return;
            }
            console.log(window.getComputedStyle(slot2.current).transform);
            const positions = [...playerDiv.current.children].map(it => (window.getComputedStyle(it)));
            const transforms = [...playerDiv.current.children].map(it => window.getComputedStyle(it).transform);
            console.log(window.getComputedStyle(playerDiv.current).left);
            console.log(positions);
            const slotIndex = Math.floor(Math.random()*positions.length);
            setInitial(`translate(${300 * 1}px, ${0}px) ${transforms[slotIndex]} rotateY(180deg)`)
            setTimeout(()=>{
              setAnimate(true);  
            },500);
        }}>animate</button>

        <button onClick={()=>{

        }}>
            list
        </button>
    </div>
    
}