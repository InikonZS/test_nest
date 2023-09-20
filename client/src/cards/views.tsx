import React, { useRef, useState } from "react";
import "./views.css";

export function Views(){
    const [animate, setAnimate] = useState(false);
    const [initial, setInitial] = useState('');
    const playerCards = [1,2,3,4,5,6,7,8,9];
    const slot2 = useRef<HTMLDivElement>();
    const playerDiv = useRef<HTMLDivElement>();
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
            <div ref={slot2} className="views_slot" style={{transform: 'translate(400px, 300px) rotate(50deg)'}}></div>
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
    </div>
    
}