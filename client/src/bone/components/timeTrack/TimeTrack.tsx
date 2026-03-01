import React, { useEffect, useRef, useState } from "react";
import "./TimeTrack.css";

export const TimeTrack = ({onTime, model}: {onTime:(time: number)=>void, model: any}) => {
    const [dragStart, setDragStart] = useState<React.MouseEvent>(null);
    const [position, setPosition] = useState(0);
    const trackRef = useRef<HTMLDivElement>();
    const namesRef = useRef<HTMLDivElement>();
    const scrollRef = useRef<HTMLDivElement>();

    useEffect(()=>{
        onTime(position);
    }, [position])

    useEffect(()=>{
        if (!dragStart){
            return;
        }
        let lastPos = dragStart.clientX;
        dragStart.stopPropagation();
        const moveHandler = (moveEvent: MouseEvent)=>{
            const dx = moveEvent.clientX - lastPos;
            lastPos = moveEvent.clientX;
            setPosition(last => last + dx);
        }
        const upHandler = (moveEvent: MouseEvent)=>{
            setDragStart(null);
        }
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        return ()=>{
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        }
    }, [dragStart]);

    return <div className="boneTimeTrackWrap">
        <div ref={namesRef} className="boneTimeTrackNameList">
             <div className="boneTimeTrackNameListContent">
            {
                model.objects.map((objectData: any)=>{
                        return <div className="boneTimeTrackNameListItem">
                            {objectData.name}
                        </div>
                    })
            }
            {/* <div className="boneTimeTrackNameListItem">
                track 0
            </div>
            <div className="boneTimeTrackNameListItem">
                track long 1
            </div>
            <div className="boneTimeTrackNameListItem">
                track very long 2
            </div> */}
            </div>
        </div>
        <div className="boneTimeTrackScroll">
        <div className="boneTimeTrack" ref={trackRef}>
            <div className="boneTimeTrackContent">
                <div className="boneTimeTrackPositionMeasure"></div>
                <div className="boneTimeTrackPositionMeasureSub"></div>
                <div className="boneTimeTrackPosition" style={{"--position": position+'px'}} onDragStart={(e)=>e.preventDefault()} onMouseDown={(e)=>{
                    setDragStart(e);
                }}>
                </div>
                <div className="boneTimeTrackPositionLine" style={{"--position": position+'px'}}>
                </div>
            </div>
        </div>
        <div className="boneTimeTrackList" ref={scrollRef} onScroll={(e)=>{
            trackRef.current.scrollLeft = scrollRef.current.scrollLeft;
            namesRef.current.scrollTop = scrollRef.current.scrollTop;
            console.log('scroll ', scrollRef.current.scrollLeft)
        }}>
            <div className="boneTimeTrackListContent">
                {/* <div className="boneTimeTrackListItem">
                    item
                </div>
                <div className="boneTimeTrackListItem">
                    item 1
                </div>
                <div className="boneTimeTrackListItem">
                    item 2
                </div> */}
                {
                    model.objects.map((objectData: any)=>{
                        return <div className="boneTimeTrackListItem">
                            {
                                objectData.keyframes.map((keyframeData: any)=>{
                                    return <div className="boneTimeTrackListKey" style={{"--time": keyframeData.time}}>

                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    </div>
    </div>
}