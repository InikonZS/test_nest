import React, { useEffect, useMemo, useRef, useState } from "react";
import './aniSlider.css';

interface IAniSliderProps extends React.PropsWithChildren{
    showCount?: number
}

export function AniSlider({children, showCount = 4}: IAniSliderProps){
    const [position, setPosition] = useState(0);
    const [moveDir, setMoveDir] = useState('');
    const [startPoint, setStartPoint] = useState(null);
    const [offset, setOffset] = useState(0);

    const slidesRef = useRef<HTMLDivElement>();

    useEffect(()=>{
        if (startPoint && slidesRef.current){
            const handleMove = (e: MouseEvent)=>{
                const slideWidth = slidesRef.current.getBoundingClientRect().width / showCount;
                let nextOffset = offset - e.movementX;
                let fullSlides = Math.floor(Math.abs(nextOffset) / slideWidth) * Math.sign(nextOffset);
                if ((Math.abs(fullSlides))){
                    setPosition(last=> cycle(last+fullSlides, allSlides.length));
                    nextOffset = Math.abs(nextOffset) % slideWidth * Math.sign(nextOffset);
                    setOffset(nextOffset);
                } else {
                        setOffset(last=>nextOffset); 
                }
            }
            const handleUp = ()=>{
                const slideWidth = slidesRef.current.getBoundingClientRect().width / showCount;              
                if (Math.abs(offset) > slideWidth / 2){
                    setPosition(last=> cycle(last + Math.sign(offset), allSlides.length));
                    setStartPoint(null);
                    setOffset(last=>last -Math.sign(offset) * slideWidth);
                    requestAnimationFrame(()=>{
                        setOffset(0);
                    })
                } else {
                    setOffset(0);  
                    setStartPoint(null);
                }         
            }
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            return ()=>{
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', handleUp);
            }
        }
    }, [startPoint, offset, position, slidesRef.current]);
    const cycle = (a: number, am: number)=>{
        return a>=0?a%am:am-(1+ -(a+1)%am)
    }      
    //const showCount = 4;
    const fixedChildren = Array.isArray(children) ? children : [children];
    const allSlides = useMemo(()=>children ? fixedChildren : [
        <div className="aniSlider_slide_content">1</div>,
        <div className="aniSlider_slide_content aniSlider_slide_content1">2</div>,
        <div className="aniSlider_slide_content aniSlider_slide_content2">3</div>,
        <div className="aniSlider_slide_content aniSlider_slide_content3">4</div>
    ], [fixedChildren]);
    const realSlides = new Array(showCount).fill(null).map((item, index)=>allSlides[cycle(position + index, allSlides.length)]);
    const actualSlides = [allSlides[cycle(position - 1, allSlides.length)], ...realSlides , allSlides[cycle(position + realSlides.length, allSlides.length)]];

    const toLeft = ()=>{
        setPosition(last=>cycle(last-1, allSlides.length));
        setMoveDir('aniSlider_slide_move_left');
    }

    const toRight = ()=>{
        setPosition(last=>cycle(last+1, allSlides.length));
        setMoveDir('aniSlider_slide_move_right');
    }
    const toLeftForce = ()=>{
        setPosition(last=>cycle(last-1, allSlides.length));
        setMoveDir('aniSlider_slide_move_left_force');
    }

    const toRightForce = ()=>{
        setPosition(last=>cycle(last+1, allSlides.length));
        setMoveDir('aniSlider_slide_move_right_force');
    }
    return <div className="aniSlider">
        <div className="aniSlider_wrapper" style={{'--cols': showCount, '--offset': -offset+'px'}}>
        <div className="aniSlider_arrowZero">
            <button className="aniSlider_arrowButton aniSlider_arrowButton_left" onClick={toLeft}>
                left
            </button>
        </div>
        <div ref={slidesRef} className="aniSlider_slides"
            onDragStart={(e)=>e.preventDefault()}
         onMouseDown={(e)=>{
            setStartPoint({x: e.clientX, y: e.clientY});
            setMoveDir('');
        }}>
            <div className="aniSlider_slides_rescaler">
                {actualSlides.map((content, index)=>{
                    return <div className={`aniSlider_slide ${moveDir} ${startPoint?'aniSlider_slide_no_transition':''}`} key={index+'_'+position}>
                        {content}
                    </div>
                })}
            </div>
        </div>
        <div className="aniSlider_arrowZero aniSlider_arrowZero_right" onClick={toRight}>
            <button className="aniSlider_arrowButton">
                right
            </button>
        </div>
    </div>
    <div className="aniSlider_pagination">
        {allSlides.map((it, index)=>{
            return <button className={`aniSlider_pagination_button ${index == position? 'aniSlider_pagination_button_active' : ''}`} onClick={()=>{
                if (position == index){
                    return;
                }
                //setPosition(last=>index);
                if (position< index){
                    //setMoveDir('aniSlider_slide_move_right');
                    for (let i = 0; i< Math.abs(position-index); i++){
                        setTimeout(()=>{
                            toRightForce();
                        }, i* 100);
                    }
                } else {
                    for (let i = 0; i< Math.abs(position-index); i++){
                        setTimeout(()=>{
                            toLeftForce();
                        }, i* 100);
                    }
                    //setMoveDir('aniSlider_slide_move_left');
                }
            }}></button>
        })}
    </div>
    </div>
}