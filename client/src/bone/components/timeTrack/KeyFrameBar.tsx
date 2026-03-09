import React, { useEffect, useMemo, useRef, useState } from "react";
//import "./TimeTrack.css";

export const KeyFrameBar = ({framePosition, keyframeData, isSelected, onTime, onSelect}: { isSelected:boolean, framePosition: number, keyframeData: any, onTime: (time: number)=>void, onSelect: ()=>void}) => {
      const [dragStart, setDragStart] = useState<React.MouseEvent>(null);
        const [position, setPosition] = useState<number>(keyframeData.time ?? 0);
        const trackRef = useRef<HTMLDivElement>();
        const namesRef = useRef<HTMLDivElement>();
        const scrollRef = useRef<HTMLDivElement>();
    
        const _framePosition = useMemo(()=>Math.floor(position / 10) * 10, [position]);
        useEffect(()=>{
            if (_framePosition != keyframeData.time){
                //onTime(_framePosition);
            }
           setPosition(keyframeData.time);
        }, [keyframeData?.time])

        useEffect(()=>{
            if (_framePosition != keyframeData.time){
               // onTime(_framePosition);
                //console.log(_framePosition, keyframeData.time)
            }
           //setPosition(keyframeData.time);
        }, [_framePosition])
    
        useEffect(()=>{
            if (!dragStart){
                return;
            }
            let lastPos = dragStart.clientX;
            dragStart.stopPropagation();
            const moveHandler = (moveEvent: MouseEvent)=>{
                const dx = moveEvent.clientX - lastPos;
                lastPos = moveEvent.clientX;
                setPosition(last => (last + dx));
            }
            /*const upHandler = (moveEvent: MouseEvent)=>{
                setDragStart(null);
            }*/
            window.addEventListener('mousemove', moveHandler);
            //window.addEventListener('mouseup', upHandler);
            return ()=>{
                window.removeEventListener('mousemove', moveHandler);
                //window.removeEventListener('mouseup', upHandler);
            }
        }, [dragStart]);

        useEffect(()=>{
            const upHandler = (moveEvent: MouseEvent)=>{
                setDragStart(null);
                if (_framePosition != keyframeData.time){
                    onTime(_framePosition);
                    console.log(_framePosition, keyframeData.time)
                }
            }
            //window.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', upHandler);
            return ()=>{
               // window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', upHandler);
            }
        }, [dragStart, _framePosition])

    return <div className={`boneTimeTrackListKey ${framePosition == keyframeData.time ? "boneTimeTrackListKeyCurrent" : ''} ${isSelected ? "boneTimeTrackListKeySelected" : ""}`} style={{ "--time": /*keyframeData.time*/ _framePosition  }}
        onDragStart={(e)=>e.preventDefault()} onMouseDown={(e)=>{
                    setDragStart(e);
                    onSelect();
                }}
    >

    </div>
}