import React, { useEffect, useRef, useState } from "react";
import { useBoneContext } from "../../boneModel";
import { getCurrentTransform as _getCurrentTransform, getGlobalTransform, getGlobalTransform2 } from "../../utils";
import { useCanvasContext } from "../../boneCanvas";

type IStartEvent = { downEvent: React.MouseEvent }
type IMoveEvent = { dx: number, dy: number, totalDx: number, totalDy: number, downEvent: React.MouseEvent, moveEvent: MouseEvent }
type IEndEvent = { totalDx: number, totalDy: number, downEvent: React.MouseEvent, upEvent: MouseEvent };
type IDragStickProps = React.PropsWithChildren<{
    style?: React.CSSProperties,
    className?: string,
    onNonDragClick?: (event: MouseEvent) => void,
    onStart?: (event: IStartEvent) => void,
    onMove?: (event: IMoveEvent) => void,
    onEnd?: (event: IEndEvent) => void,
    flowHandler?: (event: IStartEvent) => (event: IMoveEvent) => (event: IEndEvent) => void;
}>

export const DragStick = ({ children, className = "", style, onStart, onMove, onEnd, onNonDragClick, flowHandler }: IDragStickProps) => {
    const cancelRef = useRef<() => void>(() => { });

    const handleDrag = (downEvent: React.MouseEvent) => {
        downEvent.preventDefault()
        downEvent.stopPropagation();
        let lastPosX = downEvent.clientX;
        let lastPosY = downEvent.clientY;
        let flowUpHandler: ((event: IEndEvent) => void) | null = null;

        const downEventExt = { downEvent: downEvent }
        onStart?.(downEventExt);
        const flowMoveHandler = flowHandler?.(downEventExt) || null;
        const moveHandler = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - lastPosX;
            const dy = moveEvent.clientY - lastPosY;
            lastPosX = moveEvent.clientX;
            lastPosY = moveEvent.clientY;
            const moveEventExt = {
                dx,
                dy,
                totalDx: moveEvent.clientX - downEvent.clientX,
                totalDy: moveEvent.clientY - downEvent.clientY,
                downEvent,
                moveEvent
            }
            onMove?.(moveEventExt)
            if (flowMoveHandler) {
                flowUpHandler = flowMoveHandler(moveEventExt) || null;
            }
        }
        const upHandler = (upEvent: MouseEvent) => {
            const totalDx = upEvent.clientX - downEvent.clientX;
            const totalDy = upEvent.clientY - downEvent.clientY;
            const dragThreshold = 5;
            if (Math.abs(totalDx) < dragThreshold &&
                Math.abs(totalDy) < dragThreshold) {
                onNonDragClick?.(upEvent);
            }

            const upEventExt = { totalDx, totalDy, downEvent, upEvent }
            onEnd?.(upEventExt);
            if (flowUpHandler) {
                flowUpHandler(upEventExt)
            }
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

    useEffect(() => {
        return () => cancelRef.current();
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

export const RotationMarker = ({className, style}: {className: string, style: React.CSSProperties}) => {
    const {activeObject, refMap} = useBoneContext();
    const {setTemp} = useCanvasContext();
    const getCurrentTransform = () => _getCurrentTransform(activeObject, refMap);
    
    return <DragStick className={className} style={style} flowHandler={({ downEvent }) => {
        const trs = getCurrentTransform();
        const objectData = activeObject;
        const tempRef = { current: refMap.current[objectData?.name].parentElement };
        const matrix = getGlobalTransform(tempRef.current.parentElement);
        const it = {
            angle: trs.rotate,
            position: trs.translate,
            width: objectData.width,
            height: objectData.height
        }
        const ang = it.angle / 180 * Math.PI;

        const startPoint = {
            x: (it.width / 2) + Math.sin(ang) * (it.height / 2) * trs.scale.y,
            y: (it.height / 2) - Math.cos(ang) * (it.height / 2) * trs.scale.y
        }
        const centerPoint = {
            x: it.width / 2,
            y: it.height / 2
        }

        const lastAng = (it.angle + 3600000 + 180) % 360 - 180;
        let lastInputAngle = 0;
        let sumAngle = 0;
        return ({ dx, dy, moveEvent }) => {

            const globalPos = matrix.transformPoint(new DOMPoint(startPoint.x, startPoint.y));
            const localPos = matrix.inverse().transformPoint(new DOMPoint(globalPos.x + dx, globalPos.y + dy));
            startPoint.x = localPos.x
            startPoint.y = localPos.y
            const inputAngle = Math.atan2(startPoint.x - centerPoint.x, -(startPoint.y - centerPoint.y)) / Math.PI * 180 //- it.angle;
            const diff1 = inputAngle - lastInputAngle;
            const diff2 = inputAngle - lastInputAngle + 360;
            const diff3 = inputAngle - lastInputAngle - 360;
            const difs = [
                { abs: Math.abs(diff1), val: diff1 },
                { abs: Math.abs(diff2), val: diff2 },
                { abs: Math.abs(diff3), val: diff3 },
            ];
            difs.sort((a, b) => a.abs - b.abs);
            const minInputDiff = difs[0].val;
            lastInputAngle = inputAngle;
            sumAngle = sumAngle + minInputDiff;

            setTemp(last=>{
                 const next = { ...last };
                 next.angle = sumAngle - lastAng;
                 return next;
            })
            
            return (upEvent) => {

            }
        }
    }}
    ></DragStick>
}


