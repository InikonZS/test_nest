import React, { useEffect, useRef, useState } from "react"

export const BoneObject = ({objectData, time, onChange}: any)=>{
    const ref = useRef<HTMLDivElement>();
    const tempRef = useRef<HTMLDivElement>();
    const [animation, setAnimation] = useState<Animation>(null);
    const [dragStart, setDragStart] = useState<React.MouseEvent>(null);
    const [temp, setTemp] = useState({position: {x: 0, y: 0}})
    const _temp = useRef<any>()
    useEffect(()=>{
        _temp.current = temp;
    },[temp]);
    useEffect(()=>{
        if (!dragStart){
            return;
        }
        let lastPosX = dragStart.clientX;
        let lastPosY = dragStart.clientY;
        dragStart.stopPropagation();
        const moveHandler = (moveEvent: MouseEvent)=>{
            const dx = moveEvent.clientX - lastPosX;
            const dy = moveEvent.clientY - lastPosY;
            lastPosX = moveEvent.clientX;
            lastPosY = moveEvent.clientY;
            console.log(dx, tempRef.current.style.left);
            setTemp(last => ({
                position: {
                    x: last.position.x + dx,
                    y: last.position.y + dy,
                }
            }))
            console.log(JSON.stringify(_temp));
            //tempRef.current.style.left = tempRef.current.clientLeft + dx + 'px',
            //tempRef.current.style.top = tempRef.current.clientTop + dy + 'px'
           // setPosition(last => last + dx);
        }
        const upHandler = (moveEvent: MouseEvent)=>{
            setDragStart(null);
            onChange?.({position: {
                x: _temp.current.position.x + Number(getComputedStyle(ref.current).left.replace('px', "")),
                y: _temp.current.position.y + Number(getComputedStyle(ref.current).top.replace('px', "")),
            }});
            setTemp({position: {x: 0, y: 0}});
        }
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        return ()=>{
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        }
    }, [dragStart]);

    useEffect(()=>{
        if (!animation){return};
        setTemp({position: {x: 0, y: 0}});
        animation.currentTime = time;
    }, [time, animation]);
    useEffect(()=>{
        setTemp({position: {x: 0, y: 0}});
        if (!(objectData.keyframes && objectData.keyframes.length)){
            return;
        }
        const keyframes = objectData.keyframes.sort((a:any,b:any)=>a.time - b.time).map((keframeData: any)=>{
            return {
                easing: 'linear',
                offset: keframeData.time/objectData.keyframes[objectData.keyframes.length -1].time,
                left: keframeData.position.x + 'px',
                top: keframeData.position.y + 'px'
            }
        });
        AnimationTimeline
        const effect = new KeyframeEffect(ref.current, keyframes, { duration: objectData.keyframes[objectData.keyframes.length -1].time, fill: "forwards", direction: 'normal'});
        const animation = new Animation(effect);
        animation.pause();
          animation.currentTime = time;
        //animation.pause();
        //(window as any).a = (v: number)=>animation.currentTime=v;
        setAnimation(animation);
        //new Animation()
        return ()=>{
            //animation.commitStyles();
            animation.cancel();
        }
    }, [objectData.keyframes])
    return  <div ref={tempRef} className="boneObjectTemp" style={{
            left: temp.position.x,
            top: temp.position.y
        }}>
        <div className="boneObject"
        onDragStart={(e)=>e.preventDefault()} 
        onMouseDown={(e)=>{
            setDragStart(e);
        }}
        ref={ref}
        style={{
            width: objectData.width,
            height: objectData.height,
            left: objectData.position.x,
            top: objectData.position.y
        }}>
        </div>
    </div>
}