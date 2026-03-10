import { useEffect, useRef, useState } from "react";

type IDragStickProps = React.PropsWithChildren<{
    style: React.CSSProperties,
    className: string,
    onNonDragClick: (event: MouseEvent)=>void,
    onStart: (event: {downEvent: React.MouseEvent})=>void,
    onMove: (event: {dx: number, dy: number, totalDx: number, totalDy: number, downEvent: React.MouseEvent, moveEvent: MouseEvent})=>void,
    onEnd: (event: {totalDx: number, totalDy: number, downEvent: React.MouseEvent, upEvent: MouseEvent})=>void,
}>

export const DragStick = ({children, className, style, onStart, onMove, onEnd, onNonDragClick}: IDragStickProps)=>{
    const cancelRef = useRef<()=>void>(()=>{});

    const handleDrag = (downEvent: React.MouseEvent) => {
        downEvent.preventDefault()
        downEvent.stopPropagation();
        let lastPosX = downEvent.clientX;
        let lastPosY = downEvent.clientY;

        onStart({downEvent: downEvent});
        const moveHandler = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - lastPosX;
            const dy = moveEvent.clientY - lastPosY;
            lastPosX = moveEvent.clientX;
            lastPosY = moveEvent.clientY;
            onMove({
                dx,
                dy,
                totalDx: moveEvent.clientX - downEvent.clientX,
                totalDy: moveEvent.clientY - downEvent.clientY,
                downEvent,
                moveEvent
            })
        }
        const upHandler = (upEvent: MouseEvent) => {
            const totalDx = upEvent.clientX - downEvent.clientX;
            const totalDy = upEvent.clientY - downEvent.clientY;
            const dragThreshold = 5;
            if (Math.abs(totalDx) < dragThreshold ||
                Math.abs(totalDy) < dragThreshold) {
                onNonDragClick(upEvent);
            }

            onEnd({totalDx, totalDy, downEvent, upEvent});
            cancel();
        }
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        const cancel = () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
        }
        cancelRef.current = cancel;
    }

    useEffect(()=>{
        return ()=>cancelRef.current();
    }, []);

    return <div 
        className={className} 
        style={style}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={handleDrag}
    >
        {children}
    </div>
}