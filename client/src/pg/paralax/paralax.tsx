import React, { useEffect, useRef } from 'react';
import './paralax.css';

export function Paralax(){
    const img = useRef<HTMLDivElement>();

    useEffect(()=>{
        if (!img.current){
            return;
        }
        const handle =()=>{
            img.current.style.backgroundPositionY = -img.current.clientTop - img.current.clientHeight + window.scrollY/2 + 'px';
        };
        handle();
        window.addEventListener('scroll', handle);
        return ()=>{
            window.removeEventListener('scroll', handle);
        }
    }, [img.current]);

    return <div className='paralax'>
        <div ref={img} className='paralax_picture'></div>
        <div className='paralax_mask'></div>
    </div>
}