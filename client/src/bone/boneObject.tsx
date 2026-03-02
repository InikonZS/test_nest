import React, { useEffect, useRef, useState } from "react"
import { getGlobalTransform } from "./utils";

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
        const matrix = getGlobalTransform(tempRef.current.parentElement);
        const moveHandler = (moveEvent: MouseEvent)=>{
            const dx = moveEvent.clientX - lastPosX;
            const dy = moveEvent.clientY - lastPosY;
            lastPosX = moveEvent.clientX;
            lastPosY = moveEvent.clientY;
            console.log(dx, tempRef.current.style.left);
            setTemp(last => {
                const globalPos = matrix.transformPoint(new DOMPoint(last.position.x, last.position.y));
                const localPos = matrix.inverse().transformPoint(new DOMPoint(globalPos.x + dx, globalPos.y + dy));
                /*return {position: {
                    x: last.position.x + dx,
                    y: last.position.y + dy,
                }}*/
               return {position: {
                    x: localPos.x,
                    y: localPos.y,
                }}
            })
            console.log(JSON.stringify(_temp));
            //tempRef.current.style.left = tempRef.current.clientLeft + dx + 'px',
            //tempRef.current.style.top = tempRef.current.clientTop + dy + 'px'
           // setPosition(last => last + dx);
        }
        /*const upHandler = (moveEvent: MouseEvent)=>{
            setDragStart(null);
            onChange?.({position: {
                x: _temp.current.position.x + Number(getComputedStyle(ref.current).left.replace('px', "")),
                y: _temp.current.position.y + Number(getComputedStyle(ref.current).top.replace('px', "")),
            }});
            setTemp({position: {x: 0, y: 0}});
        }*/
        window.addEventListener('mousemove', moveHandler);
        //window.addEventListener('mouseup', upHandler);
        return ()=>{
            window.removeEventListener('mousemove', moveHandler);
           // window.removeEventListener('mouseup', upHandler);
        }
    }, [dragStart]);

    useEffect(()=>{
        const upHandler = (moveEvent: MouseEvent)=>{
            setDragStart(null);
            if (temp.position.x == 0 && temp.position.y == 0){
                return;
            }
            const objMatrix = new DOMMatrix(getComputedStyle(ref.current).transform);
            //const tempMatrix = new DOMMatrix(getComputedStyle(tempRef.current).transform);
            const point = objMatrix.transformPoint(new DOMPoint(temp.position.x, temp.position.y));
            //objMatrix.tra
            onChange?.({position: {
                x: point.x,//temp.position.x,//_temp.current.position.x + Number(getComputedStyle(ref.current).left.replace('px', "")),
                y: point.y//temp.position.y//_temp.current.position.y + Number(getComputedStyle(ref.current).top.replace('px', "")),
            }});
            setTemp({position: {x: 0, y: 0}});
        }
         //window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        return ()=>{
            //window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        }
    }, [dragStart, temp])

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
                offset: (objectData.keyframes.length >1) ? keframeData.time/objectData.keyframes[objectData.keyframes.length -1].time:0,
                 transform: `translate(${keframeData.position.x / 1 + 'px'}, ${keframeData.position.y / 1 + 'px'})`,
                //left: keframeData.position.x + 'px',
                //top: keframeData.position.y + 'px'
            }
        });
        AnimationTimeline
        const effect = new KeyframeEffect(ref.current, keyframes, { duration: (objectData.keyframes.length >1) ? objectData.keyframes[objectData.keyframes.length -1].time : 1, fill: "forwards", direction: 'normal'});
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
            //left: temp.position.x,
            //top: temp.position.y
            transform: `translate(${temp.position.x / 1 + 'px'}, ${temp.position.y / 1 + 'px'})`,
        }}>
        <div className="boneObject"
        onDragStart={(e)=>e.preventDefault()} 
        onMouseDown={(e)=>{
            setDragStart(e);
        }}
        ref={ref}
        style={{
            display: (objectData.visible ?? true) ? '' : 'none',
            width: objectData.width / 1 + 'px',
            height: objectData.height / 1 + 'px',
            //left: objectData.position.x / 1 + 'px',
            //top: objectData.position.y / 1 + 'px',
            top: 0,
            left: 0,
            transform: `translate(${objectData.position.x / 1 + 'px'}, ${objectData.position.y / 1 + 'px'})`,
            transformOrigin: `50% 50%`,
            backgroundImage: `url(${objectData.imageURL})`,
            backgroundColor: objectData.imageURL ? "transparent" : ""
        }}>
        </div>
    </div>
}